package com.highroller.payroll_project.Repository;

import com.highroller.payroll_project.Entity.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Long> {

    // Find employees by first and last name
    List<EmployeeEntity> findByFirstNameAndLastName(String firstName, String lastName);

    // Find employees by email (since email is unique)
    Optional<EmployeeEntity> findByEmail(String email);

    // Find employees by department
    List<EmployeeEntity> findByDepartment(String department);

    // Find employees by position
    List<EmployeeEntity> findByPosition(String position);

    // Find employees by department and position
    List<EmployeeEntity> findByDepartmentAndPosition(String department, String position);
}
