package com.paf_project.smartcampus.dto;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import com.paf_project.smartcampus.model.Notification;
import com.paf_project.smartcampus.model.NotificationPriority;
import com.paf_project.smartcampus.model.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * RESTful NotificationDTO with HATEOAS Links
 * 
 * Level 3 REST - Includes hypermedia links to related resources
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    
    private Long id;
    private NotificationType type;
    private String message;
    private Long referenceId;
    private String referenceType;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private NotificationPriority priority;
    private Long userId;
    private String userEmail;
    
    // HATEOAS Links
    private Map<String, String> _links;

    public static NotificationDTO fromEntity(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setType(notification.getType());
        dto.setMessage(notification.getMessage());
        dto.setReferenceId(notification.getReferenceId());
        dto.setReferenceType(notification.getReferenceType());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setPriority(notification.getPriority());
        
        if (notification.getUser() != null) {
            dto.setUserId(notification.getUser().getUserId());
            dto.setUserEmail(notification.getUser().getEmail());
        }
        
        // Add HATEOAS links
        dto.set_links(buildLinks(notification));
        
        return dto;
    }

    private static Map<String, String> buildLinks(Notification notification) {
        Map<String, String> links = new HashMap<>();
        Long id = notification.getId();
        
        // Self link
        links.put("self", "/api/v1/notifications/" + id);
        
        // Mark as read (if unread)
        if (!notification.getIsRead()) {
            links.put("markAsRead", "/api/v1/notifications/" + id + "/read");
        }
        
        // Delete link
        links.put("delete", "/api/v1/notifications/" + id);
        
        // Reference link (if available)
        if (notification.getReferenceType() != null && notification.getReferenceId() != null) {
            String refType = notification.getReferenceType().toLowerCase();
            links.put("reference", "/api/v1/" + refType + "s/" + notification.getReferenceId());
        }
        
        return links;
    }
}