package com.yourorg.crp.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yourorg.crp.dto.CompanyRegistrationRequest;
import com.yourorg.crp.dto.CompanyResponse;
import com.yourorg.crp.dto.CompanyReviewRequest;
import com.yourorg.crp.service.CompanyService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {
	private final CompanyService companyService;

	public CompanyController(CompanyService companyService) {
		this.companyService = companyService;
	}

	@PostMapping
	public CompanyResponse register(@Valid @RequestBody CompanyRegistrationRequest request) {
		return CompanyResponse.from(companyService.register(request));
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public List<CompanyResponse> allCompanies() {
		return companyService.allCompanies().stream().map(CompanyResponse::from).toList();
	}

	@GetMapping("/{companyId}")
	@PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
	public CompanyResponse company(@PathVariable Long companyId) {
		return CompanyResponse.from(companyService.companyProfile(companyId));
	}

	@PatchMapping("/{companyId}/review")
	@PreAuthorize("hasRole('ADMIN')")
	public CompanyResponse review(@PathVariable Long companyId, @Valid @RequestBody CompanyReviewRequest request) {
		return CompanyResponse.from(companyService.reviewCompany(companyId, request));
	}

	@PatchMapping("/{companyId}/deactivate")
	@PreAuthorize("hasRole('ADMIN')")
	public CompanyResponse deactivate(@PathVariable Long companyId) {
		return CompanyResponse.from(companyService.deactivateCompany(companyId));
	}

	@PatchMapping("/{companyId}/logo")
	@PreAuthorize("hasRole('COMPANY')")
	public CompanyResponse updateLogo(@PathVariable Long companyId, @org.springframework.web.bind.annotation.RequestParam String logoUrl) {
		return CompanyResponse.from(companyService.updateLogo(companyId, logoUrl));
	}
}
