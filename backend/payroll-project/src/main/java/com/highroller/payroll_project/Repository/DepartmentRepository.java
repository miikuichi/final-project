package com.highroller.payroll_project.Repository;

import com.highroller.payroll_project.Entity.DepartmentEntity;
import com.highroller.payroll_project.Entity.PositionsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<DepartmentEntity, Long> {

    @Query("SELECT DISTINCT d.deptName FROM DepartmentEntity d ORDER BY d.deptName")
    List<PositionsEntity.DepartmentType> findDistinctDepartments();

    List<DepartmentEntity> findByDeptNameOrderByPosTitle(PositionsEntity.DepartmentType deptName);

    List<DepartmentEntity> findAllByOrderByDeptNameAsc();
}
