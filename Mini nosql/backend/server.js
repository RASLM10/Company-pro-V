const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const employeeRoutes = require('./routes/employees');
const departmentRoutes = require('./routes/departments');

app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'CompanyPro API is running!' });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB successfully!');
        app.listen(process.env.PORT, () => {
            console.log(`✅ Server running on http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection failed:', err.message);
    });