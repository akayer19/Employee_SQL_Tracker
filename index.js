const inquirer = require('inquirer');
const db = require('./utils/db');

const mainMenu = async () => {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit',
            ],
        },
    ]);

    switch (action) {
        case 'View all departments':
            return viewDepartments();
        case 'View all roles':
            return viewRoles();
        case 'View all employees':
            return viewEmployees();
        case 'Add a department':
            return addDepartment();
        case 'Add a role':
            return addRole();
        case 'Add an employee':
            return addEmployee();
        case 'Update an employee role':
            return updateEmployeeRole();
        case 'Exit':
            process.exit();
    }
}
const viewDepartments = async () => {
    const [rows] = await db.query('SELECT * FROM department');
    console.table(rows);
    mainMenu();
}
const viewRoles = async () => {
    const [rows] = await db.query('SELECT * FROM role');
    console.table(rows);
    mainMenu();
}
const viewEmployees = async () => {
    const [rows] = await db.query('SELECT * FROM employee');
    console.table(rows);
    mainMenu();
}
const addDepartment = async () => {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:',
        },
    ]);

    await db.query('INSERT INTO department (name) VALUES (?)', [name]);
    console.log('Department added!');
    mainMenu();
}
const addRole = async () => {
    const departments = await db.query('SELECT * FROM department');
    const { title, salary, department_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary of the role:',
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department for the role:',
            choices: departments[0].map(department => ({
                name: department.name,
                value: department.id,
            })),
        },
    ]);

    await db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, department_id]);
    console.log('Role added!');
    mainMenu();
}   
const addEmployee = async () => {
    const roles = await db.query('SELECT * FROM role');
    const employees = await db.query('SELECT * FROM employee');
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the employee\'s first name:',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the employee\'s last name:',
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the role for the employee:',
            choices: roles[0].map(role => ({
                name: role.title,
                value: role.id,
            })),
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the manager for the employee:',
            choices: employees[0].map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            })),
        },
    ]);

    await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [first_name, last_name, role_id, manager_id]);
    console.log('Employee added!');
    mainMenu();
}
const updateEmployeeRole = async () => {
    const employees = await db.query('SELECT * FROM employee');
    const roles = await db.query('SELECT * FROM role');
    const { employee_id, role_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: [
                ...employees[0].map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id,
                })),
                { name: 'Cancel', value: 'CANCEL' }, // Add a Cancel option here
            ],
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role for the employee:',
            choices: [
                ...roles[0].map(role => ({
                    name: role.title,
                    value: role.id,
                })),
                { name: 'Cancel', value: 'CANCEL' }, // Add a Cancel option here
            ],
        },
    ]);

    // Check if the user selected the "Cancel" option
    if (employee_id === 'CANCEL' || role_id === 'CANCEL') {
        console.log('Operation cancelled.');
        return mainMenu(); // Return to the main menu
    }

    await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [role_id, employee_id]);
    console.log('Employee role updated!');
    mainMenu();
};

mainMenu();

