// Module: Booking Management 
// Developed by: Pulindu Seniya

package com.paf_project.smartcampus.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class BookingController {

    @GetMapping("/hotels")
    public List<String> getHotels() {
        return List.of("Hilton", "Marriott", "Shangri-La");
    }

    @PostMapping("/book")
    public String bookHotel(@RequestBody Map<String, String> booking) {
        return "Booking confirmed for " + booking.get("name") +
                " from " + booking.get("checkIn") +
                " to " + booking.get("checkOut") +
                " for " + booking.get("guests") + " guest(s).";
    }
}
