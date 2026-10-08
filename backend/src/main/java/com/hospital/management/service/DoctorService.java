package com.hospital.management.service;

import com.hospital.management.dto.DoctorDTO;
import com.hospital.management.model.Department;
import com.hospital.management.model.Doctor;
import com.hospital.management.model.Role;
import com.hospital.management.model.User;
import com.hospital.management.repository.DepartmentRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.UserRepository;
import com.hospital.management.util.DtoMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorService(DoctorRepository doctorRepository,
                         UserRepository userRepository,
                         DepartmentRepository departmentRepository,
                         PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream().map(DtoMapper::toDoctorDTO).toList();
    }

    public List<DoctorDTO> getDoctorsByDepartment(String departmentCode) {
        Department department = departmentRepository.findByCode(departmentCode)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        return doctorRepository.findByDepartment(department).stream().map(DtoMapper::toDoctorDTO).toList();
    }

    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return DtoMapper.toDoctorDTO(doctor);
    }

    public DoctorDTO getDoctorByUserId(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return DtoMapper.toDoctorDTO(doctor);
    }

    @Transactional
    public DoctorDTO createDoctor(Map<String, Object> request) {
        String email = (String) request.get("email");
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        String name = (String) request.get("name");
        user.setFirstName(name.startsWith("Dr.") ? name.substring(4).trim().split("\\s+")[0] : name.split("\\s+")[0]);
        user.setLastName(name.contains(" ") ? name.substring(name.indexOf(' ') + 1) : "Doctor");
        user.setEmail(email);
        user.setPhone((String) request.get("phone"));
        user.setPassword(passwordEncoder.encode("Doctor@123"));
        user.setRole(Role.DOCTOR);
        user = userRepository.save(user);

        String deptCode = (String) request.get("department");
        Department department = departmentRepository.findByCode(deptCode)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setSpecialty((String) request.get("specialty"));
        doctor.setDepartment(department);
        doctor.setStatus("ACTIVE");
        doctor = doctorRepository.save(doctor);

        return DtoMapper.toDoctorDTO(doctor);
    }

    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        User user = doctor.getUser();
        doctorRepository.delete(doctor);
        userRepository.delete(user);
    }
}
