package com.paf_project.smartcampus.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paf_project.smartcampus.dto.NotificationPreferenceDTO;
import com.paf_project.smartcampus.service.NotificationPreferencesService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/notifications/preferences")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
@Tag(
    name = "Notification Preferences",
    description = "Settings for managing user notification preferences"
)
@SecurityRequirement(name = "bearerAuth")
public class NotificationPreferenceController {
    
    private final NotificationPreferencesService notificationPreferencesService;

    @GetMapping()
    public ResponseEntity<List<NotificationPreferenceDTO>> getMyPreferences() {
        
        log.info("GET-fetching user notification preferences");

        List<NotificationPreferenceDTO> preferences = notificationPreferencesService.getMyPreferences();

        log.info("Found {} preferences for current user", preferences.size());

        return ResponseEntity.ok(preferences);
    }
    

}
