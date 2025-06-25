package com.highroller.payroll_project.Repository;

import com.highroller.payroll_project.Entity.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Integer> {
    // Find by frontend employeeId
    Optional<EmployeeEntity> findByEmployeeId(String employeeId);

    // Find by last name (case-insensitive, partial match)
    List<EmployeeEntity> findByLastNameContainingIgnoreCase(String lastName);

    // Find by first name (case-insensitive, partial match)
    List<EmployeeEntity> findByFirstNameContainingIgnoreCase(String firstName);

    // Delete by frontend employeeId
    void deleteByEmployeeId(String employeeId);

    // Exists by frontend employeeId
    boolean existsByEmployeeId(String employeeId);
}
