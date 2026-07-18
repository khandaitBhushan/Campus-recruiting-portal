package com.yourorg.crp.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.yourorg.crp.model.ApprovalStatus;
import com.yourorg.crp.model.JobPosting;

public record PostingResponse(
		Long id,
		Long companyId,
		String companyName,
		String title,
		String location,
		String employmentType,
		BigDecimal ctc,
		String description,
		String eligibilityCriteria,
		BigDecimal minimumCgpa,
		String eligibleBranches,
		boolean backlogsAllowed,
		LocalDate deadline,
		ApprovalStatus status,
		String rejectionReason) {
	public static PostingResponse from(JobPosting p) {
		return new PostingResponse(p.getId(), p.getCompany().getId(), p.getCompany().getName(), p.getTitle(),
				p.getLocation(), p.getEmploymentType(), p.getCtc(), p.getDescription(), p.getEligibilityCriteria(),
				p.getMinimumCgpa(), p.getEligibleBranches(), p.isBacklogsAllowed(), p.getDeadline(), p.getStatus(),
				p.getRejectionReason());
	}
}
