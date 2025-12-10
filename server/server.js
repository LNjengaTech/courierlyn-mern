require('dotenv').config();
const express = require('express');
const colors = require('colors')
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const allowedOrigins = [

    process.env.CLIENT_URL,
    'http://10.21.0.226:5173',
    'http://192.168.42.246:5173',
    'http://192.168.43.200:5173'
];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));

connectDB()
// Middleware to parse JSON bodies (for POST requests)
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API Running...');
});

// Route Definitions
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/rates', require('./routes/rateRoutes'));
app.use('/api/tracking', require('./routes/trackingRoutes'));
app.use('/api/shipments', require('./routes/shipmentRoutes'));

// static uploads folder (essential for Multer)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/contact', require('./routes/contactRoutes'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold)
)