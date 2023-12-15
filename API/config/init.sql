DROP DATABASE IF EXISTS MY_PORTFOLIO_DB;
CREATE DATABASE MY_PORTFOLIO_DB;
USE MY_PORTFOLIO_DB;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'USER'
);

CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(10) NOT NULL,
    subject VARCHAR(10) DEFAULT 'PRO',
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS technologies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(10) NOT NULL,
    subject VARCHAR(10) DEFAULT 'PRO',
    name VARCHAR(50) NOT NULL
);


CREATE TABLE IF NOT EXISTS project_technologies (
  project_id INT,
  technology_id INT,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (technology_id) REFERENCES technologies(id)
);

INSERT INTO users (username, email, password, role) VALUES ('mdian', 'mdian@diari.com', 'Mdian123$', 'ADMIN'), 
                                                               ('diallo', 'diallo@diari.com', 'Diallo123$', 'USER');

INSERT INTO projects (type, name, description) VALUES ('PROJECT', 'Project 1', 'Description for Project 1'),
                                                      ('PROJECT', 'Project 2', 'Description for Project 2');

INSERT INTO projects (type, subject, name, description) VALUES ('SERVICE', 'VEB', 'Web Development Services', 'My web development services include:'),
                                                              ('SERVICE', 'DATA', 'Data Management Services', 'My data management services encompass:');

INSERT INTO technologies (type, name) VALUES ('PROJECT', 'HTML'),
                                              ('PROJECT', 'CSS'),
                                              ('PROJECT', 'JavaScript'),
                                              ('PROJECT', 'Angular'),
                                              ('PROJECT', 'React'),
                                              ('PROJECT', 'Node.js'),
                                              ('PROJECT', 'MongoDB');

INSERT INTO technologies (type, subject, name) VALUES ('SERVICE', 'WEB', 'Front-end Development'),
                                              ('SERVICE', 'VEB', 'Back-end Development'),
                                              ('SERVICE', 'VEB', 'Responsive Design'),
                                              ('SERVICE', 'DATA', 'Data Analysis'),
                                              ('SERVICE', 'DATA', 'Database Management'),
                                              ('SERVICE', 'DATA', 'Data Warehousing');

INSERT INTO project_technologies (project_id, technology_id) VALUES (1, 1),
                                                              (1, 2),
                                                              (1, 3),
                                                              (1, 4),
                                                              (2, 5),
                                                              (2, 6),
                                                              (2, 7),
                                                              (3, 8),
                                                              (3, 9),
                                                              (3, 10),
                                                              (4, 11),
                                                              (4, 12),
                                                              (4, 13);