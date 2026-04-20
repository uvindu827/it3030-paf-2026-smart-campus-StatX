//backend/src/main/java/com/paf_project/smartcampus/dto/TicketAttachmentResponseDTO.java

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
public class TicketAttachmentResponseDTO {
    private Long id;
    private String filePath;
    private LocalDateTime uploadedAt;
}
