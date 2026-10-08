package com.hospital.management.controller;

import com.hospital.management.dto.ApiResponse;
import com.hospital.management.model.Department;
import com.hospital.management.repository.DepartmentRepository;
import com.hospital.management.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final DashboardService dashboardService;
    private final DepartmentRepository departmentRepository;

    public DashboardController(DashboardService dashboardService, DepartmentRepository departmentRepository) {
        this.dashboardService = dashboardService;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse> getStats() {
        return ResponseEntity.ok(ApiResponse.ok("Dashboard stats", dashboardService.getAdminStats()));
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse> getDepartments() {
        return ResponseEntity.ok(ApiResponse.ok("Departments fetched", departmentRepository.findAll()));
    }
}
