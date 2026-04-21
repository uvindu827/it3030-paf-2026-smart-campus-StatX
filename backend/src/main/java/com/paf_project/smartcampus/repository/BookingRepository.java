// Module: Booking Management 
// Developed by: Pulindu Seniya

package com.paf_project.smartcampus.repository;

import com.paf_project.smartcampus.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Get all bookings for a specific resource and date
    List<Booking> findByResourceNameAndBookingDate(String resourceName, LocalDate bookingDate);

    // Custom query method to check time conflicts
    List<Booking> findByResourceNameAndBookingDateAndStartTimeLessThanAndEndTimeGreaterThan(
            String resourceName,
            LocalDate bookingDate,
            LocalTime endTime,
            LocalTime startTime);
}