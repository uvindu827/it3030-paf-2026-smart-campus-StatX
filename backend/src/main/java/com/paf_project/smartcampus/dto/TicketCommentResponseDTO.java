//backend/src/main/java/com/paf_project/smartcampus/dto/TicketCommentResponseDTO.java

package com.paf_project.smartcampus.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketCommentResponseDTO {
    private Long id;
    private Long authorUserId;
    private String commentText;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
