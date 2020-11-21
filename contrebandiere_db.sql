drop database if exists contrebandiere;

create database contrebandiere;

use contrebandiere;

create table department(
id int not null auto_increment,
name varchar(30) not null,
primary key(id)
);

select*from department;


create table role(
id int not null auto_increment,
title varchar(30) not null,
salary integer,
department_id integer,
primary key(id)
);

insert into role(title, salary, department_id)
values("accountant", 70000, 1);

select*from role;

create table employee(
id int not null auto_increment,
first_name varchar(30),
last_name varchar(30),
role_id integer,
primary key(id)
);

select*from employee;