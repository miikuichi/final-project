package com.highroller.payroll_project.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tbl_position")
public class PositionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "position_name")
    private String positionName;

    @Column(name = "salary_floor")
    private Double salaryFloor;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private DepartmentEntity department;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPositionName() {
        return positionName;
    }

    public void setPositionName(String positionName) {
        this.positionName = positionName;
    }

    public Double getSalaryFloor() {
        return salaryFloor;
    }

    public void setSalaryFloor(Double salaryFloor) {
        this.salaryFloor = salaryFloor;
    }

    public DepartmentEntity getDepartment() {
        return department;
    }

    public void setDepartment(DepartmentEntity department) {
        this.department = department;
    }
}
