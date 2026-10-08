package com.hospital.management.service;

import com.hospital.management.dto.AppointmentDTO;
import com.hospital.management.model.*;
import com.hospital.management.repository.*;
import com.hospital.management.util.DtoMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              PatientRepository patientRepository,
                              DoctorRepository doctorRepository,
                              DepartmentRepository departmentRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream().map(DtoMapper::toAppointmentDTO).toList();
    }

    public List<AppointmentDTO> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId).stream().map(DtoMapper::toAppointmentDTO).toList();
    }

    public List<AppointmentDTO> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream().map(DtoMapper::toAppointmentDTO).toList();
    }

    public List<String> getBookedTimeSlots(Long doctorId, LocalDate date) {
        return appointmentRepository.findBookedTimes(doctorId, date);
    }

    @Transactional
    public AppointmentDTO createAppointment(Map<String, Object> request) {
        Long patientId = Long.valueOf(request.get("patientId").toString());
        Long doctorId = Long.valueOf(request.get("doctorId").toString());

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Department department;
        if (request.containsKey("departmentId")) {
            department = departmentRepository.findById(Long.valueOf(request.get("departmentId").toString()))
                    .orElseThrow(() -> new RuntimeException("Department not found"));
        } else {
            String deptCode = (String) request.get("department");
            department = departmentRepository.findByCode(deptCode)
                    .orElseThrow(() -> new RuntimeException("Department not found"));
        }

        LocalDate date = LocalDate.parse((String) request.get("date"));
        String time = (String) request.get("time");

        List<String> booked = appointmentRepository.findBookedTimes(doctorId, date);
        if (booked.contains(time)) {
            throw new RuntimeException("Time slot already booked");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setDepartment(department);
        appointment.setAppointmentDate(date);
        appointment.setAppointmentTime(time);
        appointment.setSymptoms((String) request.getOrDefault("symptoms", ""));
        appointment.setAppointmentType((String) request.getOrDefault("type", "Consultation"));
        appointment.setNotes((String) request.get("notes"));
        appointment.setStatus(AppointmentStatus.SCHEDULED);

        appointment = appointmentRepository.save(appointment);
        return DtoMapper.toAppointmentDTO(appointment);
    }

    @Transactional
    public AppointmentDTO updateStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(AppointmentStatus.valueOf(status.toUpperCase()));
        appointment = appointmentRepository.save(appointment);
        return DtoMapper.toAppointmentDTO(appointment);
    }

    @Transactional
    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new RuntimeException("Appointment not found");
        }
        appointmentRepository.deleteById(id);
    }
}
