const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    manager: {
        type: String,
        required: true
    },
    managerEmail: {
        type: String,
        required: true
    },
    managerPhone: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);