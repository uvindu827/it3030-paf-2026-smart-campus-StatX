//developed by : Pulindu Seniya

package com.paf_project.smartcampus.service;

import com.paf_project.smartcampus.model.Booking;
import com.paf_project.smartcampus.model.BookingStatus;
import com.paf_project.smartcampus.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Create a new booking
    public Booking createBooking(Booking booking) {
        List<Booking> conflictingBookings = bookingRepository
                .findByResourceNameAndBookingDateAndStartTimeLessThanAndEndTimeGreaterThan(
                        booking.getResourceName(),
                        booking.getBookingDate(),
                        booking.getEndTime(),
                        booking.getStartTime());

        if (!conflictingBookings.isEmpty()) {
            throw new RuntimeException("Booking conflict detected for the selected resource and time.");
        }

        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get booking by ID
    public Booking getBookingById(Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        return booking.orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    // Approve booking
    public Booking approveBooking(Long id, String remarks) {
        Booking booking = getBookingById(id);
        booking.setStatus(BookingStatus.APPROVED);
        booking.setAdminRemarks(remarks);
        return bookingRepository.save(booking);
    }

    // Reject booking
    public Booking rejectBooking(Long id, String remarks) {
        Booking booking = getBookingById(id);
        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminRemarks(remarks);
        return bookingRepository.save(booking);
    }

    // Cancel booking
    public Booking cancelBooking(Long id, String remarks) {
        Booking booking = getBookingById(id);
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setAdminRemarks(remarks);
        return bookingRepository.save(booking);
    }
}