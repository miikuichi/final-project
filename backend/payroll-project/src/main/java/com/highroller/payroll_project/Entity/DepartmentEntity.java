package com.highroller.payroll_project.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tbl_dept")
public class DepartmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "dept_name")
    private PositionsEntity.DepartmentType deptName;

    @Column(name = "pos_title")
    private String posTitle;

    @Column(name = "position_id")
    private Long positionId;

    @ManyToOne
    @JoinColumn(name = "position_id", insertable = false, updatable = false)
    private PositionsEntity position;

    // Constructors
    public DepartmentEntity() {
    }

    public DepartmentEntity(PositionsEntity.DepartmentType deptName, String posTitle, Long positionId) {
        this.deptName = deptName;
        this.posTitle = posTitle;
        this.positionId = positionId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PositionsEntity.DepartmentType getDeptName() {
        return deptName;
    }

    public void setDeptName(PositionsEntity.DepartmentType deptName) {
        this.deptName = deptName;
    }

    public String getPosTitle() {
        return posTitle;
    }

    public void setPosTitle(String posTitle) {
        this.posTitle = posTitle;
    }

    public Long getPositionId() {
        return positionId;
    }

    public void setPositionId(Long positionId) {
        this.positionId = positionId;
    }

    public PositionsEntity getPosition() {
        return position;
    }

    public void setPosition(PositionsEntity position) {
        this.position = position;
    }
}
