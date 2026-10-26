
package com.careertrack.careertrack.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.careertrack.careertrack.model.JobApplication;
import com.careertrack.careertrack.repo.JobApplicationRepository;

@Service
public class InterviewReminderService {

    @Autowired
    private JobApplicationRepository repository;

    @Autowired
    private EmailService emailService;

    private static final ZoneId ZONE_ID =
            ZoneId.of("Asia/Kolkata");

    @Scheduled(fixedRate = 60000)
    public void sendInterviewReminders() {

        System.out.println(
                "\n========== INTERVIEW REMINDER CHECK STARTED ==========");

        try {
            List<JobApplication> applications =
                    repository.findAll();

            LocalDateTime now = LocalDateTime.now(ZONE_ID);

            System.out.println(
                    "Current time: " + now);

            System.out.println(
                    "Applications found: " + applications.size());

            for (JobApplication job : applications) {
                processApplication(job, now);
            }

        } catch (Exception e) {
            System.err.println(
                    "Error while checking interview reminders: "
                            + e.getMessage());

            e.printStackTrace();
        }

        System.out.println(
                "========== INTERVIEW REMINDER CHECK COMPLETED ==========\n");
    }

    private void processApplication(
            JobApplication job,
            LocalDateTime now) {

        try {
            System.out.println(
                    "\nChecking application ID: " + job.getId());

            // Check interview date
            if (job.getInterviewDate() == null
                    || job.getInterviewDate().isBlank()) {

                System.out.println(
                        "Skipped: Interview date is missing.");

                return;
            }

            // Check interview time
            if (job.getInterviewTime() == null
                    || job.getInterviewTime().isBlank()) {

                System.out.println(
                        "Skipped: Interview time is missing.");

                return;
            }

            // Check associated user
            if (job.getUser() == null) {

                System.out.println(
                        "Skipped: No user associated with this application.");

                return;
            }

            // Check recipient email
            String email = job.getUser().getEmail();

            if (email == null || email.isBlank()) {

                System.out.println(
                        "Skipped: User email is missing.");

                return;
            }

            // Parse interview date and time
            LocalDate date =
                    LocalDate.parse(job.getInterviewDate());

            LocalTime time =
                    LocalTime.parse(job.getInterviewTime());

            LocalDateTime interviewDateTime =
                    LocalDateTime.of(date, time);

            System.out.println(
                    "Interview date and time: " + interviewDateTime);

            System.out.println(
                    "Recipient email: " + email);

            System.out.println(
                    "One-day reminder sent: "
                            + job.isOneDayReminderSent());

            System.out.println(
                    "One-hour reminder sent: "
                            + job.isOneHourReminderSent());

            // Skip past interviews
            if (!interviewDateTime.isAfter(now)) {

                System.out.println(
                        "Skipped: Interview date and time have passed.");

                return;
            }

            // Prepare interview details
            String details =
                    "Company: " + job.getCompanyName()
                    + "\nJob Role: " + job.getJobRole()
                    + "\nInterview Date: " + date
                    + "\nInterview Time: " + time;

            // One-day reminder
            if (!job.isOneDayReminderSent()
                    && !now.isBefore(
                            interviewDateTime.minusDays(1))) {

                System.out.println(
                        "Sending one-day reminder for application ID: "
                                + job.getId());

                emailService.sendEmail(
                        email,
                        "Interview Reminder - Tomorrow",
                        "Your interview is scheduled within the next 24 hours.\n\n"
                                + details);

                job.setOneDayReminderSent(true);
                repository.save(job);

                System.out.println(
                        "One-day reminder sent successfully for application ID: "
                                + job.getId());
            }

            // One-hour reminder
            if (!job.isOneHourReminderSent()
                    && !now.isBefore(
                            interviewDateTime.minusHours(1))) {

                System.out.println(
                        "Sending one-hour reminder for application ID: "
                                + job.getId());

                emailService.sendEmail(
                        email,
                        "Interview Reminder - 1 Hour",
                        "Your interview is scheduled within the next hour.\n\n"
                                + details);

                job.setOneHourReminderSent(true);
                repository.save(job);

                System.out.println(
                        "One-hour reminder sent successfully for application ID: "
                                + job.getId());
            }

        } catch (Exception e) {

            System.err.println(
                    "Could not process interview reminder for application ID "
                            + job.getId() + ": "
                            + e.getMessage());

            e.printStackTrace();
        }
    }
}

