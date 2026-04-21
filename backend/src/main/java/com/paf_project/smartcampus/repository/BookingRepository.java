// Module: Booking Management 
// Developed by: Pulindu Seniya

package com.paf_project.smartcampus.repository;

import com.paf_project.smartcampus.model.Booking;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Get all bookings for a specific resource and date
    List<Booking> findByResourceNameAndBookingDate(String resourceName, LocalDate bookingDate);

}