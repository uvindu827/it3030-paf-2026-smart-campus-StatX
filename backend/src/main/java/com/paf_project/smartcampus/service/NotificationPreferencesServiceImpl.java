package com.paf_project.smartcampus.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.paf_project.smartcampus.dto.NotificationPreferenceDTO;
import com.paf_project.smartcampus.dto.UpdatePreferenceRequest;
import com.paf_project.smartcampus.model.NotificationPreferences;
import com.paf_project.smartcampus.model.NotificationType;
import com.paf_project.smartcampus.model.User;
import com.paf_project.smartcampus.repository.NotificationPreferenceRepository;
import com.paf_project.smartcampus.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationPreferencesServiceImpl implements NotificationPreferencesService {

    private final NotificationPreferenceRepository notificationPreferenceRepository;
    private final UserRepository userRepository;

    private User getCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not fount with email"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationPreferenceDTO> getMyPreferences() {
        User currentUser = getCurrentUser();

        List<NotificationPreferences> preferences = notificationPreferenceRepository.findByUser_UserId(currentUser.getUserId());

        if(preferences.isEmpty()){
            log.info("No preferences found for user: {}", currentUser.getEmail());
             return getDefaultPreferences();    
        }

        return preferences.stream()
            .map(NotificationPreferenceDTO::fromEntity)
            .collect(Collectors.toList());
    }

    private List<NotificationPreferenceDTO> getDefaultPreferences(){

        List<NotificationPreferenceDTO> defaults = new ArrayList<>();

        for (NotificationType type : NotificationType.values()){
            defaults.add(new NotificationPreferenceDTO(null, type, true));
        }

        return defaults;

    }

    @Override
    @Transactional
    public void updateMyPreferences(UpdatePreferenceRequest request) {
        User currentUser = getCurrentUser();

        log.info("Updating preferences fro user {} : {}", currentUser.getUserId(), request.getPreferences());

        for(Map.Entry<NotificationType, Boolean> entry : request.getPreferences().entrySet()){
            NotificationType type = entry.getKey();
            Boolean enabled = entry.getValue();

            NotificationPreferences preference = notificationPreferenceRepository
                .findByUser_UserIdAndNotificationType(currentUser.getUserId(), type)
                .orElse(new NotificationPreferences(currentUser, type, enabled));

            preference.setEnabled(enabled);

            notificationPreferenceRepository.save(preference);
        }
    }

    @Override
    public void enableNotificationType(NotificationType type) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'enableNotificationType'");
    }

    @Override
    public void disableNotificationType(NotificationType type) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'disableNotificationType'");
    }

    @Override
    public void resetToDefaultPreferences() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'resetToDefaultPreferences'");
    }
    
}
