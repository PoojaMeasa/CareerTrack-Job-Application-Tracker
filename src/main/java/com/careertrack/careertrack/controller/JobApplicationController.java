package com.careertrack.careertrack.controller;

import java.util.List;
import java.util.Optional;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.careertrack.careertrack.model.JobApplication;
import com.careertrack.careertrack.model.User;
import com.careertrack.careertrack.repo.UserRepository;
import com.careertrack.careertrack.service.JobApplicationService;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(
    origins = "http://localhost:3000",
    allowCredentials = "true"
)
public class JobApplicationController {

    @Autowired
    private JobApplicationService service;

    @Autowired
    private UserRepository userRepository;

    // Add a job application for the logged-in user
    @PostMapping
    public ResponseEntity<?> addApplication(
            @RequestBody JobApplication application,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first!");
        }

        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            session.invalidate();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User session is invalid. Please login again!");
        }

        application.setUser(userOptional.get());

        return ResponseEntity.ok(service.saveApplication(application));
    }

    // Get applications belonging to the logged-in user
    @GetMapping
    public ResponseEntity<?> getApplications(HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first!");
        }

        return ResponseEntity.ok(
                service.getApplicationsByUserId(userId)
        );
    }

    // Update an application only if it belongs to the logged-in user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplication(
            @PathVariable Long id,
            @RequestBody JobApplication application,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first!");
        }

        Optional<JobApplication> existingOptional =
                service.getApplicationById(id);

        if (existingOptional.isEmpty()
                || existingOptional.get().getUser() == null
                || !userId.equals(existingOptional.get().getUser().getId())) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Application not found!");
        }

        JobApplication updated =
                service.updateApplication(id, application);

        return ResponseEntity.ok(updated);
    }

    // Delete an application only if it belongs to the logged-in user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(
            @PathVariable Long id,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first!");
        }

        Optional<JobApplication> existingOptional =
                service.getApplicationById(id);

        if (existingOptional.isEmpty()
                || existingOptional.get().getUser() == null
                || !userId.equals(existingOptional.get().getUser().getId())) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Application not found!");
        }

        service.deleteApplication(id);

        return ResponseEntity.ok("Application deleted successfully!");
    }
}