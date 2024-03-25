const db = require('../utils/db'); // Your database connection module

class Employee {
    // Fetch all employees
    static async getAllEmployees() {
        const [employees] = await db.query('SELECT * FROM employee');
        return employees;
    }

    // Add a new employee
    static async addEmployee(firstName, lastName, roleId, managerId) {
        const result = await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
        return result;
    }

    // Update an employee's role
    static async updateEmployeeRole(employeeId, newRoleId) {
        const result = await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleId, employeeId]);
        return result;
    }

    // Other methods related to employee operations...
}

module.exports = Employee;
