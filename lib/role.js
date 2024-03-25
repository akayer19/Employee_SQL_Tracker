const db = require('../utils/db'); // Your database connection module

class Role {
    // Fetch all roles
    static async getAllRoles() {
        const [roles] = await db.query('SELECT * FROM role');
        return roles;
    }

    // Add a new role
    static async addRole(title, salary, departmentId) {
        const result = await db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
        return result;
    }

    // Other methods related to role operations...
}

module.exports = Role;
