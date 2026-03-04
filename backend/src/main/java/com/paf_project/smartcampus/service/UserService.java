package com.paf_project.smartcampus.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paf_project.smartcampus.model.User;
import com.paf_project.smartcampus.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

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
    
}