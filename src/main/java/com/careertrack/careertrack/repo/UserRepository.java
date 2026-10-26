package com.careertrack.careertrack.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.careertrack.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}