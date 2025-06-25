package com.highroller.payroll_project.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "employees")
public class EmployeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int empId;

    private String employeeId; // for frontend mapping
    private String image; // store as URL or path
    private String lastName;
    private String firstName;
    private String middleInitial;
    private String suffix;
    private String birthday;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "house", column = @Column(name = "perm_house")),
            @AttributeOverride(name = "barangay", column = @Column(name = "perm_barangay")),
            @AttributeOverride(name = "city", column = @Column(name = "perm_city")),
            @AttributeOverride(name = "province", column = @Column(name = "perm_province")),
            @AttributeOverride(name = "zip", column = @Column(name = "perm_zip"))
    })
    private Address permanentAddress;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "house", column = @Column(name = "curr_house")),
            @AttributeOverride(name = "barangay", column = @Column(name = "curr_barangay")),
            @AttributeOverride(name = "city", column = @Column(name = "curr_city")),
            @AttributeOverride(name = "province", column = @Column(name = "curr_province")),
            @AttributeOverride(name = "zip", column = @Column(name = "curr_zip"))
    })
    private Address currentAddress;

    private String cellphone;
    private String dateHired;
    private String religion;

    private String email;
    private String course;
    private String school;
    private String licenses;
    private String philhealth;
    private String sss;
    private String pagibig;
    private String tin;
    private String bloodtype;
    private String department;
    private String position;

    public EmployeeEntity() {
    }

    public int getEmpId() {
        return empId;
    }

    public void setEmpId(int empId) {
        this.empId = empId;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
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

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public Address getPermanentAddress() {
        return permanentAddress;
    }

    public void setPermanentAddress(Address permanentAddress) {
        this.permanentAddress = permanentAddress;
    }

    public Address getCurrentAddress() {
        return currentAddress;
    }

    public void setCurrentAddress(Address currentAddress) {
        this.currentAddress = currentAddress;
    }

    public String getCellphone() {
        return cellphone;
    }

    public void setCellphone(String cellphone) {
        this.cellphone = cellphone;
    }

    public String getDateHired() {
        return dateHired;
    }

    public void setDateHired(String dateHired) {
        this.dateHired = dateHired;
    }

    public String getReligion() {
        return religion;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public String getLicenses() {
        return licenses;
    }

    public void setLicenses(String licenses) {
        this.licenses = licenses;
    }

    public String getPhilhealth() {
        return philhealth;
    }

    public void setPhilhealth(String philhealth) {
        this.philhealth = philhealth;
    }

    public String getSss() {
        return sss;
    }

    public void setSss(String sss) {
        this.sss = sss;
    }

    public String getPagibig() {
        return pagibig;
    }

    public void setPagibig(String pagibig) {
        this.pagibig = pagibig;
    }

    public String getTin() {
        return tin;
    }

    public void setTin(String tin) {
        this.tin = tin;
    }

    public String getBloodtype() {
        return bloodtype;
    }

    public void setBloodtype(String bloodtype) {
        this.bloodtype = bloodtype;
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
}
