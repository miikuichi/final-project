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

    @GetMapping("/address/test")
    public ResponseEntity<?> testAddressFormatting(@RequestParam(required = false) String house,
            @RequestParam(required = false) String barangay,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String zip,
            @RequestParam(required = false, defaultValue = "PH") String country) {
        try {
            Map<String, Object> result = new HashMap<>();
            result.put("components", Map.of(
                    "house", house != null ? house : "",
                    "barangay", barangay != null ? barangay : "",
                    "city", city != null ? city : "",
                    "province", province != null ? province : "",
                    "zip", zip != null ? zip : "",
                    "country", country));

            // Build address string like the validation service does
            StringBuilder address = new StringBuilder();
            if (house != null && !house.trim().isEmpty()) {
                address.append(house.trim());
            }
            if (barangay != null && !barangay.trim().isEmpty()) {
                if (address.length() > 0)
                    address.append(", ");
                address.append(barangay.trim());
            }
            if (city != null && !city.trim().isEmpty()) {
                if (address.length() > 0)
                    address.append(", ");
                address.append(city.trim());
            }
            if (province != null && !province.trim().isEmpty()) {
                if (address.length() > 0)
                    address.append(", ");
                address.append(province.trim());
            }
            if (zip != null && !zip.trim().isEmpty()) {
                if (address.length() > 0)
                    address.append(" ");
                address.append(zip.trim());
            }
            if (country != null && !country.trim().isEmpty()) {
                if (address.length() > 0)
                    address.append(", ");
                address.append(country.trim());
            }

            result.put("formattedAddress", address.toString());
            result.put("googleMapsUrl", "https://maps.googleapis.com/maps/api/geocode/json?address=" +
                    java.net.URLEncoder.encode(address.toString(), "UTF-8"));

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
