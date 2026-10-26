package com.careertrack.careertrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.careertrack.careertrack.service.EmailService;

@RestController
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/api/email-test")
    public String testEmail(@RequestParam String to) {

        emailService.sendEmail(
            to,
            "CareerTrack Email Test",
            "Congratulations! Your CareerTrack email configuration is working."
        );

        return "Email sent successfully!";
    }
}