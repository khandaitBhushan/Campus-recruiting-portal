package com.yourorg.crp.dto;

import com.yourorg.crp.model.ApprovalStatus;
import jakarta.validation.constraints.NotNull;

public record ApprovalRequest(
		@NotNull ApprovalStatus status,
		String rejectionReason) {
}
