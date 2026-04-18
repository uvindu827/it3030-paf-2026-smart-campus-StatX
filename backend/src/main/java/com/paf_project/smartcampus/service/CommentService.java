package com.paf_project.smartcampus.service;

import com.paf_project.smartcampus.exception.ForbiddenOperationException;
import com.paf_project.smartcampus.exception.ResourceNotFoundException;
import com.paf_project.smartcampus.model.TicketComment;
import com.paf_project.smartcampus.repository.TicketCommentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    private final TicketCommentRepository ticketCommentRepository;

    public CommentService(TicketCommentRepository ticketCommentRepository) {
        this.ticketCommentRepository = ticketCommentRepository;
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        TicketComment comment = ticketCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getAuthorUserId().equals(userId)) {
            throw new ForbiddenOperationException("You can only delete your own comments.");
        }

        ticketCommentRepository.delete(comment);
    }
}
