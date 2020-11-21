//Dependencies
//Must install express, inquirer, and mysql
const mysql = require('mysql');
const inquirer = require('inquirer');
const { allowedNodeEnvironmentFlags } = require('process');

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
        choices: ["ADD to departments, roles, or employees", "View departments, roles, or employees", "EXIT"]
    })
        .then(function (answer) {
            if (answer.userPath == "ADD to departments, roles, or employees") {
                addToDB();
            }
            else if (answer.userPath == "View departments, roles, or employees") {
                viewDB();
            }
            else {
                connection.end();
            }
        })
}

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
                    //Populating the department IDs from the department table 
                    choices: function () {
                        var departmentArray = [];
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
                        console.log(`Successfully added ${answer.roleTitle} role at a salary of ${answer.salary} in department number ${answer.department_id}`);
                        startPage();
                    }
                )
            })
    })
}

function addEmployee() {
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
                            roleArray.push(results[i].role_id);
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

function viewDB() {
    console.log("viewing!");
    startPage();
}