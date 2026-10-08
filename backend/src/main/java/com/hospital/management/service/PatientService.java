package com.hospital.management.service;

import com.hospital.management.dto.PatientDTO;
import com.hospital.management.model.Doctor;
import com.hospital.management.model.Patient;
import com.hospital.management.model.Role;
import com.hospital.management.model.User;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.UserRepository;
import com.hospital.management.util.DtoMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public PatientService(PatientRepository patientRepository,
                          UserRepository userRepository,
                          DoctorRepository doctorRepository,
                          PasswordEncoder passwordEncoder) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream().map(DtoMapper::toPatientDTO).toList();
    }

    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return DtoMapper.toPatientDTO(patient);
    }

    public PatientDTO getPatientByUserId(Long userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return DtoMapper.toPatientDTO(patient);
    }

    @Transactional
    public PatientDTO createPatient(Map<String, Object> request) {
        String email = (String) request.get("email");
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFirstName(extractFirstName((String) request.get("name")));
        user.setLastName(extractLastName((String) request.get("name")));
        user.setEmail(email);
        user.setPhone((String) request.get("phone"));
        user.setPassword(passwordEncoder.encode("Patient@123"));
        user.setRole(Role.PATIENT);
        user = userRepository.save(user);

        Patient patient = new Patient();
        patient.setUser(user);
        patient.setAge(toInteger(request.get("age")));
        patient.setGender((String) request.get("gender"));
        patient.setBloodGroup((String) request.getOrDefault("bloodGroup", "O+"));
        patient.setStatus((String) request.getOrDefault("status", "OUTPATIENT"));

        if (request.get("assignedDoctorId") != null) {
            Long doctorId = Long.valueOf(request.get("assignedDoctorId").toString());
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            patient.setAssignedDoctor(doctor);
        }

        patient = patientRepository.save(patient);
        return DtoMapper.toPatientDTO(patient);
    }

    @Transactional
    public PatientDTO updatePatient(Long id, Map<String, Object> request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        User user = patient.getUser();

        if (request.containsKey("firstName")) user.setFirstName((String) request.get("firstName"));
        if (request.containsKey("lastName")) user.setLastName((String) request.get("lastName"));
        if (request.containsKey("email")) user.setEmail((String) request.get("email"));
        if (request.containsKey("phone")) user.setPhone((String) request.get("phone"));
        if (request.containsKey("age")) patient.setAge(toInteger(request.get("age")));
        if (request.containsKey("gender")) patient.setGender((String) request.get("gender"));
        if (request.containsKey("bloodGroup")) patient.setBloodGroup((String) request.get("bloodGroup"));
        if (request.containsKey("address")) patient.setAddress((String) request.get("address"));
        if (request.containsKey("status")) patient.setStatus((String) request.get("status"));
        if (request.containsKey("dateOfBirth")) {
            patient.setDateOfBirth(LocalDate.parse((String) request.get("dateOfBirth")));
        }

        userRepository.save(user);
        patient = patientRepository.save(patient);
        return DtoMapper.toPatientDTO(patient);
    }

    @Transactional
    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        User user = patient.getUser();
        patientRepository.delete(patient);
        userRepository.delete(user);
    }

    private String extractFirstName(String fullName) {
        if (fullName == null || fullName.isBlank()) return "Patient";
        String[] parts = fullName.trim().split("\\s+", 2);
        return parts[0];
    }

    private String extractLastName(String fullName) {
        if (fullName == null || fullName.isBlank()) return "User";
        String[] parts = fullName.trim().split("\\s+", 2);
        return parts.length > 1 ? parts[1] : "User";
    }

    private Integer toInteger(Object value) {
        if (value == null) return null;
        return Integer.valueOf(value.toString());
    }
}
