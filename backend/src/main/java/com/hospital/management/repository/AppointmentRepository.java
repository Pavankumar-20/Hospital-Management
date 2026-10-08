package com.hospital.management.repository;

import com.hospital.management.model.Appointment;
import com.hospital.management.model.AppointmentStatus;
import com.hospital.management.model.Doctor;
import com.hospital.management.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(Patient patient);
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctor(Doctor doctor);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByAppointmentDate(LocalDate date);
    List<Appointment> findByStatus(AppointmentStatus status);
    long countByAppointmentDate(LocalDate date);
    long countByAppointmentDateAndStatus(LocalDate date, AppointmentStatus status);

    @Query("SELECT a.appointmentTime FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date AND a.status <> 'CANCELLED'")
    List<String> findBookedTimes(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);

    List<Appointment> findTop8ByOrderByCreatedAtDesc();
}
