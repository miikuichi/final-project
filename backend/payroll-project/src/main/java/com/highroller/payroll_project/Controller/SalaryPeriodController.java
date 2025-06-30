package com.highroller.payroll_project.Controller;

import com.highroller.payroll_project.Entity.SalaryPeriodEntity;
import com.highroller.payroll_project.Repository.SalaryPeriodRepository;
import com.highroller.payroll_project.util.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/salary-periods")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" }, allowCredentials = "true")
public class SalaryPeriodController {

    @Autowired
    private SalaryPeriodRepository salaryPeriodRepository;
    
    @Autowired
    private ValidationUtils validationUtils;

    @PostMapping
    public ResponseEntity<?> createSalaryPeriod(@RequestBody Map<String, Object> request) {
        try {
            // INPUT VALIDATION
            
            // Validate required fields
            if (request.get("employeeId") == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Employee ID is required"));
            }
            if (request.get("monthlyRate") == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Monthly rate is required"));
            }
            
            SalaryPeriodEntity salaryPeriod = new SalaryPeriodEntity();

            salaryPeriod.setEmployeeId(Long.valueOf(request.get("employeeId").toString()));
            salaryPeriod.setPeriodFrom(LocalDate.parse(request.get("periodFrom").toString()));
            salaryPeriod.setPeriodTo(LocalDate.parse(request.get("periodTo").toString()));
            salaryPeriod.setMonthlyRate(Double.valueOf(request.get("monthlyRate").toString()));

            // Work hours with validation
            if (request.get("regularHours") != null) {
                Double regularHours = Double.valueOf(request.get("regularHours").toString());
                if (!validationUtils.isValidRegularHours(regularHours)) {
                    return ResponseEntity.badRequest().body(Map.of("error", 
                        "Regular hours must be between 0 and " + ValidationUtils.MAX_REGULAR_HOURS_MONTHLY + " per month"));
                }
                salaryPeriod.setRegularHours(regularHours);
            }
            
            if (request.get("overtimeHours") != null) {
                Double overtimeHours = Double.valueOf(request.get("overtimeHours").toString());
                if (!validationUtils.isValidOvertimeHours(overtimeHours)) {
                    return ResponseEntity.badRequest().body(Map.of("error", 
                        "Overtime hours must be between 0 and " + ValidationUtils.MAX_OVERTIME_HOURS_MONTHLY + " per month"));
                }
                salaryPeriod.setOvertimeHours(overtimeHours);
            }
            
            if (request.get("holidayHours") != null) {
                Double holidayHours = Double.valueOf(request.get("holidayHours").toString());
                if (!validationUtils.isValidHolidayHours(holidayHours)) {
                    return ResponseEntity.badRequest().body(Map.of("error", 
                        "Holiday hours must be between 0 and " + ValidationUtils.MAX_HOLIDAY_HOURS_MONTHLY + " per month"));
                }
                salaryPeriod.setHolidayHours(holidayHours);
            }
            
            if (request.get("nightDiffHours") != null) {
                Double nightDiffHours = Double.valueOf(request.get("nightDiffHours").toString());
                if (!validationUtils.isValidNightDiffHours(nightDiffHours)) {
                    return ResponseEntity.badRequest().body(Map.of("error", 
                        "Night differential hours must be between 0 and " + ValidationUtils.MAX_NIGHT_DIFF_HOURS_MONTHLY + " per month"));
                }
                salaryPeriod.setNightDiffHours(nightDiffHours);
            }

            // Calculation fields
            if (request.get("ratePerDay") != null) {
                salaryPeriod.setRatePerDay(Double.valueOf(request.get("ratePerDay").toString()));
            }
            if (request.get("ratePerHour") != null) {
                salaryPeriod.setRatePerHour(Double.valueOf(request.get("ratePerHour").toString()));
            }
            if (request.get("regularPay") != null) {
                salaryPeriod.setRegularPay(Double.valueOf(request.get("regularPay").toString()));
            }
            if (request.get("overtimePay") != null) {
                salaryPeriod.setOvertimePay(Double.valueOf(request.get("overtimePay").toString()));
            }
            if (request.get("holidayPay") != null) {
                salaryPeriod.setHolidayPay(Double.valueOf(request.get("holidayPay").toString()));
            }
            if (request.get("nightDiffPay") != null) {
                salaryPeriod.setNightDiffPay(Double.valueOf(request.get("nightDiffPay").toString()));
            }
            if (request.get("grossPay") != null) {
                salaryPeriod.setGrossPay(Double.valueOf(request.get("grossPay").toString()));
            }
            if (request.get("sssContribution") != null) {
                salaryPeriod.setSssContribution(Double.valueOf(request.get("sssContribution").toString()));
            }
            if (request.get("philhealthContribution") != null) {
                salaryPeriod
                        .setPhilhealthContribution(Double.valueOf(request.get("philhealthContribution").toString()));
            }
            if (request.get("pagibigContribution") != null) {
                salaryPeriod.setPagibigContribution(Double.valueOf(request.get("pagibigContribution").toString()));
            }
            if (request.get("withholdingTax") != null) {
                salaryPeriod.setWithholdingTax(Double.valueOf(request.get("withholdingTax").toString()));
            }
            if (request.get("totalDeductions") != null) {
                salaryPeriod.setTotalDeductions(Double.valueOf(request.get("totalDeductions").toString()));
            }
            if (request.get("netPay") != null) {
                salaryPeriod.setNetPay(Double.valueOf(request.get("netPay").toString()));
            }

            SalaryPeriodEntity saved = salaryPeriodRepository.save(salaryPeriod);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<SalaryPeriodEntity>> getSalaryPeriodsByEmployee(@PathVariable Long employeeId) {
        List<SalaryPeriodEntity> salaryPeriods = salaryPeriodRepository
                .findByEmployeeIdOrderByPeriodFromAsc(employeeId);
        return ResponseEntity.ok(salaryPeriods);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalaryPeriod(@PathVariable Long id) {
        if (salaryPeriodRepository.existsById(id)) {
            salaryPeriodRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
