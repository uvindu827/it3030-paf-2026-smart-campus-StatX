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

}