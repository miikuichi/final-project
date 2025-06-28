package com.highroller.payroll_project.Controller;

import com.highroller.payroll_project.Entity.DepartmentEntity;
import com.highroller.payroll_project.Entity.PositionsEntity;
import com.highroller.payroll_project.Repository.DepartmentRepository;
import com.highroller.payroll_project.Repository.PositionsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class DepartmentController {
    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PositionsRepository positionsRepository;

    @GetMapping("/departments")
    public ResponseEntity<List<String>> getAllDepartments() {
        List<PositionsEntity.DepartmentType> departments = positionsRepository.findDistinctDepartments();
        List<String> departmentNames = departments.stream()
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(departmentNames);
    }

    @GetMapping("/departments/{deptName}/positions")
    public ResponseEntity<List<Map<String, Object>>> getPositionsForDepartment(@PathVariable String deptName) {
        try {
            PositionsEntity.DepartmentType departmentType = PositionsEntity.DepartmentType.valueOf(deptName);
            List<PositionsEntity> positions = positionsRepository.findByDeptNameOrderByPosTitle(departmentType);

            List<Map<String, Object>> positionData = positions.stream()
                    .map(pos -> {
                        Map<String, Object> data = new HashMap<>();
                        data.put("id", pos.getId());
                        data.put("posTitle", pos.getPosTitle());
                        data.put("salaryFloor", pos.getSalaryFloor());
                        return data;
                    })
                    .toList();

            return ResponseEntity.ok(positionData);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/positions/{positionId}")
    public ResponseEntity<Double> getSalaryFloor(@PathVariable Long positionId) {
        return positionsRepository.findById(positionId)
                .map(position -> ResponseEntity.ok(position.getSalaryFloor()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/dept-positions")
    public ResponseEntity<List<Map<String, Object>>> getAllDeptPositions() {
        List<DepartmentEntity> deptPositions = departmentRepository.findAllByOrderByDeptNameAsc();

        List<Map<String, Object>> data = deptPositions.stream()
                .map(dp -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", dp.getId());
                    item.put("deptName", dp.getDeptName().name());
                    item.put("posTitle", dp.getPosTitle());
                    if (dp.getPosition() != null) {
                        item.put("salaryFloor", dp.getPosition().getSalaryFloor());
                    }
                    return item;
                })
                .toList();

        return ResponseEntity.ok(data);
    }
}
