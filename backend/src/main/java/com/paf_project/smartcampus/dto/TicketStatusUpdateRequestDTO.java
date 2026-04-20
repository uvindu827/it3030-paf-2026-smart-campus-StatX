//backend/src/main/java/com/paf_project/smartcampus/dto/TicketStatusUpdateRequestDTO.java

package com.paf_project.smartcampus.dto;

import com.paf_project.smartcampus.model.TicketStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketStatusUpdateRequestDTO {

    @NotNull
    private TicketStatus status;

    @Size(max = 500)
    private String rejectedReason;

    @Size(max = 5000)
    private String resolutionNotes;
}
