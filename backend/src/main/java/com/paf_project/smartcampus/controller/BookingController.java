// Module: Booking Management 
// Developed by: Pulindu Seniya

package com.paf_project.smartcampus.controller;

import com.paf_project.smartcampus.dto.BookingRequestDTO;
import com.paf_project.smartcampus.dto.BookingResponseDTO;
import com.paf_project.smartcampus.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Create a new booking
    @PostMapping
    public BookingResponseDTO createBooking(@RequestBody BookingRequestDTO requestDTO) {
        return bookingService.createBooking(requestDTO);
    }

    // Get all bookings
    @GetMapping
    public List<BookingResponseDTO> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // Get booking by ID
    @GetMapping("/{id}")
    public BookingResponseDTO getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    // Approve booking
    @PutMapping("/{id}/approve")
    public BookingResponseDTO approveBooking(@PathVariable Long id,
            @RequestParam String remarks) {
        return bookingService.approveBooking(id, remarks);
    }

    // Reject booking
    @PutMapping("/{id}/reject")
    public BookingResponseDTO rejectBooking(@PathVariable Long id,
            @RequestParam String remarks) {
        return bookingService.rejectBooking(id, remarks);
    }

    // Cancel booking
    @PutMapping("/{id}/cancel")
    public BookingResponseDTO cancelBooking(@PathVariable Long id,
            @RequestParam String remarks) {
        return bookingService.cancelBooking(id, remarks);
    }
}