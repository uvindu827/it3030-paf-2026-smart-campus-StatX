package com.paf_project.smartcampus.dto;

import com.paf_project.smartcampus.model.TicketPriority;
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
    private Long resourceId;

    @NotNull
    private Long reportedByUserId;

    @NotBlank
    @Size(max = 100)
    private String category;

    @NotBlank
    @Size(max = 5000)
    private String description;

    @NotNull
    private TicketPriority priority;

    @NotBlank
    @Size(max = 255)
    private String preferredContactDetails;
}
