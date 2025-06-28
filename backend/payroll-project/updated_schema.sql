-- Updated employees table schema to match EmployeeEntity
USE db_payroll;

-- Drop the existing employees table and recreate with all fields
DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    middle_initial VARCHAR(1),
    email VARCHAR(100),
    cellphone VARCHAR(20),
    birthday VARCHAR(20),
    date_hired VARCHAR(20),
    religion VARCHAR(50),
    course VARCHAR(100),
    school VARCHAR(100),
    licenses VARCHAR(200),
    philhealth VARCHAR(50),
    sss VARCHAR(50),
    pagibig VARCHAR(50),
    tin VARCHAR(50),
    bloodtype VARCHAR(10),
    image VARCHAR(255),
    dept_pos_id BIGINT,
    
    -- Permanent Address fields
    perm_house VARCHAR(100),
    perm_barangay VARCHAR(100),
    perm_city VARCHAR(100),
    perm_province VARCHAR(100),
    perm_zip VARCHAR(20),
    
    -- Current Address fields
    curr_house VARCHAR(100),
    curr_barangay VARCHAR(100),
    curr_city VARCHAR(100),
    curr_province VARCHAR(100),
    curr_zip VARCHAR(20),
    
    FOREIGN KEY (dept_pos_id) REFERENCES tbl_dept(id)
);
