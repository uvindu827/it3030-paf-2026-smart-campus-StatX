//backend/src/main/java/com/paf_project/smartcampus/dto/TicketCreateRequestDTO.java

package com.paf_project.smartcampus.dto;

import com.paf_project.smartcampus.model.TicketPriority;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
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
public class TicketCreateRequestDTO {

    @NotNull
    @Schema(description = "Resource ID from shared resources module.", example = "1")
    private Long resourceId;

    @NotNull
    @Schema(description = "User ID of the ticket creator.", example = "12")
    private Long reportedByUserId;

    @NotBlank
    @Size(max = 100)
    @Schema(description = "Incident category.", example = "Electrical")
    private String category;

    @NotBlank
    @Size(max = 5000)
    @Schema(description = "Detailed incident description.")
    private String description;

    @NotNull
    @Schema(description = "Priority level.", example = "HIGH")
    private TicketPriority priority;

    @NotBlank
    @Size(max = 255)
    @Schema(description = "Preferred contact details.", example = "layara@example.com | +94-7X-XXXXXXX")
    private String preferredContactDetails;
}
