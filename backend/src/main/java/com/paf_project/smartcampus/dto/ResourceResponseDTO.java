package com.paf_project.smartcampus.dto;

import com.paf_project.smartcampus.model.Resource;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceResponseDTO {

    private Long id;
    private String name;
    private Resource.ResourceType type;
    private Integer capacity;
    private String location;
    private String description;
    private String availabilityWindows;
    private Resource.ResourceStatus status;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}