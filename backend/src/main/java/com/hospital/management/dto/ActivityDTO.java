package com.hospital.management.dto;

import java.time.LocalDateTime;

public class ActivityDTO {

    private String title;
    private String description;
    private String iconType;
    private LocalDateTime createdAt;

    public ActivityDTO() {}

    public ActivityDTO(String title, String description, String iconType, LocalDateTime createdAt) {
        this.title = title;
        this.description = description;
        this.iconType = iconType;
        this.createdAt = createdAt;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIconType() { return iconType; }
    public void setIconType(String iconType) { this.iconType = iconType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
