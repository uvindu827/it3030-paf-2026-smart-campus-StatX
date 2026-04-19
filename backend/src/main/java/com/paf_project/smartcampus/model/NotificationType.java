package com.paf_project.smartcampus.model;

public enum NotificationType {

    //Booking-related notifications
    BOOKING_APPROVED("Your booking has been approved"),
    BOOKING_REJECTED("Your booking has been rejected"),
    BOOKING_CANCELLED("A booking has been cancelled"),
    
    
    //Ticket/Incident-related notifications
    TICKET_STATUS_CHANGED("Ticket status has been updated"),
    TICKET_ASSIGNED("You have been assigned to a ticket"),
    TICKET_RESOLVED("Your ticket has been resolved"),
    TICKET_CLOSED("Your ticket has been closed"),
    TICKET_REJECTED("Your ticket has been rejected"),
    
    //Comment-related notifications
    COMMENT_ADDED("New comment on your ticket"),
    COMMENT_REPLY("Someone replied to your comment"),
    
    //System notifications
    SYSTEM_ANNOUNCEMENT("System announcement"),
    MAINTENANCE_SCHEDULED("Maintenance scheduled");
 
    private final String defaultMessage;
 
    NotificationType(String defaultMessage) {
        this.defaultMessage = defaultMessage;
    }
 
    public String getDefaultMessage() {
        return defaultMessage;
    }
    
}
