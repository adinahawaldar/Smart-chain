const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartchain';
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected:', uri);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.warn('⚠️  Continuing without MongoDB — runtime state only.');
  }
}

module.exports = connectDB;
