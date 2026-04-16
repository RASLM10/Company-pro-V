const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    joiningDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'on-leave', 'inactive'],
        default: 'active'
    },
    address: {
        type: String,
        default: 'Not provided'
    },
    emergencyContact: {
        type: String,
        default: 'Not provided'
    },
    bloodGroup: {
        type: String,
        default: 'Not provided'
    },
    education: {
        type: String,
        default: 'Not provided'
    }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);