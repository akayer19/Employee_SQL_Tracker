// department.js
const db = require('../utils/db'); // Your database connection module

class Department {
    // Fetch all departments
    static async getAllDepartments() {
        const [departments] = await db.query('SELECT * FROM department');
        return departments;
    }

    // Add a new department
    static async addDepartment(name) {
        const result = await db.query('INSERT INTO department (name) VALUES (?)', [name]);
        return result;
    }

    // Other methods related to department operations...
}

module.exports = Department;
