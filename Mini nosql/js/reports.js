// ==========================================
// REPORTS.JS - WITH LOCALSTORAGE SUPPORT
// ==========================================

// Load employees and departments from localStorage
let employeesData = JSON.parse(localStorage.getItem('companyEmployees')) || [];
let departmentsData = JSON.parse(localStorage.getItem('companyDepartments')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Reports page loaded!');
    // Reload data from localStorage
    employeesData = JSON.parse(localStorage.getItem('companyEmployees')) || [];
    departmentsData = JSON.parse(localStorage.getItem('companyDepartments')) || [];
    console.log('Loaded employees:', employeesData.length);
    console.log('Loaded departments:', departmentsData.length);
});

// 1. EMPLOYEE REPORT - DOWNLOADABLE IN WORD
function generateEmployeeReport() {
    console.log('Generating Employee Report...');
    
    // Reload latest data
    employeesData = JSON.parse(localStorage.getItem('companyEmployees')) || [];
    
    if (employeesData.length === 0) {
        alert('⚠️ No employee data available to generate report!');
        return;
    }
    
    const totalEmployees = employeesData.length;
    const activeEmployees = employeesData.filter(e => e.status === 'active').length;
    const onLeaveEmployees = employeesData.filter(e => e.status === 'on-leave').length;
    
    let docContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>Employee Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #3256B1; text-align: center; margin-bottom: 10px; }
                .subtitle { text-align: center; color: #64748b; margin-bottom: 30px; font-size: 14px; }
                h2 { color: #3256B1; margin-top: 30px; border-bottom: 2px solid #3256B1; padding-bottom: 5px; }
                table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 13px; }
                th { background-color: #3256B1; color: white; font-weight: bold; }
                tr:nth-child(even) { background-color: #f9fafb; }
                .summary-box { background: #f8fafc; padding: 20px; margin: 20px 0; border-left: 4px solid #3256B1; }
                .summary-box p { margin: 8px 0; font-size: 14px; }
                .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            </style>
        </head>
        <body>
            <h1>CompanyPro - Employee Report</h1>
            <div class="subtitle">Generated on: ${new Date().toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</div>
            
            <div class="summary-box">
                <h2 style="margin-top: 0;">Summary</h2>
                <p><strong>Total Employees:</strong> ${totalEmployees}</p>
                <p><strong>Active Employees:</strong> ${activeEmployees}</p>
                <p><strong>On Leave:</strong> ${onLeaveEmployees}</p>
                <p><strong>Inactive:</strong> ${totalEmployees - activeEmployees - onLeaveEmployees}</p>
            </div>
            
            <h2>Complete Employee List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Salary</th>
                        <th>Joining Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${employeesData.map(emp => `
                        <tr>
                            <td>${emp.id}</td>
                            <td>${emp.name}</td>
                            <td>${emp.email}</td>
                            <td>${emp.phone}</td>
                            <td>${emp.department}</td>
                            <td>${emp.position}</td>
                            <td>₹${emp.salary.toLocaleString('en-IN')}</td>
                            <td>${emp.joiningDate}</td>
                            <td>${emp.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="footer">
                <p>© 2026 CompanyPro. All rights reserved.</p>
                <p>This is a system-generated report.</p>
            </div>
        </body>
        </html>
    `;
    
    downloadWordDocument(docContent, 'Employee_Report.doc');
}

// 2. DEPARTMENT REPORT - DOWNLOADABLE IN WORD
function generateDepartmentReport() {
    console.log('Generating Department Report...');
    
    // Reload latest data
    employeesData = JSON.parse(localStorage.getItem('companyEmployees')) || [];
    departmentsData = JSON.parse(localStorage.getItem('companyDepartments')) || [];
    
    if (departmentsData.length === 0) {
        alert('⚠️ No department data available to generate report!');
        return;
    }
    
    // Calculate employee count per department
    const deptStats = departmentsData.map(dept => {
        const empCount = employeesData.filter(emp => emp.department === dept.name).length;
        return { ...dept, employeeCount: empCount };
    });
    
    const totalBudget = departmentsData.reduce((sum, d) => sum + d.budget, 0);
    
    let docContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>Department Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #3256B1; text-align: center; margin-bottom: 10px; }
                .subtitle { text-align: center; color: #64748b; margin-bottom: 30px; font-size: 14px; }
                h2 { color: #3256B1; margin-top: 30px; border-bottom: 2px solid #3256B1; padding-bottom: 5px; }
                table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 13px; }
                th { background-color: #3256B1; color: white; font-weight: bold; }
                tr:nth-child(even) { background-color: #f9fafb; }
                .summary-box { background: #f8fafc; padding: 20px; margin: 20px 0; border-left: 4px solid #3256B1; }
                .summary-box p { margin: 8px 0; font-size: 14px; }
                .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            </style>
        </head>
        <body>
            <h1>CompanyPro - Department Report</h1>
            <div class="subtitle">Generated on: ${new Date().toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</div>
            
            <div class="summary-box">
                <h2 style="margin-top: 0;">Summary</h2>
                <p><strong>Total Departments:</strong> ${departmentsData.length}</p>
                <p><strong>Total Budget:</strong> ₹${totalBudget.toLocaleString('en-IN')}</p>
                <p><strong>Total Employees:</strong> ${employeesData.length}</p>
            </div>
            
            <h2>Department Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Department ID</th>
                        <th>Name</th>
                        <th>Manager</th>
                        <th>Location</th>
                        <th>Employees</th>
                        <th>Budget</th>
                    </tr>
                </thead>
                <tbody>
                    ${deptStats.map(dept => `
                        <tr>
                            <td>${dept.id}</td>
                            <td>${dept.name}</td>
                            <td>${dept.manager}</td>
                            <td>${dept.location}</td>
                            <td>${dept.employeeCount}</td>
                            <td>₹${dept.budget.toLocaleString('en-IN')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <h2>Department-wise Employee Distribution</h2>
            ${deptStats.map(dept => {
                const deptEmployees = employeesData.filter(emp => emp.department === dept.name);
                return `
                    <h3 style="color: #3256B1; margin-top: 25px;">${dept.name} (${deptEmployees.length} employees)</h3>
                    ${deptEmployees.length > 0 ? `
                        <table>
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
                                        <td>${emp.name}</td>
                                        <td>${emp.position}</td>
                                        <td>₹${emp.salary.toLocaleString('en-IN')}</td>
                                        <td>${emp.status}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<p>No employees in this department.</p>'}
                `;
            }).join('')}
            
            <div class="footer">
                <p>© 2026 CompanyPro. All rights reserved.</p>
                <p>This is a system-generated report.</p>
            </div>
        </body>
        </html>
    `;
    
    downloadWordDocument(docContent, 'Department_Report.doc');
}

// 3. SALARY REPORT - DOWNLOADABLE IN WORD
function generateSalaryReport() {
    console.log('Generating Salary Report...');
    
    // Reload latest data
    employeesData = JSON.parse(localStorage.getItem('companyEmployees')) || [];
    
    if (employeesData.length === 0) {
        alert('⚠️ No employee data available to generate report!');
        return;
    }
    
    const totalSalary = employeesData.reduce((sum, emp) => sum + emp.salary, 0);
    const avgSalary = totalSalary / employeesData.length;
    const maxSalary = Math.max(...employeesData.map(e => e.salary));
    const minSalary = Math.min(...employeesData.map(e => e.salary));
    
    // Department-wise salary
    const deptSalary = {};
    employeesData.forEach(emp => {
        if (!deptSalary[emp.department]) {
            deptSalary[emp.department] = 0;
        }
        deptSalary[emp.department] += emp.salary;
    });
    
    let docContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>Salary Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #3256B1; text-align: center; margin-bottom: 10px; }
                .subtitle { text-align: center; color: #64748b; margin-bottom: 30px; font-size: 14px; }
                h2 { color: #3256B1; margin-top: 30px; border-bottom: 2px solid #3256B1; padding-bottom: 5px; }
                table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 13px; }
                th { background-color: #3256B1; color: white; font-weight: bold; }
                tr:nth-child(even) { background-color: #f9fafb; }
                .summary-box { background: #f8fafc; padding: 20px; margin: 20px 0; border-left: 4px solid #3256B1; }
                .summary-box p { margin: 8px 0; font-size: 14px; }
                .highlight { background: #dbeafe; padding: 15px; margin: 15px 0; border-radius: 8px; }
                .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            </style>
        </head>
        <body>
            <h1>CompanyPro - Salary Report</h1>
            <div class="subtitle">Generated on: ${new Date().toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</div>
            
            <div class="summary-box">
                <h2 style="margin-top: 0;">Salary Summary</h2>
                <p><strong>Total Monthly Payroll:</strong> ₹${totalSalary.toLocaleString('en-IN')}</p>
                <p><strong>Total Annual Payroll:</strong> ₹${(totalSalary * 12).toLocaleString('en-IN')}</p>
                <p><strong>Average Salary:</strong> ₹${Math.round(avgSalary).toLocaleString('en-IN')}</p>
                <p><strong>Highest Salary:</strong> ₹${maxSalary.toLocaleString('en-IN')}</p>
                <p><strong>Lowest Salary:</strong> ₹${minSalary.toLocaleString('en-IN')}</p>
            </div>
            
            <h2>Department-wise Salary Distribution</h2>
            <table>
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Employees</th>
                        <th>Total Monthly Salary</th>
                        <th>Total Annual Salary</th>
                        <th>Average Salary</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.keys(deptSalary).map(dept => {
                        const empCount = employeesData.filter(e => e.department === dept).length;
                        const avgDeptSalary = deptSalary[dept] / empCount;
                        return `
                            <tr>
                                <td>${dept}</td>
                                <td>${empCount}</td>
                                <td>₹${deptSalary[dept].toLocaleString('en-IN')}</td>
                                <td>₹${(deptSalary[dept] * 12).toLocaleString('en-IN')}</td>
                                <td>₹${Math.round(avgDeptSalary).toLocaleString('en-IN')}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
            
            <h2>Employee Salary Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Monthly Salary</th>
                        <th>Annual Salary</th>
                    </tr>
                </thead>
                <tbody>
                    ${employeesData.map(emp => `
                        <tr>
                            <td>${emp.id}</td>
                            <td>${emp.name}</td>
                            <td>${emp.department}</td>
                            <td>${emp.position}</td>
                            <td>₹${emp.salary.toLocaleString('en-IN')}</td>
                            <td>₹${(emp.salary * 12).toLocaleString('en-IN')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="highlight">
                <p style="margin: 0; font-size: 14px; color: #3256B1;"><strong>Note:</strong> This report includes only basic salary. Additional allowances, bonuses, and deductions are not included.</p>
            </div>
            
            <div class="footer">
                <p>© 2026 CompanyPro. All rights reserved.</p>
                <p>This is a system-generated report.</p>
            </div>
        </body>
        </html>
    `;
    
    downloadWordDocument(docContent, 'Salary_Report.doc');
}

// 4. ATTENDANCE REPORT - DOWNLOADABLE IN WORD
function generateAttendanceReport() {
    console.log('Generating Attendance Report...');
    
    // Reload latest data
    employeesData = JSON.parse(localStorage.getItem('companyEmployees')) || [];
    
    if (employeesData.length === 0) {
        alert('⚠️ No employee data available to generate report!');
        return;
    }
    
    const activeCount = employeesData.filter(e => e.status === 'active').length;
    const leaveCount = employeesData.filter(e => e.status === 'on-leave').length;
    const inactiveCount = employeesData.filter(e => e.status === 'inactive').length;
    const attendanceRate = ((activeCount / employeesData.length) * 100).toFixed(1);
    
    let docContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>Attendance Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #3256B1; text-align: center; margin-bottom: 10px; }
                .subtitle { text-align: center; color: #64748b; margin-bottom: 30px; font-size: 14px; }
                h2 { color: #3256B1; margin-top: 30px; border-bottom: 2px solid #3256B1; padding-bottom: 5px; }
                table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 13px; }
                th { background-color: #3256B1; color: white; font-weight: bold; }
                tr:nth-child(even) { background-color: #f9fafb; }
                .summary-box { background: #f8fafc; padding: 20px; margin: 20px 0; border-left: 4px solid #3256B1; }
                .summary-box p { margin: 8px 0; font-size: 14px; }
                .status-active { background: #dcfce7; color: #16a34a; padding: 4px 8px; border-radius: 4px; font-weight: 600; }
                .status-leave { background: #fef3c7; color: #ca8a04; padding: 4px 8px; border-radius: 4px; font-weight: 600; }
                .status-inactive { background: #fee2e2; color: #dc2626; padding: 4px 8px; border-radius: 4px; font-weight: 600; }
                .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            </style>
        </head>
        <body>
            <h1>CompanyPro - Attendance Report</h1>
            <div class="subtitle">Month: ${new Date().toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long'
            })}</div>
            
            <div class="summary-box">
                <h2 style="margin-top: 0;">Attendance Summary</h2>
                <p><strong>Total Employees:</strong> ${employeesData.length}</p>
                <p><strong>Present (Active):</strong> ${activeCount}</p>
                <p><strong>On Leave:</strong> ${leaveCount}</p>
                <p><strong>Inactive:</strong> ${inactiveCount}</p>
                <p><strong>Attendance Rate:</strong> ${attendanceRate}%</p>
            </div>
            
            <h2>Employee Attendance Status</h2>
            <table>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th>Joining Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${employeesData.map(emp => `
                        <tr>
                            <td>${emp.id}</td>
                            <td>${emp.name}</td>
                            <td>${emp.department}</td>
                            <td>${emp.position}</td>
                            <td>
                                <span class="status-${emp.status}">
                                    ${emp.status === 'active' ? 'Present' : emp.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                                </span>
                            </td>
                            <td>${emp.joiningDate}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <h2>Department-wise Attendance</h2>
            <table>
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Total Employees</th>
                        <th>Present</th>
                        <th>On Leave</th>
                        <th>Attendance %</th>
                    </tr>
                </thead>
                <tbody>
                    ${[...new Set(employeesData.map(e => e.department))].map(dept => {
                        const deptEmps = employeesData.filter(e => e.department === dept);
                        const deptActive = deptEmps.filter(e => e.status === 'active').length;
                        const deptLeave = deptEmps.filter(e => e.status === 'on-leave').length;
                        const deptRate = ((deptActive / deptEmps.length) * 100).toFixed(1);
                        return `
                            <tr>
                                <td>${dept}</td>
                                <td>${deptEmps.length}</td>
                                <td>${deptActive}</td>
                                <td>${deptLeave}</td>
                                <td>${deptRate}%</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
            
            <div class="footer">
                <p>© 2026 CompanyPro. All rights reserved.</p>
                <p>This is a system-generated report.</p>
            </div>
        </body>
        </html>
    `;
    
    downloadWordDocument(docContent, 'Attendance_Report.doc');
}

// Download Word Document Function
function downloadWordDocument(content, filename) {
    const blob = new Blob(['\ufeff', content], {
        type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`✅ ${filename} downloaded successfully!`);
}

// Export functions to global scope
window.generateEmployeeReport = generateEmployeeReport;
window.generateDepartmentReport = generateDepartmentReport;
window.generateSalaryReport = generateSalaryReport;
window.generateAttendanceReport = generateAttendanceReport;

console.log('reports.js loaded successfully with localStorage support!');