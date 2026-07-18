package com.yourorg.crp.dto;

import java.math.BigDecimal;

import com.yourorg.crp.model.Student;

public record StudentResponse(
		Long id,
		String name,
		String email,
		String department,
		String branch,
		BigDecimal cgpa,
		int activeBacklogs,
		String resumeUrl,
		int graduationYear,
		boolean placed) {
	public static StudentResponse from(Student student) {
		return new StudentResponse(student.getId(), student.getName(), student.getEmail(), student.getDepartment(),
				student.getBranch(), student.getCgpa(), student.getActiveBacklogs(), student.getResumeUrl(),
				student.getGraduationYear(), student.isPlaced());
	}
}
