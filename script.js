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

}

function addEmployee() {

}

function viewDB() {
    console.log("viewing!");
    startPage();
}