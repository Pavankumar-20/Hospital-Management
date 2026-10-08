package com.hospital.management.service;

import com.hospital.management.dto.ActivityDTO;
import com.hospital.management.dto.DashboardStatsDTO;
import com.hospital.management.model.Appointment;
import com.hospital.management.model.AppointmentStatus;
import com.hospital.management.model.Department;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.DepartmentRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final DepartmentRepository departmentRepository;

    public DashboardService(PatientRepository patientRepository,
                            DoctorRepository doctorRepository,
                            AppointmentRepository appointmentRepository,
                            DepartmentRepository departmentRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.departmentRepository = departmentRepository;
    }

    public DashboardStatsDTO getAdminStats() {
        LocalDate today = LocalDate.now();
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalPatients(patientRepository.count());
        stats.setTotalDoctors(doctorRepository.count());
        stats.setTodayAppointments(appointmentRepository.countByAppointmentDate(today));
        stats.setScheduledAppointments(appointmentRepository.countByAppointmentDateAndStatus(today, AppointmentStatus.SCHEDULED));
        stats.setCompletedAppointments(appointmentRepository.countByAppointmentDateAndStatus(today, AppointmentStatus.COMPLETED));
        stats.setCancelledAppointments(appointmentRepository.countByAppointmentDateAndStatus(today, AppointmentStatus.CANCELLED));

        Map<String, Long> byStatus = new HashMap<>();
        for (AppointmentStatus status : AppointmentStatus.values()) {
            byStatus.put(status.name().toLowerCase(), appointmentRepository.findByStatus(status).size());
        }
        stats.setAppointmentsByStatus(byStatus);
        stats.setDoctorsByDepartment(buildDoctorsByDepartment());
        stats.setPatientsByDepartment(buildPatientsByDepartment());
        stats.setRecentActivities(buildRecentActivities());
        return stats;
    }

    private Map<String, Long> buildDoctorsByDepartment() {
        Map<String, Long> map = new LinkedHashMap<>();
        for (Department department : departmentRepository.findAll()) {
            long count = doctorRepository.findByDepartment(department).size();
            map.put(department.getName(), count);
        }
        return map;
    }

    private Map<String, Long> buildPatientsByDepartment() {
        Map<String, Long> map = new LinkedHashMap<>();
        for (Department department : departmentRepository.findAll()) {
            long count = appointmentRepository.findAll().stream()
                    .filter(a -> a.getDepartment().getId().equals(department.getId()))
                    .map(a -> a.getPatient().getId())
                    .distinct()
                    .count();
            map.put(department.getName(), count);
        }
        return map;
    }

    private List<ActivityDTO> buildRecentActivities() {
        return appointmentRepository.findTop8ByOrderByCreatedAtDesc().stream()
                .map(this::toActivity)
                .toList();
    }

    private ActivityDTO toActivity(Appointment appointment) {
        String patientName = appointment.getPatient().getUser().getFullName();
        String doctorName = appointment.getDoctor().getUser().getFullName();
        String dept = appointment.getDepartment().getName();

        return switch (appointment.getStatus()) {
            case COMPLETED -> new ActivityDTO(
                    "Appointment completed",
                    doctorName + " — " + patientName + " (" + dept + ")",
                    "green",
                    appointment.getCreatedAt()
            );
            case CANCELLED -> new ActivityDTO(
                    "Appointment cancelled",
                    patientName + " — " + dept,
                    "orange",
                    appointment.getCreatedAt()
            );
            default -> new ActivityDTO(
                    "New appointment scheduled",
                    patientName + " with " + doctorName + " — " + dept,
                    "blue",
                    appointment.getCreatedAt()
            );
        };
    }
}
