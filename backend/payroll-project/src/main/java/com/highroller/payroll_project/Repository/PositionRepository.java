package com.highroller.payroll_project.Repository;

import com.highroller.payroll_project.Entity.PositionsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PositionRepository extends JpaRepository<PositionsEntity, Long> {
}
