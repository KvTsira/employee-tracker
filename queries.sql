USE employee_db;

-- view all employee
SELECT e.id as ID, e.first_name as 'First Name', e.last_name as 'Last Name', 
e.role_id as Role,  r.title as Title, d.name as Department,  CONCAT(m.first_name, ' ',  m.last_name) as 'Manager Name' 
FROM employee e 
LEFT JOIN employee m ON e.manager_id = m.id
LEFT JOIN role r ON e.role_id = r.id
LEFT JOIN department d ON r.department_id = d.id;


-- view employees by manager
SELECT e.* , m.first_name
from employee e
left join employee m on m.id=e.manager_id
where m.first_name like '%jenine%';


