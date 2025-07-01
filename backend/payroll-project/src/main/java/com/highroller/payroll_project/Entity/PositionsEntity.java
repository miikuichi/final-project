package com.highroller.payroll_project.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tbl_positions")
public class PositionsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "dept_name")
    private DepartmentType deptName;

    @Column(name = "pos_title")
    private String posTitle;

    @Column(name = "salary_floor")
    private Double salaryFloor;

    // Enum for department types
    public enum DepartmentType {
        IT, HR, Finance, Marketing, Operations
    }

    // Constructors
    public PositionsEntity() {
    }

    public PositionsEntity(DepartmentType deptName, String posTitle, Double salaryFloor) {
        this.deptName = deptName;
        this.posTitle = posTitle;
        this.salaryFloor = salaryFloor;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DepartmentType getDeptName() {
        return deptName;
    }

    public void setDeptName(DepartmentType deptName) {
        this.deptName = deptName;
    }

    public String getPosTitle() {
        return posTitle;
    }

    public void setPosTitle(String posTitle) {
        this.posTitle = posTitle;
    }

    public Double getSalaryFloor() {
        return salaryFloor;
    }

    public void setSalaryFloor(Double salaryFloor) {
        this.salaryFloor = salaryFloor;
    }
}
