package com.highroller.payroll_project.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
public class EmployeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic Personal Information
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "middle_initial", length = 10)
    private String middleInitial;

    @Column(name = "suffix", length = 20)
    private String suffix;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "cellphone", length = 20)
    private String cellphone;

    @Column(name = "birthday")
    private LocalDate birthday;

    @Column(name = "date_hired", nullable = false)
    private LocalDate dateHired;

    @Column(name = "blood_type", length = 10)
    private String bloodType;

    // Employment Information (simplified - no foreign keys)
    @Column(name = "department", nullable = false, length = 100)
    private String department;

    @Column(name = "position", nullable = false, length = 100)
    private String position;

    @Column(name = "salary", nullable = false)
    private Double salary;

    // Address Information (simplified - only one address)
    @Column(name = "address_house")
    private String addressHouse;

    @Column(name = "address_barangay")
    private String addressBarangay;

    @Column(name = "address_city", length = 100)
    private String addressCity;

    @Column(name = "address_province", length = 100)
    private String addressProvince;

    @Column(name = "address_zip", length = 20)
    private String addressZip;

    // Optional fields
    @Column(name = "religion", length = 100)
    private String religion;

    @Column(name = "image", columnDefinition = "LONGTEXT")
    private String image;

    // Timestamps
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public EmployeeEntity() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getMiddleInitial() {
        return middleInitial;
    }

    public void setMiddleInitial(String middleInitial) {
        this.middleInitial = middleInitial;
    }

    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCellphone() {
        return cellphone;
    }

    public void setCellphone(String cellphone) {
        this.cellphone = cellphone;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public LocalDate getDateHired() {
        return dateHired;
    }

    public void setDateHired(LocalDate dateHired) {
        this.dateHired = dateHired;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public String getAddressHouse() {
        return addressHouse;
    }

    public void setAddressHouse(String addressHouse) {
        this.addressHouse = addressHouse;
    }

    public String getAddressBarangay() {
        return addressBarangay;
    }

    public void setAddressBarangay(String addressBarangay) {
        this.addressBarangay = addressBarangay;
    }

    public String getAddressCity() {
        return addressCity;
    }

    public void setAddressCity(String addressCity) {
        this.addressCity = addressCity;
    }

    public String getAddressProvince() {
        return addressProvince;
    }

    public void setAddressProvince(String addressProvince) {
        this.addressProvince = addressProvince;
    }

    public String getAddressZip() {
        return addressZip;
    }

    public void setAddressZip(String addressZip) {
        this.addressZip = addressZip;
    }

    public String getReligion() {
        return religion;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
