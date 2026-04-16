// ==========================================
// DEPARTMENTS.JS - MONGODB VERSION
// ==========================================

let employees = [];
let departments = [];

document.addEventListener('DOMContentLoaded', async function() {
    await loadAllData();
    loadDepartments();
    setupEventListeners();
});

// Load all data from API
async function loadAllData() {
    try {
        const [empRes, deptRes] = await Promise.all([
            API.getAllEmployees(),
            API.getAllDepartments()
        ]);
        if (empRes.success) employees = empRes.data;
        if (deptRes.success) departments = deptRes.data;
    } catch (err) {
        console.error('Error loading data:', err);
        alert('❌ Failed to connect to server!');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    const addBtn = document.getElementById('addDepartmentBtn');
    if (addBtn) addBtn.addEventListener('click', openAddDepartmentModal);

    setupModalCloseButtons();

    const addForm = document.getElementById('addDepartmentForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addDepartment();
        });
    }

    const editForm = document.getElementById('editDepartmentForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateDepartment();
        });
    }
}

// Setup Modal Close Buttons
function setupModalCloseButtons() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    });
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) modal.style.display = 'none';
        });
    });
}

// Helper functions
function getEmployeeCount(deptName) {
    return employees.filter(emp => emp.department === deptName).length;
}
function getActiveEmployeesCount(deptName) {
    return employees.filter(emp => emp.department === deptName && emp.status === 'active').length;
}
function getTotalSalary(deptName) {
    return employees.filter(emp => emp.department === deptName).reduce((sum, emp) => sum + emp.salary, 0);
}
function getEmployeesByDepartment(deptName) {
    return employees.filter(emp => emp.department === deptName);
}

// Load Departments
function loadDepartments() {
    renderDepartments(departments);
}

// Render Departments
function renderDepartments(deptList) {
    const container = document.querySelector('.departments-grid');
    if (!container) return;

    if (deptList.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-building"></i><p>No departments found</p></div>`;
        return;
    }

    container.innerHTML = deptList.map(dept => {
        const employeeCount = getEmployeeCount(dept.name);
        const totalSalary = getTotalSalary(dept.name);
        const activeCount = getActiveEmployeesCount(dept.name);

        return `
            <div class="department-card">
                <div class="dept-header">
                    <h3>${dept.name}</h3>
                    <div class="action-buttons">
                        <button class="icon-btn" onclick="viewDepartmentDetails('${dept.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="icon-btn" onclick="editDepartmentDetails('${dept.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="icon-btn danger" onclick="deleteDepartmentConfirm('${dept.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div style="margin: 16px 0;">
                    <p style="color: #64748b; margin-bottom: 8px;"><i class="fas fa-user-tie" style="color: #3256B1; margin-right: 8px;"></i><strong>Manager:</strong> ${dept.manager}</p>
                    <p style="color: #64748b; margin-bottom: 8px;"><i class="fas fa-envelope" style="color: #3256B1; margin-right: 8px;"></i>${dept.managerEmail}</p>
                    <p style="color: #64748b; margin-bottom: 8px;"><i class="fas fa-phone" style="color: #3256B1; margin-right: 8px;"></i>${dept.managerPhone}</p>
                    <p style="color: #64748b; margin-bottom: 8px;"><i class="fas fa-map-marker-alt" style="color: #3256B1; margin-right: 8px;"></i>${dept.location}</p>
                    <p style="color: #64748b;"><i class="fas fa-info-circle" style="color: #3256B1; margin-right: 8px;"></i>${dept.description}</p>
                </div>
                <div class="dept-stats">
                    <div class="stat-item">
                        <label>Employees</label>
                        <p style="font-weight: 700; color: #3256B1;">${employeeCount}</p>
                    </div>
                    <div class="stat-item">
                        <label>Active</label>
                        <p style="font-weight: 700; color: #10b981;">${activeCount}</p>
                    </div>
                    <div class="stat-item">
                        <label>Budget</label>
                        <p style="font-weight: 700; color: #3256B1;">₹${(dept.budget / 100000).toFixed(1)}L</p>
                    </div>
                </div>
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
                    <p style="color: #64748b; font-size: 0.875rem; margin: 0;">
                        <strong>Total Monthly Payroll:</strong> ₹${totalSalary.toLocaleString('en-IN')}
                    </p>
                </div>
            </div>
        `;
    }).join('');
}

// View Department Details
function viewDepartmentDetails(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;

    const modal = document.getElementById('viewDepartmentModal');
    if (!modal) return;

    const deptEmployees = getEmployeesByDepartment(dept.name);
    const totalSalary = getTotalSalary(dept.name);

    document.getElementById('viewDeptId').textContent = dept.id;
    document.getElementById('viewDeptName').textContent = dept.name;
    document.getElementById('viewDeptManager').textContent = dept.manager;
    document.getElementById('viewDeptManagerEmail').textContent = dept.managerEmail;
    document.getElementById('viewDeptManagerPhone').textContent = dept.managerPhone;
    document.getElementById('viewDeptEmployeeCount').textContent = deptEmployees.length;
    document.getElementById('viewDeptLocation').textContent = dept.location;
    document.getElementById('viewDeptBudget').textContent = '₹' + dept.budget.toLocaleString('en-IN');
    document.getElementById('viewDeptDescription').textContent = dept.description;

    const employeeListContainer = document.getElementById('viewDeptEmployees');
    if (deptEmployees.length > 0) {
        employeeListContainer.innerHTML = `
            <div class="table-container">
                <table class="employee-table">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Salary</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${deptEmployees.map(emp => `
                            <tr>
                                <td>${emp.id}</td>
                                <td>
                                    <div class="employee-info">
                                        <div class="employee-avatar">${emp.name.charAt(0)}</div>
                                        <div class="employee-name">${emp.name}</div>
                                    </div>
                                </td>
                                <td>${emp.position}</td>
                                <td>₹${emp.salary.toLocaleString('en-IN')}</td>
                                <td><span class="status-badge ${emp.status}">${emp.status === 'active' ? 'Active' : emp.status === 'on-leave' ? 'On Leave' : 'Inactive'}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div style="margin-top:16px;padding:12px;background:#f8fafc;border-radius:8px;">
                    <p style="margin:0;color:#3256B1;font-weight:600;">Total Monthly Payroll: ₹${totalSalary.toLocaleString('en-IN')}</p>
                </div>
            </div>
        `;
    } else {
        employeeListContainer.innerHTML = `<div class="empty-state"><i class="fas fa-users"></i><p>No employees in this department</p></div>`;
    }

    modal.style.display = 'block';
}

// Edit Department
function editDepartmentDetails(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;

    const modal = document.getElementById('editDepartmentModal');
    if (!modal) return;

    document.getElementById('editDepartmentId').value = dept.id;
    document.getElementById('editDeptName').value = dept.name;
    document.getElementById('editManager').value = dept.manager;
    document.getElementById('editManagerEmail').value = dept.managerEmail;
    document.getElementById('editManagerPhone').value = dept.managerPhone;
    document.getElementById('editLocation').value = dept.location;
    document.getElementById('editBudget').value = dept.budget;
    document.getElementById('editDescription').value = dept.description;

    modal.style.display = 'block';
}

// Update Department - API Call
async function updateDepartment() {
    const form = document.getElementById('editDepartmentForm');
    if (!form) return;

    const id = document.getElementById('editDepartmentId').value;
    const formData = new FormData(form);

    const updatedDept = {
        name: formData.get('name'),
        manager: formData.get('manager'),
        managerEmail: formData.get('managerEmail'),
        managerPhone: formData.get('managerPhone'),
        location: formData.get('location'),
        budget: parseFloat(formData.get('budget')),
        description: formData.get('description')
    };

    try {
        const res = await API.updateDepartment(id, updatedDept);
        if (res.success) {
            document.getElementById('editDepartmentModal').style.display = 'none';
            await loadAllData();
            loadDepartments();
            alert('✅ Department updated successfully!');
        } else {
            alert('❌ Error: ' + res.message);
        }
    } catch (err) {
        alert('❌ Failed to connect to server!');
    }
}

// Open Add Department Modal
function openAddDepartmentModal() {
    const modal = document.getElementById('addDepartmentModal');
    if (modal) {
        document.getElementById('addDepartmentForm').reset();
        modal.style.display = 'block';
    }
}

// Add Department - API Call
async function addDepartment() {
    const form = document.getElementById('addDepartmentForm');
    if (!form) return;

    const formData = new FormData(form);
    const newDept = {
        name: formData.get('name'),
        manager: formData.get('manager'),
        managerEmail: formData.get('managerEmail'),
        managerPhone: formData.get('managerPhone'),
        budget: parseFloat(formData.get('budget')),
        location: formData.get('location'),
        description: formData.get('description')
    };

    if (!newDept.name || !newDept.manager) {
        alert('Please fill all required fields!');
        return;
    }

    try {
        const res = await API.addDepartment(newDept);
        if (res.success) {
            document.getElementById('addDepartmentModal').style.display = 'none';
            await loadAllData();
            loadDepartments();
            alert('✅ Department added successfully!');
            form.reset();
        } else {
            alert('❌ Error: ' + res.message);
        }
    } catch (err) {
        alert('❌ Failed to connect to server!');
    }
}

// Delete Department - API Call
async function deleteDepartmentConfirm(id) {
    if (confirm('Are you sure you want to delete this department?')) {
        try {
            const res = await API.deleteDepartment(id);
            if (res.success) {
                await loadAllData();
                loadDepartments();
                alert('✅ Department deleted successfully!');
            } else {
                alert('❌ ' + res.message);
            }
        } catch (err) {
            alert('❌ Failed to connect to server!');
        }
    }
}

window.viewDepartmentDetails = viewDepartmentDetails;
window.editDepartmentDetails = editDepartmentDetails;
window.deleteDepartmentConfirm = deleteDepartmentConfirm;

console.log('departments.js loaded - MongoDB version!');