/**
 * riskEngine.js
 * Computes and adjusts risk scores for shipments.
 */

const RISK_BANDS = {
  LOW: { min: 0, max: 39, label: 'Low' },
  MEDIUM: { min: 40, max: 74, label: 'Medium' },
  HIGH: { min: 75, max: 100, label: 'High' },
};

function getRiskBand(score) {
  if (score >= 75) return RISK_BANDS.HIGH;
  if (score >= 40) return RISK_BANDS.MEDIUM;
  return RISK_BANDS.LOW;
}

function getRiskLabel(score) {
  return getRiskBand(score).label;
}

/**
 * Apply disruption to a set of shipments.
 * Returns updated shipments + meta.
 */
function applyDisruption(shipments, disruption) {
  const configs = {
    storm: {
      riskDelta: [25, 40],
      speedFactor: 0.45,
      insight: 'Cyclonic storm system detected over Bay of Bengal. Affected routes show 55% speed reduction and elevated collision risk. Recommend rerouting coastal shipments via inland NH-48 corridor.',
    },
    traffic: {
      riskDelta: [10, 20],
      speedFactor: 0.72,
      insight: 'Major arterial congestion detected near Delhi NCR and Mumbai-Pune Expressway. Average delays of 2.4 hrs projected. Suggest time-window rescheduling for non-critical freight.',
    },
    strike: {
      riskDelta: [30, 50],
      speedFactor: 0.25,
      insight: 'Labour action reported at 3 major logistics hubs. Severe throughput reduction expected. Priority rerouting via air freight and alternate ground corridors is advised for time-sensitive cargo.',
    },
  };

  const cfg = configs[disruption] || configs.traffic;
  const [dMin, dMax] = cfg.riskDelta;

  const updated = shipments.map(s => {
    const delta = Math.floor(Math.random() * (dMax - dMin + 1)) + dMin;
    const newRisk = Math.min(100, s.riskScore + delta);
    return {
      ...s,
      riskScore: newRisk,
      speedFactor: cfg.speedFactor,
      speedKmph: Math.max(5, s.speedKmph * cfg.speedFactor),
    };
  });

  return {
    shipments: updated,
    insight: cfg.insight,
    speedFactor: cfg.speedFactor,
  };
}

/**
 * Derive on-time probability from shipment data.
 */
function computeOnTimeProbability(shipments) {
  const active = shipments.filter(s => s.active);
  if (!active.length) return 100;
  const avgRisk = active.reduce((a, s) => a + s.riskScore, 0) / active.length;
  const avgSpeedRatio = active.reduce((a, s) => a + (s.speedFactor || 1), 0) / active.length;
  const base = 100 - avgRisk * 0.5;
  return Math.max(5, Math.min(99, Math.round(base * avgSpeedRatio)));
}

module.exports = { getRiskBand, getRiskLabel, applyDisruption, computeOnTimeProbability };
