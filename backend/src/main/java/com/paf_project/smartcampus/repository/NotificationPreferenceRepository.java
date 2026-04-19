package com.paf_project.smartcampus.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.paf_project.smartcampus.model.NotificationPreferences;
import com.paf_project.smartcampus.model.NotificationType;

@Repository
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreferences, Long> {
    
    List<NotificationPreferences> findByUser_UserId(Long userId);

    Optional<NotificationPreferences> findByUser_UserIdAndNotificationType(
        Long userId,
        NotificationType type
    );

    void deleteByUser_UserId(Long userId);

    boolean existsByUser_UserIdAndNotificationType(Long userId, NotificationType type);

}
