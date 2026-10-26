package com.careertrack.careertrack.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.careertrack.careertrack.model.User;
import com.careertrack.careertrack.repo.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User registerUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return null;
        }

        if (passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }

        return null;
    }
}