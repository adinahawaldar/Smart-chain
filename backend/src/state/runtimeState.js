/**
 * runtimeState.js
 * In-memory state store for live shipment tracking.
 * MongoDB is the source of truth for persistence;
 * this store drives the real-time movement engine.
 */

const state = {
  /** @type {Array} Live shipment objects */
  shipments: [],

  /** @type {Array} Recent event log (max 100) */
  events: [],

  /** @type {Array} Telemetry history [{timestamp, avgRisk, avgSpeed}] (max 30) */
  tickHistory: [],

  /** @type {import('socket.io').Server|null} Socket.IO server instance */
  io: null,

  /** @type {boolean} Is a simulation currently applied */
  simulationActive: false,

  /** @type {string|null} Last simulation type */
  lastSimulation: null,
};

module.exports = state;
