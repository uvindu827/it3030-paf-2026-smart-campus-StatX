package com.paf_project.smartcampus.repository;

import com.paf_project.smartcampus.model.TicketAttachment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {

    List<TicketAttachment> findByTicketId(Long ticketId);

    long countByTicketId(Long ticketId);
}
