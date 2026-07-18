package com.yourorg.crp.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "students")
public class Student {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private String department;

	@Column(nullable = false)
	private String branch;

	@Column(nullable = false, precision = 3, scale = 2)
	private BigDecimal cgpa;

	@Column(nullable = false)
	private int activeBacklogs;

	@Column(nullable = false)
	private String resumeUrl;

	@Column(nullable = false)
	private int graduationYear;

	@Column(nullable = false)
	private boolean placed = false;

	protected Student() {
	}

	public Student(User user, String name, String email, String department, String branch, BigDecimal cgpa, int activeBacklogs,
			String resumeUrl, int graduationYear) {
		this.user = user;
		this.name = name;
		this.email = email;
		this.department = department;
		this.branch = branch;
		this.cgpa = cgpa;
		this.activeBacklogs = activeBacklogs;
		this.resumeUrl = resumeUrl != null ? resumeUrl : "";
		this.graduationYear = graduationYear;
		this.placed = false;
	}

	public void updateProfile(String name, String department, String branch, BigDecimal cgpa, int activeBacklogs, String resumeUrl) {
		this.name = name;
		this.department = department;
		this.branch = branch;
		this.cgpa = cgpa;
		this.activeBacklogs = activeBacklogs;
		this.resumeUrl = resumeUrl != null ? resumeUrl : "";
	}

	public void setPlaced(boolean placed) {
		this.placed = placed;
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

	public String getEmail() {
		return email;
	}

	public String getDepartment() {
		return department;
	}

	public String getBranch() {
		return branch;
	}

	public BigDecimal getCgpa() {
		return cgpa;
	}

	public int getActiveBacklogs() {
		return activeBacklogs;
	}

	public String getResumeUrl() {
		return resumeUrl;
	}

	public int getGraduationYear() {
		return graduationYear;
	}

	public boolean isPlaced() {
		return placed;
	}
}
