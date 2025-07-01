-- First, disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data
DELETE FROM tbl_dept;
DELETE FROM tbl_positions;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Operations Department positions
INSERT INTO tbl_positions (dept_name, pos_title, salary_floor) VALUES
('Operations', 'Operations Manager', 85000.0),
('Operations', 'Project Manager', 80000.0),
('Operations', 'Business Analyst', 65000.0),
('Operations', 'Quality Assurance', 55000.0);

-- IT Department positions
INSERT INTO tbl_positions (dept_name, pos_title, salary_floor) VALUES
('IT', 'Software Developer', 75000.0),
('IT', 'System Administrator', 70000.0),
('IT', 'IT Support', 45000.0),
('IT', 'DevOps Engineer', 85000.0);

-- HR Department positions
INSERT INTO tbl_positions (dept_name, pos_title, salary_floor) VALUES
('HR', 'HR Manager', 80000.0),
('HR', 'Recruiter', 55000.0),
('HR', 'HR Assistant', 40000.0),
('HR', 'Training Coordinator', 50000.0);

-- Finance Department positions
INSERT INTO tbl_positions (dept_name, pos_title, salary_floor) VALUES
('Finance', 'Financial Manager', 90000.0),
('Finance', 'Accountant', 60000.0),
('Finance', 'Financial Analyst', 65000.0),
('Finance', 'Auditor', 70000.0);

-- Marketing Department positions
INSERT INTO tbl_positions (dept_name, pos_title, salary_floor) VALUES
('Marketing', 'Marketing Manager', 75000.0),
('Marketing', 'Content Creator', 50000.0),
('Marketing', 'Digital Marketer', 55000.0),
('Marketing', 'Brand Manager', 70000.0);
