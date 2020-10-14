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
    runSearch();
});

function runSearch() {
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

                case VIEW_TABLE_CONTENT:
                    return viewContent();

                case UPDATE_ROLES:
                    return roleUpdate();

                default:
                    connection.end();
            }
        });
}

function addToTable() {
    inquirer
        .prompt({
            name: "artist",
            type: "input",
            message: "What artist would you like to search for?",
        })
        .then((answer) => {
            const query = "SELECT position, song, year FROM top5000 WHERE ?";
            connection.query(query, { artist: answer.artist }, (err, res) => {
                for (let i = 0; i < res.length; i++) {
                    console.log(
                        "Position: " +
                        res[i].position +
                        " || Song: " +
                        res[i].song +
                        " || Year: " +
                        res[i].year
                    );
                }
                runSearch();
            });
        });
}

function viewContent() {
    const query =
        "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
    connection.query(query, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            console.log(res[i].artist);
        }
        runSearch();
    });
}

function roleUpdate() {
    inquirer
        .prompt([
            {
                name: "role",
                type: "input",
                message: "What role would you like to update?",
            },
            {
                name: "end",
                type: "input",
                message: "Enter ending position: ",
                validate: (value) => {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                },
            },
        ])
        .then((answer) => {
            const query =
                "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
            connection.query(query, [answer.start, answer.end], (err, res) => {
                for (let i = 0; i < res.length; i++) {
                    console.log(
                        "Position: " +
                        res[i].position +
                        " || Song: " +
                        res[i].song +
                        " || Artist: " +
                        res[i].artist +
                        " || Year: " +
                        res[i].year
                    );
                }
                runSearch();
            });
        });
}

function songSearch() {
    inquirer
        .prompt({
            name: "song",
            type: "input",
            message: "What song would you like to look for?",
        })
        .then((answer) => {
            console.log(answer.song);
            connection.query(
                "SELECT * FROM top5000 WHERE ?",
                { song: answer.song },
                (err, res) => {
                    console.log(
                        "Position: " +
                        res[0].position +
                        " || Song: " +
                        res[0].song +
                        " || Artist: " +
                        res[0].artist +
                        " || Year: " +
                        res[0].year
                    );
                    runSearch();
                }
            );
        });
}

function songAndAlbumSearch() {
    inquirer
        .prompt({
            name: "artist",
            type: "input",
            message: "What artist would you like to search for?",
        })
        .then((answer) => {
            let query =
                "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
            query +=
                "FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ";
            query +=
                "= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position";

            connection.query(query, [answer.artist, answer.artist], (err, res) => {
                console.log(res.length + " matches found!");
                for (let i = 0; i < res.length; i++) {
                    console.log(
                        i +
                        1 +
                        ".) " +
                        "Year: " +
                        res[i].year +
                        " Album Position: " +
                        res[i].position +
                        " || Artist: " +
                        res[i].artist +
                        " || Song: " +
                        res[i].song +
                        " || Album: " +
                        res[i].album
                    );
                }

                runSearch();
            });
        });
}

