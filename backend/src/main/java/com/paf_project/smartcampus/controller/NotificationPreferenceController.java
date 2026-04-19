package com.paf_project.smartcampus.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paf_project.smartcampus.dto.NotificationPreferenceDTO;
import com.paf_project.smartcampus.dto.UpdatePreferenceRequest;
import com.paf_project.smartcampus.model.NotificationType;
import com.paf_project.smartcampus.service.NotificationPreferencesService;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;



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

    @PutMapping
    public ResponseEntity<Void> updatePreferences( 
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Map of notification types and their enabled status",
            required = true,
            content = @Content(schema = @Schema(implementation = UpdatePreferenceRequest.class))
        )
        @Valid
        @RequestBody UpdatePreferenceRequest request
    ) {
        log.info("PUT-updating user notification preferences: {}", request);

        notificationPreferencesService.updateMyPreferences(request);

        log.info("User notification preferences updated successfully");

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{type}/enable")
    public ResponseEntity<Void> enableNotificationType(
        @Parameter(description = "Notification type to enable", example = "BOOKING_APPROVED")
        @PathVariable NotificationType type
    ) {
        
        log.info("PUT-enabling notification type: {}", type);

        notificationPreferencesService.enableNotificationType(type);

        log.info("Notification type {} enabled successfully", type);
        
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{type}/enable")
    public ResponseEntity<Void> disableNotificationType(
        @Parameter(description = "Notification type to disable", example = "BOOKING_APPROVED")
        @PathVariable NotificationType type
    ) {
        
        log.info("PUT-disabling notification type: {}", type);

        notificationPreferencesService.disableNotificationType(type);

        log.info("Notification type {} disabled successfully", type);
        
        return ResponseEntity.ok().build();
    }
    

}
