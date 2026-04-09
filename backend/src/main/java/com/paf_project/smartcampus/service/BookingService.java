//developed by : Pulindu Seniya

package com.paf_project.smartcampus.service;

import com.paf_project.smartcampus.dto.BookingRequestDTO;
import com.paf_project.smartcampus.dto.BookingResponseDTO;
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
    public BookingResponseDTO createBooking(BookingRequestDTO requestDTO) {
        Booking booking = mapToEntity(requestDTO);

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
        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponseDTO(savedBooking);
    }

    // Get all bookings
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    // Get booking by ID
    public BookingResponseDTO getBookingById(Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        return mapToResponseDTO(
                booking.orElseThrow(() -> new RuntimeException("Booking not found with id: " + id)));
    }

    private Booking findBookingEntityById(Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        return booking.orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    // Approve booking
    public BookingResponseDTO approveBooking(Long id, String remarks) {
        Booking booking = findBookingEntityById(id);
        booking.setStatus(BookingStatus.APPROVED);
        booking.setAdminRemarks(remarks);
        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponseDTO(updatedBooking);
    }

    // Reject booking
    public BookingResponseDTO rejectBooking(Long id, String remarks) {
        Booking booking = findBookingEntityById(id);
        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminRemarks(remarks);
        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponseDTO(updatedBooking);
    }

    // Cancel booking
    public BookingResponseDTO cancelBooking(Long id, String remarks) {
        Booking booking = findBookingEntityById(id);
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setAdminRemarks(remarks);
        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponseDTO(updatedBooking);
    }

    private Booking mapToEntity(BookingRequestDTO requestDTO) {
        Booking booking = new Booking();
        booking.setResourceName(requestDTO.getResourceName());
        booking.setRequestedBy(requestDTO.getRequestedBy());
        booking.setBookingDate(requestDTO.getBookingDate());
        booking.setStartTime(requestDTO.getStartTime());
        booking.setEndTime(requestDTO.getEndTime());
        booking.setPurpose(requestDTO.getPurpose());
        booking.setExpectedAttendees(requestDTO.getExpectedAttendees());
        return booking;
    }

    private BookingResponseDTO mapToResponseDTO(Booking booking) {
        BookingResponseDTO responseDTO = new BookingResponseDTO();
        responseDTO.setId(booking.getId());
        responseDTO.setResourceName(booking.getResourceName());
        responseDTO.setRequestedBy(booking.getRequestedBy());
        responseDTO.setBookingDate(booking.getBookingDate());
        responseDTO.setStartTime(booking.getStartTime());
        responseDTO.setEndTime(booking.getEndTime());
        responseDTO.setPurpose(booking.getPurpose());
        responseDTO.setExpectedAttendees(booking.getExpectedAttendees());
        responseDTO.setStatus(booking.getStatus());
        responseDTO.setAdminRemarks(booking.getAdminRemarks());
        responseDTO.setCreatedAt(booking.getCreatedAt());
        return responseDTO;
    }
}