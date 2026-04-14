const state = require('../state/runtimeState');
const { chatResponse } = require('../services/aiClient');

// Local fallback chat logic when Python AI is unavailable
function localChatFallback(query, shipments) {
  const q = query.toLowerCase();
  const active = shipments.filter(s => s.active);
  const highRisk = shipments.filter(s => s.riskScore >= 75).sort((a, b) => b.riskScore - a.riskScore);
  const delayed = shipments.filter(s => s.status === 'Delayed');

  if (q.includes('highest risk') || q.includes('most risk') || q.includes('dangerous')) {
    if (highRisk.length === 0) {
      return 'All shipments are currently within acceptable risk thresholds. No high-risk shipments detected.';
    }
    const top = highRisk[0];
    return `The highest-risk shipment is **${top.id}** (${top.source} → ${top.destination}) with a risk score of ${top.riskScore}/100. Current status: ${top.status}. ETA: ${Math.round(top.etaMinutes)} minutes. Immediate rerouting is recommended.`;
  }

  if (q.includes('delay') || q.includes('late') || q.includes('delayed')) {
    if (delayed.length === 0) return 'No shipments are currently delayed. All active shipments are progressing on schedule.';
    const ids = delayed.map(s => s.id).join(', ');
    return `${delayed.length} shipment(s) are currently delayed: **${ids}**. Primary causes include elevated risk scores and reduced speed factors from adverse conditions. Consider activating rerouting for these shipments.`;
  }

  if (q.includes('eta') || q.includes('arrive') || q.includes('when')) {
    if (active.length === 0) return 'No shipments are currently in active transit.';
    const lines = active.map(s => `• **${s.id}**: ${Math.round(s.etaMinutes)} min (${s.destination})`).join('\n');
    return `Current ETA estimates for active shipments:\n${lines}`;
  }

  if (q.includes('reroute') || q.includes('alternative') || q.includes('route')) {
    if (highRisk.length === 0) return 'No shipments currently qualify for emergency rerouting. Risk levels are acceptable across the fleet.';
    const top = highRisk[0];
    return `I recommend rerouting **${top.id}** immediately. With risk at ${top.riskScore}, Express Corridor B offers 25% faster delivery at ₹18,400 additional cost. Alternate Route A saves ₹6,200 but adds approximately 110 minutes. Click "Reroute" in the shipment table to proceed.`;
  }

  if (q.includes('speed') || q.includes('slow') || q.includes('fast')) {
    const avg = active.length
      ? Math.round(active.reduce((a, s) => a + s.speedKmph * (s.speedFactor || 1), 0) / active.length)
      : 0;
    return `Fleet average effective speed is currently **${avg} km/h**. ${active.map(s => `${s.id}: ${Math.round(s.speedKmph * (s.speedFactor || 1))} km/h`).join(', ')}.`;
  }

  if (q.includes('status') || q.includes('summary') || q.includes('overview')) {
    const counts = { active: active.length, highRisk: highRisk.length, delayed: delayed.length };
    return `Fleet overview: **${counts.active}** active shipments, **${counts.highRisk}** high-risk, **${counts.delayed}** delayed. ${highRisk.length > 0 ? `Priority attention needed for: ${highRisk.map(s => s.id).join(', ')}.` : 'No critical issues at this time.'}`;
  }

  if (q.includes('storm') || q.includes('weather') || q.includes('traffic') || q.includes('strike')) {
    return `Disruption simulations are available in the Simulation Panel. Storm reduces speed by 55% and significantly raises risk. Traffic adds 28% delay on urban corridors. Strike causes severe throughput reduction at hub facilities. Use the panel to model impact on your fleet.`;
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return `Hello! I'm your SmartChain AI Assistant. I can help you with shipment risk analysis, ETA estimates, rerouting recommendations, and disruption impact assessment. What would you like to know about your fleet?`;
  }

  return `I can help with: shipment risk levels, ETA estimates, rerouting decisions, delay analysis, and disruption impact. Try asking "Which shipment is highest risk?" or "Are any shipments delayed?"`;
}

async function chat(req, res) {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'query string required' });
  }

  // Build context summary for AI
  const context = {
    totalShipments: state.shipments.length,
    activeShipments: state.shipments.filter(s => s.active).length,
    highRiskShipments: state.shipments.filter(s => s.riskScore >= 75).map(s => ({
      id: s.id, riskScore: s.riskScore, status: s.status, etaMinutes: s.etaMinutes
    })),
    delayedShipments: state.shipments.filter(s => s.status === 'Delayed').map(s => s.id),
    simulationActive: state.simulationActive,
    lastSimulation: state.lastSimulation,
  };

  // Try AI service
  const aiResult = await chatResponse(query, context);

  if (aiResult && aiResult.response) {
    return res.json({ response: aiResult.response, source: 'ai' });
  }

  // Fallback
  const fallback = localChatFallback(query, state.shipments);
  res.json({ response: fallback, source: 'fallback' });
}

module.exports = { chat };
