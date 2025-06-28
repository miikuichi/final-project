package com.highroller.payroll_project.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "modify_requests")
public class ModifyRequestEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "requested_by")
    private String requestedBy; // Role of user who made the request (admin/hr)

    @Column(name = "original_data", columnDefinition = "TEXT")
    private String originalData; // JSON string of original employee data

    @Column(name = "updated_data", columnDefinition = "TEXT")
    private String updatedData; // JSON string of updated employee data

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "request_date")
    private LocalDateTime requestDate = LocalDateTime.now();

    @Column(name = "processed_date")
    private LocalDateTime processedDate;

    @Column(name = "processed_by")
    private String processedBy; // Username of admin who approved/rejected

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason; // Reason for the change request

    @Column(name = "admin_comments", columnDefinition = "TEXT")
    private String adminComments; // Admin's comments on approval/rejection

    public enum RequestStatus {
        PENDING, APPROVED, REJECTED
    }

    // Constructors
    public ModifyRequestEntity() {
    }

    public ModifyRequestEntity(Long employeeId, String requestedBy, String originalData,
            String updatedData, String reason) {
        this.employeeId = employeeId;
        this.requestedBy = requestedBy;
        this.originalData = originalData;
        this.updatedData = updatedData;
        this.reason = reason;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getRequestedBy() {
        return requestedBy;
    }

    public void setRequestedBy(String requestedBy) {
        this.requestedBy = requestedBy;
    }

    public String getOriginalData() {
        return originalData;
    }

    public void setOriginalData(String originalData) {
        this.originalData = originalData;
    }

    public String getUpdatedData() {
        return updatedData;
    }

    public void setUpdatedData(String updatedData) {
        this.updatedData = updatedData;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public LocalDateTime getProcessedDate() {
        return processedDate;
    }

    public void setProcessedDate(LocalDateTime processedDate) {
        this.processedDate = processedDate;
    }

    public String getProcessedBy() {
        return processedBy;
    }

    public void setProcessedBy(String processedBy) {
        this.processedBy = processedBy;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getAdminComments() {
        return adminComments;
    }

    public void setAdminComments(String adminComments) {
        this.adminComments = adminComments;
    }
}
