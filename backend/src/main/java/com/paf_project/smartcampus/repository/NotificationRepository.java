package com.paf_project.smartcampus.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.paf_project.smartcampus.model.Notification;
import com.paf_project.smartcampus.model.NotificationType;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>{
    
    Page<Notification> findByUser_UserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<Notification> findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

    Long countByUser_UserIdAndIsReadFalse(Long userId);

    Page<Notification> findByUser_UserIdAndTypeOrderByCreatedAtDesc(
            Long userId, 
            NotificationType type, 
            Pageable pageable
    );

    List<Notification> findByUser_UserIdAndCreatedAtAfterOrderByCreatedAtDesc(
            Long userId, 
            LocalDateTime since
    );

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.userId = :userId AND n.isRead = false")
    void markAllAsReadByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.isRead = true AND n.createdAt < :before")
    void deleteReadNotificationsOlderThan(@Param("before") LocalDateTime before);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.user.userId = :userId")
    void deleteByUserId(@Param("userId") Long userId);

    List<Notification> findByReferenceIdAndReferenceType(Long referenceId, String referenceType);
}

