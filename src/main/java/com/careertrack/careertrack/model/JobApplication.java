package com.careertrack.careertrack.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;

    private String jobRole;

    private String applicationDate;

    private String status;

    private String jobLocation;
    
    private String interviewDate;
    
    private String interviewTime;
    
    private boolean oneDayReminderSent = false;
    
    private boolean oneHourReminderSent = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public JobApplication() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public String getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(String applicationDate) {
        this.applicationDate = applicationDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getJobLocation() {
        return jobLocation;
    }

    public void setJobLocation(String jobLocation) {
        this.jobLocation = jobLocation;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    public String getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(String interviewDate) {
        this.interviewDate = interviewDate;
    }

    public String getInterviewTime() {
        return interviewTime;
    }

    public void setInterviewTime(String interviewTime) {
        this.interviewTime = interviewTime;
    }
    public boolean isOneDayReminderSent() {
        return oneDayReminderSent;
    }

    public void setOneDayReminderSent(boolean oneDayReminderSent) {
        this.oneDayReminderSent = oneDayReminderSent;
    }

    public boolean isOneHourReminderSent() {
        return oneHourReminderSent;
    }

    public void setOneHourReminderSent(boolean oneHourReminderSent) {
        this.oneHourReminderSent = oneHourReminderSent;
    }
}