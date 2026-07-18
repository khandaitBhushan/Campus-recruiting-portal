package com.yourorg.crp.dto;

import com.yourorg.crp.model.UserRole;

public record LoginResponse(
		String token,
		String email,
		UserRole role,
		Long profileId) {
}
