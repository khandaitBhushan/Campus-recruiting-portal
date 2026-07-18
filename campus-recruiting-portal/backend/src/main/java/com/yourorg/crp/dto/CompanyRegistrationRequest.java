package com.yourorg.crp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CompanyRegistrationRequest(
		@NotBlank String name,
		@NotBlank String industry,
		@NotBlank @Email String recruiterEmail,
		@NotBlank String password) {
}
