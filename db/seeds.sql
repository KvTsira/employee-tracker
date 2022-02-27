-- SEED DATA
USE employee_db;


-- Table `department` Seed Data
INSERT INTO department (name) 
VALUES 
("PES"),
("Procurement"),
("Operations"),
("Information Systems"),
("Marketing");


-- Table `role` Seed Data
INSERT INTO role (title, salary, department_id) 
VALUES 
("Sr. Analyst", 200000.00, 1),
("Pricer", 222222.00, 1),
("Compliance Analyst", 233333.00, 1),
("Consultant", 125000.00, 2),
("Sr. Consultant", 45000.00, 2),
("Head of Operations", 54000.00, 3),
("Engineer", 456000.00, 3),
("Developer", 120000.00, 4),
("Tester", 85000.00, 4),
("Head of Marketing", 125000.00, 5),
("Executive Assistant", 115000.00, 5),
("CEO", 300000,5);


-- Table `employee` Seed Data
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES 
("Tsira", "Kvaratskhelia", 1, 6),
("Jenine", "Wahden", 2, 6),
("James", "Walz", 3, 6),
("Craig", "Wainer", 4, 2),
("Candice", "Bailey", 4, 1),
("Frank", "Bomher", 8, NULL);