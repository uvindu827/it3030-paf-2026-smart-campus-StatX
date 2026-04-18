package com.paf_project.smartcampus.controller;

import com.paf_project.smartcampus.dto.ResourceRequestDTO;
import com.paf_project.smartcampus.dto.ResourceResponseDTO;
import com.paf_project.smartcampus.model.Resource;
import com.paf_project.smartcampus.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Facilities & Assets Catalogue (Module A)
 * Base URL: /api/v1/resources
 *
 * Endpoints:
 *  GET    /api/v1/resources              - Get all resources (with optional filters)
 *  GET    /api/v1/resources/{id}         - Get resource by ID
 *  POST   /api/v1/resources              - Create new resource (ADMIN only)
 *  PUT    /api/v1/resources/{id}         - Update resource (ADMIN only)
 *  DELETE /api/v1/resources/{id}         - Delete resource (ADMIN only)
 *  PATCH  /api/v1/resources/{id}/status  - Update resource status (ADMIN only)
 */
@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService resourceService;

    // ─── GET ALL / SEARCH / FILTER ──────────────────────────────────────────────

    /**
     * GET /api/v1/resources
     * Optional query params: type, minCapacity, location, status, keyword
     * Accessible by: ALL authenticated users
     */
    @GetMapping
    public ResponseEntity<List<ResourceResponseDTO>> getAllResources(
            @RequestParam(required = false) Resource.ResourceType type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Resource.ResourceStatus status,
            @RequestParam(required = false) String keyword
    ) {
        boolean hasFilter = type != null || minCapacity != null || location != null
                || status != null || keyword != null;

        List<ResourceResponseDTO> resources = hasFilter
                ? resourceService.searchAndFilterResources(type, minCapacity, location, status, keyword)
                : resourceService.getAllResources();

        return ResponseEntity.ok(resources);
    }

    // ─── GET BY ID ───────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/resources/{id}
     * Accessible by: ALL authenticated users
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────────

    /**
     * POST /api/v1/resources
     * Accessible by: ADMIN only
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDTO> createResource(
            @Valid @RequestBody ResourceRequestDTO requestDTO) {
        ResourceResponseDTO created = resourceService.createResource(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────────

    /**
     * PUT /api/v1/resources/{id}
     * Accessible by: ADMIN only
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDTO> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequestDTO requestDTO) {
        return ResponseEntity.ok(resourceService.updateResource(id, requestDTO));
    }

    // ─── PATCH STATUS ─────────────────────────────────────────────────────────

    /**
     * PATCH /api/v1/resources/{id}/status?action=out-of-service|active
     * Accessible by: ADMIN only
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam String action) {
        ResourceResponseDTO updated = switch (action.toLowerCase()) {
            case "out-of-service" -> resourceService.markAsOutOfService(id);
            case "active" -> resourceService.markAsActive(id);
            default -> throw new IllegalArgumentException("Invalid action. Use 'active' or 'out-of-service'");
        };
        return ResponseEntity.ok(updated);
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────────

    /**
     * DELETE /api/v1/resources/{id}
     * Accessible by: ADMIN only
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}