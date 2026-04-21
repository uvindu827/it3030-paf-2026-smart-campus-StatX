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
}