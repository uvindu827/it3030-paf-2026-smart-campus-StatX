// Module: Booking Management
// Developed by: Pulindu Seniya

package com.paf_project.smartcampus.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String resourceName;

    @Column(nullable = false)
    private String requestedBy;

    @Column(nullable = false)
    private LocalDate bookingDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false, length = 500)
    private String purpose;

    @Column(nullable = false)
    private Integer expectedAttendees;

}