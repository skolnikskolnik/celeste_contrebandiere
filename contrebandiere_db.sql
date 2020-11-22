drop database if exists contrebandiere;

create database contrebandiere;

use contrebandiere;

create table department(
id int not null auto_increment,
name varchar(30) not null,
primary key(id)
);

select*from department;

insert into department(name)
values("software development");


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

create table employee(
id int not null auto_increment,
first_name varchar(30),
last_name varchar(30),
role_id integer,
primary key(id)
);

SELECT*FROM employee
WHERE manager="TestManager";

ALTER TABLE employee
ADD manager varchar(50);

insert into employee(first_name, last_name, role_id)
values("Theresa","Test", 3);

insert into employee(first_name, last_name, role_id, manager)
values("Matilda", "Brown", 4, "BadManager");

select*from employee;

