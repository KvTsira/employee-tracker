SELECT e.id as ID, e.first_name as 'First Name', e.last_name as 'Last Name', 
e.role_id as Role, e.manager_id,  m.first_name + m.last_name as 'Manager Name' , r.title as Title, d.NAME as Department
FROM employee e 
LEFT JOIN employee m ON e.manager_id = m.id
LEFT JOIN role r ON e.role_id = r.id
LEFT JOIN department d ON r.department_id = d.id;

-- select * from role;
-- select * from employee;