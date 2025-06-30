package com.highroller.payroll_project.Controller;

import com.highroller.payroll_project.Entity.EmployeeEntity;
import com.highroller.payroll_project.Repository.EmployeeRepository;
import com.highroller.payroll_project.Service.AddressValidationService;
import com.highroller.payroll_project.util.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" }, allowCredentials = "true")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AddressValidationService addressValidationService;

    @Autowired
    private ValidationUtils validationUtils;

    // Hardcoded department options
    private final Map<String, List<String>> DEPARTMENT_POSITIONS = Map.of(
            "IT", Arrays.asList("Software Developer", "System Administrator", "IT Support", "DevOps Engineer"),
            "HR", Arrays.asList("HR Manager", "Recruiter", "HR Assistant", "Training Coordinator"),
            "Finance", Arrays.asList("Accountant", "Financial Analyst", "Finance Manager", "Auditor"),
            "Marketing", Arrays.asList("Marketing Manager", "Content Creator", "Digital Marketer", "Brand Manager"),
            "Operations",
            Arrays.asList("Operations Manager", "Project Manager", "Business Analyst", "Quality Assurance"));

    // Hardcoded salary ranges based on position
    private final Map<String, Double> POSITION_SALARIES;

    {
        POSITION_SALARIES = new HashMap<>();
        POSITION_SALARIES.put("Software Developer", 75000.0);
        POSITION_SALARIES.put("System Administrator", 70000.0);
        POSITION_SALARIES.put("IT Support", 45000.0);
        POSITION_SALARIES.put("DevOps Engineer", 85000.0);
        POSITION_SALARIES.put("HR Manager", 80000.0);
        POSITION_SALARIES.put("Recruiter", 55000.0);
        POSITION_SALARIES.put("HR Assistant", 40000.0);
        POSITION_SALARIES.put("Training Coordinator", 50000.0);
        POSITION_SALARIES.put("Accountant", 60000.0);
        POSITION_SALARIES.put("Financial Analyst", 65000.0);
        POSITION_SALARIES.put("Finance Manager", 90000.0);
        POSITION_SALARIES.put("Auditor", 70000.0);
        POSITION_SALARIES.put("Marketing Manager", 75000.0);
        POSITION_SALARIES.put("Content Creator", 50000.0);
        POSITION_SALARIES.put("Digital Marketer", 55000.0);
        POSITION_SALARIES.put("Brand Manager", 70000.0);
        POSITION_SALARIES.put("Operations Manager", 85000.0);
        POSITION_SALARIES.put("Project Manager", 80000.0);
        POSITION_SALARIES.put("Business Analyst", 65000.0);
        POSITION_SALARIES.put("Quality Assurance", 55000.0);
    }

    // Get all employees
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllEmployees() {
        try {
            List<EmployeeEntity> employees = employeeRepository.findAll();
            List<Map<String, Object>> employeeData = employees.stream()
                    .map(emp -> {
                        Map<String, Object> data = new HashMap<>();
                        data.put("id", emp.getId());
                        data.put("firstName", emp.getFirstName());
                        data.put("lastName", emp.getLastName());
                        data.put("middleInitial", emp.getMiddleInitial());
                        data.put("suffix", emp.getSuffix());
                        data.put("email", emp.getEmail());
                        data.put("cellphone", emp.getCellphone());
                        data.put("birthday", emp.getBirthday());
                        data.put("dateHired", emp.getDateHired());
                        data.put("department", emp.getDepartment());
                        data.put("position", emp.getPosition());
                        data.put("salary", emp.getSalary());
                        data.put("bloodType", emp.getBloodType());
                        data.put("religion", emp.getReligion());

                        // Address data (flat structure to match frontend)
                        data.put("addressHouse", emp.getAddressHouse());
                        data.put("addressBarangay", emp.getAddressBarangay());
                        data.put("addressCity", emp.getAddressCity());
                        data.put("addressProvince", emp.getAddressProvince());
                        data.put("addressZip", emp.getAddressZip());

                        data.put("image", emp.getImage());
                        return data;
                    })
                    .toList();

            return ResponseEntity.ok(employeeData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }

    // Get departments and positions (hardcoded)
    @GetMapping("/departments")
    public ResponseEntity<Map<String, List<String>>> getDepartments() {
        return ResponseEntity.ok(DEPARTMENT_POSITIONS);
    }

    // Get positions for a specific department
    @GetMapping("/departments/{department}/positions")
    public ResponseEntity<List<String>> getPositionsForDepartment(@PathVariable String department) {
        List<String> positions = DEPARTMENT_POSITIONS.get(department);
        if (positions != null) {
            return ResponseEntity.ok(positions);
        }
        return ResponseEntity.notFound().build();
    }

    // Add new employee
    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody Map<String, String> employeeData) {
        try {
            System.out.println("Received employee data: " + employeeData);

            // INPUT VALIDATION AND SANITIZATION

            // Validate required fields
            if (employeeData.get("firstName") == null || employeeData.get("firstName").trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "First name is required"));
            }
            if (employeeData.get("lastName") == null || employeeData.get("lastName").trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Last name is required"));
            }
            if (employeeData.get("email") == null || employeeData.get("email").trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }

            // Validate email format
            if (!validationUtils.isValidEmail(employeeData.get("email"))) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid email format"));
            }

            // Validate phone number if provided
            if (!validationUtils.isValidPhone(employeeData.get("cellphone"))) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid phone number format"));
            }

            EmployeeEntity employee = new EmployeeEntity();

            // Basic information (sanitized)
            employee.setFirstName(validationUtils.sanitizeInput(employeeData.get("firstName")));
            employee.setLastName(validationUtils.sanitizeInput(employeeData.get("lastName")));
            employee.setMiddleInitial(validationUtils.sanitizeInput(employeeData.get("middleInitial")));
            employee.setSuffix(validationUtils.sanitizeInput(employeeData.get("suffix")));
            employee.setEmail(validationUtils.sanitizeInput(employeeData.get("email")));
            employee.setCellphone(validationUtils.sanitizeInput(employeeData.get("cellphone")));

            // Parse and validate dates
            try {
                if (employeeData.get("birthday") != null && !employeeData.get("birthday").isEmpty()) {
                    LocalDate birthday = LocalDate.parse(employeeData.get("birthday"));

                    // Validate birthday is not in the future
                    if (!validationUtils.isDateNotInFuture(birthday)) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Birthday cannot be in the future"));
                    }

                    employee.setBirthday(birthday);
                }
                if (employeeData.get("dateHired") != null && !employeeData.get("dateHired").isEmpty()) {
                    LocalDate dateHired = LocalDate.parse(employeeData.get("dateHired"));

                    // Validate date hired is not in the future
                    if (!validationUtils.isDateNotInFuture(dateHired)) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Date hired cannot be in the future"));
                    }

                    employee.setDateHired(dateHired);
                }
            } catch (DateTimeParseException e) {
                System.err.println("Error parsing dates: " + e.getMessage());
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format"));
            }

            // Department and Position with auto-calculated salary
            String department = employeeData.get("department");
            String position = employeeData.get("position");
            if (department != null && position != null) {
                employee.setDepartment(validationUtils.sanitizeInput(department));
                employee.setPosition(validationUtils.sanitizeInput(position));
                // Auto-calculate salary based on position
                Double salary = POSITION_SALARIES.get(position);
                if (salary != null) {
                    employee.setSalary(salary);
                } else {
                    employee.setSalary(50000.0); // Default salary
                }
            }

            // Optional fields (sanitized)
            employee.setReligion(validationUtils.sanitizeInput(employeeData.get("religion")));
            employee.setBloodType(validationUtils.sanitizeInput(employeeData.get("bloodType")));

            // Address validation and sanitization
            String addressHouse = validationUtils.sanitizeInput(employeeData.get("addressHouse"));
            String addressCity = validationUtils.sanitizeInput(employeeData.get("addressCity"));
            String addressProvince = validationUtils.sanitizeInput(employeeData.get("addressProvince"));
            String addressZip = validationUtils.sanitizeInput(employeeData.get("addressZip"));

            // Validate address using Address API
            if (addressHouse != null && addressCity != null && addressProvince != null && addressZip != null) {
                if (!addressValidationService.validateAddress(addressHouse, addressCity, addressProvince, addressZip)) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid address format or details"));
                }
            }

            // Address fields (simplified to one address)
            employee.setAddressHouse(addressHouse);
            employee.setAddressBarangay(validationUtils.sanitizeInput(employeeData.get("addressBarangay")));
            employee.setAddressCity(addressCity);
            employee.setAddressProvince(addressProvince);
            employee.setAddressZip(addressZip);

            System.out.println("About to save employee...");
            EmployeeEntity savedEmployee = employeeRepository.save(employee);
            System.out.println("Employee saved successfully with ID: " + savedEmployee.getId());

            return ResponseEntity.ok(Map.of("message", "Employee created successfully", "id", savedEmployee.getId()));
        } catch (Exception e) {
            System.err.println("Error creating employee: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create employee: " + e.getMessage()));
        }
    }

    // Get employee by id
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getEmployeeById(@PathVariable Long id) {
        Optional<EmployeeEntity> employeeOpt = employeeRepository.findById(id);
        if (employeeOpt.isPresent()) {
            EmployeeEntity emp = employeeOpt.get();
            Map<String, Object> data = new HashMap<>();
            data.put("id", emp.getId());
            data.put("firstName", emp.getFirstName());
            data.put("lastName", emp.getLastName());
            data.put("middleInitial", emp.getMiddleInitial());
            data.put("suffix", emp.getSuffix());
            data.put("email", emp.getEmail());
            data.put("cellphone", emp.getCellphone());
            data.put("birthday", emp.getBirthday());
            data.put("dateHired", emp.getDateHired());
            data.put("department", emp.getDepartment());
            data.put("position", emp.getPosition());
            data.put("salary", emp.getSalary());
            data.put("bloodType", emp.getBloodType());
            data.put("religion", emp.getReligion());

            // Address data (flat structure to match frontend)
            data.put("addressHouse", emp.getAddressHouse());
            data.put("addressBarangay", emp.getAddressBarangay());
            data.put("addressCity", emp.getAddressCity());
            data.put("addressProvince", emp.getAddressProvince());
            data.put("addressZip", emp.getAddressZip());

            data.put("image", emp.getImage());

            return ResponseEntity.ok(data);
        }
        return ResponseEntity.notFound().build();
    }

    // Update employee by id
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody Map<String, Object> employeeData) {
        Optional<EmployeeEntity> employeeOpt = employeeRepository.findById(id);
        if (employeeOpt.isPresent()) {
            try {
                EmployeeEntity employee = employeeOpt.get();

                // Update fields
                if (employeeData.get("firstName") != null) {
                    employee.setFirstName((String) employeeData.get("firstName"));
                }
                if (employeeData.get("lastName") != null) {
                    employee.setLastName((String) employeeData.get("lastName"));
                }
                if (employeeData.get("email") != null) {
                    employee.setEmail((String) employeeData.get("email"));
                }
                if (employeeData.get("cellphone") != null) {
                    employee.setCellphone((String) employeeData.get("cellphone"));
                }
                if (employeeData.get("department") != null && employeeData.get("position") != null) {
                    String department = (String) employeeData.get("department");
                    String position = (String) employeeData.get("position");
                    employee.setDepartment(department);
                    employee.setPosition(position);
                    // Auto-update salary
                    Double salary = POSITION_SALARIES.get(position);
                    if (salary != null) {
                        employee.setSalary(salary);
                    }
                }

                employeeRepository.save(employee);
                return ResponseEntity.ok(Map.of("message", "Employee updated successfully"));
            } catch (Exception e) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Failed to update employee: " + e.getMessage()));
            }
        }
        return ResponseEntity.notFound().build();
    }

    // Delete employee by id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Employee deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
