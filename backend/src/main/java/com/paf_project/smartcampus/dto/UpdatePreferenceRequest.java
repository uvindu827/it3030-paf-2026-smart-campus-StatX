package com.paf_project.smartcampus.dto;

import java.util.Map;

import com.paf_project.smartcampus.model.NotificationType;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePreferenceRequest {
    
    @NotNull(message = "Preferences map required")
    private Map<NotificationType, Boolean> preferences;
}
