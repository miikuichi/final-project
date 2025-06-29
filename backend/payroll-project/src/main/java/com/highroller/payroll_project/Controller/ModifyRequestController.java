package com.highroller.payroll_project.Controller;

import com.highroller.payroll_project.Entity.ModifyRequestEntity;
import com.highroller.payroll_project.Entity.EmployeeEntity;
import com.highroller.payroll_project.Repository.ModifyRequestRepository;
import com.highroller.payroll_project.Repository.EmployeeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/modify-requests")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" }, allowCredentials = "true")
public class ModifyRequestController {

    @Autowired
    private ModifyRequestRepository modifyRequestRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllRequests() {
        List<ModifyRequestEntity> requests = modifyRequestRepository.findAllByOrderByRequestDateDesc();
        List<Map<String, Object>> requestData = requests.stream()
                .map(this::mapRequestToResponse)
                .toList();
        return ResponseEntity.ok(requestData);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingRequests() {
        List<ModifyRequestEntity> requests = modifyRequestRepository
                .findByStatusOrderByRequestDateDesc(ModifyRequestEntity.RequestStatus.PENDING);
        List<Map<String, Object>> requestData = requests.stream()
                .map(this::mapRequestToResponse)
                .toList();
        return ResponseEntity.ok(requestData);
    }

    @PostMapping
    public ResponseEntity<?> createModifyRequest(@RequestBody Map<String, Object> requestData) {
        try {
            Long employeeId = Long.valueOf(requestData.get("employeeId").toString());
            String requestedBy = (String) requestData.get("requestedBy");
            String originalData = (String) requestData.get("originalData");
            String updatedData = (String) requestData.get("updatedData");
            String reason = (String) requestData.get("reason");

            ModifyRequestEntity request = new ModifyRequestEntity(
                    employeeId, requestedBy, originalData, updatedData, reason);

            ModifyRequestEntity savedRequest = modifyRequestRepository.save(request);
            return ResponseEntity
                    .ok(Map.of("message", "Modify request created successfully", "id", savedRequest.getId()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to create modify request: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            Optional<ModifyRequestEntity> requestOpt = modifyRequestRepository.findById(id);
            if (!requestOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            ModifyRequestEntity request = requestOpt.get();
            if (request.getStatus() != ModifyRequestEntity.RequestStatus.PENDING) {
                return ResponseEntity.badRequest().body(Map.of("error", "Request has already been processed"));
            }

            // Apply the changes to the employee record
            Optional<EmployeeEntity> employeeOpt = employeeRepository.findById(request.getEmployeeId());
            if (!employeeOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Employee not found"));
            }

            EmployeeEntity employee = employeeOpt.get();

            // Parse the updated data and apply changes
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> updatedData = objectMapper.readValue(request.getUpdatedData(), Map.class);
                applyUpdatedData(employee, updatedData);
                employeeRepository.save(employee);
            } catch (Exception e) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Failed to parse updated data: " + e.getMessage()));
            }

            // Update the request status
            request.setStatus(ModifyRequestEntity.RequestStatus.APPROVED);
            request.setProcessedDate(LocalDateTime.now());
            request.setProcessedBy("admin"); // This could be dynamic based on session
            if (body != null && body.containsKey("comments")) {
                request.setAdminComments(body.get("comments"));
            }

            modifyRequestRepository.save(request);
            return ResponseEntity.ok(Map.of("message", "Request approved and applied successfully"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to approve request: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            Optional<ModifyRequestEntity> requestOpt = modifyRequestRepository.findById(id);
            if (!requestOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            ModifyRequestEntity request = requestOpt.get();
            if (request.getStatus() != ModifyRequestEntity.RequestStatus.PENDING) {
                return ResponseEntity.badRequest().body(Map.of("error", "Request has already been processed"));
            }

            request.setStatus(ModifyRequestEntity.RequestStatus.REJECTED);
            request.setProcessedDate(LocalDateTime.now());
            request.setProcessedBy("admin"); // This could be dynamic based on session
            request.setAdminComments(body.get("comments"));

            modifyRequestRepository.save(request);
            return ResponseEntity.ok(Map.of("message", "Request rejected successfully"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to reject request: " + e.getMessage()));
        }
    }

    private void applyUpdatedData(EmployeeEntity employee, Map<String, Object> updatedData) {
        // Hardcoded salary ranges based on position
        Map<String, Double> POSITION_SALARIES = new HashMap<>();
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

        if (updatedData.containsKey("firstName")) {
            employee.setFirstName((String) updatedData.get("firstName"));
        }
        if (updatedData.containsKey("lastName")) {
            employee.setLastName((String) updatedData.get("lastName"));
        }
        if (updatedData.containsKey("email")) {
            employee.setEmail((String) updatedData.get("email"));
        }
        if (updatedData.containsKey("cellphone")) {
            employee.setCellphone((String) updatedData.get("cellphone"));
        }
        if (updatedData.containsKey("department")) {
            employee.setDepartment((String) updatedData.get("department"));
        }
        if (updatedData.containsKey("position")) {
            String position = (String) updatedData.get("position");
            employee.setPosition(position);
            // Auto-assign salary based on position
            Double salary = POSITION_SALARIES.get(position);
            if (salary != null) {
                employee.setSalary(salary);
            }
        }
        // Note: We don't apply salary changes directly from updatedData
        // since they should be auto-calculated based on position
    }

    private Map<String, Object> mapRequestToResponse(ModifyRequestEntity request) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", request.getId());
        data.put("employeeId", request.getEmployeeId());
        data.put("requestedBy", request.getRequestedBy());
        data.put("originalData", request.getOriginalData());
        data.put("updatedData", request.getUpdatedData());
        data.put("status", request.getStatus().name());
        data.put("requestDate", request.getRequestDate().toString());
        data.put("reason", request.getReason());

        if (request.getProcessedDate() != null) {
            data.put("processedDate", request.getProcessedDate().toString());
            data.put("processedBy", request.getProcessedBy());
            data.put("adminComments", request.getAdminComments());
        }

        return data;
    }
}
