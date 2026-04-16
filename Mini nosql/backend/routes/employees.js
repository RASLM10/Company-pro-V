const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json({ success: true, data: employees });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single employee
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findOne({ id: req.params.id });
        if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
        res.json({ success: true, data: employee });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST - create new employee
router.post('/', async (req, res) => {
    try {
        // Auto generate ID
        const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });
        let newIdNum = 1;
        if (lastEmployee && lastEmployee.id) {
            newIdNum = parseInt(lastEmployee.id.replace('EMP', '')) + 1;
        }
        const newId = 'EMP' + String(newIdNum).padStart(3, '0');

        const employee = new Employee({
            ...req.body,
            id: newId
        });

        const saved = await employee.save();
        res.status(201).json({ success: true, data: saved, message: 'Employee added successfully!' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// PUT - update employee
router.put('/:id', async (req, res) => {
    try {
        const updated = await Employee.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: 'Employee not found' });
        res.json({ success: true, data: updated, message: 'Employee updated successfully!' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Employee.findOneAndDelete({ id: req.params.id });
        if (!deleted) return res.status(404).json({ success: false, message: 'Employee not found' });
        res.json({ success: true, message: 'Employee deleted successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;