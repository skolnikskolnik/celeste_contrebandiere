drop database if exists contrebandiere;

create database contrebandiere;

use contrebandiere;

create table department(
id int not null auto_increment,
name varchar(30) not null,
primary key(id)
);

select*from department;

SELECT*FROM department
WHERE name="accounting";


insert into department(name)
values("software development");

SELECT department.id
FROM department
INNER JOIN role
ON department.id=role.department_id;

create table role(
id int not null auto_increment,
title varchar(30) not null,
salary integer,
department_id integer,
primary key(id)
);

insert into role(title, salary, department_id)
values("teacher", 65000, 2);

select*from role;

ALTER TABLE role
ADD CONSTRAINT fk_department FOREIGN KEY(department_id) REFERENCES department (id) 
ON DELETE CASCADE;

create table employee(
id int not null auto_increment,
first_name varchar(30),
last_name varchar(30),
role_id integer,
primary key(id)
);

SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE employee
ADD CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES role(id) 
ON DELETE CASCADE;

SELECT*FROM employee
WHERE manager IS NOT NULL;

ALTER TABLE employee
ADD manager varchar(50);

insert into employee(first_name, last_name, role_id)
values("Theresa","Test", 3);

insert into employee(first_name, last_name, role_id, manager)
values("Matilda", "Brown", 4, "BadManager");

select*from employee;

SELECT employee.id, employee.first_name, employee.last_name, role.title
FROM employee
LEFT JOIN role
ON employee.role_id = role.id;

SELECT department.id, department.name, role.id AS role_id, role.title, role.salary, employee.last_name
FROM department
INNER JOIN role
ON role.department_id = department.id
INNER JOIN employee
ON employee.role_id = role.id
WHERE department.name="accounting";





