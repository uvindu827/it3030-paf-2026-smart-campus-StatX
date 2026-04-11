package com.paf_project.smartcampus.repository;

import com.paf_project.smartcampus.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    // Search by type
    List<Resource> findByType(Resource.ResourceType type);

    // Filter by status
    List<Resource> findByStatus(Resource.ResourceStatus status);

    // Filter by minimum capacity
    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);

    // Filter by location (case-insensitive contains)
    List<Resource> findByLocationContainingIgnoreCase(String location);

    // Combined search: type + status
    List<Resource> findByTypeAndStatus(Resource.ResourceType type, Resource.ResourceStatus status);

    // Full flexible filter query
    @Query("SELECT r FROM Resource r WHERE " +
           "(:type IS NULL OR r.type = :type) AND " +
           "(:minCapacity IS NULL OR r.capacity >= :minCapacity) AND " +
           "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:status IS NULL OR r.status = :status)")
    List<Resource> findWithFilters(
            @Param("type") Resource.ResourceType type,
            @Param("minCapacity") Integer minCapacity,
            @Param("location") String location,
            @Param("status") Resource.ResourceStatus status
    );

    // Search by name keyword
    List<Resource> findByNameContainingIgnoreCase(String keyword);

    // Check if name already exists (for duplicate prevention)
    boolean existsByNameIgnoreCase(String name);
}