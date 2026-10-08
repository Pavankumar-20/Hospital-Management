package com.hospital.management.service;

import com.hospital.management.dto.AuthResponse;
import com.hospital.management.dto.LoginRequest;
import com.hospital.management.dto.RegisterRequest;
import com.hospital.management.model.*;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PatientRepository patientRepository,
                       DoctorRepository doctorRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest request) {
        Role role = Role.valueOf(request.getRole().toUpperCase());

        User user = userRepository.findByEmailAndRole(request.getEmail(), role)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        Long profileId = resolveProfileId(user);
        return new AuthResponse(user.getId(), profileId, user.getEmail(), user.getFullName(), user.getRole().name().toLowerCase());
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.PATIENT);
        user = userRepository.save(user);

        Patient patient = new Patient();
        patient.setUser(user);
        patient.setStatus("OUTPATIENT");
        patient = patientRepository.save(patient);

        return new AuthResponse(user.getId(), patient.getId(), user.getEmail(), user.getFullName(), "patient");
    }

    private Long resolveProfileId(User user) {
        return switch (user.getRole()) {
            case PATIENT -> patientRepository.findByUserId(user.getId()).map(Patient::getId).orElse(null);
            case DOCTOR -> doctorRepository.findByUserId(user.getId()).map(Doctor::getId).orElse(null);
            case ADMIN -> user.getId();
        };
    }
}
