package com.highroller.payroll_project.Controller;

import com.highroller.payroll_project.Entity.ModifyRequestEntity;
import com.highroller.payroll_project.Repository.ModifyRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/modify-request")
@CrossOrigin(origins = "http://localhost:5173")
public class ModifyRequestController {
    @Autowired
    private ModifyRequestRepository modifyRequestRepository;

    // Get all modification requests
    @GetMapping("/all")
    public List<ModifyRequestEntity> getAllRequests() {
        return modifyRequestRepository.findAll();
    }

    // Get requests by employeeId
    @GetMapping("/employee/{employeeId}")
    public List<ModifyRequestEntity> getRequestsByEmployee(@PathVariable String employeeId) {
        return modifyRequestRepository.findByEmployeeId(employeeId);
    }

    // Get requests by requester
    @GetMapping("/requestedBy/{requestedBy}")
    public List<ModifyRequestEntity> getRequestsByRequester(@PathVariable String requestedBy) {
        return modifyRequestRepository.findByRequestedBy(requestedBy);
    }

    // Add a new modification request
    @PostMapping("/add")
    public ModifyRequestEntity addRequest(@RequestBody ModifyRequestEntity request) {
        return modifyRequestRepository.save(request);
    }

    // Delete a request by id
    @DeleteMapping("/delete/{id}")
    public void deleteRequest(@PathVariable Long id) {
        modifyRequestRepository.deleteById(id);
    }
}
