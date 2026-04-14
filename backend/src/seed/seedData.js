const Shipment = require('../models/Shipment');
const Event = require('../models/Event');
const state = require('../state/runtimeState');

const SEED_SHIPMENTS = [
  {
    id: 'S101',
    vehicleId: 'TRK-4821',
    source: 'Mumbai',
    destination: 'Delhi',
    cargoType: 'Electronics',
    temperatureC: 22,
    status: 'In Transit',
    riskScore: 45,
    etaMinutes: 855,
    progressPct: 30.3,
    active: true,
    speedKmph: 65,
    headingDeg: 345,
    speedFactor: 1.0,
    route: [
      { lat: 19.076, lng: 72.8777 },   // Mumbai
      { lat: 22.3072, lng: 73.1812 },  // Vadodara
      { lat: 23.0225, lng: 72.5714 },  // Ahmedabad
      { lat: 24.5854, lng: 73.7125 },  // Udaipur
      { lat: 26.9124, lng: 75.7873 },  // Jaipur
      { lat: 28.6139, lng: 77.209 },   // Delhi
    ],
    currentLegIndex: 1,
    legProgress: 0.3,
    currentPosition: { lat: 22.5218, lng: 72.9978 },
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    id: 'S102',
    vehicleId: 'TRK-3304',
    source: 'Bangalore',
    destination: 'Hyderabad',
    cargoType: 'Pharmaceuticals',
    temperatureC: -5,
    status: 'In Transit',
    riskScore: 28,
    etaMinutes: 216,
    progressPct: 31.7,
    active: true,
    speedKmph: 70,
    headingDeg: 20,
    speedFactor: 1.0,
    route: [
      { lat: 12.9716, lng: 77.5946 },  // Bangalore
      { lat: 15.8281, lng: 78.0373 },  // Kurnool
      { lat: 17.385, lng: 78.4867 },   // Hyderabad
    ],
    currentLegIndex: 0,
    legProgress: 0.5,
    currentPosition: { lat: 14.3999, lng: 77.816 },
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    id: 'S103',
    vehicleId: 'TRK-5917',
    source: 'Chennai',
    destination: 'Kolkata',
    cargoType: 'Automotive Parts',
    temperatureC: 28,
    status: 'In Transit',
    riskScore: 62,
    etaMinutes: 1363,
    progressPct: 5.3,
    active: true,
    speedKmph: 60,
    headingDeg: 8,
    speedFactor: 1.0,
    route: [
      { lat: 13.0827, lng: 80.2707 },  // Chennai
      { lat: 16.5062, lng: 80.648 },   // Vijayawada
      { lat: 17.6868, lng: 83.2185 },  // Visakhapatnam
      { lat: 20.2961, lng: 85.8245 },  // Bhubaneswar
      { lat: 22.5726, lng: 88.3639 },  // Kolkata
    ],
    currentLegIndex: 0,
    legProgress: 0.2,
    currentPosition: { lat: 13.7674, lng: 80.3462 },
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    id: 'S104',
    vehicleId: 'TRK-2290',
    source: 'Pune',
    destination: 'Ahmedabad',
    cargoType: 'Textiles',
    temperatureC: 35,
    status: 'Near Destination',
    riskScore: 82,
    etaMinutes: 96,
    progressPct: 77.1,
    active: true,
    speedKmph: 45,
    headingDeg: 350,
    speedFactor: 0.7,
    route: [
      { lat: 18.5204, lng: 73.8567 },  // Pune
      { lat: 19.9975, lng: 73.7898 },  // Nashik
      { lat: 21.1702, lng: 72.8311 },  // Surat
      { lat: 23.0225, lng: 72.5714 },  // Ahmedabad
    ],
    currentLegIndex: 2,
    legProgress: 0.4,
    currentPosition: { lat: 21.9111, lng: 72.7272 },
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    id: 'S105',
    vehicleId: 'TRK-1155',
    source: 'Delhi',
    destination: 'Jaipur',
    cargoType: 'FMCG',
    temperatureC: 20,
    status: 'At Hub',
    riskScore: 15,
    etaMinutes: 240,
    progressPct: 0,
    active: false,
    speedKmph: 0,
    headingDeg: 220,
    speedFactor: 1.0,
    route: [
      { lat: 28.6139, lng: 77.209 },   // Delhi
      { lat: 27.4924, lng: 77.6737 },  // Bharatpur
      { lat: 26.9124, lng: 75.7873 },  // Jaipur
    ],
    currentLegIndex: 0,
    legProgress: 0,
    currentPosition: { lat: 28.6139, lng: 77.209 },
    lastUpdatedAt: new Date().toISOString(),
  },
];

const SEED_EVENTS = [
  {
    type: 'status',
    shipmentId: 'S101',
    message: 'S101 departed Mumbai hub — route to Delhi confirmed',
    severity: 'info',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    type: 'geofence',
    shipmentId: 'S101',
    message: 'S101 entered Vadodara logistics zone',
    severity: 'info',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    type: 'risk',
    shipmentId: 'S104',
    message: 'S104 risk score elevated to 82 — temperature spike detected',
    severity: 'danger',
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
  },
  {
    type: 'status',
    shipmentId: 'S102',
    message: 'S102 departed Bangalore hub — cold-chain verified',
    severity: 'info',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    type: 'geofence',
    shipmentId: 'S103',
    message: 'S103 entered coastal highway segment near Vijayawada',
    severity: 'warning',
    timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(),
  },
];

async function seedIfEmpty() {
  try {
    const count = await Shipment.countDocuments();
    if (count === 0) {
      await Shipment.insertMany(SEED_SHIPMENTS);
      await Event.insertMany(SEED_EVENTS);
      console.log('🌱 Seeded', SEED_SHIPMENTS.length, 'shipments and', SEED_EVENTS.length, 'events');
    } else {
      console.log('ℹ️  Database already has data — skipping seed');
    }

    // Load into runtime state
    const dbShipments = await Shipment.find().lean();
    state.shipments = dbShipments.map(s => ({
      ...s,
      _id: undefined,
      __v: undefined,
      speedFactor: s.speedFactor || 1.0,
      _prevRisk: s.riskScore,
    }));

    const dbEvents = await Event.find().sort({ timestamp: -1 }).limit(50).lean();
    state.events = dbEvents.map(e => ({ ...e, _id: undefined, __v: undefined }));

    console.log(`✅ Loaded ${state.shipments.length} shipments into runtime state`);
  } catch (err) {
    // MongoDB not available — use in-memory seed data
    console.warn('⚠️  MongoDB unavailable — using in-memory seed data');
    state.shipments = SEED_SHIPMENTS.map(s => ({ ...s, speedFactor: s.speedFactor || 1.0, _prevRisk: s.riskScore }));
    state.events = [...SEED_EVENTS].reverse();
  }
}

module.exports = { seedIfEmpty, SEED_SHIPMENTS };
