package com.hospital.management.dto;

public class AuthResponse {

    private Long id;
    private Long profileId;
    private String email;
    private String name;
    private String role;
    private String message;

    public AuthResponse() {}

    public AuthResponse(Long id, Long profileId, String email, String name, String role) {
        this.id = id;
        this.profileId = profileId;
        this.email = email;
        this.name = name;
        this.role = role;
        this.message = "Login successful";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProfileId() { return profileId; }
    public void setProfileId(Long profileId) { this.profileId = profileId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
