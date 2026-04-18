package com.paf_project.smartcampus.controller;

import com.paf_project.smartcampus.dto.TicketCreateRequestDTO;
import com.paf_project.smartcampus.dto.TicketResponseDTO;
import com.paf_project.smartcampus.dto.TicketStatusUpdateRequestDTO;
import com.paf_project.smartcampus.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @Operation(
            summary = "Create a new incident ticket",
            description = "Submit ticket details with up to 3 evidence image attachments.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            content = @Content(
                    mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                    schema = @Schema(implementation = TicketCreateMultipartRequestDoc.class)))
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketResponseDTO> createTicket(
            @Valid @ModelAttribute TicketCreateRequestDTO request,
            @RequestPart(name = "attachments", required = false) List<MultipartFile> attachments) {
        TicketResponseDTO created = ticketService.createTicket(request, attachments);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponseDTO> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody TicketStatusUpdateRequestDTO request) {
        return ResponseEntity.ok(ticketService.updateStatus(id, request));
    }

    @Schema(name = "TicketCreateMultipartRequest", description = "Multipart request body for creating a ticket.")
    private static class TicketCreateMultipartRequestDoc {
        @Schema(type = "integer", format = "int64", example = "1")
        public Long resourceId;

        @Schema(type = "integer", format = "int64", example = "12")
        public Long reportedByUserId;

        @Schema(example = "Electrical")
        public String category;

        @Schema(example = "Projector in Lab A is flickering and shuts down randomly.")
        public String description;

        @Schema(allowableValues = { "LOW", "MEDIUM", "HIGH", "CRITICAL" }, example = "HIGH")
        public String priority;

        @Schema(example = "layara@example.com | +94-7X-XXXXXXX")
        public String preferredContactDetails;

        @ArraySchema(schema = @Schema(type = "string", format = "binary"))
        public List<MultipartFile> attachments;
    }
}
