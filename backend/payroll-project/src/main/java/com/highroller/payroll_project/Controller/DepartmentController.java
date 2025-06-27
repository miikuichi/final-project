package com.highroller.payroll_project.Controller;

import com.highroller.payroll_project.Entity.DepartmentEntity;
import com.highroller.payroll_project.Entity.PositionEntity;
import com.highroller.payroll_project.Repository.DepartmentRepository;
import com.highroller.payroll_project.Repository.PositionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class DepartmentController {
    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PositionRepository positionRepository;

    @GetMapping("/departments")
    public List<DepartmentEntity> getAllDepartments() {
        return departmentRepository.findAllByOrderByDeptNameAsc();
    }

    @GetMapping("/departments/{deptId}/positions")
    public ResponseEntity<List<PositionEntity>> getPositionsForDepartment(@PathVariable Long deptId) {
        return ResponseEntity.ok(positionRepository.findByDepartmentId(deptId));
    }

    @GetMapping("/positions/{positionId}")
    public ResponseEntity<Double> getSalaryFloor(@PathVariable Long positionId) {
        return positionRepository.findById(positionId)
                .map(position -> ResponseEntity.ok(position.getSalaryFloor()))
                .orElse(ResponseEntity.notFound().build());
    }
}
