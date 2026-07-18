package com.yourorg.crp.dto;

public record CompanyApplicationStats(
		Long companyId,
		String companyName,
		long applications) {
}
