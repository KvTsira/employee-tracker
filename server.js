//Dependencies

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
            switch (answer.choice) {
                case 'Add department':
                    addDepartment();
                    break;
                case 'Add role':
                    //addRole();
                    break;
                case 'Add employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
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
                    break;
                case 'Remove role':
                    break;
                case 'Remove Department':
                    break;
                case 'Quit':
                    Quit();
                    break;
            }

        }

        )
};

function viewEmployees() {
    const sql = "SELECT * FROM employee";
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
  

function Quit() {
    console.log('Goodbye!');
    process.exit();
}








//   //DATABASES
//   //Add a new department

// // add a role
// const addRole = () => {
//     const qry = 'SELECT * FROM department'
//     connection.query(qry, (error, response) => {
//       if(error) throw error;
//       let departments = [];
//       response.forEach((department) => {
//         departments.push(department.name);
//       });
//       departments.push('Add department to role');
//       inquirer.prompt([{
//         type: 'list',
//         name: 'departmentName',
//         message: 'What is the department your new role belongs to?',
//         choices: departments
//       }]).then((answer) => {
//         if(answer.departmentName === 'Add Department') {
//           this.addDepartment();
//         }
//         else {
//           addRoleData(answer);
//         }
//       });
//       const addRoleData = (roleData) => {
//         inquirer.prompt([{
//           type: 'input',
//           name: 'newRole',
//           message: 'What is the name of the new role?'
//         }, {
//           type: 'input',
//           name: 'salary',
//           message: 'What is the salary for the new role?'
//         }]).then((answer) => {
//           let newRole = answer.newRole;
//           let departmentNameMatch;
//           response.forEach((department) => {
//             if(roleData.name === department.name) {
//               departmentNameMatch = department.id;
//             }
//           });
//           let qry = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
//           let criteria = [newRole, answer.salary, departmentNameMatch];
//           connection.query(qry, criteria, (error) => {
//             if(error) throw error;
//             //  New Role confirmation
//             // =============================================================
//             console.log(redToGreen(str, {
//               interpolation: 'hsv',
//               hsvSpin: 'long'
//             }));
//             console.log((`New role type added to database successfully`));
//             viewAllEmployeeRoles();
//           });
//         });
//       };
//     });
//   };
//   //  Add New Employee
//   // =============================================================
//   const addEmployee = () => {
//     inquirer.prompt([{
//       type: "input",
//       name: "firstName",
//       message: "What is the new employee's first name?", // no blank names
//       validate: inputFirst => {
//         if(inputFirst) {
//           return true;
//         }
//         else {
//           console.log("Please enter a first name for the new employee.");
//           return false;
//         }
//       }
//     }, 
        // {
//       type: "input",
//       name: "lastName",
//       message: "What is the new employee's last name?",
//       validate: inputLast => {
//         if(inputLast) {
//           return true;
//         }
//         else {
//           console.log("Please enter a last name for the new employee.");
//           return false;
//         }
//       }
//     }]).then(answer => {
//       const criteria = [answer.firstName, answer.lastName]
//       const qry2 = `SELECT role.id, role.title FROM role`;
//       connection.query(qry2, (error, data) => {
//         if(error) throw error;
//         const roles = data.map(({
//           id,
//           title
//         }) => ({
//           name: title,
//           value: id
//         }));
//         inquirer.prompt([{
//           type: "list",
//           name: "role",
//           message: "What is the new employee's role?",
//           choices: roles
//         }]).then(selectRole => {
//           const role = selectRole.role;
//           criteria.push(role);
//           const qry3 = `SELECT * FROM employee`;
//           connection.query(qry3, (error, data) => {
//             if(error) throw error;
//             const managers = data.map(({
//               id,
//               first_name,
//               last_name
//             }) => ({
//               name: first_name + " " + last_name,
//               value: id
//             })); // list full name
//             inquirer.prompt([{
//               type: "list",
//               name: "manager",
//               message: "Who is the new employee's manager?",
//               choices: managers
//             }]).then(selectManager => {
//               const manager = selectManager.manager;
//               criteria.push(manager);
//               const qry4 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
//               connection.query(qry4, criteria, (error) => {
//                 if(error) throw error;
//                 //  Employee Added
//                 // =============================================================
//                 console.log(redToGreen(str, {
//                   interpolation: 'hsv',
//                   hsvSpin: 'long'
//                 }));
//                 console.log("The new employee has been added to the databse successfully.");
//                 viewAllEmployees();
//               });
//             });
//           });
//         });
//       });
//     });
//   };
//   // =============================================================
//   // UPDATE DATABASE
//   // =============================================================
//   
//   // =============================================================
//   // VIEW FROM DATABASE
//   // =============================================================
//   //  View Employees
//   // =============================================================
//   const viewAllEmployees = () => {
//     let qry = `SELECT
//      employee.id, CONCAT (employee.first_name, " ", employee.last_name) AS 'Employee Name',role.title AS 'Job Title', department.name AS 'Department', role.salary AS 'Salary', CONCAT(manager.first_name, " " , manager.last_name) AS 'Manager' FROM employee LEFT JOIN role on employee.role_id=role.id LEFT JOIN department on role.department_id= department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`; //not working
//     connection.query(qry, (error, response) => {
//       if(error) throw error;
//       console.log(``);
//       console.log(redToGreen(str, {
//         interpolation: 'hsv',
//         hsvSpin: 'long'
//       }));
//       console.log("Review current Employees:");
//       console.log(``);
//       console.table(response);
//       employeeApp();
//     });
//   };
//   //  View All Departments
//   // =============================================================
//   const viewAllDepartments = () => {
//     const qry = `SELECT department.id as 'Department ID', department.name AS 'Department Name' FROM department`;
//     connection.query(qry, (error, response) => {
//       if(error) throw error;
//       // Departments Displayed
//       // =============================================================
//       console.log("See all Departments:");
//       console.log(redToGreen(str, {
//         interpolation: 'hsv',
//         hsvSpin: 'long'
//       }));
//       console.table(response);
//       employeeApp();
//     });
//   };
//   //  View All Employee Roles
//   // =============================================================
//   const viewAllEmployeeRoles = () => {
//     const qry = `SELECT
//      role.id,
//      role.title AS 'Job Title',
//      role.salary AS 'Salary',
//      department.name AS 'Department'
//      FROM role INNER JOIN department on role.department_id=department.id;`;
//     connection.query(qry, (error, response) => {
//       if(error) throw error;
//       // Roles displayed
//       // =============================================================
//       console.log("Current Employee Roles:");
//       console.log(redToGreen(str, {
//         interpolation: 'hsv',
//         hsvSpin: 'long'
//       }));
//       console.table(response);
//       employeeApp();
//     });
//   }
//   //  View Employees By Department
//   // =============================================================
//   const viewAllEmployeesByDepartment = () => {
//     const qry = `SELECT employee.id, CONCAT (employee.first_name, " ", employee.last_name) AS 'Employee Name', department.name AS 'Department' FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY name`;
//     connection.query(qry, (error, response) => {
//       if(error) throw error;
//       // Employees Displayed
//       // =======================================================
//       console.log("See employees by Department:");
//       console.log(redToGreen(str, {
//         interpolation: 'hsv',
//         hsvSpin: 'long'
//       }));
//       console.table(response);
//       employeeApp();
//     });
//   };
//   // View Budget by Department
//   // =============================================================
//   const viewBudgetsByDepartment = () => {
//     let qry = `SELECT department_id AS 'Department ID', department.name AS 'Department', SUM(salary) AS 'Budget' FROM role INNER JOIN department ON role.department_id = department.id GROUP BY role.department_id`;
//     connection.query(qry, (error, response) => {
//       if(error) throw error;
//       // Budgets Displayed.
//       // =============================================================
//       console.log(redToGreen(str, {
//         interpolation: 'hsv',
//         hsvSpin: 'long'
//       }));
//       console.table(response);
//       employeeApp();
//     })
//   }
//   // =============================================================
//   // REMOVE
//   // =============================================================
//   // Remove Employee
//   // =============================================================
//   const removeEmployee = () => {
//     const qry = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;
//     connection.query(qry, (error, response) => {
//       if(error) throw error;
//       let employeeArray = [];
//       response.forEach((employee) => {
//         employeeArray.push(`${employee.first_name} ${employee.last_name}`);
//       });
//       inquirer.prompt([{
//         name: 'selectedEmployee',
//         type: "list",
//         message: 'What employee would you like to remove from the database?',
//         choices: employeeArray
//       }]).then((answer) => {
//         let employeeId;
//         response.forEach((employee) => {
//           if(answer.selectedEmployee === `${employee.first_name} ${employee.last_name}`) {
//             employeeId = employee.id;
//           }
//         });
//         const qry = `DELETE FROM employee WHERE employee.id = ?`;
//         connection.query(qry, [employeeId], (error) => {
//           if(error) throw error;
//           // Employee Removed.
//           // ==========================================================
//           console.log(redToGreen(str, {
//             interpolation: 'hsv',
//             hsvSpin: 'long'
//           }));
//           console.log("Employee Successfully Removed");
//           viewAllEmployees();
//         });
//       });
//     });
//   };
//   // Remove Departments
//   // =============================================================
//   const removeDepartment = () => {
//     const qry = `SELECT department.id, department.name FROM department`;
//     connection.query(qry, (error, response) => {
//       if(error) throw error;
//       let departments = [];
//       response.forEach((department) => {
//         departments.push(department.name);
//       });
//       inquirer.prompt([{
//         name: "selectedDepartment",
//         type: "list",
//         message: "What department would you like to remove from the database?",
//         choices: departments
//       }]).then((answer) => {
//         let departmentNameMatch;
//         response.forEach((department) => {
//           if(answer.selectedDepartment === department.name) {
//             departmentNameMatch = department.id;
//           }
//         });
//         const qry = `DELETE FROM department WHERE department.id = ?`;
//         connection.query(qry, [departmentNameMatch], (error) => {
//           if(error) throw error;
//           // Department Removed
//           // =============================================================
//           console.log(redToGreen(str, {
//             interpolation: 'hsv',
//             hsvSpin: 'long'
//           }));
//           console.log("Selected Department successfully removed from database");
//           viewAllDepartments();
//         });
//       });
//     });
//   };
//   // =============================================================
//   // END APPLICATION USE
//   // =============================================================
//   const closeApplication = () => {
//     console.log(redToGreen(str, {
//       interpolation: 'hsv',
//       hsvSpin: 'long'
//     }));
//     console.log(figlet.textSync("Thank you!"));
//     console.log(redToGreen(str, {
//       interpolation: 'hsv',
//       hsvSpin: 'long'
//     }));
//     console.log("Your session has ended.");
//   }
