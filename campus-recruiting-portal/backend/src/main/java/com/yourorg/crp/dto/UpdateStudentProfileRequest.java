package com.yourorg.crp.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateStudentProfileRequest(
		@NotBlank String name,
		@NotBlank String department,
		@NotBlank String branch,
		@NotNull @Min(0) @Max(10) BigDecimal cgpa,
		@Min(0) int activeBacklogs,
		String resumeUrl) {
}
