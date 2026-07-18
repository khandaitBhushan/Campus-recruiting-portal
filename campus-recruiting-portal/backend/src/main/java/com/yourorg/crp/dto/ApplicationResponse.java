package com.yourorg.crp.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.yourorg.crp.model.ApplicationStatus;
import com.yourorg.crp.model.StudentApplication;

public record ApplicationResponse(
		Long id,
		Long studentId,
		String studentName,
		String studentEmail,
		String studentDept,
		String studentBranch,
		BigDecimal studentCgpa,
		int studentBacklogs,
		int studentGradYear,
		Long postingId,
		String postingTitle,
		String companyName,
		String coverLetter,
		String resumeUrl,
		ApplicationStatus status,
		Instant appliedAt) {
	public static ApplicationResponse from(StudentApplication app) {
		return new ApplicationResponse(
				app.getId(),
				app.getStudent().getId(),
				app.getStudent().getName(),
				app.getStudent().getEmail(),
				app.getStudent().getDepartment(),
				app.getStudent().getBranch(),
				app.getStudent().getCgpa(),
				app.getStudent().getActiveBacklogs(),
				app.getStudent().getGraduationYear(),
				app.getPosting().getId(),
				app.getPosting().getTitle(),
				app.getPosting().getCompany().getName(),
				app.getCoverLetter(),
				app.getResumeUrl(),
				app.getStatus(),
				app.getAppliedAt());
	}
}
