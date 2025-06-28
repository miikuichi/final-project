package com.highroller.payroll_project.Repository;

import com.highroller.payroll_project.Entity.SalaryPeriodEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaryPeriodRepository extends JpaRepository<SalaryPeriodEntity, Long> {
    List<SalaryPeriodEntity> findByEmployeeIdOrderByPeriodFromAsc(Long employeeId);
}
