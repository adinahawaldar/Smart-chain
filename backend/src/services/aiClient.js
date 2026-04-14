const axios = require('axios');

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';

const aiClient = axios.create({
  baseURL: AI_URL,
  timeout: 8000,
});

async function simulateRisk(disruption, shipments) {
  try {
    const res = await aiClient.post('/simulate-risk', { disruption, shipments });
    return res.data;
  } catch (err) {
    console.error('AI service /simulate-risk failed:', err.message);
    return null;
  }
}

async function chatResponse(query, context) {
  try {
    const res = await aiClient.post('/chat-response', { query, context });
    return res.data;
  } catch (err) {
    console.error('AI service /chat-response failed:', err.message);
    return null;
  }
}

async function healthCheck() {
  try {
    const res = await aiClient.get('/health');
    return res.data;
  } catch {
    return null;
  }
}

module.exports = { simulateRisk, chatResponse, healthCheck };
