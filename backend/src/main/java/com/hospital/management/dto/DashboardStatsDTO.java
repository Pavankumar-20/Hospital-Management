package com.hospital.management.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {

    private long totalPatients;
    private long totalDoctors;
    private long todayAppointments;
    private long scheduledAppointments;
    private long completedAppointments;
    private long cancelledAppointments;
    private Map<String, Long> appointmentsByStatus;
    private Map<String, Long> patientsByDepartment;
    private Map<String, Long> doctorsByDepartment;
    private List<ActivityDTO> recentActivities;

    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }

    public long getTotalDoctors() { return totalDoctors; }
    public void setTotalDoctors(long totalDoctors) { this.totalDoctors = totalDoctors; }

    public long getTodayAppointments() { return todayAppointments; }
    public void setTodayAppointments(long todayAppointments) { this.todayAppointments = todayAppointments; }

    public long getScheduledAppointments() { return scheduledAppointments; }
    public void setScheduledAppointments(long scheduledAppointments) { this.scheduledAppointments = scheduledAppointments; }

    public long getCompletedAppointments() { return completedAppointments; }
    public void setCompletedAppointments(long completedAppointments) { this.completedAppointments = completedAppointments; }

    public long getCancelledAppointments() { return cancelledAppointments; }
    public void setCancelledAppointments(long cancelledAppointments) { this.cancelledAppointments = cancelledAppointments; }

    public Map<String, Long> getAppointmentsByStatus() { return appointmentsByStatus; }
    public void setAppointmentsByStatus(Map<String, Long> appointmentsByStatus) { this.appointmentsByStatus = appointmentsByStatus; }

    public Map<String, Long> getPatientsByDepartment() { return patientsByDepartment; }
    public void setPatientsByDepartment(Map<String, Long> patientsByDepartment) { this.patientsByDepartment = patientsByDepartment; }

    public Map<String, Long> getDoctorsByDepartment() { return doctorsByDepartment; }
    public void setDoctorsByDepartment(Map<String, Long> doctorsByDepartment) { this.doctorsByDepartment = doctorsByDepartment; }

    public List<ActivityDTO> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<ActivityDTO> recentActivities) { this.recentActivities = recentActivities; }
}
