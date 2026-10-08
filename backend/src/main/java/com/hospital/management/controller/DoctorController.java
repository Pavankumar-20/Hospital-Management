package com.hospital.management.controller;

import com.hospital.management.dto.ApiResponse;
import com.hospital.management.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAll() {
        return ResponseEntity.ok(ApiResponse.ok("Doctors fetched", doctorService.getAllDoctors()));
    }

    @GetMapping("/department/{code}")
    public ResponseEntity<ApiResponse> getByDepartment(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.ok("Doctors fetched", doctorService.getDoctorsByDepartment(code)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Doctor fetched", doctorService.getDoctorById(id)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok("Doctor fetched", doctorService.getDoctorByUserId(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(ApiResponse.ok("Doctor created", doctorService.createDoctor(request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.ok("Doctor deleted"));
    }
}
