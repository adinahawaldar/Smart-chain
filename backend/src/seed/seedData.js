const fs = require('fs');
const path = require('path');
const Shipment = require('../models/Shipment');
const Event = require('../models/Event');
const state = require('../state/runtimeState');

// Coordinate lookup for cities in the CSV to ensure movement works
const CITY_COORDS = {
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Delhi': { lat: 28.6139, lng: 77.2090 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Dubai': { lat: 25.2048, lng: 55.2708 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'London': { lat: 51.5074, lng: -0.1278 },
  'Bangkok': { lat: 13.7563, lng: 100.5018 },
  'Rotterdam': { lat: 51.9225, lng: 4.4792 },
  'San Francisco': { lat: 37.7749, lng: -122.4194 },
  'Nairobi': { lat: -1.2921, lng: 36.8219 },
  'Sydney': { lat: -33.8688, lng: 151.2093 },
  'New York': { lat: 40.7128, lng: -74.0060 },
  'Tokyo': { lat: 35.6762, lng: 139.6503 },
  'Paris': { lat: 48.8566, lng: 2.3522 },
  'Melbourne': { lat: -37.8136, lng: 144.9631 },
  'Frankfurt': { lat: 50.1109, lng: 8.6821 },
  'Toronto': { lat: 43.6532, lng: -79.3832 },
  'Amsterdam': { lat: 52.3676, lng: 4.9041 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 }
};

function getCoords(city) {
  return CITY_COORDS[city] || { lat: 20 + Math.random() * 10, lng: 75 + Math.random() * 10 };
}

function loadShipmentsFromCSV() {
  try {
    const csvPath = path.resolve(process.cwd(), '../sample-import.csv');
    console.log('📖 Loading shipments from:', csvPath);
    if (!fs.existsSync(csvPath)) {
      console.error('❌ CSV file not found at:', csvPath);
      return [];
    }
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(l => l.trim() !== '');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    
    const shipments = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row = {};
      headers.forEach((h, i) => row[h] = values[i]);
      
      const start = getCoords(row.source);
      const end = getCoords(row.destination);
      
      return {
        id: row.id,
        vehicleId: row.vehicleId,
        source: row.source,
        destination: row.destination,
        cargoType: row.cargoType,
        temperatureC: parseFloat(row.temperatureC) || 0,
        status: 'In Transit',
        riskScore: parseInt(row.riskScore) || 0,
        etaMinutes: parseInt(row.etaMinutes) || 0,
        progressPct: Math.floor(Math.random() * 60), 
        active: true,
        speedKmph: 60 + Math.random() * 20,
        headingDeg: Math.floor(Math.random() * 360),
        speedFactor: 1.0,
        route: [start, end],
        currentLegIndex: 0,
        legProgress: Math.random() * 0.5,
        currentPosition: start,
        lastUpdatedAt: new Date().toISOString(),
      };
    });
    return shipments;
  } catch (err) {
    console.error('❌ Failed to load CSV for seed:', err.message);
    return [];
  }
}

const SEED_EVENTS = [
  {
    type: 'status',
    message: 'Global shipment fleet initialized from enterprise ledger',
    severity: 'info',
    timestamp: new Date().toISOString(),
  }
];

async function seedIfEmpty() {
  try {
    const csvShipments = loadShipmentsFromCSV();
    const count = await Shipment.countDocuments();
    
    if ((count === 0 || count < 10) && csvShipments.length > 0) {
      await Shipment.deleteMany({}); 
      await Shipment.insertMany(csvShipments);
      await Event.deleteMany({});
      await Event.insertMany(SEED_EVENTS);
      console.log('🌱 Seeded/Updated', csvShipments.length, 'shipments from CSV');
    } else {
      console.log('ℹ️ Database already has enough data — skipping seed');
    }

    const dbShipments = await Shipment.find().lean();
    state.shipments = dbShipments.map(s => ({
      ...s,
      _id: undefined,
      __v: undefined,
      speedFactor: s.speedFactor || 1.0,
      _prevRisk: s.riskScore,
    }));

    // FORCE TEST CASE: Ensure S302 is high risk for user testing
    const testShipment = state.shipments.find(s => s.id === 'S302');
    if (testShipment) testShipment.riskScore = 85;

    const dbEvents = await Event.find().sort({ timestamp: -1 }).limit(50).lean();
    state.events = dbEvents.map(e => ({ ...e, _id: undefined, __v: undefined }));

    console.log(`✅ Loaded ${state.shipments.length} shipments into runtime state`);
  } catch (err) {
    console.warn('⚠️ Seed failed:', err.message);
    const csvShipments = loadShipmentsFromCSV();
    state.shipments = csvShipments.map(s => ({ ...s, speedFactor: s.speedFactor || 1.0, _prevRisk: s.riskScore }));
    const ts = state.shipments.find(s => s.id === 'S302');
    if (ts) ts.riskScore = 85;
    state.events = [...SEED_EVENTS];
  }
}

module.exports = { seedIfEmpty };
