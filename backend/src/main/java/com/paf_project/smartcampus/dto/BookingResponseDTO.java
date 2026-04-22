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

    public BookingResponseDTO() {
    }

    public Long getId() {
        return id;
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

    public BookingStatus getStatus() {
        return status;
    }

    public String getAdminRemarks() {
        return adminRemarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public void setRequestedBy(String requestedBy) {
        this.requestedBy = requestedBy;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public void setExpectedAttendees(Integer expectedAttendees) {
        this.expectedAttendees = expectedAttendees;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public void setAdminRemarks(String adminRemarks) {
        this.adminRemarks = adminRemarks;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}