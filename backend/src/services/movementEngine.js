/**
 * movementEngine.js
 * Route-based interpolation engine.
 * Every tick: advance each active shipment along its polyline,
 * update position, heading, progress, ETA and status.
 */

const state = require('../state/runtimeState');
const { createEvent, checkGeofenceEntry } = require('./eventEngine');

const TICK_MS = parseInt(process.env.TICK_MS) || 1000;
const TICK_S = TICK_MS / 1000;

// ─── Geo helpers ────────────────────────────────────────────────────────────

function haversineDistance(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function computeBearing(from, to) {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const dLon = ((to.lng - from.lng) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function getTotalDistance(route) {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    total += haversineDistance(route[i], route[i + 1]);
  }
  return total;
}

function getDistanceCovered(shipment) {
  const { route, currentLegIndex, legProgress } = shipment;
  let covered = 0;
  for (let i = 0; i < Math.min(currentLegIndex, route.length - 1); i++) {
    covered += haversineDistance(route[i], route[i + 1]);
  }
  if (currentLegIndex < route.length - 1) {
    covered += haversineDistance(route[currentLegIndex], route[currentLegIndex + 1]) * legProgress;
  }
  return covered;
}

// ─── Main tick ───────────────────────────────────────────────────────────────

function tick() {
  const newEvents = [];

  for (const shipment of state.shipments) {
    if (!shipment.active || shipment.status === 'Delivered') continue;

    const route = shipment.route;
    if (!route || route.length < 2) continue;

    const effectiveSpeed = Math.max(0, shipment.speedKmph * (shipment.speedFactor || 1));
    const distPerTick = (effectiveSpeed * TICK_S) / 3600; // km

    // Advance along route
    const legFrom = route[shipment.currentLegIndex];
    const legTo = route[shipment.currentLegIndex + 1];
    if (!legFrom || !legTo) continue;

    const legDist = haversineDistance(legFrom, legTo);
    if (legDist < 0.001) {
      shipment.currentLegIndex = Math.min(shipment.currentLegIndex + 1, route.length - 2);
      shipment.legProgress = 0;
      continue;
    }

    shipment.legProgress += distPerTick / legDist;

    // Advance through multiple legs if fast enough
    while (shipment.legProgress >= 1 && shipment.currentLegIndex < route.length - 2) {
      shipment.legProgress -= 1;
      shipment.currentLegIndex += 1;
    }

    // Route complete
    if (shipment.currentLegIndex >= route.length - 1 || shipment.legProgress >= 1) {
      shipment.legProgress = 0;
      shipment.currentLegIndex = route.length - 1;
      shipment.status = 'Delivered';
      shipment.active = false;
      shipment.progressPct = 100;
      shipment.etaMinutes = 0;
      shipment.currentPosition = { ...route[route.length - 1] };
      newEvents.push(
        createEvent('delivered', shipment.id, `${shipment.id} arrived at ${shipment.destination}`, 'success')
      );
      continue;
    }

    // Interpolate current position
    const fp = route[shipment.currentLegIndex];
    const tp = route[shipment.currentLegIndex + 1];
    const t = Math.min(1, Math.max(0, shipment.legProgress));

    shipment.currentPosition = {
      lat: fp.lat + (tp.lat - fp.lat) * t,
      lng: fp.lng + (tp.lng - fp.lng) * t,
    };

    shipment.headingDeg = computeBearing(fp, tp);

    // Progress & ETA
    const totalDist = getTotalDistance(route);
    const covered = getDistanceCovered(shipment);
    const prevProgress = shipment.progressPct;
    shipment.progressPct = Math.min(99.9, (covered / totalDist) * 100);

    const remaining = Math.max(0, totalDist - covered);
    shipment.etaMinutes = effectiveSpeed > 0 ? (remaining / effectiveSpeed) * 60 : 9999;

    // Temperature micro-variation for realism
    if (shipment.temperatureC !== undefined) {
      shipment.temperatureC = parseFloat(
        (shipment.temperatureC + (Math.random() - 0.5) * 0.4).toFixed(1)
      );
    }

    // ── Status transitions ──────────────────────────────────────────────────
    const wasDelayed = shipment.status === 'Delayed';
    const wasNear = shipment.status === 'Near Destination';

    if (shipment.progressPct >= 85 && !wasNear) {
      shipment.status = 'Near Destination';
      newEvents.push(
        createEvent('status', shipment.id, `${shipment.id} approaching ${shipment.destination}`, 'info')
      );
    } else if (
      shipment.riskScore >= 75 &&
      effectiveSpeed < 25 &&
      shipment.progressPct < 85
    ) {
      if (!wasDelayed) {
        newEvents.push(
          createEvent('delay', shipment.id, `${shipment.id} delayed — high risk conditions detected`, 'warning')
        );
      }
      shipment.status = 'Delayed';
    } else if (wasDelayed && effectiveSpeed >= 25) {
      shipment.status = 'In Transit';
      newEvents.push(
        createEvent('status', shipment.id, `${shipment.id} resumed normal transit speed`, 'info')
      );
    }

    // ── Risk threshold crossings ────────────────────────────────────────────
    const prevRisk = shipment._prevRisk || 0;
    if (shipment.riskScore >= 75 && prevRisk < 75) {
      newEvents.push(
        createEvent('risk', shipment.id, `${shipment.id} risk score crossed 75 — action required`, 'danger')
      );
    }
    shipment._prevRisk = shipment.riskScore;

    // ── Geofence checks ─────────────────────────────────────────────────────
    const gfEvent = checkGeofenceEntry(shipment);
    if (gfEvent) newEvents.push(gfEvent);

    shipment.lastUpdatedAt = new Date().toISOString();
  }

  return newEvents;
}

module.exports = { tick };
