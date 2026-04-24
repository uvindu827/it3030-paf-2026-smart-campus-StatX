package com.paf_project.smartcampus.service;

import org.springframework.stereotype.Service;

import com.paf_project.smartcampus.dto.CreateNotificationRequest;
import com.paf_project.smartcampus.model.NotificationPriority;
import com.paf_project.smartcampus.model.NotificationType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationHelper {
    
    private final NotificationService notificationService;

    private void createNotification(
        Long userId,
        NotificationType type,
        String message,
        Long referenceId,
        String referenceType,
        NotificationPriority priority) {

        CreateNotificationRequest request = new CreateNotificationRequest(
            userId,
            type,
            message,
            referenceId,
            referenceType,
            priority
        );

        try {
            notificationService.createNotification(request);
            log.info("Notification created successfully: {} for user {}", type, userId);
        } catch (Exception e) {
            log.error("Failed to create notification: {} for user {}", type, userId, e);
        }
    }

    //ticket notifications
    public void notifyTicketStatusUpdate(
        Long userId, 
        Long ticketId, 
        String newStatus
    ){

        log.info("Creating ticket status update notification for user {} and ticket {}", userId, ticketId);

        String message = String.format(
            "Your ticket #%d status has been updated to: %s",
            ticketId,
            newStatus
        );

        createNotification(
            userId, 
            NotificationType.TICKET_STATUS_CHANGED, 
            message, 
            ticketId, 
            "TICKET", 
            NotificationPriority.NORMAL
        );
        
    }

    //booking notifications
    public void notifyBookingApproved(
        Long userId, 
        Long bookingId, 
        String resourceName,
        String bookingDate
    ){

        log.info("Creating booking approved notification for user {} and booking {}", userId, bookingId);

        String message = String.format(
            "Your booking for %s on %s has been approved",
            resourceName,
            bookingDate
        );

        createNotification(
            userId, 
            NotificationType.BOOKING_APPROVED, 
            message, 
            bookingId, 
            "BOOKING", 
            NotificationPriority.NORMAL
        );

    }

    public void notifyBookingRejected(
        Long userId,
        Long bookingId,
        String resourceName,
        String reason
    ){
        log.info("Creating booking rejected notification for user {} and booking {}", userId, bookingId);

        String message = String.format(
            "Your booking for %s has been rejected. Reason: %s",
            resourceName,
            reason
        );

        createNotification(
            userId,
            NotificationType.BOOKING_REJECTED,
            message,
            bookingId,
            "BOOKING",
            NotificationPriority.HIGH
        );
    }

     public void notifyBookingcancelled(
        Long userId,
        Long bookingId,
        String resourceName
    ){
        log.info("Creating booking cancelled notification for user {} and booking {}", userId, bookingId);

        String message = String.format(
            "Your booking for %s has been cancelled.",
            resourceName
        );

        createNotification(
            userId,
            NotificationType.BOOKING_CANCELLED,
            message,
            bookingId,
            "BOOKING",
            NotificationPriority.NORMAL
        );
    }



}
