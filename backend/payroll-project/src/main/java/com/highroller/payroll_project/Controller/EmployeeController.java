package com.highroller.payroll_project.Controller;

import com.highroller.payroll_project.Entity.EmployeeEntity;
import com.highroller.payroll_project.Repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "http://localhost:5173") // Allow React dev server
public class EmployeeController {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);

    @Autowired
    private EmployeeRepository employeeRepository;

    // Get all employees
    @GetMapping("/all")
    public List<EmployeeEntity> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Get employee by employeeId
    @GetMapping("/{employeeId}")
    public ResponseEntity<EmployeeEntity> getEmployeeByEmployeeId(@PathVariable String employeeId) {
        Optional<EmployeeEntity> emp = employeeRepository.findByEmployeeId(employeeId);
        return emp.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Add new employee
    @PostMapping("/add")
    public EmployeeEntity addEmployee(@RequestBody EmployeeEntity employee) {
        logger.info("Received new employee: {}", employee);
        // Save first to get the auto-generated empId
        EmployeeEntity saved = employeeRepository.save(employee);
        if (saved.getEmployeeId() == null || saved.getEmployeeId().isEmpty()) {
            saved.setEmployeeId(String.format("EMP%05d", saved.getEmpId()));
            saved = employeeRepository.save(saved);
        }
        return saved;
    }

    // Update employee by employeeId
    @PutMapping("/update/{employeeId}")
    public ResponseEntity<EmployeeEntity> updateEmployee(@PathVariable String employeeId,
            @RequestBody EmployeeEntity updatedEmployee) {
        Optional<EmployeeEntity> empOpt = employeeRepository.findByEmployeeId(employeeId);
        if (empOpt.isPresent()) {
            EmployeeEntity emp = empOpt.get();
            updatedEmployee.setEmpId(emp.getEmpId()); // preserve DB id
            return ResponseEntity.ok(employeeRepository.save(updatedEmployee));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete employee by employeeId
    @DeleteMapping("/delete/{employeeId}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String employeeId) {
        if (employeeRepository.existsByEmployeeId(employeeId)) {
            employeeRepository.deleteByEmployeeId(employeeId);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete employee by first and last name
    @DeleteMapping("/deleteByName")
    public ResponseEntity<Void> deleteEmployeeByName(@RequestParam String firstName, @RequestParam String lastName) {
        List<EmployeeEntity> matches = employeeRepository.findAll().stream()
                .filter(e -> e.getFirstName().equalsIgnoreCase(firstName) && e.getLastName().equalsIgnoreCase(lastName))
                .toList();
        if (matches.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        for (EmployeeEntity emp : matches) {
            employeeRepository.deleteById(emp.getEmpId());
        }
        return ResponseEntity.ok().build();
    }
}
