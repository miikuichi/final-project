-- Database Fix Script for Employee Management System
-- Run these queries in your MySQL database (db_payroll) to resolve common issues

-- 1. Ensure the address_country column exists (if it doesn't exist yet)
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS address_country VARCHAR(100) DEFAULT 'US';

-- 2. Update any NULL or empty values to default values to prevent serialization issues
UPDATE employees 
SET 
    first_name = COALESCE(NULLIF(first_name, ''), 'Unknown'),
    last_name = COALESCE(NULLIF(last_name, ''), 'Unknown'),
    email = COALESCE(NULLIF(email, ''), CONCAT('unknown', id, '@company.com')),
    date_hired = COALESCE(date_hired, CURDATE()),
    department = COALESCE(NULLIF(department, ''), 'IT'),
    position = COALESCE(NULLIF(position, ''), 'Employee'),
    salary = COALESCE(salary, 50000.0),
    address_country = COALESCE(NULLIF(address_country, ''), 'US'),
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW())
WHERE 
    first_name IS NULL OR first_name = '' OR
    last_name IS NULL OR last_name = '' OR
    email IS NULL OR email = '' OR
    date_hired IS NULL OR
    department IS NULL OR department = '' OR
    position IS NULL OR position = '' OR
    salary IS NULL OR
    address_country IS NULL OR address_country = '' OR
    created_at IS NULL OR
    updated_at IS NULL;

-- 3. Ensure all employees have unique email addresses
UPDATE employees e1
INNER JOIN (
    SELECT 
        MIN(id) as min_id,
        email
    FROM employees
    WHERE email LIKE 'unknown%@company.com'
    GROUP BY email
    HAVING COUNT(*) > 1
) e2 ON e1.email = e2.email AND e1.id > e2.min_id
SET e1.email = CONCAT('unknown', e1.id, '@company.com');

-- 4. Check for any remaining data issues
SELECT 
    COUNT(*) as total_employees,
    COUNT(CASE WHEN first_name IS NULL OR first_name = '' THEN 1 END) as missing_first_name,
    COUNT(CASE WHEN last_name IS NULL OR last_name = '' THEN 1 END) as missing_last_name,
    COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) as missing_email,
    COUNT(CASE WHEN date_hired IS NULL THEN 1 END) as missing_date_hired,
    COUNT(CASE WHEN department IS NULL OR department = '' THEN 1 END) as missing_department,
    COUNT(CASE WHEN position IS NULL OR position = '' THEN 1 END) as missing_position,
    COUNT(CASE WHEN salary IS NULL THEN 1 END) as missing_salary,
    COUNT(CASE WHEN address_country IS NULL OR address_country = '' THEN 1 END) as missing_country
FROM employees;

-- 5. Display current employees to verify data integrity
SELECT 
    id, first_name, last_name, middle_initial, suffix, email, cellphone,
    birthday, date_hired, blood_type, department, position, salary,
    address_house, address_barangay, address_city, address_province, address_zip, address_country,
    religion, created_at, updated_at
FROM employees 
ORDER BY id;

-- 6. Show table structure
DESCRIBE employees;
