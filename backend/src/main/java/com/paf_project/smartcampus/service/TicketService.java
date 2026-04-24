package com.paf_project.smartcampus.service;

import com.paf_project.smartcampus.dto.TicketAttachmentResponseDTO;
import com.paf_project.smartcampus.dto.TicketCommentResponseDTO;
import com.paf_project.smartcampus.dto.TicketCreateRequestDTO;
import com.paf_project.smartcampus.dto.TicketResponseDTO;
import com.paf_project.smartcampus.dto.TicketStatusUpdateRequestDTO;
import com.paf_project.smartcampus.dto.TicketCommentRequestDTO;
import com.paf_project.smartcampus.exception.BadRequestException;
import com.paf_project.smartcampus.exception.ResourceNotFoundException;
import com.paf_project.smartcampus.model.Ticket;
import com.paf_project.smartcampus.model.TicketAttachment;
import com.paf_project.smartcampus.model.TicketStatus;
import com.paf_project.smartcampus.model.TicketComment;
import com.paf_project.smartcampus.repository.TicketAttachmentRepository;
import com.paf_project.smartcampus.repository.TicketRepository;
import com.paf_project.smartcampus.repository.TicketCommentRepository;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class TicketService {

    private static final int MAX_ATTACHMENTS = 3;

    private final TicketRepository ticketRepository;
    private final TicketAttachmentRepository ticketAttachmentRepository;
    private final TicketCommentRepository ticketCommentRepository;
    private final Path uploadRoot;

    @Autowired
    private NotificationHelper notificationHelper;

    public TicketService(
            TicketRepository ticketRepository,
            TicketAttachmentRepository ticketAttachmentRepository,
            TicketCommentRepository ticketCommentRepository, // <--- ADD THIS
            @Value("${app.ticket-uploads.dir:uploads/tickets}") String uploadDirectory) {
        this.ticketRepository = ticketRepository;
        this.ticketAttachmentRepository = ticketAttachmentRepository;
        this.ticketCommentRepository = ticketCommentRepository; // <--- ADD THIS
        this.uploadRoot = Paths.get(uploadDirectory).toAbsolutePath().normalize();
    }

    @Transactional
    public TicketResponseDTO createTicket(TicketCreateRequestDTO request, List<MultipartFile> attachments) {
        List<MultipartFile> safeAttachments = attachments == null
                ? List.of()
                : attachments.stream().filter(file -> file != null && !file.isEmpty()).toList();

        if (safeAttachments.size() > MAX_ATTACHMENTS) {
            throw new BadRequestException("A ticket can contain a maximum of 3 attachments.");
        }

        Ticket ticket = Ticket.builder()
                .resourceId(request.getResourceId())
                .reportedByUserId(request.getReportedByUserId())
                .category(request.getCategory())
                .description(request.getDescription())
                .priority(request.getPriority())
                .preferredContactDetails(request.getPreferredContactDetails())
                .status(TicketStatus.OPEN)
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);

        for (MultipartFile file : safeAttachments) {
            String storedPath = storeAttachment(savedTicket.getId(), file);
            TicketAttachment attachment = TicketAttachment.builder()
                    .ticket(savedTicket)
                    .filePath(storedPath)
                    .build();
            ticketAttachmentRepository.save(attachment);
        }

        Ticket hydratedTicket = ticketRepository.findById(savedTicket.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found after creation."));
        initializeCollections(hydratedTicket);
        return mapToResponse(hydratedTicket);
    }

    // NEW ADDITION: Fetch all tickets, initialize their lazy collections, and map to DTOs
    @Transactional
    public List<TicketResponseDTO> getAllTickets() {
        List<Ticket> tickets = ticketRepository.findAll();
        return tickets.stream().map(ticket -> {
            initializeCollections(ticket);
            return mapToResponse(ticket);
        }).collect(Collectors.toList());
    }

    @Transactional
    public TicketResponseDTO getTicketById(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
        initializeCollections(ticket);
        return mapToResponse(ticket);
    }

    @Transactional
    public TicketResponseDTO updateStatus(Long ticketId, TicketStatusUpdateRequestDTO request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        if (request.getStatus() == TicketStatus.REJECTED
                && (request.getRejectedReason() == null || request.getRejectedReason().trim().isEmpty())) {
            throw new BadRequestException("rejectedReason is required when status is REJECTED.");
        }

        ticket.setStatus(request.getStatus());
        ticket.setRejectedReason(request.getStatus() == TicketStatus.REJECTED ? request.getRejectedReason() : null);
        ticket.setResolutionNotes(request.getResolutionNotes());

        if (request.getStatus() == TicketStatus.RESOLVED && ticket.getResolvedAt() == null) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        Ticket savedTicket = ticketRepository.save(ticket);
        Ticket hydratedTicket = ticketRepository.findById(savedTicket.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found after status update."));
        initializeCollections(hydratedTicket);

        //notify user about ticket status update
        notificationHelper.notifyTicketStatusUpdate(
            ticket.getReportedByUserId(), 
            ticket.getId(), 
            ticket.getStatus().name());

        return mapToResponse(hydratedTicket);
    }

    //new
    @Transactional
    public TicketResponseDTO addComment(Long ticketId, TicketCommentRequestDTO request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        TicketComment comment = TicketComment.builder()
                .ticket(ticket)
                .authorUserId(request.getAuthorUserId())
                .commentText(request.getCommentText())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Save the comment using the repository
        ticketCommentRepository.save(comment);

        // Fetch the updated ticket to return the fresh data
        Ticket hydratedTicket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found after adding comment."));
        initializeCollections(hydratedTicket);
        return mapToResponse(hydratedTicket);
    }

    private void initializeCollections(Ticket ticket) {
        Hibernate.initialize(ticket.getAttachments());
        Hibernate.initialize(ticket.getComments());
    }

    private String storeAttachment(Long ticketId, MultipartFile file) {
        try {
            Files.createDirectories(uploadRoot);
            String sanitizedOriginal = file.getOriginalFilename() == null ? "attachment" : file.getOriginalFilename();
            String uniqueName = ticketId + "-" + UUID.randomUUID() + "-" + sanitizedOriginal.replace(" ", "_");
            Path targetPath = uploadRoot.resolve(uniqueName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return targetPath.toString();
        } catch (IOException ex) {
            throw new BadRequestException("Failed to store attachment: " + ex.getMessage());
        }
    }

    private TicketResponseDTO mapToResponse(Ticket ticket) {
        List<TicketAttachmentResponseDTO> attachmentDTOs = ticket.getAttachments()
                .stream()
                .sorted(Comparator.comparing(TicketAttachment::getUploadedAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(attachment -> TicketAttachmentResponseDTO.builder()
                        .id(attachment.getId())
                        .filePath(attachment.getFilePath())
                        .uploadedAt(attachment.getUploadedAt())
                        .build())
                .collect(Collectors.toList());

        List<TicketCommentResponseDTO> commentDTOs = ticket.getComments()
                .stream()
                .sorted(Comparator.comparing(comment -> comment.getCreatedAt(), Comparator.nullsLast(Comparator.naturalOrder())))
                .map(comment -> TicketCommentResponseDTO.builder()
                        .id(comment.getId())
                        .authorUserId(comment.getAuthorUserId())
                        .commentText(comment.getCommentText())
                        .createdAt(comment.getCreatedAt())
                        .updatedAt(comment.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        return TicketResponseDTO.builder()
                .id(ticket.getId())
                .resourceId(ticket.getResourceId())
                .reportedByUserId(ticket.getReportedByUserId())
                .assignedTechnicianId(ticket.getAssignedTechnicianId())
                .category(ticket.getCategory())
                .description(ticket.getDescription())
                .priority(ticket.getPriority())
                .preferredContactDetails(ticket.getPreferredContactDetails())
                .status(ticket.getStatus())
                .rejectedReason(ticket.getRejectedReason())
                .resolutionNotes(ticket.getResolutionNotes())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .resolvedAt(ticket.getResolvedAt())
                .timeToResolutionSeconds(TicketResponseDTO.calculateTimeToResolutionSeconds(
                        ticket.getCreatedAt(),
                        ticket.getResolvedAt()))
                .attachments(attachmentDTOs)
                .comments(commentDTOs)
                .build();
    }
}