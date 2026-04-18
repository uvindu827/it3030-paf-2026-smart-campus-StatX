package com.paf_project.smartcampus.dto;

import com.paf_project.smartcampus.model.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferenceDTO {
    
    private Long id;
    private NotificationType notificationType;
    private Boolean enabled;

    public static NotificationPreferenceDTO fromEntity(NotificationPreferenceDTO notificationPreferences){
        NotificationPreferenceDTO dto = new NotificationPreferenceDTO();
        dto.setId(notificationPreferences.getId());
        dto.setNotificationType(notificationPreferences.getNotificationType());
        dto.setEnabled(notificationPreferences.getEnabled());
        return dto;
    }
}
