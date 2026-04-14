const state = require('../state/runtimeState');
const { simulateRisk } = require('../services/aiClient');
const { applyDisruption } = require('../services/riskEngine');
const { createEvent } = require('../services/eventEngine');

async function runSimulation(req, res) {
  const { disruption } = req.body;
  if (!['storm', 'traffic', 'strike'].includes(disruption)) {
    return res.status(400).json({ error: 'disruption must be storm | traffic | strike' });
  }

  let result;

  // Try Python AI service first
  result = await simulateRisk(disruption, state.shipments);

  // Fallback to local risk engine
  if (!result) {
    console.warn('Falling back to local risk engine for simulation');
    result = applyDisruption(state.shipments, disruption);
  }

  // Apply to runtime state
  for (const updated of result.shipments) {
    const live = state.shipments.find(s => s.id === updated.id);
    if (live) {
      live.riskScore = updated.riskScore;
      live.speedFactor = updated.speedFactor;
      live.speedKmph = updated.speedKmph || live.speedKmph;
    }
  }

  state.simulationActive = true;
  state.lastSimulation = disruption;

  const event = createEvent(
    'simulation',
    null,
    `${disruption.toUpperCase()} simulation applied — speedFactor: ${result.speedFactor.toFixed(2)}`,
    'warning',
    { disruption, speedFactor: result.speedFactor, insight: result.insight }
  );
  state.events.unshift(event);

  if (state.io) {
    state.io.emit('shipments:update', state.shipments);
    state.io.emit('events:new', event);
  }

  res.json({
    success: true,
    disruption,
    speedFactor: result.speedFactor,
    insight: result.insight,
    affectedCount: result.shipments.length,
    events: [event],
  });
}

module.exports = { runSimulation };
