package com.paf_project.smartcampus.controller;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.paf_project.smartcampus.dto.CreateNotificationRequest;
import com.paf_project.smartcampus.dto.NotificationDTO;
import com.paf_project.smartcampus.model.NotificationType;
import com.paf_project.smartcampus.service.NotificationService;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// HATEOAS Imports
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.CollectionModel;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
@Tag(
    name = "Notifications",
    description = "End points for managing user notifications, including fetching, creating, marking as read, and deleting notifications."
)
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<NotificationDTO>>> getMyNotifications(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        PagedResourcesAssembler<NotificationDTO> assembler
    ) {
        log.info("Get-fetching notifications page {} with zise {}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationDTO> notifications = notificationService.getMyNotifications(pageable);

        PagedModel<EntityModel<NotificationDTO>> pagedModel = assembler.toModel(notifications, 
            dto -> EntityModel.of(dto,
                linkTo(methodOn(NotificationController.class).markAsRead(dto.getId())).withRel("mark_read"),
                linkTo(methodOn(NotificationController.class).deleteNotification(dto.getId())).withRel("delete")
            )
        );
        
        log.info("Found {} notifications for current user", notifications.getTotalElements());

        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(30, TimeUnit.SECONDS))
                .body(pagedModel);
    }

    @GetMapping("/by-type")
    public ResponseEntity<Page<NotificationDTO>> getNotificationsByType(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam NotificationType type
    ) {
        log.info("GET-fetching notifications by type {}", type);
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationDTO> notifications = notificationService.getNotificationsByType(type, pageable);

        log.info("Found {} notifications of type {}", notifications.getTotalElements(), type);

        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(1, TimeUnit.MINUTES))
                .body(notifications);
    }
    
    @PostMapping
    public ResponseEntity<EntityModel<NotificationDTO>> createNotification(
        @RequestBody CreateNotificationRequest request
    ) {
        log.info("POST-creating notifications {}", request);
        NotificationDTO createdNotification = notificationService.createNotification(request);

        if(createdNotification == null) {
            log.warn("Notification is not created - user has disabled notifications type");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // Constraint: Uniform Interface
        }

        log.info("Notification created with id {}", createdNotification.getId());
        
        // HATEOAS: Adding self-descriptive links to the response
        EntityModel<NotificationDTO> resource = EntityModel.of(createdNotification);
        resource.add(linkTo(methodOn(NotificationController.class).createNotification(request)).withSelfRel());
        resource.add(linkTo(methodOn(NotificationController.class).deleteNotification(createdNotification.getId())).withRel("delete"));

        return ResponseEntity.status(HttpStatus.CREATED).body(resource);
    }

    @GetMapping("/unread")
    public ResponseEntity<CollectionModel<NotificationDTO>> getUnreadNotifications(){
        log.info("GET_fetching unread notifications");
        List<NotificationDTO> unreadNotifications = notificationService.getMyUnreadNotifications();
        log.info("Found {} unread notifications", unreadNotifications.size());

        // HATEOAS: CollectionModel for list of resources
        CollectionModel<NotificationDTO> collectionModel = CollectionModel.of(unreadNotifications);
        collectionModel.add(linkTo(methodOn(NotificationController.class).getUnreadNotifications()).withSelfRel());

        return ResponseEntity.ok(collectionModel);
    }

    @GetMapping("/counts/unread") // REST Fix: Resource-based naming (Noun instead of Verb)
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        log.info("GET_fetching unread notifications count");
        Long unreadCount = notificationService.getUnreadCount();
        log.info("found {} unread notifications", unreadCount);

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noCache()) // Counts should not be cached
                .body(Map.of("count", unreadCount));
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
        @Parameter(description = "Notifications ID", example = "1")
        @PathVariable Long id
    ){
        log.info("PUT-marking notification as read");
        notificationService.markAsRead(id);
        log.info("Notification {} marked as read", id);

        return ResponseEntity.noContent().build(); // Constraint: Uniform Interface (204 No Content)
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead() {
        log.info("PUT-marking all notifications as read");
        notificationService.markAllAsRead();
        log.info("All notifications marked as read");

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
        @Parameter(description = "Notifications ID", example = "1")
        @PathVariable Long id
    ){
        log.info("DELETE-deleting notification {}", id);
        notificationService.deleteNotification(id);
        log.info("Notification {} deleted successfully", id);

        return ResponseEntity.noContent().build(); // Constraint: Uniform Interface
    }
}