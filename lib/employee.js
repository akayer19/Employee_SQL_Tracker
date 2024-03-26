// employee.js
const db = require('../utils/db');

class Employee {
    // Fetch all employees with detailed information including their manager
    static async getAllEmployeesInfo() {
        try {
            const sql = `
                SELECT 
                    e.id AS employee_id,
                    e.first_name,
                    e.last_name,
                    r.title AS role,
                    d.name AS department,
                    r.salary,
                    CONCAT(m.first_name, ' ', m.last_name) AS manager
                FROM 
                    employee e
                INNER JOIN 
                    role r ON e.role_id = r.id
                INNER JOIN 
                    department d ON r.department_id = d.id
                LEFT JOIN 
                    employee m ON e.manager_id = m.id;
            `;
            const [rows] = await db.query(sql);
            return rows;
        } catch (error) {
            console.error(`Error retrieving all employees: ${error.message}`);
            throw error;
        }
    }

    // Add a new employee
    static async addEmployee(firstName, lastName, roleId, managerId = null) {
        try {
            const sql = `
                INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?);
            `;
            const [result] = await db.query(sql, [firstName, lastName, roleId, managerId]);
            console.log('Employee added successfully');
            return result;
        } catch (error) {
            console.error(`Error adding new employee: ${error.message}`);
            throw error;
        }
    }

    // Retrieve all employees for manager selection
    static async getAllEmployees() {
        try {
            const sql = `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`;
            const [rows] = await db.query(sql);
            return rows;
        } catch (error) {
            console.error(`Error retrieving all employees: ${error.message}`);
            throw error;
        }
    }
    
    // Update an employee's role
    static async updateEmployeeRole(employeeId, newRoleId) {
        try {
            console.log(`Updating role for employeeId: ${employeeId}, newRoleId: ${newRoleId}`); // Debug log
            const sql = `UPDATE employee SET role_id = ? WHERE id = ?;`;
            const [result] = await db.query(sql, [newRoleId, employeeId]);
            console.log(result); // Check the result for any indication of the update status
            if(result.affectedRows > 0) {
                console.log(`Employee's role updated successfully.`);
            } else {
                console.log(`No changes made. Ensure the employee ID (${employeeId}) exists and the new role ID (${newRoleId}) differs from the current one.`);
            }
            return result;
        } catch (error) {
            console.error(`Error updating employee's role: ${error.message}`);
            throw error;
        }
    }
}

module.exports = Employee;
