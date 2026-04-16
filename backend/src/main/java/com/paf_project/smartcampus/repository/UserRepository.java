package com.paf_project.smartcampus.repository;

import java.util.Optional;

import com.paf_project.smartcampus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
