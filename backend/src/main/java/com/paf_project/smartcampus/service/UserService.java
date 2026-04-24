package com.paf_project.smartcampus.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.paf_project.smartcampus.model.User;
import com.paf_project.smartcampus.repository.BookingRepository;
import com.paf_project.smartcampus.repository.NotificationRepository;
import com.paf_project.smartcampus.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public User processOAuthPostLogin(String email, String name){
        
        return userRepository.findByEmail(email)
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name);
                newUser.setRole("ROLE_USER");

                return userRepository.save(newUser);
            });
    }

    public User createAdminUser(User adminData) {
        User admin = new User();
        admin.setName(adminData.getName());
        admin.setEmail(adminData.getEmail());
        admin.setRole("ROLE_ADMIN"); // Explicitly set admin role
        return userRepository.save(admin);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteUser(Long userId) {
        // Better way to delete to ensure Hibernate tracks it
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        notificationRepository.deleteByUserId(userId);
        bookingRepository.deleteByUserId(userId);
        
        userRepository.delete(user);
    }
            
}