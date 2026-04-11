package com.paf_project.smartcampus.service;

import com.paf_project.smartcampus.dto.ResourceRequestDTO;
import com.paf_project.smartcampus.dto.ResourceResponseDTO;
import com.paf_project.smartcampus.model.Resource;

import java.util.List;

public interface ResourceService {

    ResourceResponseDTO createResource(ResourceRequestDTO requestDTO);

    ResourceResponseDTO getResourceById(Long id);

    List<ResourceResponseDTO> getAllResources();

    List<ResourceResponseDTO> searchAndFilterResources(
            Resource.ResourceType type,
            Integer minCapacity,
            String location,
            Resource.ResourceStatus status,
            String keyword
    );

    ResourceResponseDTO updateResource(Long id, ResourceRequestDTO requestDTO);

    ResourceResponseDTO markAsOutOfService(Long id);

    ResourceResponseDTO markAsActive(Long id);

    void deleteResource(Long id);
}