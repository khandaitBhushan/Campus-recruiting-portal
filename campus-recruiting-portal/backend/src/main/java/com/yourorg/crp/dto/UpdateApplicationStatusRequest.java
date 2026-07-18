package com.yourorg.crp.dto;

import com.yourorg.crp.model.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateApplicationStatusRequest(
		@NotNull ApplicationStatus status) {
}
