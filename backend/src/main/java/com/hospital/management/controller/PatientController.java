package com.hospital.management.controller;

import com.hospital.management.dto.ApiResponse;
import com.hospital.management.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAll() {
        return ResponseEntity.ok(ApiResponse.ok("Patients fetched", patientService.getAllPatients()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Patient fetched", patientService.getPatientById(id)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok("Patient fetched", patientService.getPatientByUserId(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(ApiResponse.ok("Patient created", patientService.createPatient(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(ApiResponse.ok("Patient updated", patientService.updatePatient(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok(ApiResponse.ok("Patient deleted"));
    }
}
