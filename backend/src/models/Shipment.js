const mongoose = require('mongoose');

const waypointSchema = new mongoose.Schema(
  { lat: Number, lng: Number },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    vehicleId: String,
    source: String,
    destination: String,
    cargoType: String,
    temperatureC: Number,
    status: {
      type: String,
      enum: ['At Hub', 'In Transit', 'Near Destination', 'Delayed', 'Delivered'],
      default: 'At Hub',
    },
    riskScore: { type: Number, default: 0 },
    etaMinutes: { type: Number, default: 0 },
    progressPct: { type: Number, default: 0 },
    active: { type: Boolean, default: false },
    speedKmph: { type: Number, default: 0 },
    headingDeg: { type: Number, default: 0 },
    route: [waypointSchema],
    currentLegIndex: { type: Number, default: 0 },
    legProgress: { type: Number, default: 0 },
    currentPosition: waypointSchema,
    speedFactor: { type: Number, default: 1.0 },
    lastUpdatedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shipment', shipmentSchema);
