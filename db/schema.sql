CREATE DATABASE findajob;

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY, 
    company TEXT,
    position TEXT,
    date_applied DATE,
    notes VARCHAR,
    tags TEXT,
    status TEXT
);

CREATE TABLE wishlist (
    id SERIAL PRIMARY KEY, 
    company TEXT, 
    website_url VARCHAR,
    position TEXT,
    notes VARCHAR,
    comments VARCHAR
);

CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    name TEXT, 
    qualification VARCHAR,
    project_name VARCHAR (255),
    url VARCHAR, 
    social_media_name TEXT,
    social_media_url VARCHAR 
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT, 
    password_digest TEXT
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    comments VARCHAR
);

INSERT INTO jobs (company, position, date_applied, tags, notes, status)
VALUES ('Microsoft', 'Software Engineering', '05-MAY-2022', 'Office Environment', 'First round of interview w/ hiring manager', 'Interview');

INSERT INTO jobs (company, position, date_applied, tags, status)
VALUES ('Apple', 'Full Stack Engineer', '06-JUN-2022', 'Hybrid-Remote', 'Applied');

INSERT INTO jobs (company, position, date_applied, notes, tags, status)
VALUES ('Samsung', 'Software Quality Engineer', '27-APR-2022', 'Overseas position', 'Remote', 'Applied');

-- INSERT INTO jobs (company, position, tags, notes, status)
-- VALUES ('Microsoft', 'Software Engineering', 'Office Environment', 'First round of interview w/ hiring manager', 'Interview');

-- INSERT INTO jobs (company, position, tags, status)
-- VALUES ('Apple', 'Full Stack Engineer', 'Hybrid-Remote', 'Applied');

-- INSERT INTO jobs (company, position, notes, tags, status)
-- VALUES ('Samsung', 'Software Quality Engineer', 'Overseas position', 'Remote', 'Applied');