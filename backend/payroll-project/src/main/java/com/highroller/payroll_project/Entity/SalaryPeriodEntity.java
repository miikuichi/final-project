package com.highroller.payroll_project.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "salary_periods")
public class SalaryPeriodEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "period_from", nullable = false)
    private LocalDate periodFrom;

    @Column(name = "period_to", nullable = false)
    private LocalDate periodTo;

    @Column(name = "monthly_rate", nullable = false)
    private Double monthlyRate;

    @Column(name = "regular_hours")
    private Double regularHours;

    @Column(name = "overtime_hours")
    private Double overtimeHours;

    @Column(name = "holiday_hours")
    private Double holidayHours;

    @Column(name = "night_diff_hours")
    private Double nightDiffHours;

    @Column(name = "rate_per_day")
    private Double ratePerDay;

    @Column(name = "rate_per_hour")
    private Double ratePerHour;

    @Column(name = "regular_pay")
    private Double regularPay;

    @Column(name = "overtime_pay")
    private Double overtimePay;

    @Column(name = "holiday_pay")
    private Double holidayPay;

    @Column(name = "night_diff_pay")
    private Double nightDiffPay;

    @Column(name = "gross_pay")
    private Double grossPay;

    @Column(name = "sss_contribution")
    private Double sssContribution;

    @Column(name = "philhealth_contribution")
    private Double philhealthContribution;

    @Column(name = "pagibig_contribution")
    private Double pagibigContribution;

    @Column(name = "withholding_tax")
    private Double withholdingTax;

    @Column(name = "total_deductions")
    private Double totalDeductions;

    @Column(name = "net_pay")
    private Double netPay;

    // Constructors
    public SalaryPeriodEntity() {
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

    public LocalDate getPeriodFrom() {
        return periodFrom;
    }

    public void setPeriodFrom(LocalDate periodFrom) {
        this.periodFrom = periodFrom;
    }

    public LocalDate getPeriodTo() {
        return periodTo;
    }

    public void setPeriodTo(LocalDate periodTo) {
        this.periodTo = periodTo;
    }

    public Double getMonthlyRate() {
        return monthlyRate;
    }

    public void setMonthlyRate(Double monthlyRate) {
        this.monthlyRate = monthlyRate;
    }

    public Double getRegularHours() {
        return regularHours;
    }

    public void setRegularHours(Double regularHours) {
        this.regularHours = regularHours;
    }

    public Double getOvertimeHours() {
        return overtimeHours;
    }

    public void setOvertimeHours(Double overtimeHours) {
        this.overtimeHours = overtimeHours;
    }

    public Double getHolidayHours() {
        return holidayHours;
    }

    public void setHolidayHours(Double holidayHours) {
        this.holidayHours = holidayHours;
    }

    public Double getNightDiffHours() {
        return nightDiffHours;
    }

    public void setNightDiffHours(Double nightDiffHours) {
        this.nightDiffHours = nightDiffHours;
    }

    public Double getRatePerDay() {
        return ratePerDay;
    }

    public void setRatePerDay(Double ratePerDay) {
        this.ratePerDay = ratePerDay;
    }

    public Double getRatePerHour() {
        return ratePerHour;
    }

    public void setRatePerHour(Double ratePerHour) {
        this.ratePerHour = ratePerHour;
    }

    public Double getRegularPay() {
        return regularPay;
    }

    public void setRegularPay(Double regularPay) {
        this.regularPay = regularPay;
    }

    public Double getOvertimePay() {
        return overtimePay;
    }

    public void setOvertimePay(Double overtimePay) {
        this.overtimePay = overtimePay;
    }

    public Double getHolidayPay() {
        return holidayPay;
    }

    public void setHolidayPay(Double holidayPay) {
        this.holidayPay = holidayPay;
    }

    public Double getNightDiffPay() {
        return nightDiffPay;
    }

    public void setNightDiffPay(Double nightDiffPay) {
        this.nightDiffPay = nightDiffPay;
    }

    public Double getGrossPay() {
        return grossPay;
    }

    public void setGrossPay(Double grossPay) {
        this.grossPay = grossPay;
    }

    public Double getSssContribution() {
        return sssContribution;
    }

    public void setSssContribution(Double sssContribution) {
        this.sssContribution = sssContribution;
    }

    public Double getPhilhealthContribution() {
        return philhealthContribution;
    }

    public void setPhilhealthContribution(Double philhealthContribution) {
        this.philhealthContribution = philhealthContribution;
    }

    public Double getPagibigContribution() {
        return pagibigContribution;
    }

    public void setPagibigContribution(Double pagibigContribution) {
        this.pagibigContribution = pagibigContribution;
    }

    public Double getWithholdingTax() {
        return withholdingTax;
    }

    public void setWithholdingTax(Double withholdingTax) {
        this.withholdingTax = withholdingTax;
    }

    public Double getTotalDeductions() {
        return totalDeductions;
    }

    public void setTotalDeductions(Double totalDeductions) {
        this.totalDeductions = totalDeductions;
    }

    public Double getNetPay() {
        return netPay;
    }

    public void setNetPay(Double netPay) {
        this.netPay = netPay;
    }
}
