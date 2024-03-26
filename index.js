const inquirer = require('inquirer');
const Department = require('./lib/department');
const Role = require('./lib/role');
const Employee = require('./lib/employee');


const mainMenu = async () => {
    try {
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
                await viewAllDepartments();
                break;
            case 'View all roles':
                await viewAllRoles();
                break;
            case 'View all employees':
                await viewAllEmployees();
                break;
            case 'Add a department':
                await addDepartment();
                break;
            case 'Add a role':
                await addRole();
                break;
            case 'Add an employee':
                await addEmployee();
                break;
            case 'Update an employee role':
                await updateEmployeeRole();
                break;
            case 'Exit':
                console.log('Goodbye!');
                process.exit();
                break;
            default:
                console.log('Invalid action');
                break;
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
    mainMenu();
};


const startApp = async () => {
    try {
        console.log(`
        ________  _______  __    ______  ______________   __  ______    _   _____   ________________ 
       / ____/  |/  / __ \\/ /   / __ \\ \\/ / ____/ ____/  /  |/  /   |  / | / /   | / ____/ ____/ __ \\
      / __/ / /|_/ / /_/ / /   / / / /\\  / __/ / __/    / /|_/ / /| | /  |/ / /| |/ / __/ __/ / /_/ /
     / /___/ /  / / ____/ /___/ /_/ / / / /___/ /___   / /  / / ___ |/ /|  / ___ / /_/ / /___/ _, _/ 
    /_____/_/  /_/_/   /_____/\\____/ /_/_____/_____/  /_/  /_/_/  |_/_/ |_/_/  |_\\____/_____/_/ |_|  
        `);

        await mainMenu();
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

startApp();

const viewAllDepartments = async () => {
    const departments = await Department.getAllDepartments();
    console.table(departments);
};

const viewAllRoles = async () => {
    const roles = await Role.getAllRoles();
    console.table(roles);
};

const viewAllEmployees = async () => {
    const employees = await Employee.getAllEmployeesInfo();
    console.table(employees);
};


const addDepartment = async () => {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department (or type "cancel" to cancel):',
        },
    ]);

    if (!name || name.toLowerCase() === 'cancel') {
        console.log('Cancelled!');
        return;
    }

    try {
        await Department.addDepartment(name);
        console.log(`Department ${name} added!`);
    } catch (error) {
        console.error('An error occurred while adding department:', error);
    }
};

const addRole = async () => {
    const { title } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role (or type "cancel" to cancel):',
        },
    ]);

    if (!title || title.toLowerCase() === 'cancel') {
        console.log('Cancelled!');
        return; // Return without calling mainMenu()
    }

    const { salary } = await inquirer.prompt([
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary of the role:',
        },
    ]);

    // Assuming salary is a string that needs to be validated or converted
    if (!salary || isNaN(salary) || salary.toLowerCase() === 'cancel') {
        console.log('Cancelled!');
        return; // Return without calling mainMenu()
    }

    const departmentsForRole = await Department.getAllDepartments();
    const { departmentId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department for the role:',
            choices: departmentsForRole.map(dept => ({ name: dept.name, value: dept.id.toString() })), // Convert ID to string if matching against string values
        },
    ]);

    // No need to check for .toLowerCase() on departmentId since it's a selection
    if (!departmentId) {
        console.log('Cancelled!');
        return; // Return without calling mainMenu()
    }

    try {
        await Role.addRole(title, parseFloat(salary), parseInt(departmentId, 10)); // Ensure salary is a float and departmentId is an integer
        console.log(`Role ${title} added!`);
    } catch (error) {
        console.error('An error occurred while adding the role:', error);
    }

    // mainMenu(); // Return to main menu
};

const addEmployee = async () => {
    const roles = await Role.getAllRoles();
    const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

    const employees = await Employee.getAllEmployees();
    const employeeChoices = employees.map(emp => ({ name: emp.name, value: emp.id }));
    employeeChoices.unshift({ name: 'None', value: null });

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "Enter the employee's first name:",
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Enter the employee's last name:",
        },
        {
            type: 'list',
            name: 'roleId',
            message: "Select the employee's role:",
            choices: roleChoices,
        },
        {
            type: 'list',
            name: 'managerId',
            message: "Select the employee's manager:",
            choices: employeeChoices,
        },
    ]);

    if (answers.firstName.toLowerCase() === 'cancel' || answers.lastName.toLowerCase() === 'cancel') {
        console.log('Operation cancelled.');
        return;
    }

    await Employee.addEmployee(answers.firstName, answers.lastName, answers.roleId, answers.managerId === null ? null : answers.managerId);
    console.log(`${answers.firstName} ${answers.lastName} added as an employee.`);
};

const updateEmployeeRole = async () => {
    try {
        // Fetch all employees and roles for the prompts
        const employeesToUpdate = await Employee.getAllEmployeesInfo();
        const newRoles = await Role.getAllRoles();

        // Prompt to select an employee to update
        const { employeeId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId', // Use 'employeeId' instead of 'action' for clarity
                message: 'Select an employee to update their role:',
                choices: [
                    ...employeesToUpdate.map(emp => ({ 
                        name: `${emp.first_name} ${emp.last_name}`, 
                        value: emp.employee_id  // Ensure you use the correct property here
                    })),
                    { name: 'Cancel', value: 'cancel' }
                ],
            },
        ]);

        // Handle cancellation
        if (employeeId === 'cancel') {
            console.log('Operation cancelled.');
            return;
        }

        // Prompt to select the new role for the employee
        const { newRoleId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'newRoleId',
                message: 'Select the new role for the employee:',
                choices: newRoles.map(role => ({ name: role.title, value: role.id })),
            },
        ]);

        // Perform the update operation
        await Employee.updateEmployeeRole(employeeId, newRoleId);
        console.log(`Employee's role updated successfully!`);
    } catch (error) {
        console.error('An error occurred while updating employee role:', error);
    }
};
