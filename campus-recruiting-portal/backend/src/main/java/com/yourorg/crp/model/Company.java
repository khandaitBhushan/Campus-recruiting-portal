package com.yourorg.crp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "companies")
public class Company {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String industry;

	@Column(nullable = false)
	private String recruiterEmail;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private CompanyStatus status = CompanyStatus.PENDING;

	private String rejectionReason;

	private String logoUrl;

	protected Company() {
	}

	public Company(User user, String name, String industry, String recruiterEmail) {
		this.user = user;
		this.name = name;
		this.industry = industry;
		this.recruiterEmail = recruiterEmail;
	}

	public void approve() {
		requirePending();
		status = CompanyStatus.APPROVED;
		rejectionReason = null;
	}

	public void reject(String reason) {
		requirePending();
		status = CompanyStatus.REJECTED;
		rejectionReason = reason;
	}

	public void deactivate() {
		status = CompanyStatus.DEACTIVATED;
	}

	public boolean canPostJobs() {
		return status == CompanyStatus.APPROVED;
	}

	private void requirePending() {
		if (status != CompanyStatus.PENDING) {
			throw new IllegalStateException("Only pending companies can be reviewed");
		}
	}

	public Long getId() {
		return id;
	}

	public User getUser() {
		return user;
	}

	public String getName() {
		return name;
	}

	public String getIndustry() {
		return industry;
	}

	public String getRecruiterEmail() {
		return recruiterEmail;
	}

	public CompanyStatus getStatus() {
		return status;
	}

	public String getRejectionReason() {
		return rejectionReason;
	}

	public String getLogoUrl() {
		return logoUrl;
	}

	public void setLogoUrl(String logoUrl) {
		this.logoUrl = logoUrl;
	}
}
