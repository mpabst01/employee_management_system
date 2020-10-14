require("console.table");
const mysql = require("mysql");
const mysql = require("express");
const inquirer = require("inquirer");


// create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "employee_db",
});

connection.connect((err) => {
    if (err) {
        throw err;
    }
    search();
});

function search() {
    // constants enumerating search options
    const ADD_TO_TABLE = "Add departments, roles, employees";
    const VIEW_TABLE_CONTENT =
        "View departments, roles, employees";
    const UPDATE_ROLES = "Update employee roles";

    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                ADD_TO_TABLE,
                VIEW_TABLE_CONTENT,
                UPDATE_ROLES,
                "EXIT",
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case ADD_TO_TABLE:
                    return addToTable();
                    break;

                case VIEW_TABLE_CONTENT:
                    return viewContent();
                    break;

                case UPDATE_ROLES:
                    return roleUpdate();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
};

function addToTable() {
    return connection.query(`SELECT distinct role.id, role.title from role;`, (err, res_a) => {
        if (err) {
            throw err;
        };

        const namesRole = res_a.map((row) => row.title);

        return connection.query(`SELECT distinct employee.id, CONCAT(employee.first_name," ",employee.last_name) as name FROM employee;`, (err, res_b) => {
            if (err) {
                throw err;
            };

            const namesManager = res_b.map((row) => row.name);

            return inquirer
                .prompt([
                    {
                        name: "firstName",
                        type: "input",
                        message: "What is the employee's first name?",
                    },
                    {
                        name: "lastName",
                        type: "input",
                        message: "What is the employee's last name?",
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "What is the employee's job title?",
                        choices: namesRole,
                    },
                    {
                        name: "manager",
                        type: "list",
                        message: "Who is the employee's manager?",
                        choices: namesManager,
                    }
                ])
                .then((answers) => {
                    const selectedRole = res_a.find(
                        (row) => row.title === answers.role
                    );
                    const selectedManager = res_b.find(
                        (row) => row.name === answers.manager
                    );

                    return connection.query(
                        "INSERT INTO employee SET ?",
                        {
                            first_name: answers.firstName,
                            last_name: answers.lastName,
                            role_id: selectedRole.id,
                            manager_id: selectedManager.id
                        },
                        (err) => {
                            if (err) {
                                throw err;
                            }
                            return start();
                        }
                    );
                });
        });
    })
};

function viewContent() {
    return connection.query(
        `SELECT subs.id,
        subs.first_name,
        subs.last_name,
        role.title as 'job title',
        department.name as department,
        role.salary, 
        concat(managers.first_name,' ', managers.last_name) as manager 
        from employee as subs
        left join employee as managers
        on subs.manager_id = managers.id
        inner join role
        on subs.role_id = role.id
        inner join department
        on department.id = role.department_id;`,
        (err, results) => {
            if (err) {
                throw err;
            };
            console.log("");
            console.log("");
            console.table(results);
            console.log("");
            console.log("");
            return start();
        });

};

function roleUpdate() {
    return connection.query(`SELECT distinct employee.id AS id, CONCAT(employee.first_name," ",employee.last_name) as name from employee;`,
     (err, res_a) => {
        if (err) {
            throw err;
        };

        const nameEmployee = res_a.map((row) => row.name);

        return inquirer
            .prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "Which employee would you like to modify?",
                    choices: nameEmployee,
                }
            ])
            .then((answers) => {

                const selectedEmployee = res_a.find(
                    (row) => row.name === answers.employee
                );

                return connection.query(`SELECT distinct role.id AS id, role.title FROM role;`, (err, res_b) => {
                    if (err) {
                        throw err;
                    };

                    const titleOfRole = res_b.map((row) => row.title);

                    return inquirer
                        .prompt([
                            {
                                name: "role",
                                type: "list",
                                message: "Which role do you want to give the employee?",
                                choices: titleOfRole,
                            }
                        ])
                        .then((answers) => {

                            const chosenRole = res_b.find(
                                (row) => row.title === answers.role
                            );

                            return connection.query(
                                "UPDATE employee SET employee.role_id = ? WHERE employee.id = ?",
                                [chosenRole.id, selectedEmployee.id],
                                (err) => {
                                    if (err) {
                                        throw err;
                                    }
                                    console.log("");
                                    console.log("");
                                    return start();
                                }
                            );

                        });

                });

            });
    })

}



