package com.yourorg.crp.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.yourorg.crp.dto.ApprovalRequest;
import com.yourorg.crp.dto.CreatePostingRequest;
import com.yourorg.crp.model.ApprovalStatus;
import com.yourorg.crp.model.Company;
import com.yourorg.crp.model.JobPosting;
import com.yourorg.crp.repository.CompanyRepository;
import com.yourorg.crp.repository.JobPostingRepository;
import com.yourorg.crp.repository.UserRepository;

@Service
public class PostingService {
	private final CompanyRepository companyRepository;
	private final JobPostingRepository postingRepository;
	private final UserRepository userRepository;

	public PostingService(CompanyRepository companyRepository, JobPostingRepository postingRepository, UserRepository userRepository) {
		this.companyRepository = companyRepository;
		this.postingRepository = postingRepository;
		this.userRepository = userRepository;
	}

	@Transactional
	public JobPosting createPosting(Long companyId, CreatePostingRequest request) {
		if (request.deadline().isBefore(LocalDate.now())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Deadline must be today or later");
		}
		Company company = companyRepository.findById(companyId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
		if (!company.canPostJobs()) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Company must be approved before posting jobs");
		}
		JobPosting posting = new JobPosting(company, request.title(), request.location(), request.employmentType(),
				request.ctc(), request.description(), request.eligibilityCriteria(), request.minimumCgpa(),
				request.eligibleBranches(), request.backlogsAllowed(), request.deadline());
		return postingRepository.save(posting);
	}

	@Transactional(readOnly = true)
	public List<JobPosting> approvedPostingsVisibleToStudents() {
		LocalDate today = LocalDate.now();
		return postingRepository.findByStatusOrderByDeadlineAsc(ApprovalStatus.APPROVED)
				.stream()
				.filter(posting -> posting.isOpenForApplications(today))
				.toList();
	}

	@Transactional(readOnly = true)
	public List<JobPosting> companyPostings(Long companyId) {
		if (!companyRepository.existsById(companyId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found");
		}
		org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null) {
			boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
			boolean isCompany = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_COMPANY"));
			if (isCompany && !isAdmin) {
				String email = auth.getName();
				Company company = companyRepository.findByRecruiterEmail(email)
						.orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Company profile not found"));
				if (!company.getId().equals(companyId)) {
					throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to postings of other companies");
				}
			}
		}
		return postingRepository.findByCompanyIdOrderByCreatedAtDesc(companyId);
	}

	@Transactional(readOnly = true)
	public List<JobPosting> pendingPostings() {
		return postingRepository.findByStatusOrderByDeadlineAsc(ApprovalStatus.PENDING);
	}

	@Transactional(readOnly = true)
	public List<JobPosting> allPostings() {
		return postingRepository.findAllByOrderByCreatedAtDesc();
	}

	@Transactional(readOnly = true)
	public JobPosting posting(Long postingId) {
		JobPosting posting = findPosting(postingId);
		org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null) {
			boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
			boolean isCompany = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_COMPANY"));
			boolean isStudent = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"));

			if (isStudent) {
				if (posting.getStatus() != ApprovalStatus.APPROVED && posting.getStatus() != ApprovalStatus.CLOSED) {
					throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Job posting is not approved yet");
				}
			}
			else if (isCompany && !isAdmin) {
				String email = auth.getName();
				Company company = companyRepository.findByRecruiterEmail(email)
						.orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Company profile not found"));
				if (!posting.getCompany().getId().equals(company.getId())) {
					throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to view this posting");
				}
			}
		}
		return posting;
	}

	@Transactional
	public JobPosting reviewPosting(Long postingId, ApprovalRequest request) {
		JobPosting posting = findPosting(postingId);
		try {
			if (request.status() == ApprovalStatus.APPROVED) {
				posting.approve();
			}
			else if (request.status() == ApprovalStatus.REJECTED) {
				posting.reject(request.rejectionReason());
			}
			else {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Review status must be APPROVED or REJECTED");
			}
		}
		catch (IllegalStateException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage(), ex);
		}
		return posting;
	}

	@Transactional
	public JobPosting closePosting(Long postingId) {
		JobPosting posting = findPosting(postingId);
		try {
			posting.close();
		}
		catch (IllegalStateException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage(), ex);
		}
		return posting;
	}

	private JobPosting findPosting(Long postingId) {
		return postingRepository.findById(postingId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Posting not found"));
	}
}
