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

import com.yourorg.crp.dto.ApprovalRequest;
import com.yourorg.crp.dto.CreatePostingRequest;
import com.yourorg.crp.dto.PostingResponse;
import com.yourorg.crp.service.PostingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/postings")
public class PostingController {
	private final PostingService postingService;

	public PostingController(PostingService postingService) {
		this.postingService = postingService;
	}

	@PostMapping("/company/{companyId}")
	@PreAuthorize("hasRole('COMPANY')")
	public PostingResponse create(@PathVariable Long companyId, @Valid @RequestBody CreatePostingRequest request) {
		return PostingResponse.from(postingService.createPosting(companyId, request));
	}

	@GetMapping("/company/{companyId}")
	@PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
	public List<PostingResponse> companyPostings(@PathVariable Long companyId) {
		return postingService.companyPostings(companyId).stream().map(PostingResponse::from).toList();
	}

	@GetMapping("/student")
	@PreAuthorize("hasRole('STUDENT')")
	public List<PostingResponse> visibleToStudents() {
		return postingService.approvedPostingsVisibleToStudents().stream().map(PostingResponse::from).toList();
	}

	@GetMapping("/pending")
	@PreAuthorize("hasRole('ADMIN')")
	public List<PostingResponse> pending() {
		return postingService.pendingPostings().stream().map(PostingResponse::from).toList();
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public List<PostingResponse> all() {
		return postingService.allPostings().stream().map(PostingResponse::from).toList();
	}

	@GetMapping("/{postingId}")
	@PreAuthorize("hasAnyRole('STUDENT', 'COMPANY', 'ADMIN')")
	public PostingResponse posting(@PathVariable Long postingId) {
		return PostingResponse.from(postingService.posting(postingId));
	}

	@PatchMapping("/{postingId}/review")
	@PreAuthorize("hasRole('ADMIN')")
	public PostingResponse review(@PathVariable Long postingId, @Valid @RequestBody ApprovalRequest request) {
		return PostingResponse.from(postingService.reviewPosting(postingId, request));
	}

	@PatchMapping("/{postingId}/close")
	@PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
	public PostingResponse close(@PathVariable Long postingId) {
		return PostingResponse.from(postingService.closePosting(postingId));
	}
}
