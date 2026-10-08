package com.hospital.management.util;

import com.hospital.management.dto.AppointmentDTO;
import com.hospital.management.dto.DoctorDTO;
import com.hospital.management.dto.PatientDTO;
import com.hospital.management.model.Appointment;
import com.hospital.management.model.Doctor;
import com.hospital.management.model.Patient;

public final class DtoMapper {

    private static final String DEFAULT_AVATAR = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop";
    private static final String DOCTOR_AVATAR = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop";
    private static final String PATIENT_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop";

    private DtoMapper() {}

    public static PatientDTO toPatientDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setUserId(patient.getUser().getId());
        dto.setPatientCode(patient.getPatientCode());
        dto.setName(patient.getUser().getFullName());
        dto.setEmail(patient.getUser().getEmail());
        dto.setPhone(patient.getUser().getPhone());
        dto.setAge(patient.getAge());
        dto.setGender(patient.getGender());
        dto.setBloodGroup(patient.getBloodGroup());
        dto.setAddress(patient.getAddress());
        dto.setDateOfBirth(patient.getDateOfBirth() != null ? patient.getDateOfBirth().toString() : null);
        dto.setStatus(patient.getStatus());
        dto.setAvatarUrl(PATIENT_AVATAR);
        if (patient.getAssignedDoctor() != null) {
            dto.setAssignedDoctorId(patient.getAssignedDoctor().getId());
            dto.setAssignedDoctorName(patient.getAssignedDoctor().getUser().getFullName());
        }
        return dto;
    }

    public static DoctorDTO toDoctorDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setUserId(doctor.getUser().getId());
        dto.setName(doctor.getUser().getFullName());
        dto.setEmail(doctor.getUser().getEmail());
        dto.setPhone(doctor.getUser().getPhone());
        dto.setSpecialty(doctor.getSpecialty());
        dto.setStatus(doctor.getStatus());
        dto.setAvatarUrl(DOCTOR_AVATAR);
        if (doctor.getDepartment() != null) {
            dto.setDepartmentId(doctor.getDepartment().getId());
            dto.setDepartment(doctor.getDepartment().getName());
            dto.setDepartmentCode(doctor.getDepartment().getCode());
        }
        return dto;
    }

    public static AppointmentDTO toAppointmentDTO(Appointment appointment) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(appointment.getId());
        dto.setAppointmentCode(appointment.getAppointmentCode());
        dto.setPatientId(appointment.getPatient().getId());
        dto.setPatientName(appointment.getPatient().getUser().getFullName());
        dto.setPatientCode(appointment.getPatient().getPatientCode());
        dto.setDoctorId(appointment.getDoctor().getId());
        dto.setDoctorName(appointment.getDoctor().getUser().getFullName());
        dto.setDepartmentId(appointment.getDepartment().getId());
        dto.setDepartment(appointment.getDepartment().getName());
        dto.setDepartmentCode(appointment.getDepartment().getCode());
        dto.setDate(appointment.getAppointmentDate().toString());
        dto.setTime(appointment.getAppointmentTime());
        dto.setSymptoms(appointment.getSymptoms());
        dto.setType(appointment.getAppointmentType());
        dto.setNotes(appointment.getNotes());
        dto.setStatus(appointment.getStatus().name().toLowerCase());
        dto.setPatientAvatar(PATIENT_AVATAR);
        dto.setDoctorAvatar(DOCTOR_AVATAR);
        return dto;
    }
}
