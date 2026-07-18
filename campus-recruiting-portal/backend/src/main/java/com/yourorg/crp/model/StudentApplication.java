package com.yourorg.crp.model;

import java.time.Instant;

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
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "student_applications", uniqueConstraints = {
		@UniqueConstraint(columnNames = { "student_id", "posting_id" })
})
public class StudentApplication {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "student_id")
	private Student student;

	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "posting_id")
	private JobPosting posting;

	@Lob
	@Column(nullable = false)
	private String coverLetter;

	@Column(nullable = false)
	private String resumeUrl;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ApplicationStatus status = ApplicationStatus.APPLIED;

	@Column(nullable = false)
	private Instant appliedAt = Instant.now();

	protected StudentApplication() {
	}

	public StudentApplication(Student student, JobPosting posting, String coverLetter, String resumeUrl) {
		this.student = student;
		this.posting = posting;
		this.coverLetter = coverLetter;
		this.resumeUrl = resumeUrl;
	}

	public void advanceTo(ApplicationStatus status) {
		if (status == null) {
			throw new IllegalArgumentException("Application status is required");
		}
		this.status = status;
	}

	public Long getId() {
		return id;
	}

	public Student getStudent() {
		return student;
	}

	public JobPosting getPosting() {
		return posting;
	}

	public String getCoverLetter() {
		return coverLetter;
	}

	public String getResumeUrl() {
		return resumeUrl;
	}

	public ApplicationStatus getStatus() {
		return status;
	}

	public Instant getAppliedAt() {
		return appliedAt;
	}
}
