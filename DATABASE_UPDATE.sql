-- SQL Queries to Update Database Schema and Add Sample Data
-- Run these queries in your MySQL database (db_payroll)

-- 1. Add the missing address_country column to the employees table
ALTER TABLE employees 
ADD COLUMN address_country VARCHAR(100) DEFAULT 'US';

-- 2. Update existing employees to have a default country value
UPDATE employees 
SET address_country = 'US' 
WHERE address_country IS NULL OR address_country = '';

-- 3. Sample Employee Data (optional - for testing)
-- Insert 5 sample employees with complete address information

INSERT INTO employees (
    first_name, last_name, middle_initial, suffix, email, cellphone, 
    birthday, date_hired, blood_type, department, position, salary,
    address_house, address_barangay, address_city, address_province, address_zip, address_country,
    religion, created_at, updated_at
) VALUES 
(
    'John', 'Smith', 'A', NULL, 'john.smith@company.com', '+1-555-0101',
    '1990-05-15', '2023-01-15', 'O+', 'Information Technology', 'Software Developer', 75000.00,
    '123 Main Street', 'Downtown', 'Springfield', 'IL', '62701', 'US',
    'Christianity', NOW(), NOW()
),
(
    'Jane', 'Johnson', 'M', NULL, 'jane.johnson@company.com', '+1-555-0102',
    '1985-08-22', '2022-03-10', 'A+', 'Human Resources', 'HR Manager', 80000.00,
    '456 Oak Avenue', 'Westside', 'Chicago', 'IL', '60601', 'US',
    'Christianity', NOW(), NOW()
),
(
    'Michael', 'Brown', 'R', 'Jr', 'michael.brown@company.com', '+1-555-0103',
    '1992-12-03', '2023-06-01', 'B+', 'Finance', 'Financial Analyst', 65000.00,
    '789 Pine Road', 'Northside', 'Peoria', 'IL', '61601', 'US',
    'Catholic', NOW(), NOW()
),
(
    'Sarah', 'Davis', 'L', NULL, 'sarah.davis@company.com', '+1-555-0104',
    '1988-03-18', '2021-09-12', 'AB+', 'Marketing', 'Marketing Manager', 75000.00,
    '321 Elm Street', 'Eastside', 'Rockford', 'IL', '61101', 'US',
    'Judaism', NOW(), NOW()
),
(
    'David', 'Wilson', 'T', NULL, 'david.wilson@company.com', '+1-555-0105',
    '1995-07-09', '2024-02-20', 'O-', 'Operations', 'Operations Manager', 85000.00,
    '654 Maple Drive', 'Southside', 'Aurora', 'IL', '60505', 'US',
    'Buddhism', NOW(), NOW()
);

-- 4. Verify the data was inserted correctly
SELECT 
    id, first_name, last_name, email, department, position,
    address_house, address_city, address_province, address_zip, address_country
FROM employees 
ORDER BY id DESC 
LIMIT 10;

-- 5. Check the table structure to confirm the new column exists
DESCRIBE employees;
