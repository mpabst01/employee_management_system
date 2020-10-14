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
    id INT PRIMARY KEY,
    title  VARCHAR(30),
    salary DECIMAL,
    --reference to department role belongs to
    department_id INT
)

create table department (
    id INT PRIMARY KEY,
    --hold name od dept
    name VARCHAR(30)
)