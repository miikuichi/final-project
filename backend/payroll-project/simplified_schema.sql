-- Simplified employees table schema
USE db_payroll;

-- Drop the existing employees table and recreate with simplified fields
DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- Basic Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_initial VARCHAR(10),
    suffix VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    cellphone VARCHAR(20),
    birthday DATE,
    date_hired DATE NOT NULL,
    blood_type VARCHAR(10),
    
    -- Employment Information (simplified - no foreign keys)
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    
    -- Address Information (simplified - only one address)
    address_house VARCHAR(255),
    address_barangay VARCHAR(255),
    address_city VARCHAR(100),
    address_province VARCHAR(100),
    address_zip VARCHAR(20),
    
    -- Optional fields
    religion VARCHAR(100),
    image LONGTEXT,  -- Base64 encoded image
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data for testing
INSERT INTO employees (
    first_name, last_name, middle_initial, email, cellphone, 
    birthday, date_hired, department, position, salary,
    address_house, address_barangay, address_city, address_province, address_zip,
    religion, blood_type
) VALUES 
(
    'John', 'Doe', 'A', 'john.doe@company.com', '+1234567890',
    '1990-05-15', '2024-01-15', 'IT', 'Software Developer', 75000.00,
    '123 Main St', 'Downtown', 'Makati', 'Metro Manila', '1200',
    'Catholic', 'O+'
),
(
    'Jane', 'Smith', 'B', 'jane.smith@company.com', '+1234567891',
    '1988-08-22', '2023-06-01', 'HR', 'HR Manager', 80000.00,
    '456 Oak Ave', 'Business District', 'Taguig', 'Metro Manila', '1634',
    'Protestant', 'A+'
);
