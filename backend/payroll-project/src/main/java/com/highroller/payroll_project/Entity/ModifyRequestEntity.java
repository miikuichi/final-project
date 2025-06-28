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
    private String requestedBy; // Username of HR who made the request

    @Column(name = "field_name")
    private String fieldName; // Which field to modify (e.g., "name", "email", "deptPosId")

    @Column(name = "current_value")
    private String currentValue; // Current value in the database

    @Column(name = "requested_value")
    private String requestedValue; // New value requested

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "request_date")
    private LocalDateTime requestDate = LocalDateTime.now();

    @Column(name = "processed_date")
    private LocalDateTime processedDate;

    @Column(name = "processed_by")
    private String processedBy; // Username of admin who approved/rejected

    @Column(name = "reason")
    private String reason; // Reason for the change request

    @Column(name = "admin_comments")
    private String adminComments; // Admin's comments on approval/rejection

    public enum RequestStatus {
        PENDING, APPROVED, REJECTED
    }

    // Constructors
    public ModifyRequestEntity() {
    }

    public ModifyRequestEntity(Long employeeId, String requestedBy, String fieldName,
            String currentValue, String requestedValue, String reason) {
        this.employeeId = employeeId;
        this.requestedBy = requestedBy;
        this.fieldName = fieldName;
        this.currentValue = currentValue;
        this.requestedValue = requestedValue;
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

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(String currentValue) {
        this.currentValue = currentValue;
    }

    public String getRequestedValue() {
        return requestedValue;
    }

    public void setRequestedValue(String requestedValue) {
        this.requestedValue = requestedValue;
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
