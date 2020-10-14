DROP DATABASE IF EXISTS employee_db;
create database employee_db;
use employee_db;

create table employee (
id int PRIMARY KEY auto_increment,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT,
manager_id INT,
foreign key (role_id) references role (id)
);

create table role (
id int PRIMARY KEY auto_increment,
title  VARCHAR(30) NOT NULL,
salary DECIMAL(10, 2) NOT NULL,
    -- reference to department role belongs to
department_id INT,
foreign key (department_id) references department (id)
);

create table department (
id int PRIMARY KEY auto_increment,
name varchar(30) not null
);

select * from employee;
select * from department; 
Select subs.id, subs.first_name, subs.last_name, role.title as 'job title', department.name as department, role.salary, concat(managers.first_name,' ', managers.last_name) as manager from employee as subs

left join employee as managers
on subs.manager_id = managers.id

inner join role
on subs.role_id = role.id

inner join department
on department.id = role.department_id;

Select 
subs.id, subs.first_name,subs.last_name, role.title as 'job title', department.name as department, role.salary, concat(managers.first_name,' ', managers.last_name) as manager 
from department 

right join role 
on role.department_id = department.id

left join employee as subs
on subordinates.role_id = role.id

left join employee as managers
on subs.manager_id = managers.id

where department.id = 1
order by salary desc;

Select 
subs.id,subs.first_name, subs.last_name, role.title as 'job title', department.name as department, role.salary, concat(managers.first_name,' ', managers.last_name) as manager 
from employee as managers
right join employee as subs
on subs.manager_id = managers.id
left join role
on subs.role_id = role.id
left join department
on department.id = role.department_id
where managers.id = 3
order by role.salary desc
;