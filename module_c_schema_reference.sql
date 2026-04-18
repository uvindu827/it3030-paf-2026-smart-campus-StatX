-- =========================================================
-- MODULE C: Maintenance & Incident Ticketing Schema
-- Reference script for final report documentation.
-- NOTE: Actual table creation in this project is handled by
-- Spring Boot Hibernate (spring.jpa.hibernate.ddl-auto=update).
-- =========================================================

-- Assumptions:
--   Existing tables in other modules:
--     users(id BIGINT PK, ...)
--     resources(id BIGINT PK, ...)
-- If your teammate schema uses different PK names, adjust FK references.

CREATE TABLE tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    -- Common resource id (as used across components/modules)
    resource_id BIGINT UNSIGNED NOT NULL,

    -- User who created the ticket
    reported_by_user_id BIGINT UNSIGNED NOT NULL,

    -- Assigned technician/staff (nullable until assigned)
    assigned_technician_id BIGINT UNSIGNED NULL,

    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    preferred_contact_details VARCHAR(255) NOT NULL,

    status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED') NOT NULL DEFAULT 'OPEN',

    -- Mandatory when status is REJECTED
    rejected_reason VARCHAR(500) NULL,

    -- Added by technician/staff when resolving
    resolution_notes TEXT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Innovation support: time-to-resolution
    resolved_at DATETIME NULL,

    CONSTRAINT chk_ticket_rejected_reason
        CHECK (
            (status <> 'REJECTED' AND rejected_reason IS NULL)
            OR
            (status = 'REJECTED' AND rejected_reason IS NOT NULL AND CHAR_LENGTH(TRIM(rejected_reason)) > 0)
        ),

    CONSTRAINT chk_ticket_resolved_after_created
        CHECK (
            resolved_at IS NULL OR resolved_at >= created_at
        ),

    CONSTRAINT fk_tickets_resource
        FOREIGN KEY (resource_id) REFERENCES resources(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_tickets_reported_by
        FOREIGN KEY (reported_by_user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_tickets_assigned_technician
        FOREIGN KEY (assigned_technician_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE INDEX idx_tickets_resource_id ON tickets(resource_id);
CREATE INDEX idx_tickets_reported_by_user_id ON tickets(reported_by_user_id);
CREATE INDEX idx_tickets_assigned_technician_id ON tickets(assigned_technician_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);

-- ---------------------------------------------------------

CREATE TABLE ticket_attachments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT UNSIGNED NOT NULL,

    -- Local file path only (no BLOB storage)
    file_path VARCHAR(500) NOT NULL,
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_attachments_ticket
        FOREIGN KEY (ticket_id) REFERENCES tickets(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT uq_ticket_attachment_path UNIQUE (ticket_id, file_path)
);

CREATE INDEX idx_ticket_attachments_ticket_id ON ticket_attachments(ticket_id);

-- ---------------------------------------------------------

CREATE TABLE ticket_comments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT UNSIGNED NOT NULL,

    -- Supports ownership checks in service layer
    author_user_id BIGINT UNSIGNED NOT NULL,

    comment_text TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_comments_ticket
        FOREIGN KEY (ticket_id) REFERENCES tickets(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_ticket_comments_author
        FOREIGN KEY (author_user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE INDEX idx_ticket_comments_ticket_id ON ticket_comments(ticket_id);
CREATE INDEX idx_ticket_comments_author_user_id ON ticket_comments(author_user_id);
CREATE INDEX idx_ticket_comments_created_at ON ticket_comments(created_at);

-- ---------------------------------------------------------
-- Attachment count rule:
-- "Max 3 images per ticket" should be enforced in service layer:
-- count(existingAttachments) + incomingFiles <= 3
-- ---------------------------------------------------------
