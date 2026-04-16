// ==========================================
// DASHBOARD.JS - MONGODB VERSION
// ==========================================

let employees = [];
let departments = [];

document.addEventListener('DOMContentLoaded', async function() {
    await loadAllData();
    calculateAndDisplayStats();
    loadRecentEmployees();
    loadDepartmentOverview();
    setupModalCloseButtons();
    setupEditForm();
});

// Load all data from MongoDB via API
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
        alert('❌ Failed to connect to server. Make sure backend is running on port 5000!');
    }
}

// Calculate and Display Real Statistics
function calculateAndDisplayStats() {
    const totalEmployees = employees.length;
    document.getElementById('totalEmployees').textContent = totalEmployees;
    document.getElementById('totalDepartments').textContent = departments.length;

    const presentToday = employees.filter(emp => emp.status === 'active').length;
    document.getElementById('presentToday').textContent = presentToday;

    const onLeave = employees.filter(emp => emp.status === 'on-leave').length;
    document.getElementById('onLeave').textContent = onLeave;

    const attendanceRate = totalEmployees > 0 ? ((presentToday / totalEmployees) * 100).toFixed(1) : 0;
    document.getElementById('attendanceRate').innerHTML = `
        <i class="fas fa-arrow-up"></i>
        <span>${attendanceRate}% attendance</span>
    `;

    const leavePercentage = totalEmployees > 0 ? ((onLeave / totalEmployees) * 100).toFixed(1) : 0;
    document.getElementById('leavePercentage').innerHTML = `
        <i class="fas fa-minus"></i>
        <span>${leavePercentage}% on leave</span>
    `;
}

// Load Department Overview
function loadDepartmentOverview() {
    const container = document.getElementById('departmentOverview');
    if (!container) return;

    const departmentIcons = {
        'Engineering': 'fa-code',
        'Marketing': 'fa-bullhorn',
        'Sales': 'fa-chart-line',
        'HR': 'fa-users',
        'Finance': 'fa-dollar-sign'
    };

    const departmentStats = departments.map(dept => ({
        name: dept.name,
        count: employees.filter(emp => emp.department === dept.name).length,
        icon: departmentIcons[dept.name] || 'fa-building'
    })).filter(dept => dept.count > 0);

    if (departmentStats.length === 0) {
        container.innerHTML = '<p style="color: #64748b; text-align: center;">No department data available</p>';
        return;
    }

    container.innerHTML = departmentStats.map(dept => `
        <div class="dept-stat">
            <div class="dept-info">
                <div class="dept-icon"><i class="fas ${dept.icon}"></i></div>
                <div>
                    <div class="dept-name">${dept.name}</div>
                    <div class="dept-count">${dept.count} employee${dept.count !== 1 ? 's' : ''}</div>
                </div>
            </div>
            <div class="dept-number">${dept.count}</div>
        </div>
    `).join('');
}

// Load Recent Employees
function loadRecentEmployees() {
    const tbody = document.getElementById('recentEmployeesTable');
    if (!tbody) return;

    const recentEmployees = employees.slice(-5).reverse();

    tbody.innerHTML = recentEmployees.map(employee => `
        <tr>
            <td>
                <div class="employee-info">
                    <div class="employee-avatar">${employee.name.charAt(0)}</div>
                    <div>
                        <div class="employee-name">${employee.name}</div>
                        <div class="employee-id-badge">${employee.id}</div>
                    </div>
                </div>
            </td>
            <td>${employee.department}</td>
            <td>${employee.position}</td>
            <td>
                <span class="status-badge ${employee.status}">
                    ${employee.status === 'active' ? 'Active' : employee.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="icon-btn" onclick="viewEmployeeFromDashboard('${employee.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="icon-btn" onclick="editEmployeeFromDashboard('${employee.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
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

// Setup Edit Form
function setupEditForm() {
    const editForm = document.getElementById('editEmployeeForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateEmployeeFromDashboard();
        });
    }
}

// View Employee from Dashboard
function viewEmployeeFromDashboard(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;

    const modal = document.getElementById('viewEmployeeModal');
    if (!modal) return;

    document.getElementById('viewEmployeeId').textContent = employee.id;
    document.getElementById('viewEmployeeName').textContent = employee.name;
    document.getElementById('viewEmployeeEmail').textContent = employee.email;
    document.getElementById('viewEmployeePhone').textContent = employee.phone;
    document.getElementById('viewEmployeeDepartment').textContent = employee.department;
    document.getElementById('viewEmployeePosition').textContent = employee.position;
    document.getElementById('viewEmployeeSalary').textContent = '₹' + employee.salary.toLocaleString('en-IN');
    document.getElementById('viewEmployeeJoining').textContent = formatDate(employee.joiningDate);
    document.getElementById('viewEmployeeStatus').innerHTML = `<span class="status-badge ${employee.status}">${employee.status === 'active' ? 'Active' : employee.status === 'on-leave' ? 'On Leave' : 'Inactive'}</span>`;
    document.getElementById('viewEmployeeAddress').textContent = employee.address;
    document.getElementById('viewEmployeeEmergency').textContent = employee.emergencyContact;
    document.getElementById('viewEmployeeBlood').textContent = employee.bloodGroup;
    document.getElementById('viewEmployeeEducation').textContent = employee.education;

    modal.style.display = 'block';
}

// Edit Employee from Dashboard
function editEmployeeFromDashboard(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;

    const modal = document.getElementById('editEmployeeModal');
    if (!modal) return;

    // Populate department dropdown
    const editDeptSelect = document.getElementById('editDepartment');
    if (editDeptSelect) {
        editDeptSelect.innerHTML = '';
        departments.forEach(dept => {
            editDeptSelect.innerHTML += `<option value="${dept.name}">${dept.name}</option>`;
        });
    }

    document.getElementById('editEmployeeId').value = employee.id;
    document.getElementById('editName').value = employee.name;
    document.getElementById('editEmail').value = employee.email;
    document.getElementById('editPhone').value = employee.phone;
    document.getElementById('editDepartment').value = employee.department;
    document.getElementById('editPosition').value = employee.position;
    document.getElementById('editSalary').value = employee.salary;
    document.getElementById('editJoiningDate').value = employee.joiningDate;
    document.getElementById('editStatus').value = employee.status;
    document.getElementById('editAddress').value = employee.address;
    document.getElementById('editEmergencyContact').value = employee.emergencyContact;
    document.getElementById('editBloodGroup').value = employee.bloodGroup;
    document.getElementById('editEducation').value = employee.education;

    modal.style.display = 'block';
}

// Update Employee from Dashboard - API Call
async function updateEmployeeFromDashboard() {
    const form = document.getElementById('editEmployeeForm');
    if (!form) return;

    const id = document.getElementById('editEmployeeId').value;
    const formData = new FormData(form);

    const updatedEmployee = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        department: formData.get('department'),
        position: formData.get('position'),
        salary: parseFloat(formData.get('salary')),
        joiningDate: formData.get('joiningDate'),
        status: formData.get('status'),
        address: formData.get('address'),
        emergencyContact: formData.get('emergencyContact'),
        bloodGroup: formData.get('bloodGroup'),
        education: formData.get('education')
    };

    try {
        const res = await API.updateEmployee(id, updatedEmployee);
        if (res.success) {
            document.getElementById('editEmployeeModal').style.display = 'none';
            await loadAllData();
            calculateAndDisplayStats();
            loadRecentEmployees();
            loadDepartmentOverview();
            alert('✅ Employee updated successfully!');
        } else {
            alert('❌ Error: ' + res.message);
        }
    } catch (err) {
        alert('❌ Failed to connect to server!');
    }
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

window.viewEmployeeFromDashboard = viewEmployeeFromDashboard;
window.editEmployeeFromDashboard = editEmployeeFromDashboard;

console.log('dashboard.js loaded - MongoDB version!');
