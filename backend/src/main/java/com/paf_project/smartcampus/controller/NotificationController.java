package com.paf_project.smartcampus.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paf_project.smartcampus.dto.CreateNotificationRequest;
import com.paf_project.smartcampus.dto.NotificationDTO;
import com.paf_project.smartcampus.service.NotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<NotificationDTO>> getMyNotifications(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        log.info("Get-fetching notifications page {} with zise {}", page, size);

        Pageable pageable = PageRequest.of(page, size);

        Page<NotificationDTO> notifications = notificationService.getMyNotifications(pageable);

        log.info("Found {} notifications for current user", notifications.getTotalElements());

        return ResponseEntity.ok(notifications);
    }

    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(
        @RequestBody CreateNotificationRequest request
    ) {
        
        log.info("POST-creating notifications {}", request);

        NotificationDTO createdNotification = notificationService.createNotification(request);

        if(createdNotification == null) {
            log.warn("Notification is not created - user has disabled notifications type");

            return ResponseEntity.ok(null);
        }

        log.info("Notification created with id {}", createdNotification.getId());
        
        return ResponseEntity.status(201).body(createdNotification);
    }
    
    
    
}
