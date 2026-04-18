package com.paf_project.smartcampus.repository;

import com.paf_project.smartcampus.model.Ticket;
import com.paf_project.smartcampus.model.TicketStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByReportedByUserId(Long reportedByUserId);

    List<Ticket> findByAssignedTechnicianId(Long assignedTechnicianId);

    List<Ticket> findByStatus(TicketStatus status);
}
