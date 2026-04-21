// Developed by: Pulindu Seniya
package com.paf_project.smartcampus.dto;

import com.paf_project.smartcampus.model.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class BookingResponseDTO {

    private Long id;
    private String resourceName;
    private String requestedBy;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer expectedAttendees;
    private BookingStatus status;
    private String adminRemarks;
    private LocalDateTime createdAt;

}