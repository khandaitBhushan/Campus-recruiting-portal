package com.yourorg.crp.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreatePostingRequest(
		@NotBlank String title,
		@NotBlank String location,
		@NotBlank String employmentType,
		@NotNull @DecimalMin("0.0") BigDecimal ctc,
		@NotBlank String description,
		@NotBlank String eligibilityCriteria,
		@NotNull @DecimalMin("0.0") BigDecimal minimumCgpa,
		@NotBlank String eligibleBranches,
		boolean backlogsAllowed,
		@NotNull @FutureOrPresent LocalDate deadline) {
}
