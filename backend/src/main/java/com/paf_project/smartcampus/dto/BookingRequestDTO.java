// Module: Booking Management 
// Developed by: Pulindu Seniya

package com.paf_project.smartcampus.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingRequestDTO {

    private String resourceName;
    private String requestedBy;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer expectedAttendees;

    public BookingRequestDTO() {
    }

    public String getResourceName() {
        return resourceName;
    }

    public String getRequestedBy() {
        return requestedBy;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public String getPurpose() {
        return purpose;
    }

    public Integer getExpectedAttendees() {
        return expectedAttendees;
    }
}