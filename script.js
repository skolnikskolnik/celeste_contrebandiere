//Dependencies
//Must install express, inquirer, and mysql
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

//Connects to database
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",

    database: "contrebandiere"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startPage();
});


//Function definitions
//This is the start page, and also how the user can exit the program
function startPage() {
    //First asking the user if they want to add, view, or update
    inquirer.prompt({
        name: "userPath",
        type: "list",
        message: "What do you want to do?",
        choices: ["ADD to departments, roles, or employees", "View departments, roles, or employees",
            "Update employee role", "Add manager to employee", "View employees by manager",
            "Delete departments, roles, or employees", "View budget by department", "EXIT"]
    })
        .then(function (answer) {
            if (answer.userPath == "ADD to departments, roles, or employees") {
                addToDB();
            }
            else if (answer.userPath == "View departments, roles, or employees") {
                viewDB();
            }
            else if (answer.userPath == "Update employee role") {
                updateEmployeeRole();
            }
            else if (answer.userPath == "Add manager to employee") {
                addManager();
            }
            else if (answer.userPath == "View employees by manager") {
                viewEmployeeByManager();
            }
            else if (answer.userPath == "Delete departments, roles, or employees") {
                deleteFxn();
            }
            else if (answer.userPath == "View budget by department") {
                viewBudget();
            }
            else {
                connection.end();
            }
        })
}



//addToDB, addDepartment, addRole, and addEmployee all concern adding to the existing DB
function addToDB() {
    //Do they want to add to departments, roles, or employees?
    inquirer.prompt({
        name: "whatToAdd",
        type: "list",
        message: "What do you want to add?",
        choices: ["department", "role", "employee", "GO BACK"]
    })
        .then(function (answer) {
            if (answer.whatToAdd == "department") {
                addDepartment();
            }
            else if (answer.whatToAdd == "role") {
                addRole();
            }
            else if (answer.whatToAdd == "employee") {
                addEmployee();
            }
            else {
                startPage();
            }
        })
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "department",
                type: "input",
                message: "What department do you want to add?"
            },
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO department SET?",
                {
                    name: answer.department
                },
                function (err) {
                    if (err) throw err;
                    console.log(`Successfully added ${answer.department} department`);
                    startPage();
                }
            )
        })
}

function addRole() {
    let sqlString = `SELECT*FROM department`;

    printTable(sqlString);

    connection.query("SELECT*FROM department", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the role being added?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary of this role?",
                    //Validate that this is a number
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "departmentId",
                    type: "rawlist",
                    //Populating the department roless from the department table 
                    choices: function () {
                        let departmentArray = [];
                        for (var i = 0; i < results.length; i++) {
                            departmentArray.push(results[i].id);
                        }
                        return departmentArray;
                    },
                    message: "What is this person's department ID?"
                }
            ])
            .then(function (answer) {
                connection.query(
                    "INSERT INTO role SET?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.departmentId
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(`Successfully added ${answer.title} role at a salary of ${answer.salary} in department number ${answer.department_id}`);
                        startPage();
                    }
                )
            })
    })
}



function addEmployee() {
    let sqlString = `SELECT id, title FROM role`;

    printTable(sqlString);

    connection.query("SELECT*FROM role", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "What is this employees first name?"
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is this employees last name?"
                },
                {
                    name: "roleId",
                    type: "rawlist",
                    //Populating the role IDs from the role table 
                    choices: function () {
                        var roleArray = [];
                        for (var i = 0; i < results.length; i++) {
                            roleArray.push(results[i].id);
                        }
                        return roleArray;
                    },
                    message: "What is this person's role ID?"
                }
            ])
            .then(function (answer) {
                connection.query(
                    "INSERT INTO employee SET?",
                    {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        role_id: answer.roleId
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(`Successfully added ${answer.first_name} ${answer.last_name} to the employee list`);
                        startPage();
                    }
                )
            })
    })
}



//Now we want to view departments, roles, and employees
function viewDB() {
    let sqlString="";
    //Do they want to add to departments, roles, or employees?
    inquirer.prompt({
        name: "whatToView",
        type: "list",
        message: "What do you want to view?",
        choices: ["departments", "roles", "employees", "GO BACK"]
    })
        .then(function (answer) {
            if (answer.whatToView == "departments") {
                sqlString = `SELECT*FROM department`;
                printTable(sqlString);
                startPage();
            }
            else if (answer.whatToView == "roles") {
                sqlString = "SELECT*FROM role";
                printTable(sqlString);
                startPage();
            }
            else if (answer.whatToView == "employees") {
                sqlString = "SELECT*FROM employee";
                printTable(sqlString);
                startPage();
            }
            else {
                startPage();
            }
        })
}

function printTable(string){
    connection.query(
        `${string}`,
        function (err, results) {
            if (err) throw err;
            console.table(results);
        }
    );
}




//Updating employee role
function updateEmployeeRole() {
    //Fine out what employee they want to change
    let employeeToChange = "";
    connection.query("SELECT*FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "employee_name",
                    type: "rawlist",
                    choices: function () {
                        var nameArray = [];
                        for (var i = 0; i < results.length; i++) {
                            nameArray.push(results[i].last_name);
                        }
                        return nameArray;
                    },
                    message: "Which employee do you want to change the role of?"
                }
            ])
            .then(function (answer) {
                employeeToChange = answer.employee_name;
                changeRole(employeeToChange);
            })
    })
    startPage();
}

function changeRole(name) {
    //We want to target the lines with name 
    //First find out what the new role is - from the roles table
    let sqlString = `SELECT id, title FROM role`;

    printTable(sqlString);
    connection.query(
        "SELECT*FROM role", function (err, results) {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: "roleId",
                        type: "rawlist",
                        //Populating the role IDs from the role table 
                        choices: function () {
                            var roleArray = [];
                            for (var i = 0; i < results.length; i++) {
                                roleArray.push(results[i].id);
                            }
                            return roleArray;
                        },
                        message: `What is ${name}'s new role ID?`
                    }
                ])
                .then(function (answer) {
                    let newRole = answer.roleId;
                    changeEmployeeTable(newRole, name);
                })
        })
}

function changeEmployeeTable(newRole, name) {
    let sqlCommand = `UPDATE employee
    SET role_id = ${newRole}
    WHERE last_name="${name}";`;

    connection.query(sqlCommand, function (err, results) {
        if (err) throw err;
        console.log(`Successfully updated ${name}'s new role!`);
        startPage();
    })
}



//Adding manager to existing employee
function addManager() {
    //First need to get the employee
    //Fine out what employee they want to change
    let employeeToChange = "";
    connection.query("SELECT*FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "employee_name",
                    type: "rawlist",
                    choices: function () {
                        var nameArray = [];
                        for (var i = 0; i < results.length; i++) {
                            nameArray.push(results[i].last_name);
                        }
                        return nameArray;
                    },
                    message: "Which employee do you want to change the role of?"
                }
            ])
            .then(function (answer) {
                employeeToChange = answer.employee_name;
                changeManager(employeeToChange);
            })
    })
}

function changeManager(employee_name) {
    //Use inquirer to get name of manager to be added
    inquirer
        .prompt([
            {
                name: "manager",
                type: "input",
                message: "What is the name of the manager?"
            }
        ])
        .then(function (answer) {
            connection.query(
                `UPDATE employee
            SET manager="${answer.manager}"
            WHERE last_name="${employee_name}"`
            )
            console.log(`Sucessfully updated ${employee_name}'s manager to ${answer.manager}`);
            startPage();
        })


}



//Viewing the employees of a manager - using "TestManager" when testing 
function viewEmployeeByManager() {
    //First need to get the employee
    //Fine out what employee they want to change
    let managerSelected = "";
    connection.query(`SELECT*FROM employee
    WHERE manager IS NOT NULL`, function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "manager_name",
                    type: "rawlist",
                    choices: function () {
                        var managersArray = [];
                        for (var i = 0; i < results.length; i++) {
                            managersArray.push(results[i].manager);
                        }
                        return managersArray;
                    },
                    message: "Which manager do you want to view employees for?"
                }
            ])
            .then(function (answer) {
                managerSelected = answer.manager_name;
                let sqlString=`SELECT*FROM employee WHERE manager="${managerSelected}"`;
                printTable(sqlString);
                startPage();
            })
    })
}


//Functions to delete departments, roles, and/or employees

function deleteFxn() {
    //Use inquirer to determine what they want to delete
    //Do they want to add to departments, roles, or employees?
    inquirer.prompt({
        name: "whatToDelete",
        type: "list",
        message: "What do you want to delete?",
        choices: ["department", "role", "employee", "GO BACK"]
    })
        .then(function (answer) {
            if (answer.whatToDelete == "department") {
                deleteDepartment();
            }
            else if (answer.whatToDelete == "role") {
                deleteRole();
            }
            else if (answer.whatToDelete == "employee") {
                deleteEmployees();
            }
            else {
                startPage();
            }
        })
}

function deleteDepartment() {
    //Need to first select the department to delete in inquirer
    connection.query("SELECT*FROM department", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "department_to_delete",
                    type: "rawlist",
                    choices: function () {
                        var deleteDepartment = [];
                        for (var i = 0; i < results.length; i++) {
                            deleteDepartment.push(results[i].name);
                        }
                        return deleteDepartment;
                    },
                    message: "What department do you want to delete?"
                }
            ])
            .then(function (answer) {
                let departmentToDelete = answer.department_to_delete;
                makeTableToDelete(departmentToDelete);
            })
    })
}

function makeTableToDelete(department) {
    //department is the name of the department to delete
    connection.query(`DELETE FROM department WHERE name="${department}"`, function (err, results) {
        if (err) throw err;
        console.log(`Successfully deleter ${department} department.`)
    })

    startPage();
}

function deleteRole() {
    connection.query("SELECT*FROM role", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "role_to_delete",
                    type: "rawlist",
                    choices: function () {
                        var rolesToDelete = [];
                        for (var i = 0; i < results.length; i++) {
                            rolesToDelete.push(results[i].title);
                        }
                        return rolesToDelete;
                    },
                    message: "What role do you want to delete?"
                }
            ])
            .then(function (answer) {
                let removeRoleEntries = answer.role_to_delete;
                makeRoleToDelete(removeRoleEntries);
            })
    })
}

function makeRoleToDelete(role) {
    connection.query(`DELETE FROM role WHERE title="${role}"`, function (err, results) {
        if (err) throw err;
        console.log(`Successfully deleted ${role} role.`)
    })

    startPage();
}

function deleteEmployees() {
    connection.query("SELECT*FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "employee_to_delete",
                    type: "rawlist",
                    choices: function () {
                        var employeeToDelete = [];
                        for (var i = 0; i < results.length; i++) {
                            employeeToDelete.push(results[i].last_name);
                        }
                        return employeeToDelete;
                    },
                    message: "What employee do you want to remove?"
                }
            ])
            .then(function (answer) {
                let removeLastName = answer.employee_to_delete;
                makeEmployeeToDelete(removeLastName);
            })
    })
}

function makeEmployeeToDelete(employee) {
    connection.query(`DELETE FROM employee WHERE last_name="${employee}"`, function (err, results) {
        if (err) throw err;
        console.log(`Successfully deleted ${employee} from database.`)
    })

    startPage();
}



//Series of functions for viewing budget by department
function viewBudget() {
    let departmentChosen = "";
    //Use inquirer to determine which department they want to view the budget for
    connection.query("SELECT*FROM department", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "department",
                    type: "rawlist",
                    choices: function () {
                        var departmentsChoices = [];
                        for (var i = 0; i < results.length; i++) {
                            departmentsChoices.push(results[i].name);
                        }
                        return departmentsChoices;
                    },
                    message: "Which department do you want to view the budget for?"
                }
            ])
            .then(function (answer) {
                departmentChosen = answer.department;
                console.log(`Test#1 ${departmentChosen}`);
                tableOrTotal(departmentChosen);
            })
    })

}

function tableOrTotal(department) {
    //Use inquirer to determine if the person wants to just view the table or if they want the total budget
    inquirer
        .prompt([
            {
                name: "tableOrTotal",
                type: "rawlist",
                message: "What do you want to do?",
                choices: ["View the table", "See overall budget for the department", "START OVER"]
            }
        ])
        .then(function (answer) {
            let choice = answer.tableOrTotal;
            if (choice == "View the table") {
                let sqlString=`SELECT department.id, department.name, role.id AS role_id, role.title, role.salary, employee.last_name
                FROM department
                INNER JOIN role
                ON role.department_id = department.id
                INNER JOIN employee
                ON employee.role_id = role.id
                WHERE department.name="${department}"`;

                printTable(sqlString);
                startPage();
            }
            else if (choice == "See overall budget for the department") {
                calculateBudget(department);
            }
            else {
                startPage();
            }
        })

}



function calculateBudget(department) {
    connection.query(
        `SELECT department.id, department.name, role.id AS role_id, role.title, role.salary, employee.last_name
        FROM department
        INNER JOIN role
        ON role.department_id = department.id
        INNER JOIN employee
        ON employee.role_id = role.id
        WHERE department.name="${department}"`,
        function (err, results) {
            if (err) throw err;
            var salaryTotal = 0;
            for (var i = 0; i < results.length; i++) {
                var salary = results[i].salary;
                salary = parseInt(salary);
                salaryTotal += salary;
            }
            console.log(`The total payroll for the ${department} department is ${salaryTotal}`);
            startPage();
        }
    );
}