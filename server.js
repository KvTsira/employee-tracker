const inquirer = require("inquirer");
const consoleTable = require("console.table");
const mysql = require('mysql2');
const validate = require("./utils/validation");
const connection = require("./db/connection");

//Connect
connection.connect(async function () {
       start();
    });

//Base Structure
function start() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'start',
            message: 'What would you like to do?',
            choices: [
                'Add department', 
                'Add role', 
                'Add employee', 
                'Update an employee role', 
                'View all employees', 
                'View all departments', 
                'View all employee roles', 
                'View all employees by department', 
                'View Budgets by Department', 
                'Remove employee', 
                'Remove role', 
                'Remove Department', 
                'Quit'
            ],
        }
    ]
    )
        .then((answer) => {
            switch (answer.start) {
                case 'Add department':
                    addDepartment();
                    break;
                case 'Add role':
                    addRole();
                    break;
                case 'Add employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateRole();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'View all employee roles':
                    viewRoles();
                    break;
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all employees by department':
                    viewEmployeesByDepartment();
                    break;
                case 'View Budgets by Department':
                    viewBudgetByDepartment();
                    break;
                case 'Remove employee':
                    removeEmployee();
                    break;
                case 'Remove role':
                    break;
                case 'Remove Department':
                    removeDepartment();
                    break;
                case 'Quit':
                    Quit();
                    break;
            }

        }

    )
};

function viewEmployees() {
    const sql = "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, CONCAT( m.first_name, ' ', m.last_name) AS Manager  FROM employee e LEFT JOIN role r ON r.id=e.role_id LEFT JOIN employee m ON m.id=e.manager_id;";
    connection.query(sql, function(err, res) {
      if (err) throw err;
      console.log("Viewing All Employees");
      console.table(res);
      inquirer.prompt([
          {
              type: 'list',
              name: 'choice',
              message: 'select an option.',
              choices: [
                  'Main Menu',
                  'Quit'
              ],
          }
      ])
      .then((answer) => {
          switch (answer.choice) {
              case 'Main Menu':
                  start();
                break;
                case 'Quit':
                    Quit();
          }
      })
    }) 
  };

function viewRoles() {
    const sql = "SELECT * FROM role";
    connection.query(sql, function(err, res) {
        if (err) throw err;
        console.log("Viewing All Roles");
        console.table(res);
        inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'select an option.',
                choices: [
                    'Main Menu',
                    'Quit'
                ],
            }
        ])
        .then((answer) => {
            switch (answer.choice) {
                case 'Main Menu':
                    start();
                break;
                case 'Quit':
                    Quit();
            }
        })
    }) 
};


function viewDepartments() {
    console.log("Viewing All Departments");
    const sql = "SELECT * FROM department";
    connection.query(sql, function(err, res) {
        if (err) throw err;
        console.log("Viewing All Departments");
        console.table(res);
        inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'select an option.',
                choices: [
                    'Main Menu',
                    'Quit'
                ],
            }
        ])
        .then((answer) => {
            switch (answer.choice) {
                case 'Main Menu':
                    start();
                break;
                case 'Quit':
                    Quit();
            }
        })
    }) 
};

function viewEmployeesByDepartment() {
    const sql = "SELECT employee.id, CONCAT (employee.first_name, ' ', employee.last_name) AS 'Employee Name', department.name AS 'Department' FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY name";
    connection.query(sql, function(err, res) {
      if (err) throw err;
      console.log("Viewing All Employees by Department");
      console.table(res);
      inquirer.prompt([
          {
              type: 'list',
              name: 'choice',
              message: 'select an option.',
              choices: [
                  'Main Menu',
                  'Quit'
              ],
          }
      ])
      .then((answer) => {
          switch (answer.choice) {
              case 'Main Menu':
                  start();
                break;
                case 'Quit':
                    Quit();
          }
      })
    }) 
  };

  function viewBudgetByDepartment() {
    const sql = "SELECT department_id AS 'Department ID', department.name AS 'Department', SUM(salary) AS 'Budget' FROM role INNER JOIN department ON role.department_id = department.id GROUP BY role.department_id";
    connection.query(sql, function(err, res) {
      if (err) throw err;
      console.log("Viewing budget by Department");
      console.table(res);
      inquirer.prompt([
          {
              type: 'list',
              name: 'choice',
              message: 'select an option.',
              choices: [
                  'Main Menu',
                  'Quit'
              ],
          }
      ])
      .then((answer) => {
          switch (answer.choice) {
              case 'Main Menu':
                  start();
                break;
                case 'Quit':
                    Quit();
          }
      })
    }) 
  };


function addEmployee() {
    console.log('adding a new employee')
    inquirer.prompt([{
        type: "input",
        name: "firstName",
        message: "Enter the Employee First Name", // no blank names
        validate: inputFirst => {
        if(inputFirst) {
            return true;
        }
        else {
            console.log("Please enter a first name for the new employee.");
            return false;
        }
        }
    }, 
        {
        type: "input",
        name: "lastName",
        message: "Enter the Employee Lats Name",  // no blank names
        validate: inputLast => {
        if(inputLast) {
            return true;
        }
        else {
            console.log("Please enter a last name for the new employee.");
            return false;
        }
        }
    }]).then(answer => {
        const criteria = [answer.firstName, answer.lastName]
        const qry = "SELECT role.id, role.title FROM role";
        connection.query(qry, (error, data) => {
        if(error) throw error;
        const roles = data.map(({
            id,
            title
        }) => ({
            name: title,
            value: id
        }));
        //list roles
        inquirer.prompt([{
            type: "list",
            name: "role",
            message: "Select the Employee Role",
            choices: roles
        }]).then(selectRole => {
            const role = selectRole.role;
            criteria.push(role);
            const qry = "SELECT * FROM employee";
            connection.query(qry, (error, data) => {
            if(error) throw error;
            const managers = data.map(({
                id,
                first_name,
                last_name
            }) => ({
                name: first_name + " " + last_name,
                value: id
            })); 
            // list managers
            inquirer.prompt([{
                type: "list",
                name: "manager",
                message: "select the manager",
                choices: managers
            }]).then(selectManager => {
                const manager = selectManager.manager;
                criteria.push(manager);
                const qry = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                connection.query(qry, criteria, (error) => {
                if(error) throw error;
                //  Employee Added
                console.log("The new employee has been added to the databse successfully.");
                viewEmployees();
                });
            });
            });
        });
        });
    });
};

function addDepartment() {
    inquirer.prompt([{
        type: 'input',
        name: 'addDepartment',
        message: "Enter the Department Name"
    }]).then((answer) => {
        let qry = "INSERT INTO department(name)VALUES (?)";
        connection.query(qry, answer.addDepartment, (error, response) => {
        if(error) throw error;
        console.log("Department was created successfully.");
        viewDepartments();
        });
    });
};
  
function addRole() {
    const qry = 'SELECT * FROM department'
    connection.query(qry, (error, response) => {
      if(error) throw error;
      let departmentArray = [];
      response.forEach((department) => {
        departmentArray.push(department.name);
      });
      departmentArray.push('Add department to role');
      inquirer.prompt([{
        type: 'list',
        name: 'departmentName',
        message: 'What is the department your new role belongs to?',
        choices: departmentArray
      }]).then((answer) => {
        if(answer.departmentName === 'Add Department') {
          this.addDepartment();
        }
        else {
          addRoleData(answer);
        }
      });
      const addRoleData = (roleData) => {
        inquirer.prompt([{
          type: 'input',
          name: 'newRole',
          message: 'What is the name of the new role?'
        }, {
          type: 'input',
          name: 'salary',
          message: 'What is the salary for the new role?'
        }]).then((answer) => {
          let newRole = answer.newRole;
          let departmentNameMatch;
          response.forEach((department) => {
            if(roleData.departmentName === department.name) {
              departmentNameMatch = department.id;
            }
          });
          let qry = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
          let criteria = [newRole, answer.salary, departmentNameMatch];
          connection.query(qry, criteria, (error) => {
            if(error) throw error;
            console.log((`New role type added to database successfully`));
            //show all employees
            viewEmployees();
          });
        });
      };
    });
  };

  //remove Employee
function removeEmployee() {
    const qry = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;
    connection.query(qry, (error, response) => {
      if(error) throw error;
      let employeeArray = [];
      response.forEach((employee) => {
        employeeArray.push(`${employee.first_name} ${employee.last_name}`);
      });
      inquirer.prompt([{
        name: 'selectedEmployee',
        type: "list",
        message: 'Select the employee you would like to remove',
        choices: employeeArray
      }]).then((answer) => {
        let employeeId;
        response.forEach((employee) => {
          if(answer.selectedEmployee === `${employee.first_name} ${employee.last_name}`) {
            employeeId = employee.id;
          }
        });
        const qry = `DELETE FROM employee WHERE employee.id = ?`;
        connection.query(qry, [employeeId], (error) => {
          if(error) throw error;
          //show the remaining employee
          viewEmployees();
        });
      });
    });
  };

  //Remove Depratmnet
function removeDepartment() {
    const qry = `SELECT department.id, department.department_name FROM department`;
    connection.query(qry, (error, response) => {
        if(error) throw error;
        let departmentArray = [];
        response.forEach((department) => {
            departmentArray.push(department.department_name);
        });
        inquirer.prompt([{
            name: "selectedDepartment",
            type: "list",
            message: "Select the department you would like to remove",
            choices: departmentArray
        }]).then((answer) => {
            let departmentNameMatch;
            response.forEach((department) => {
                if(answer.selectedDepartment === department.name) {
                departmentNameMatch = department.id;
                }
            });
            const qry = `DELETE FROM department WHERE department.id = ?`;
            connection.query(qry, [departmentNameMatch], (error) => {
                if(error) throw error;
                console.log("The Department was removed");
                //show all remaining departments
                viewDepartments();
            });
        });
    });
};


function updateRole() {
    const qry=`SELECT CONCAT(first_name, " ", last_name) AS EmployeeName FROM employee;`;
    connection.query(qry, (err, res)  => {
            if (err) throw err;
            // loop to go through names and push to array for selection
            let employeeArray = [];
            res.forEach((employee) => {
                employeeArray.push(employee.EmployeeName);
            });
            inquirer.prompt([
                {
                    type: "list",
                    name: "selectedEmployee",
                    message: "Select the Employee you want to change the role for",
                    choices: employeeArray
                }
            ])
            .then((res) => {
                let employee = res.selectedEmployee;
                const qry=`SELECT title FROM role`;
                connection.query(qry, (err, res) => {
                    if (err) throw err;
                    // loop to go through rolls and push to array for selection 
                    let roleArray = [];
                    res.forEach((role) => {
                        roleArray.push(role.title);
                    });
                inquirer.prompt([
                    {
                        type: "list",
                        name: "roleUpdate",
                        message: "What is the new role for this employee?",
                        choices: roleArray
                    }
                ])
    
                .then((res) => {
                    let roleName = res.roleUpdate;
                    console.log('selected role:', roleName);
                    connection.query(`UPDATE employee SET role_id=(SELECT id FROM role WHERE title='${roleName}') WHERE CONCAT(first_name,' ', last_name) = '${employee}'; `,
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Employee role updated!`);
                        viewEmployees();
                    });
                });
            });
        });
    });
    }

function Quit() {
    console.log('Good Bye!');
    process.exit();
}

