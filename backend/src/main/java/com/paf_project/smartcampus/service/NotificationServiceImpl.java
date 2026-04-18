package com.paf_project.smartcampus.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.paf_project.smartcampus.dto.CreateNotificationRequest;
import com.paf_project.smartcampus.dto.NotificationDTO;
import com.paf_project.smartcampus.model.NotificationPreferences;
import com.paf_project.smartcampus.model.Notification;
import com.paf_project.smartcampus.model.NotificationType;
import com.paf_project.smartcampus.model.User;
import com.paf_project.smartcampus.repository.NotificationPreferenceRepository;
import com.paf_project.smartcampus.repository.NotificationRepository;
import com.paf_project.smartcampus.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository notificationPreferenceRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Override
    @Transactional
    public NotificationDTO createNotification(CreateNotificationRequest request) {
        log.info("creating notification of type {} for user {}", request.getType(), request.getUserId());

        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found with id:" + request.getUserId()));

        if(!shouldSendNotification(user.getUserId(), request.getType())){
            log.info("User {} has diabled notification for {}", user.getUserId(), request.getType());
            return null;
        }

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(request.getType());
        notification.setMessage(request.getMessage());
        notification.setReferenceId(request.getReferenceId());
        notification.setReferenceType(request.getReferenceType());
        notification.setPriority(request.getPriority());
        notification.setIsRead(false);

        Notification savedNotification = notificationRepository.save(notification);

        log.info("Notification created successfully with Id: {}", savedNotification.getId());

        return NotificationDTO.fromEntity(savedNotification);
    }

    //Helper method find the user's notification preferences 
    public boolean shouldSendNotification(Long userID, NotificationType type) {
        Optional<NotificationPreferences> preference = 
            notificationPreferenceRepository.findByUser_UserIdAndNotificationType(userID, type);

        return preference.map(NotificationPreferences::getEnabled)
            .orElse(true);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getMyNotifications(Pageable pageable) {
        
        User currentUser = getCurrentUser();
        Page<Notification> notifications = 
            notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(
                currentUser.getUserId(), 
                pageable
            );

        return notifications.map(NotificationDTO::fromEntity);

    }

    @Override
    public List<NotificationDTO> getMyUnreadNotifications() {
        
        User currentUser = getCurrentUser();
        List<Notification> unreadNotifications = 
            notificationRepository.findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(currentUser.getUserId());
        
        return unreadNotifications.stream()
            .map(NotificationDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    public Long getUnreadCount() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getUnreadCount'");
    }

    @Override
    public void markAsRead(Long notificationId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'markAsRead'");
    }

    @Override
    public void markAllAsRead() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'markAllAsRead'");
    }

    @Override
    public void deleteNotification(Long notificationId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteNotification'");
    }

    @Override
    public Page<NotificationDTO> getNotificationsByType(NotificationType type, Pageable pageable) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getNotificationsByType'");
    }
    
}
