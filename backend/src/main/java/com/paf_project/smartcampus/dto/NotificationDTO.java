package com.paf_project.smartcampus.dto;

import java.time.LocalDateTime;

import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.server.core.Relation;

import com.paf_project.smartcampus.model.Notification;
import com.paf_project.smartcampus.model.NotificationPriority;
import com.paf_project.smartcampus.model.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Relation(collectionRelation = "notifications", itemRelation = "notification")
public class NotificationDTO extends RepresentationModel<NotificationDTO> {
    
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
                       
        return dto;
    }

}