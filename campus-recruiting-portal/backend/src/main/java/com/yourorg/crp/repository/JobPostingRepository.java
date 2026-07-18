package com.yourorg.crp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yourorg.crp.model.ApprovalStatus;
import com.yourorg.crp.model.JobPosting;

public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
	List<JobPosting> findByStatusOrderByDeadlineAsc(ApprovalStatus status);

	List<JobPosting> findByCompanyIdOrderByCreatedAtDesc(Long companyId);

	List<JobPosting> findAllByOrderByCreatedAtDesc();

	long countByStatus(ApprovalStatus status);
}
