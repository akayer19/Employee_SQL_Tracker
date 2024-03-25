-- seeds.sql

-- Insert data into `department`
INSERT INTO department (name) VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

-- Insert data into `role`
INSERT INTO role (title, salary, department_id) VALUES
('Sales Lead', 100000.00, (SELECT id FROM department WHERE name = 'Sales')),
('Salesperson', 80000.00, (SELECT id FROM department WHERE name = 'Sales')),
('Lead Engineer', 150000.00, (SELECT id FROM department WHERE name = 'Engineering')),
('Software Engineer', 120000.00, (SELECT id FROM department WHERE name = 'Engineering')),
('Account Manager', 160000.00, (SELECT id FROM department WHERE name = 'Finance')),
('Accountant', 125000.00, (SELECT id FROM department WHERE name = 'Finance')),
('Legal Team Lead', 250000.00, (SELECT id FROM department WHERE name = 'Legal')),
('Lawyer', 190000.00, (SELECT id FROM department WHERE name = 'Legal'));

-- Temporarily disable the foreign key checks to avoid insertion order issues
SET FOREIGN_KEY_CHECKS = 0;

-- Insert data into `employee`
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', (SELECT id FROM role WHERE title = 'Sales Lead'), NULL),
('Mike', 'Chan', (SELECT id FROM role WHERE title = 'Salesperson'), (SELECT id FROM employee WHERE first_name = 'John' AND last_name = 'Doe')),
('Ashley', 'Rodriguez', (SELECT id FROM role WHERE title = 'Lead Engineer'), NULL),
('Kevin', 'Tupik', (SELECT id FROM role WHERE title = 'Software Engineer'), (SELECT id FROM employee WHERE first_name = 'Ashley' AND last_name = 'Rodriguez')),
('Kunal', 'Singh', (SELECT id FROM role WHERE title = 'Account Manager'), NULL),
('Malia', 'Brown', (SELECT id FROM role WHERE title = 'Accountant'), (SELECT id FROM employee WHERE first_name = 'Kunal' AND last_name = 'Singh')),
('Sarah', 'Lourd', (SELECT id FROM role WHERE title = 'Legal Team Lead'), NULL),
('Tom', 'Allen', (SELECT id FROM role WHERE title = 'Lawyer'), (SELECT id FROM employee WHERE first_name = 'Sarah' AND last_name = 'Lourd'));

-- Re-enable the foreign key checks after insertion
SET FOREIGN_KEY_CHECKS = 1;
