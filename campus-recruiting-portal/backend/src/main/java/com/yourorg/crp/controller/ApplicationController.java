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

import com.yourorg.crp.dto.ApplicationResponse;
import com.yourorg.crp.dto.ApplyRequest;
import com.yourorg.crp.dto.UpdateApplicationStatusRequest;
import com.yourorg.crp.service.ApplicationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
	private final ApplicationService applicationService;

	public ApplicationController(ApplicationService applicationService) {
		this.applicationService = applicationService;
	}

	@PostMapping
	@PreAuthorize("hasRole('STUDENT')")
	public ApplicationResponse apply(@Valid @RequestBody ApplyRequest request) {
		return ApplicationResponse.from(applicationService.apply(
				request.studentId(),
				request.postingId(),
				request.coverLetter(),
				request.resumeUrl()));
	}

	@GetMapping("/student/{studentId}")
	@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
	public List<ApplicationResponse> studentApplications(@PathVariable Long studentId) {
		return applicationService.applicationsForStudent(studentId).stream().map(ApplicationResponse::from).toList();
	}

	@GetMapping("/posting/{postingId}")
	@PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
	public List<ApplicationResponse> postingApplicants(@PathVariable Long postingId) {
		return applicationService.applicationsForPosting(postingId).stream().map(ApplicationResponse::from).toList();
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public List<ApplicationResponse> allApplications() {
		return applicationService.allApplications().stream().map(ApplicationResponse::from).toList();
	}

	@PatchMapping("/{applicationId}/status")
	@PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
	public ApplicationResponse updateStatus(@PathVariable Long applicationId,
			@Valid @RequestBody UpdateApplicationStatusRequest request) {
		return ApplicationResponse.from(applicationService.advanceApplication(applicationId, request.status()));
	}
}
