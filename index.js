const inquirer = require('inquirer');
const Department = require('./lib/department');
const Role = require('./lib/role');
const Employee = require('./lib/employee');

const mainMenu = async () => {
    console.log(`
    ________  _______  __    ______  ______________   __  ______    _   _____   ________________ 
   / ____/  |/  / __ \\/ /   / __ \\ \\/ / ____/ ____/  /  |/  /   |  / | / /   | / ____/ ____/ __ \\
  / __/ / /|_/ / /_/ / /   / / / /\\  / __/ / __/    / /|_/ / /| | /  |/ / /| |/ / __/ __/ / /_/ /
 / /___/ /  / / ____/ /___/ /_/ / / / /___/ /___   / /  / / ___ |/ /|  / ___ / /_/ / /___/ _, _/ 
/_____/_/  /_/_/   /_____\\____/ /_/_____/_____/  /_/  /_/_/  |_/_/ |_/_/  |_\\____/_____/_/ |_|  
`);

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
            const departments = await Department.getAllDepartments();
            console.table(departments);
            break;
        case 'View all roles':
            const roles = await Role.getAllRoles();
            console.table(roles);
            break;
        case 'View all employees':
            const employees = await Employee.getAllEmployees();
            console.table(employees);
            break;
        case 'Add a department':
            const { name } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Enter the name of the department:',
                },
            ]);
            await Department.addDepartment(name);
            console.log(`Department ${name} added!`);
            break;
        case 'Add a role':
            // Assumes you have a function in Department to get all departments
            const departmentsForRole = await Department.getAllDepartments();
            const { title, salary, departmentId } = await inquirer.prompt([
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
                    name: 'departmentId',
                    message: 'Select the department for the role:',
                    choices: departmentsForRole.map(dept => ({ name: dept.name, value: dept.id })),
                },
            ]);
            await Role.addRole(title, salary, departmentId);
            console.log(`Role ${title} added!`);
            break;
        case 'Add an employee':
            const rolesForEmployee = await Role.getAllRoles();
            const employeesForManager = await Employee.getAllEmployees();
            const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter the employee\'s first name:',
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter the employee\'s last name:',
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'Select the role for the employee:',
                    choices: rolesForEmployee.map(role => ({ name: role.title, value: role.id })),
                },
                {
                    type: 'list',
                    name: 'managerId',
                    message: 'Select the manager for the employee:',
                    choices: [{ name: 'None', value: null }].concat(
                      employeesForManager.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
                    ),
                },
            ]);
            await Employee.addEmployee(firstName, lastName, roleId, managerId);
            console.log(`Employee ${firstName} ${lastName} added!`);
            break;
        case 'Update an employee role':
            const employeesToUpdate = await Employee.getAllEmployees();
            const newRoles = await Role.getAllRoles();
           
            const { employeeId, newRoleId } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select the employee to update:',
                    choices: employeesToUpdate.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })),
                },
                {
                    type: 'list',
                    name: 'newRoleId',
                    message: 'Select the new role for the employee:',
                    choices: newRoles.map(role => ({ name: role.title, value: role.id })),
                },
            ]);
            await Employee.updateEmployeeRole(employeeId, newRoleId);
            console.log(`Employee updated!`);
            break;
        case 'Exit':
            console.log('Goodbye!');
            process.exit();
            break;
        default:
            console.log('Invalid action');
            break;
    }

    mainMenu();
}
