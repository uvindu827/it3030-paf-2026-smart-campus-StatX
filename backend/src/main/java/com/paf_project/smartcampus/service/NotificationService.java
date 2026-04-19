package com.paf_project.smartcampus.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.paf_project.smartcampus.dto.CreateNotificationRequest;
import com.paf_project.smartcampus.dto.NotificationDTO;
import com.paf_project.smartcampus.model.NotificationType;

public interface NotificationService {
    
    NotificationDTO createNotification(CreateNotificationRequest request);
 
    Page<NotificationDTO> getMyNotifications(Pageable pageable);
 
    List<NotificationDTO> getMyUnreadNotifications();
 
    Long getUnreadCount();
 
    void markAsRead(Long notificationId);
 
    void markAllAsRead();
 
    void deleteNotification(Long notificationId);
 
    Page<NotificationDTO> getNotificationsByType(NotificationType type, Pageable pageable);
}
