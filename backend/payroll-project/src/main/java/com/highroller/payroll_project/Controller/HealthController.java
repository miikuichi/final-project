package com.highroller.payroll_project.Controller;

import com.highroller.payroll_project.Repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" }, allowCredentials = "true")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();

        try {
            // Test database connection
            try (Connection connection = dataSource.getConnection()) {
                health.put("database", "connected");
                health.put("databaseUrl", connection.getMetaData().getURL());
            }

            // Test employee repository
            long employeeCount = employeeRepository.count();
            health.put("employeeCount", employeeCount);

            health.put("status", "healthy");
            return ResponseEntity.ok(health);

        } catch (Exception e) {
            health.put("status", "unhealthy");
            health.put("error", e.getMessage());
            health.put("database", "disconnected");
            return ResponseEntity.status(500).body(health);
        }
    }

    @GetMapping("/employees/sample")
    public ResponseEntity<?> getSampleEmployee() {
        try {
            // Try to get the first employee
            var employees = employeeRepository.findAll();
            if (employees.isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "No employees found"));
            }

            var employee = employees.get(0);
            Map<String, Object> data = new HashMap<>();
            data.put("id", employee.getId());
            data.put("firstName", employee.getFirstName());
            data.put("lastName", employee.getLastName());
            data.put("email", employee.getEmail());

            return ResponseEntity.ok(data);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage(), "stackTrace", e.getStackTrace()));
        }
    }

}
