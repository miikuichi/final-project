package com.highroller.payroll_project.Repository;

import com.highroller.payroll_project.Entity.DepartmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepartmentRepository extends JpaRepository<DepartmentEntity, Long> {
    List<DepartmentEntity> findAllByOrderByDeptNameAsc();
}
