package com.yourorg.crp.dto;

import com.yourorg.crp.model.Company;
import com.yourorg.crp.model.CompanyStatus;

public record CompanyResponse(
		Long id,
		String name,
		String industry,
		String recruiterEmail,
		CompanyStatus status,
		String rejectionReason,
		String logoUrl) {
	public static CompanyResponse from(Company company) {
		return new CompanyResponse(company.getId(), company.getName(), company.getIndustry(),
				company.getRecruiterEmail(), company.getStatus(), company.getRejectionReason(),
				company.getLogoUrl());
	}
}
