package com.highroller.payroll_project.Repository;

import com.highroller.payroll_project.Entity.ModifyRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModifyRequestRepository extends JpaRepository<ModifyRequestEntity, Long> {
    // Find all requests for a specific employee
    List<ModifyRequestEntity> findByEmployeeId(Long employeeId);

    // Find all requests by requester
    List<ModifyRequestEntity> findByRequestedBy(String requestedBy);

    // Delete all requests for a specific employee
    void deleteByEmployeeId(Long employeeId);

    List<ModifyRequestEntity> findByStatusOrderByRequestDateDesc(ModifyRequestEntity.RequestStatus status);

    List<ModifyRequestEntity> findByRequestedByOrderByRequestDateDesc(String requestedBy);

    List<ModifyRequestEntity> findByEmployeeIdOrderByRequestDateDesc(Long employeeId);

    List<ModifyRequestEntity> findAllByOrderByRequestDateDesc();
}
