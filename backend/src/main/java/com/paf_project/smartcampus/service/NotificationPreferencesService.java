package com.paf_project.smartcampus.service;

import java.util.List;

import com.paf_project.smartcampus.dto.NotificationPreferenceDTO;
import com.paf_project.smartcampus.dto.UpdatePreferenceRequest;
import com.paf_project.smartcampus.model.NotificationType;

public interface NotificationPreferencesService {

    List<NotificationPreferenceDTO> getMyPreferences();

    void updateMyPreferences(UpdatePreferenceRequest request);

    void enableNotificationType(NotificationType type);

    void disableNotificationType(NotificationType type);

    void resetToDefaultPreferences();
    
}
