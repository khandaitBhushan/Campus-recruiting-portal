package com.yourorg.crp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yourorg.crp.model.Company;
import com.yourorg.crp.model.CompanyStatus;

public interface CompanyRepository extends JpaRepository<Company, Long> {
	long countByStatus(CompanyStatus status);
	Optional<Company> findByUserId(Long userId);
	Optional<Company> findByRecruiterEmail(String recruiterEmail);
}
