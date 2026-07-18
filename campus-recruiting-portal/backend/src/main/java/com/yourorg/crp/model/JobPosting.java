package com.yourorg.crp.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "job_postings")
public class JobPosting {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "company_id")
	private Company company;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false)
	private String location;

	@Column(nullable = false)
	private String employmentType;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal ctc;

	@Lob
	@Column(nullable = false)
	private String description;

	@Lob
	@Column(nullable = false)
	private String eligibilityCriteria;

	@Column(nullable = false, precision = 3, scale = 2)
	private BigDecimal minimumCgpa;

	@Column(nullable = false)
	private String eligibleBranches;

	@Column(nullable = false)
	private boolean backlogsAllowed;

	@Column(nullable = false)
	private LocalDate deadline;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ApprovalStatus status = ApprovalStatus.PENDING;

	private String rejectionReason;

	@Column(nullable = false)
	private Instant createdAt = Instant.now();

	private Instant reviewedAt;

	protected JobPosting() {
	}

	public JobPosting(Company company, String title, String location, String employmentType, BigDecimal ctc,
			String description, String eligibilityCriteria, BigDecimal minimumCgpa, String eligibleBranches,
			boolean backlogsAllowed, LocalDate deadline) {
		this.company = company;
		this.title = title;
		this.location = location;
		this.employmentType = employmentType;
		this.ctc = ctc;
		this.description = description;
		this.eligibilityCriteria = eligibilityCriteria;
		this.minimumCgpa = minimumCgpa;
		this.eligibleBranches = eligibleBranches;
		this.backlogsAllowed = backlogsAllowed;
		this.deadline = deadline;
	}

	public void approve() {
		requirePendingReview();
		status = ApprovalStatus.APPROVED;
		rejectionReason = null;
		reviewedAt = Instant.now();
	}

	public void reject(String reason) {
		requirePendingReview();
		status = ApprovalStatus.REJECTED;
		rejectionReason = reason;
		reviewedAt = Instant.now();
	}

	public void close() {
		if (status != ApprovalStatus.APPROVED) {
			throw new IllegalStateException("Only approved postings can be closed");
		}
		status = ApprovalStatus.CLOSED;
	}

	public boolean isOpenForApplications(LocalDate today) {
		return status == ApprovalStatus.APPROVED && !deadline.isBefore(today);
	}

	private void requirePendingReview() {
		if (status != ApprovalStatus.PENDING) {
			throw new IllegalStateException("Only pending postings can be reviewed");
		}
	}

	public Long getId() {
		return id;
	}

	public Company getCompany() {
		return company;
	}

	public String getTitle() {
		return title;
	}

	public String getLocation() {
		return location;
	}

	public String getEmploymentType() {
		return employmentType;
	}

	public BigDecimal getCtc() {
		return ctc;
	}

	public String getDescription() {
		return description;
	}

	public String getEligibilityCriteria() {
		return eligibilityCriteria;
	}

	public BigDecimal getMinimumCgpa() {
		return minimumCgpa;
	}

	public String getEligibleBranches() {
		return eligibleBranches;
	}

	public boolean isBacklogsAllowed() {
		return backlogsAllowed;
	}

	public LocalDate getDeadline() {
		return deadline;
	}

	public ApprovalStatus getStatus() {
		return status;
	}

	public String getRejectionReason() {
		return rejectionReason;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getReviewedAt() {
		return reviewedAt;
	}
}
