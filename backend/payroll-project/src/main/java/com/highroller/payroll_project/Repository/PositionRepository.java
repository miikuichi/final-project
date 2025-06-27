package com.highroller.payroll_project.Repository;

import com.highroller.payroll_project.Entity.PositionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PositionRepository extends JpaRepository<PositionEntity, Long> {
    List<PositionEntity> findByDepartmentId(Long deptId);
}
