const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['geofence', 'risk', 'delay', 'reroute', 'delivered', 'status', 'simulation', 'csv'],
      required: true,
    },
    shipmentId: { type: String, default: null },
    message: { type: String, required: true },
    severity: {
      type: String,
      enum: ['info', 'warning', 'danger', 'success'],
      default: 'info',
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
