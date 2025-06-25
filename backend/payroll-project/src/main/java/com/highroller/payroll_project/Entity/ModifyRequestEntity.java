package com.highroller.payroll_project.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ModifyRequestEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String employeeId;
    private String requestedBy;
    private String reason;
    private LocalDateTime date;

    @Lob
    private String updatedJson; // Store the proposed changes as JSON

    public ModifyRequestEntity() {
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getRequestedBy() {
        return requestedBy;
    }

    public void setRequestedBy(String requestedBy) {
        this.requestedBy = requestedBy;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getUpdatedJson() {
        return updatedJson;
    }

    public void setUpdatedJson(String updatedJson) {
        this.updatedJson = updatedJson;
    }
}
