package com.highroller.payroll_project.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tickets")
public class TicketEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "status", columnDefinition = "varchar(255) default 'under process'")
    private String status = "under process";

    // Constructors
    public TicketEntity() {
    }

    public TicketEntity(String name, String category, String details) {
        this.name = name;
        this.category = category;
        this.details = details;
        this.status = "under process";
    }

    public TicketEntity(String name, String category, String details, String status) {
        this.name = name;
        this.category = category;
        this.details = details;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
