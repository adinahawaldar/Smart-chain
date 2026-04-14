const state = require('../state/runtimeState');
const { computeOnTimeProbability } = require('../services/riskEngine');

function getSummary(req, res) {
  const shipments = state.shipments;
  const active = shipments.filter(s => s.active);

  const avgRisk =
    shipments.length > 0
      ? Math.round(shipments.reduce((a, s) => a + s.riskScore, 0) / shipments.length)
      : 0;

  const avgSpeed =
    active.length > 0
      ? Math.round(active.reduce((a, s) => a + s.speedKmph * (s.speedFactor || 1), 0) / active.length)
      : 0;

  const highRiskCount = shipments.filter(s => s.riskScore >= 75).length;
  const delayedCount = shipments.filter(s => s.status === 'Delayed').length;
  const deliveredCount = shipments.filter(s => s.status === 'Delivered').length;
  const onTimeProbability = computeOnTimeProbability(shipments);

  res.json({
    avgRisk,
    avgSpeed,
    highRiskCount,
    delayedCount,
    deliveredCount,
    activeCount: active.length,
    totalCount: shipments.length,
    onTimeProbability,
    tickHistory: state.tickHistory.slice(-20),
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getSummary };
