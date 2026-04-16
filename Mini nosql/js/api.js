// ==========================================
// API.JS - Base API configuration
// ==========================================

const API_BASE_URL = 'http://localhost:5000/api';

const API = {
    // Employee endpoints
    getAllEmployees: async () => {
        const res = await fetch(`${API_BASE_URL}/employees`);
        return res.json();
    },
    addEmployee: async (data) => {
        const res = await fetch(`${API_BASE_URL}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    updateEmployee: async (id, data) => {
        const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    deleteEmployee: async (id) => {
        const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
            method: 'DELETE'
        });
        return res.json();
    },

    // Department endpoints
    getAllDepartments: async () => {
        const res = await fetch(`${API_BASE_URL}/departments`);
        return res.json();
    },
    addDepartment: async (data) => {
        const res = await fetch(`${API_BASE_URL}/departments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    updateDepartment: async (id, data) => {
        const res = await fetch(`${API_BASE_URL}/departments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    deleteDepartment: async (id) => {
        const res = await fetch(`${API_BASE_URL}/departments/${id}`, {
            method: 'DELETE'
        });
        return res.json();
    }
};