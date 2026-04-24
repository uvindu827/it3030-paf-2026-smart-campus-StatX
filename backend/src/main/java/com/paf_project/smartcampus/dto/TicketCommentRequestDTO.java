package com.paf_project.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketCommentRequestDTO {
    @NotNull(message = "Author User ID is required")
    private Long authorUserId;

    @NotBlank(message = "Comment text cannot be empty")
    private String commentText;
}