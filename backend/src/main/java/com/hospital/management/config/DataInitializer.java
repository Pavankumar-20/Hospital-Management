package com.hospital.management.config;

import com.hospital.management.model.*;
import com.hospital.management.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DepartmentRepository departmentRepository,
                           DoctorRepository doctorRepository,
                           PatientRepository patientRepository,
                           AppointmentRepository appointmentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        Map<String, Department> departments = seedDepartments();
        seedAdmin();
        Doctor demoDoctor = seedDemoDoctor(departments.get("cardiology"));
        Patient demoPatient = seedDemoPatient(demoDoctor);
        seedAdditionalDoctors(departments);
        seedAdditionalPatients();
        seedAppointments(demoPatient, demoDoctor, departments);

        System.out.println("=== Hospital Management System - Sample data loaded ===");
        System.out.println("Admin:   admin@hms.com / Admin@123");
        System.out.println("Doctor:  doctor@hms.com / Doctor@123");
        System.out.println("Patient: patient@hms.com / Patient@123");
    }

    private Map<String, Department> seedDepartments() {
        Map<String, Department> map = new LinkedHashMap<>();
        map.put("cardiology", saveDepartment("Cardiology", "cardiology", "Heart and cardiovascular care", "Dr. Sarah Wilson"));
        map.put("neurology", saveDepartment("Neurology", "neurology", "Brain and nervous system", "Dr. Emily Parker"));
        map.put("orthopedics", saveDepartment("Orthopedics", "orthopedics", "Bone and joint care", "Dr. David Kumar"));
        map.put("pediatrics", saveDepartment("Pediatrics", "pediatrics", "Child healthcare", "Dr. Anna Martinez"));
        map.put("dermatology", saveDepartment("Dermatology", "dermatology", "Skin care specialists", "Dr. Jennifer White"));
        map.put("general", saveDepartment("General Medicine", "general", "Primary healthcare", "Dr. Thomas Brown"));
        return map;
    }

    private Department saveDepartment(String name, String code, String description, String head) {
        Department dept = new Department();
        dept.setName(name);
        dept.setCode(code);
        dept.setDescription(description);
        dept.setHead(head);
        return departmentRepository.save(dept);
    }

    private void seedAdmin() {
        User admin = new User();
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setEmail("admin@hms.com");
        admin.setPhone("+1 555-0000");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
    }

    private Doctor seedDemoDoctor(Department cardiology) {
        User user = new User();
        user.setFirstName("Sarah");
        user.setLastName("Wilson");
        user.setEmail("doctor@hms.com");
        user.setPhone("+1 555-0101");
        user.setPassword(passwordEncoder.encode("Doctor@123"));
        user.setRole(Role.DOCTOR);
        user = userRepository.save(user);

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setSpecialty("Cardiologist");
        doctor.setDepartment(cardiology);
        doctor.setStatus("ACTIVE");
        return doctorRepository.save(doctor);
    }

    private Patient seedDemoPatient(Doctor doctor) {
        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("patient@hms.com");
        user.setPhone("+1 555-0201");
        user.setPassword(passwordEncoder.encode("Patient@123"));
        user.setRole(Role.PATIENT);
        user = userRepository.save(user);

        Patient patient = new Patient();
        patient.setUser(user);
        patient.setAge(35);
        patient.setGender("Male");
        patient.setBloodGroup("A+");
        patient.setAddress("123 Health Street, Medical City");
        patient.setDateOfBirth(LocalDate.of(1991, 5, 15));
        patient.setStatus("OUTPATIENT");
        patient.setAssignedDoctor(doctor);
        return patientRepository.save(patient);
    }

    private void seedAdditionalDoctors(Map<String, Department> departments) {
        createDoctor("Michael", "Chen", "michael.c@hms.com", "+1 555-0102", "Cardiac Surgeon", departments.get("cardiology"));
        createDoctor("Emily", "Parker", "emily.p@hms.com", "+1 555-0103", "Neurologist", departments.get("neurology"));
        createDoctor("David", "Kumar", "david.k@hms.com", "+1 555-0104", "Orthopedic Surgeon", departments.get("orthopedics"));
        createDoctor("Anna", "Martinez", "anna.m@hms.com", "+1 555-0105", "Pediatrician", departments.get("pediatrics"));
        createDoctor("Jennifer", "White", "jennifer.w@hms.com", "+1 555-0106", "Dermatologist", departments.get("dermatology"));
        createDoctor("Thomas", "Brown", "thomas.b@hms.com", "+1 555-0107", "General Physician", departments.get("general"));
    }

    private void createDoctor(String firstName, String lastName, String email, String phone, String specialty, Department department) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode("Doctor@123"));
        user.setRole(Role.DOCTOR);
        user = userRepository.save(user);

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setSpecialty(specialty);
        doctor.setDepartment(department);
        doctor.setStatus("ACTIVE");
        doctorRepository.save(doctor);
    }

    private void seedAdditionalPatients() {
        createPatient("Emily", "Johnson", "emily.j@email.com", "+1 555-0202", 32, "Female", "O+", "ADMITTED");
        createPatient("Robert", "Williams", "robert.w@email.com", "+1 555-0203", 58, "Male", "B+", "CRITICAL");
        createPatient("Sarah", "Davis", "sarah.d@email.com", "+1 555-0204", 27, "Female", "AB+", "DISCHARGED");
        createPatient("Michael", "Brown", "michael.b@email.com", "+1 555-0205", 41, "Male", "O-", "ADMITTED");
    }

    private void createPatient(String firstName, String lastName, String email, String phone, int age, String gender, String blood, String status) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode("Patient@123"));
        user.setRole(Role.PATIENT);
        user = userRepository.save(user);

        Patient patient = new Patient();
        patient.setUser(user);
        patient.setAge(age);
        patient.setGender(gender);
        patient.setBloodGroup(blood);
        patient.setStatus(status);
        patientRepository.save(patient);
    }

    private void seedAppointments(Patient patient, Doctor doctor, Map<String, Department> departments) {
        createAppointment(patient, doctor, departments.get("cardiology"),
                LocalDate.now().plusDays(3), "09:00 AM", "Chest pain follow-up", AppointmentStatus.SCHEDULED);

        Doctor neurologyDoctor = doctorRepository.findAll().stream()
                .filter(d -> d.getDepartment().getCode().equals("neurology"))
                .findFirst().orElse(doctor);

        createAppointment(patient, neurologyDoctor, departments.get("neurology"),
                LocalDate.now().plusDays(7), "10:30 AM", "Headache consultation", AppointmentStatus.SCHEDULED);

        Patient emily = patientRepository.findAll().stream()
                .filter(p -> p.getUser().getEmail().equals("emily.j@email.com"))
                .findFirst().orElse(patient);

        createAppointment(emily, doctor, departments.get("cardiology"),
                LocalDate.now(), "02:00 PM", "Routine check-up", AppointmentStatus.COMPLETED);
    }

    private void createAppointment(Patient patient, Doctor doctor, Department department,
                                   LocalDate date, String time, String symptoms, AppointmentStatus status) {
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setDepartment(department);
        appointment.setAppointmentDate(date);
        appointment.setAppointmentTime(time);
        appointment.setSymptoms(symptoms);
        appointment.setAppointmentType("Consultation");
        appointment.setStatus(status);
        appointmentRepository.save(appointment);
    }
}
