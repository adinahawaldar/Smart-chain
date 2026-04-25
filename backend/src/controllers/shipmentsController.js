const state = require('../state/runtimeState');
const Shipment = require('../models/Shipment');
const { createEvent } = require('../services/eventEngine');

function getShipments(req, res) {
  res.json(state.shipments);
}

function getTick(req, res) {
  // Polling fallback
  res.json({ shipments: state.shipments, timestamp: new Date().toISOString() });
}

async function rerouteShipment(req, res) {
  const { id } = req.params;
  const body = req.body || {};
  const routeChoice = body.routeChoice || 'B';

  const shipment = state.shipments.find(s => s.id === id);
  if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

  const isRouteB = routeChoice === 'B';
  const speedBoost = isRouteB ? 1.3 : 0.9;
  const costLabel = isRouteB ? 'Express Corridor B (+₹18,400)' : 'Alternate Route A (-₹6,200)';

  shipment.riskScore = 35; // Reset to safe level for demo
  shipment.speedKmph = Math.min(120, shipment.speedKmph * speedBoost);
  shipment.speedFactor = Math.min(1.2, (shipment.speedFactor || 1) * speedBoost);
  shipment.etaMinutes = isRouteB
    ? Math.max(15, shipment.etaMinutes * 0.75)
    : shipment.etaMinutes * 1.1;
  if (shipment.status === 'Delayed') shipment.status = 'In Transit';

  const event = createEvent(
    'reroute',
    id,
    `${id} rerouted via ${costLabel} — risk reduced to ${shipment.riskScore}`,
    'success',
    { routeChoice, costLabel }
  );
  state.events.unshift(event);

  if (state.io) {
    state.io.emit('shipments:update', state.shipments);
    state.io.emit('events:new', event);
  }

  // Persist to MongoDB if available
  // try {
  //   await Shipment.findOneAndUpdate(
  //     { id },
  //     { riskScore: shipment.riskScore, speedKmph: shipment.speedKmph, etaMinutes: shipment.etaMinutes, status: shipment.status }
  //   );
  // } catch {}

  res.json({ success: true, shipment, event });
}

async function ingestCSV(req, res) {
  const { rows } = req.body;
  if (!Array.isArray(rows)) return res.status(400).json({ error: 'rows array required' });

  let imported = 0;
  let skipped = 0;
  const newShipments = [];

  for (const row of rows) {
    if (!row.id || !row.source || !row.destination) { skipped++; continue; }
    if (state.shipments.find(s => s.id === row.id)) { skipped++; continue; }

    const shipment = {
      id: row.id,
      vehicleId: row.vehicleId || `TRK-${Math.floor(Math.random() * 9000 + 1000)}`,
      source: row.source,
      destination: row.destination,
      cargoType: row.cargoType || 'General',
      temperatureC: parseFloat(row.temperatureC) || 20,
      status: 'At Hub',
      riskScore: parseInt(row.riskScore) || 20,
      etaMinutes: parseInt(row.etaMinutes) || 360,
      progressPct: 0,
      active: false,
      speedKmph: 0,
      headingDeg: 0,
      speedFactor: 1.0,
      route: [],
      currentLegIndex: 0,
      legProgress: 0,
      currentPosition: null,
      lastUpdatedAt: new Date().toISOString(),
    };

    state.shipments.push(shipment);
    newShipments.push(shipment);
    imported++;
  }

  if (state.io) state.io.emit('shipments:update', state.shipments);

  const event = createEvent('csv', null, `CSV import: ${imported} shipments added, ${skipped} skipped`, 'info');
  state.events.unshift(event);
  if (state.io) state.io.emit('events:new', event);

  // Persist
  try {
    if (newShipments.length) await Shipment.insertMany(newShipments, { ordered: false });
  } catch {}

  res.json({ imported, skipped, total: state.shipments.length });
}

async function getAIRecommendation(req, res) {
  const { id } = req.params;
  const shipment = state.shipments.find(s => s.id === id);
  if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

  const { rerouteRecommendation } = require('../services/aiClient');
  console.log(`[AI] Fetching recommendation for shipment ${id}...`);
  const recommendation = await rerouteRecommendation(shipment, state.lastSimulation);
  
  if (!recommendation) {
    return res.status(503).json({ error: 'AI service unavailable' });
  }

  res.json(recommendation);
}

module.exports = { getShipments, getTick, rerouteShipment, ingestCSV, getAIRecommendation };
