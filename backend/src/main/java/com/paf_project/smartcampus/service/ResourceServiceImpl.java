package com.paf_project.smartcampus.service;

import com.paf_project.smartcampus.dto.ResourceRequestDTO;
import com.paf_project.smartcampus.dto.ResourceResponseDTO;
import com.paf_project.smartcampus.exception.DuplicateResourceException;
import com.paf_project.smartcampus.exception.ResourceNotFoundException;
import com.paf_project.smartcampus.model.Resource;
import com.paf_project.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Override
    public ResourceResponseDTO createResource(ResourceRequestDTO requestDTO) {
        log.info("Creating new resource with name: {}", requestDTO.getName());

        if (resourceRepository.existsByNameIgnoreCase(requestDTO.getName())) {
            throw new DuplicateResourceException("Resource with name '" + requestDTO.getName() + "' already exists.");
        }

        Resource resource = Resource.builder()
                .name(requestDTO.getName())
                .type(requestDTO.getType())
                .capacity(requestDTO.getCapacity())
                .location(requestDTO.getLocation())
                .description(requestDTO.getDescription())
                .availabilityWindows(requestDTO.getAvailabilityWindows())
                .imageUrl(requestDTO.getImageUrl())
                .status(requestDTO.getStatus() != null ? requestDTO.getStatus() : Resource.ResourceStatus.ACTIVE)
                .build();

        Resource saved = resourceRepository.save(resource);
        log.info("Resource created successfully with ID: {}", saved.getId());
        return mapToResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceResponseDTO getResourceById(Long id) {
        log.info("Fetching resource with ID: {}", id);
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));
        return mapToResponseDTO(resource);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponseDTO> getAllResources() {
        log.info("Fetching all resources");
        return resourceRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponseDTO> searchAndFilterResources(
            Resource.ResourceType type,
            Integer minCapacity,
            String location,
            Resource.ResourceStatus status,
            String keyword) {

        log.info("Searching resources with filters - type: {}, minCapacity: {}, location: {}, status: {}, keyword: {}",
                type, minCapacity, location, status, keyword);

        // If keyword search is provided, use name search
        if (keyword != null && !keyword.isBlank()) {
            return resourceRepository.findByNameContainingIgnoreCase(keyword)
                    .stream()
                    .map(this::mapToResponseDTO)
                    .collect(Collectors.toList());
        }

        return resourceRepository.findWithFilters(type, minCapacity, location, status)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResourceResponseDTO updateResource(Long id, ResourceRequestDTO requestDTO) {
        log.info("Updating resource with ID: {}", id);

        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));

        // Check name uniqueness only if name is being changed
        if (!resource.getName().equalsIgnoreCase(requestDTO.getName()) &&
                resourceRepository.existsByNameIgnoreCase(requestDTO.getName())) {
            throw new DuplicateResourceException("Resource with name '" + requestDTO.getName() + "' already exists.");
        }

        resource.setName(requestDTO.getName());
        resource.setType(requestDTO.getType());
        resource.setCapacity(requestDTO.getCapacity());
        resource.setLocation(requestDTO.getLocation());
        resource.setDescription(requestDTO.getDescription());
        resource.setAvailabilityWindows(requestDTO.getAvailabilityWindows());
        resource.setImageUrl(requestDTO.getImageUrl());
        if (requestDTO.getStatus() != null) {
            resource.setStatus(requestDTO.getStatus());
        }

        Resource updated = resourceRepository.save(resource);
        log.info("Resource updated successfully with ID: {}", updated.getId());
        return mapToResponseDTO(updated);
    }

    @Override
    public ResourceResponseDTO markAsOutOfService(Long id) {
        log.info("Marking resource ID: {} as OUT_OF_SERVICE", id);
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));
        resource.setStatus(Resource.ResourceStatus.OUT_OF_SERVICE);
        return mapToResponseDTO(resourceRepository.save(resource));
    }

    @Override
    public ResourceResponseDTO markAsActive(Long id) {
        log.info("Marking resource ID: {} as ACTIVE", id);
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));
        resource.setStatus(Resource.ResourceStatus.ACTIVE);
        return mapToResponseDTO(resourceRepository.save(resource));
    }

    @Override
    public void deleteResource(Long id) {
        log.info("Deleting resource with ID: {}", id);
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));
        resourceRepository.delete(resource);
        log.info("Resource deleted successfully with ID: {}", id);
    }

    // ─── Mapper ────────────────────────────────────────────────────────────────

    private ResourceResponseDTO mapToResponseDTO(Resource resource) {
        return ResourceResponseDTO.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .description(resource.getDescription())
                .availabilityWindows(resource.getAvailabilityWindows())
                .status(resource.getStatus())
                .imageUrl(resource.getImageUrl())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}