package com.hospital.management.dto;

public class AppointmentDTO {

    private Long id;
    private String appointmentCode;
    private Long patientId;
    private String patientName;
    private String patientCode;
    private Long doctorId;
    private String doctorName;
    private Long departmentId;
    private String department;
    private String departmentCode;
    private String date;
    private String time;
    private String symptoms;
    private String type;
    private String notes;
    private String status;
    private String patientAvatar;
    private String doctorAvatar;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAppointmentCode() { return appointmentCode; }
    public void setAppointmentCode(String appointmentCode) { this.appointmentCode = appointmentCode; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientCode() { return patientCode; }
    public void setPatientCode(String patientCode) { this.patientCode = patientCode; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPatientAvatar() { return patientAvatar; }
    public void setPatientAvatar(String patientAvatar) { this.patientAvatar = patientAvatar; }

    public String getDoctorAvatar() { return doctorAvatar; }
    public void setDoctorAvatar(String doctorAvatar) { this.doctorAvatar = doctorAvatar; }
}
