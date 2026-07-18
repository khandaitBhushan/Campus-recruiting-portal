package com.yourorg.crp.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.yourorg.crp.dto.CompanyRegistrationRequest;
import com.yourorg.crp.dto.CompanyReviewRequest;
import com.yourorg.crp.model.UserRole;
import com.yourorg.crp.model.Company;
import com.yourorg.crp.model.CompanyStatus;
import com.yourorg.crp.model.User;
import com.yourorg.crp.repository.CompanyRepository;
import com.yourorg.crp.repository.UserRepository;

@Service
public class CompanyService {
	private final CompanyRepository companyRepository;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public CompanyService(CompanyRepository companyRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.companyRepository = companyRepository;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional
	public Company register(CompanyRegistrationRequest request) {
		if (userRepository.existsByEmail(request.recruiterEmail())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
		}
		User user = new User(request.recruiterEmail(), passwordEncoder.encode(request.password()), UserRole.COMPANY);
		user = userRepository.save(user);
		return companyRepository.save(new Company(user, request.name(), request.industry(), request.recruiterEmail()));
	}

	@Transactional(readOnly = true)
	public List<Company> allCompanies() {
		return companyRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Company companyProfile(Long companyId) {
		return findCompany(companyId);
	}

	@Transactional
	public Company reviewCompany(Long companyId, CompanyReviewRequest request) {
		Company company = findCompany(companyId);
		try {
			if (request.status() == CompanyStatus.APPROVED) {
				company.approve();
			}
			else if (request.status() == CompanyStatus.REJECTED) {
				company.reject(request.rejectionReason());
			}
			else {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Review status must be APPROVED or REJECTED");
			}
		}
		catch (IllegalStateException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage(), ex);
		}
		return company;
	}

	@Transactional
	public Company deactivateCompany(Long companyId) {
		Company company = findCompany(companyId);
		company.deactivate();
		return company;
	}

	@Transactional
	public Company updateLogo(Long companyId, String logoUrl) {
		Company company = findCompany(companyId);
		company.setLogoUrl(logoUrl);
		return company;
	}

	private Company findCompany(Long companyId) {
		return companyRepository.findById(companyId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
	}
}
