package com.careertrack.careertrack.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.careertrack.model.JobApplication;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByUserId(Long userId);

}