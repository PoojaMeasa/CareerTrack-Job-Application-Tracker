package com.careertrack.careertrack.controller;

import java.util.Map;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.careertrack.careertrack.model.User;
import com.careertrack.careertrack.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
    origins = "http://localhost:3000",
    allowCredentials = "true"
)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            authService.registerUser(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("Registration successful!");

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // Login and create a server-side session
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody Map<String, String> loginData,
            HttpSession session) {

        String email = loginData.get("email");
        String password = loginData.get("password");

        if (email == null || password == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Email and password are required!");
        }

        User user = authService.loginUser(email, password);

        if (user != null) {

            // Store the logged-in user's ID in the server session
            session.setAttribute("userId", user.getId());

            return ResponseEntity.ok("Login successful!");
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password!");
    }

    // Logout and invalidate the session
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpSession session) {

        session.invalidate();

        return ResponseEntity.ok("Logout successful!");
    }
}