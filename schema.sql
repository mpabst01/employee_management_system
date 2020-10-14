create database employee_db;
use employee_db;

create table employee (
    id int AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT not null,
    manager_id INT,
    PRIMARY KEY(id)
)

create table role (
    id INT AUTO_INCREMENT,
    title  VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY(id)
)