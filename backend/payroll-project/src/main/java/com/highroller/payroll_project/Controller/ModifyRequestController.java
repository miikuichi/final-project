package com.highroller.payroll_project.Controller;

import com.highroller.payroll_project.Entity.ModifyRequestEntity;
import com.highroller.payroll_project.Entity.EmployeeEntity;
import com.highroller.payroll_project.Repository.ModifyRequestRepository;
import com.highroller.payroll_project.Repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/modify-requests")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ModifyRequestController {

    @Autowired
    private ModifyRequestRepository modifyRequestRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

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

    @GetMapping("/my-requests")
    public ResponseEntity<List<Map<String, Object>>> getMyRequests(HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(401).build();
        }

        List<ModifyRequestEntity> requests = modifyRequestRepository
                .findByRequestedByOrderByRequestDateDesc(username);
        List<Map<String, Object>> requestData = requests.stream()
                .map(this::mapRequestToResponse)
                .toList();
        return ResponseEntity.ok(requestData);
    }

    @PostMapping
    public ResponseEntity<?> createModifyRequest(@RequestBody Map<String, Object> requestData, HttpSession session) {
        try {
            String username = (String) session.getAttribute("username");
            if (username == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            Long employeeId = Long.valueOf(requestData.get("employeeId").toString());
            String fieldName = (String) requestData.get("fieldName");
            String currentValue = (String) requestData.get("currentValue");
            String requestedValue = (String) requestData.get("requestedValue");
            String reason = (String) requestData.get("reason");

            ModifyRequestEntity request = new ModifyRequestEntity(
                    employeeId, username, fieldName, currentValue, requestedValue, reason);

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
            @RequestBody(required = false) Map<String, String> body,
            HttpSession session) {
        try {
            String username = (String) session.getAttribute("username");
            if (username == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            Optional<ModifyRequestEntity> requestOpt = modifyRequestRepository.findById(id);
            if (!requestOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            ModifyRequestEntity request = requestOpt.get();
            if (request.getStatus() != ModifyRequestEntity.RequestStatus.PENDING) {
                return ResponseEntity.badRequest().body(Map.of("error", "Request has already been processed"));
            }

            // Apply the change to the employee record
            Optional<EmployeeEntity> employeeOpt = employeeRepository.findById(request.getEmployeeId());
            if (!employeeOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Employee not found"));
            }

            EmployeeEntity employee = employeeOpt.get();
            applyFieldChange(employee, request.getFieldName(), request.getRequestedValue());
            employeeRepository.save(employee);

            // Update the request status
            request.setStatus(ModifyRequestEntity.RequestStatus.APPROVED);
            request.setProcessedDate(LocalDateTime.now());
            request.setProcessedBy(username);
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
            @RequestBody Map<String, String> body,
            HttpSession session) {
        try {
            String username = (String) session.getAttribute("username");
            if (username == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

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
            request.setProcessedBy(username);
            request.setAdminComments(body.get("comments"));

            modifyRequestRepository.save(request);
            return ResponseEntity.ok(Map.of("message", "Request rejected successfully"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to reject request: " + e.getMessage()));
        }
    }

    private void applyFieldChange(EmployeeEntity employee, String fieldName, String newValue) {
        switch (fieldName) {
            case "firstName":
                employee.setFirstName(newValue);
                break;
            case "lastName":
                employee.setLastName(newValue);
                break;
            case "email":
                employee.setEmail(newValue);
                break;
            case "cellphone":
                employee.setCellphone(newValue);
                break;
            case "department":
                employee.setDepartment(newValue);
                break;
            case "position":
                employee.setPosition(newValue);
                break;
            // Add more fields as needed
            default:
                throw new IllegalArgumentException("Unsupported field: " + fieldName);
        }
    }

    private Map<String, Object> mapRequestToResponse(ModifyRequestEntity request) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", request.getId());
        data.put("employeeId", request.getEmployeeId());
        data.put("requestedBy", request.getRequestedBy());
        data.put("fieldName", request.getFieldName());
        data.put("currentValue", request.getCurrentValue());
        data.put("requestedValue", request.getRequestedValue());
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
