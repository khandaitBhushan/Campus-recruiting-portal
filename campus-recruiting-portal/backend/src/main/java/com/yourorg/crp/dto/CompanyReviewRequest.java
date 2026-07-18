package com.yourorg.crp.dto;

import com.yourorg.crp.model.CompanyStatus;
import jakarta.validation.constraints.NotNull;

public record CompanyReviewRequest(
		@NotNull CompanyStatus status,
		String rejectionReason) {
}
