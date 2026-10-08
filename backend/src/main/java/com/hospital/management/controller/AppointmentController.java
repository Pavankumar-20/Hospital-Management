package com.hospital.management.controller;

import com.hospital.management.dto.ApiResponse;
import com.hospital.management.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAll() {
        return ResponseEntity.ok(ApiResponse.ok("Appointments fetched", appointmentService.getAllAppointments()));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok("Appointments fetched", appointmentService.getAppointmentsByPatient(patientId)));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse> getByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(ApiResponse.ok("Appointments fetched", appointmentService.getAppointmentsByDoctor(doctorId)));
    }

    @GetMapping("/booked-slots")
    public ResponseEntity<ApiResponse> getBookedSlots(@RequestParam Long doctorId, @RequestParam String date) {
        return ResponseEntity.ok(ApiResponse.ok("Booked slots fetched",
                appointmentService.getBookedTimeSlots(doctorId, java.time.LocalDate.parse(date))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(ApiResponse.ok("Appointment created", appointmentService.createAppointment(request)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(ApiResponse.ok("Status updated",
                appointmentService.updateStatus(id, request.get("status"))));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok(ApiResponse.ok("Appointment deleted"));
    }
}
