package com.paf_project.smartcampus.dto;

import com.paf_project.smartcampus.model.NotificationPriority;
import com.paf_project.smartcampus.model.NotificationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateNotificationRequest {
    
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Notification type is required")
    private NotificationType type;

    @NotBlank(message = "Message cannot be empty")
    private String message;

    private Long referenceId;
    private String referenceType;

    private NotificationPriority priority = NotificationPriority.NORMAL; // Default priority
}
