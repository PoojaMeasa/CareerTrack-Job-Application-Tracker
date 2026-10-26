package com.careertrack.careertrack.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.careertrack.careertrack.model.JobApplication;
import com.careertrack.careertrack.repo.JobApplicationRepository;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository repository;

    // Save a new job application
    public JobApplication saveApplication(JobApplication application) {
        return repository.save(application);
    }

    // Get all job applications
    public List<JobApplication> getAllApplications() {
        return repository.findAll();
    }

    // Get job applications for a specific user
    public List<JobApplication> getApplicationsByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    // Get a job application by ID
    public Optional<JobApplication> getApplicationById(Long id) {
        return repository.findById(id);
    }

 // Update an existing job application
    public JobApplication updateApplication(Long id, JobApplication application) {

        Optional<JobApplication> existing = repository.findById(id);

        if (existing.isPresent()) {

            JobApplication job = existing.get();

            boolean interviewChanged =
                    !java.util.Objects.equals(
                            job.getInterviewDate(),
                            application.getInterviewDate())
                    ||
                    !java.util.Objects.equals(
                            job.getInterviewTime(),
                            application.getInterviewTime());

            job.setCompanyName(application.getCompanyName());
            job.setJobRole(application.getJobRole());
            job.setApplicationDate(application.getApplicationDate());
            job.setStatus(application.getStatus());
            job.setJobLocation(application.getJobLocation());

            // Update interview details
            job.setInterviewDate(application.getInterviewDate());
            job.setInterviewTime(application.getInterviewTime());

            // Reset reminders if interview date or time changes
            if (interviewChanged) {
                job.setOneDayReminderSent(false);
                job.setOneHourReminderSent(false);
            }

            return repository.save(job);
        }

        return null;
    }

    // Delete a job application by ID
    public void deleteApplication(Long id) {
        repository.deleteById(id);
    }
}