package com.highroller.payroll_project.Repository;

import com.highroller.payroll_project.Entity.PositionsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PositionsRepository extends JpaRepository<PositionsEntity, Long> {

    @Query("SELECT DISTINCT p.deptName FROM PositionsEntity p ORDER BY p.deptName")
    List<PositionsEntity.DepartmentType> findDistinctDepartments();

    List<PositionsEntity> findByDeptNameOrderByPosTitle(PositionsEntity.DepartmentType deptName);
}
