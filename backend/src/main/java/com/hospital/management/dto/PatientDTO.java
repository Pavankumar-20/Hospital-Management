package com.hospital.management.dto;

public class PatientDTO {

    private Long id;
    private Long userId;
    private String patientCode;
    private String name;
    private String email;
    private String phone;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String address;
    private String dateOfBirth;
    private String status;
    private String assignedDoctorName;
    private Long assignedDoctorId;
    private String avatarUrl;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPatientCode() { return patientCode; }
    public void setPatientCode(String patientCode) { this.patientCode = patientCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedDoctorName() { return assignedDoctorName; }
    public void setAssignedDoctorName(String assignedDoctorName) { this.assignedDoctorName = assignedDoctorName; }

    public Long getAssignedDoctorId() { return assignedDoctorId; }
    public void setAssignedDoctorId(Long assignedDoctorId) { this.assignedDoctorId = assignedDoctorId; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
