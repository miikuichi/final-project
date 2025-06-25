package com.highroller.payroll_project.Repository;

import com.highroller.payroll_project.Entity.ModifyRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModifyRequestRepository extends JpaRepository<ModifyRequestEntity, Long> {
    // Find all requests for a specific employee
    java.util.List<ModifyRequestEntity> findByEmployeeId(String employeeId);

    // Find all requests by requester
    java.util.List<ModifyRequestEntity> findByRequestedBy(String requestedBy);

    // Delete all requests for a specific employee
    void deleteByEmployeeId(String employeeId);
}
