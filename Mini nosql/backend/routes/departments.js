const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const Employee = require('../models/Employee');

// GET all departments
router.get('/', async (req, res) => {
    try {
        const departments = await Department.find();
        res.json({ success: true, data: departments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single department
router.get('/:id', async (req, res) => {
    try {
        const department = await Department.findOne({ id: req.params.id });
        if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
        res.json({ success: true, data: department });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST - create new department
router.post('/', async (req, res) => {
    try {
        // Auto generate ID
        const lastDept = await Department.findOne().sort({ createdAt: -1 });
        let newIdNum = 1;
        if (lastDept && lastDept.id) {
            newIdNum = parseInt(lastDept.id.replace('DEPT', '')) + 1;
        }
        const newId = 'DEPT' + String(newIdNum).padStart(3, '0');

        const department = new Department({
            ...req.body,
            id: newId
        });

        const saved = await department.save();
        res.status(201).json({ success: true, data: saved, message: 'Department added successfully!' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// PUT - update department
router.put('/:id', async (req, res) => {
    try {
        const oldDept = await Department.findOne({ id: req.params.id });
        if (!oldDept) return res.status(404).json({ success: false, message: 'Department not found' });

        // If department name changed, update all employees in that department
        if (oldDept.name !== req.body.name) {
            await Employee.updateMany(
                { department: oldDept.name },
                { department: req.body.name }
            );
        }

        const updated = await Department.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        res.json({ success: true, data: updated, message: 'Department updated successfully!' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE department
router.delete('/:id', async (req, res) => {
    try {
        const dept = await Department.findOne({ id: req.params.id });
        if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });

        // Check if employees exist in this department
        const employeeCount = await Employee.countDocuments({ department: dept.name });
        if (employeeCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete! ${dept.name} has ${employeeCount} employees. Reassign them first.`
            });
        }

        await Department.findOneAndDelete({ id: req.params.id });
        res.json({ success: true, message: 'Department deleted successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;