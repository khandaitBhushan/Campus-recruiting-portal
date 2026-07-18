package com.yourorg.crp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ApplyRequest(
		@NotNull Long studentId,
		@NotNull Long postingId,
		@NotBlank String coverLetter,
		@NotBlank String resumeUrl) {
}
