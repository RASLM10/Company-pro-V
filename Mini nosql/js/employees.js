// ==========================================
// EMPLOYEES.JS - MONGODB VERSION
// ==========================================

let employees = [];
let departments = [];

// Load all data on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadDepartments();
    await loadEmployees();
    populateDepartmentDropdowns();
    setupEventListeners();
});

// Load employees from MongoDB via API
async function loadEmployees() {
    try {
        const res = await API.getAllEmployees();
        if (res.success) {
            employees = res.data;
            renderEmployees(employees);
            updateEmployeeCount();
        }
    } catch (err) {
        console.error('Error loading employees:', err);
        alert('❌ Failed to connect to server. Make sure backend is running!');
    }
}

// Load departments from MongoDB via API
async function loadDepartments() {
    try {
        const res = await API.getAllDepartments();
        if (res.success) {
            departments = res.data;
        }
    } catch (err) {
        console.error('Error loading departments:', err);
    }
}

// Populate department dropdowns
function populateDepartmentDropdowns() {
    const filterDropdown = document.getElementById('departmentFilter');
    if (filterDropdown) {
        filterDropdown.innerHTML = '<option value="all">All Departments</option>';
        departments.forEach(dept => {
            filterDropdown.innerHTML += `<option value="${dept.name}">${dept.name}</option>`;
        });
    }

    const addFormSelect = document.querySelector('#addEmployeeForm select[name="department"]');
    if (addFormSelect) {
        addFormSelect.innerHTML = '<option value="">Select Department</option>';
        departments.forEach(dept => {
            addFormSelect.innerHTML += `<option value="${dept.name}">${dept.name}</option>`;
        });
    }

    const editFormSelect = document.getElementById('editDepartment');
    if (editFormSelect) {
        editFormSelect.innerHTML = '';
        departments.forEach(dept => {
            editFormSelect.innerHTML += `<option value="${dept.name}">${dept.name}</option>`;
        });
    }
}

// Setup Event Listeners
function setupEventListeners() {
    const addBtn = document.getElementById('addEmployeeBtn');
    if (addBtn) {
        addBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openAddEmployeeModal();
        });
    }

    const departmentFilter = document.getElementById('departmentFilter');
    if (departmentFilter) departmentFilter.addEventListener('change', filterEmployees);

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) statusFilter.addEventListener('change', filterEmployees);

    setupModalCloseButtons();

    const addForm = document.getElementById('addEmployeeForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addEmployee();
        });
    }

    const editForm = document.getElementById('editEmployeeForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateEmployee();
        });
    }

    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchEmployees(e.target.value.toLowerCase().trim());
        });
    }
}

// Setup Modal Close Buttons
function setupModalCloseButtons() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.style.display = 'none');
        }
    });
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) modal.style.display = 'none';
        });
    });
}

// Render Employees Table
function renderEmployees(employeeList) {
    const tbody = document.querySelector('.employee-table tbody');
    if (!tbody) return;

    if (employeeList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px;">
                    <i class="fas fa-users" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 10px; display: block;"></i>
                    <p style="color: #64748b;">No employees found</p>
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = employeeList.map(employee => `
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
            <td>${employee.email}</td>
            <td>${employee.phone}</td>
            <td>${employee.department}</td>
            <td>${employee.position}</td>
            <td>₹${employee.salary.toLocaleString('en-IN')}</td>
            <td>${formatDate(employee.joiningDate)}</td>
            <td>
                <span class="status-badge ${employee.status}">
                    ${employee.status === 'active' ? 'Active' : employee.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="icon-btn" onclick="viewEmployeeDetails('${employee.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="icon-btn" onclick="editEmployeeDetails('${employee.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-btn danger" onclick="deleteEmployeeConfirm('${employee.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Search Employees
function searchEmployees(searchTerm) {
    if (!searchTerm) {
        renderEmployees(employees);
        return;
    }
    const filtered = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm) ||
        emp.id.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.department.toLowerCase().includes(searchTerm) ||
        emp.position.toLowerCase().includes(searchTerm) ||
        emp.phone.includes(searchTerm)
    );
    renderEmployees(filtered);
}

// Filter Employees
function filterEmployees() {
    const deptFilter = document.getElementById('departmentFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    let filtered = employees;
    if (deptFilter !== 'all') filtered = filtered.filter(emp => emp.department === deptFilter);
    if (statusFilter !== 'all') filtered = filtered.filter(emp => emp.status === statusFilter);
    renderEmployees(filtered);
}

// Update Employee Count
function updateEmployeeCount() {
    const countElement = document.getElementById('employeeCount');
    if (countElement) countElement.textContent = employees.length;
}

// Open Add Employee Modal
function openAddEmployeeModal() {
    const modal = document.getElementById('addEmployeeModal');
    if (modal) {
        document.getElementById('addEmployeeForm').reset();
        populateDepartmentDropdowns();
        modal.style.display = 'block';
    }
}

// Add Employee - API Call
async function addEmployee() {
    const form = document.getElementById('addEmployeeForm');
    if (!form) return;

    const formData = new FormData(form);
    const newEmployee = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        department: formData.get('department'),
        position: formData.get('position'),
        salary: parseFloat(formData.get('salary')),
        joiningDate: formData.get('joiningDate'),
        status: 'active',
        address: formData.get('address') || 'Not provided',
        emergencyContact: formData.get('emergencyContact') || 'Not provided',
        bloodGroup: formData.get('bloodGroup') || 'Not provided',
        education: formData.get('education') || 'Not provided'
    };

    if (!newEmployee.name || !newEmployee.email || !newEmployee.department) {
        alert('Please fill all required fields!');
        return;
    }

    try {
        const res = await API.addEmployee(newEmployee);
        if (res.success) {
            document.getElementById('addEmployeeModal').style.display = 'none';
            await loadEmployees();
            alert('✅ Employee added successfully!');
            form.reset();
        } else {
            alert('❌ Error: ' + res.message);
        }
    } catch (err) {
        alert('❌ Failed to connect to server!');
    }
}

// View Employee Details
function viewEmployeeDetails(id) {
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

// Edit Employee
function editEmployeeDetails(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;

    const modal = document.getElementById('editEmployeeModal');
    if (!modal) return;

    populateDepartmentDropdowns();

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

// Update Employee - API Call
async function updateEmployee() {
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
            await loadEmployees();
            alert('✅ Employee updated successfully!');
        } else {
            alert('❌ Error: ' + res.message);
        }
    } catch (err) {
        alert('❌ Failed to connect to server!');
    }
}

// Delete Employee - API Call
async function deleteEmployeeConfirm(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        try {
            const res = await API.deleteEmployee(id);
            if (res.success) {
                await loadEmployees();
                alert('✅ Employee deleted successfully!');
            } else {
                alert('❌ Error: ' + res.message);
            }
        } catch (err) {
            alert('❌ Failed to connect to server!');
        }
    }
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Export to global scope
window.viewEmployeeDetails = viewEmployeeDetails;
window.editEmployeeDetails = editEmployeeDetails;
window.deleteEmployeeConfirm = deleteEmployeeConfirm;

console.log('employees.js loaded - MongoDB version!');