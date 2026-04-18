package com.paf_project.smartcampus.dto;

import com.paf_project.smartcampus.model.TicketPriority;
import com.paf_project.smartcampus.model.TicketStatus;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponseDTO {
    private Long id;
    private Long resourceId;
    private Long reportedByUserId;
    private Long assignedTechnicianId;
    private String category;
    private String description;
    private TicketPriority priority;
    private String preferredContactDetails;
    private TicketStatus status;
    private String rejectedReason;
    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private Long timeToResolutionSeconds;
    private List<TicketAttachmentResponseDTO> attachments;
    private List<TicketCommentResponseDTO> comments;

    public static Long calculateTimeToResolutionSeconds(LocalDateTime createdAt, LocalDateTime resolvedAt) {
        if (createdAt == null || resolvedAt == null) {
            return null;
        }
        return Duration.between(createdAt, resolvedAt).getSeconds();
    }
}
