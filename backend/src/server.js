const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Route Files
const machineRoutes = require('./routes/machineRoutes');
const storageRoutes = require('./routes/storageRoutes');

const app = express();

// Database Connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/machines', machineRoutes);
app.use('/api/storage', storageRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'किसान साथी बिहार API चालू है 🌾',
    database: 'Connected',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 सर्वर पोर्ट ${PORT} पर चालू है: http://localhost:${PORT}/api/health`);
});