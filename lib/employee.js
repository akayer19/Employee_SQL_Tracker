// Import the mysql package
const db = require('../utils/db');

// Define a method to retrieve all employees with their information
const getAllEmployeesInfo = async () => {
    try {
        // SQL query to retrieve employee information
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

        // Execute the SQL query
        const [rows, fields] = await db.query(sql);

        // Return the result
        return rows;
    } catch (error) {
        throw new Error(`Error retrieving employee information: ${error.message}`);
    }
};

// Export the method to be used in other parts of the application
module.exports = {
    getAllEmployeesInfo
};
