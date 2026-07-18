package com.yourorg.crp.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.yourorg.crp.model.UserRole;
import com.yourorg.crp.config.JwtService;
import com.yourorg.crp.model.Company;
import com.yourorg.crp.model.Student;
import com.yourorg.crp.model.User;
import com.yourorg.crp.dto.CompanyRegistrationRequest;
import com.yourorg.crp.dto.LoginRequest;
import com.yourorg.crp.dto.LoginResponse;
import com.yourorg.crp.dto.StudentRegisterRequest;
import com.yourorg.crp.repository.CompanyRepository;
import com.yourorg.crp.repository.StudentRepository;
import com.yourorg.crp.repository.UserRepository;

@Service
public class AuthService {
	private final UserRepository userRepository;
	private final StudentRepository studentRepository;
	private final CompanyRepository companyRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public AuthService(UserRepository userRepository, StudentRepository studentRepository,
			CompanyRepository companyRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
		this.userRepository = userRepository;
		this.studentRepository = studentRepository;
		this.companyRepository = companyRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	@Transactional
	public Student registerStudent(StudentRegisterRequest request) {
		if (!request.email().endsWith("@university.edu")) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student email must belong to the @university.edu domain");
		}
		if (userRepository.existsByEmail(request.email())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
		}

		User user = new User(request.email(), passwordEncoder.encode(request.password()), UserRole.STUDENT);
		user = userRepository.save(user);

		Student student = new Student(user, request.name(), request.email(), request.department(), request.branch(),
				request.cgpa(), request.activeBacklogs(), request.resumeUrl(), request.graduationYear());
		return studentRepository.save(student);
	}

	@Transactional
	public Company registerCompany(CompanyRegistrationRequest request) {
		if (userRepository.existsByEmail(request.recruiterEmail())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
		}

		User user = new User(request.recruiterEmail(), passwordEncoder.encode(request.password()), UserRole.COMPANY);
		user = userRepository.save(user);

		Company company = new Company(user, request.name(), request.industry(), request.recruiterEmail());
		return companyRepository.save(company);
	}

	@Transactional(readOnly = true)
	public LoginResponse login(LoginRequest request) {
		User user = userRepository.findByEmail(request.email())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

		if (!passwordEncoder.matches(request.password(), user.getPassword())) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
		}

		String token = jwtService.generateToken(user.getEmail(), user.getRole());
		Long profileId = null;

		if (user.getRole() == UserRole.STUDENT) {
			Student student = studentRepository.findByUserId(user.getId())
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Student profile not found"));
			profileId = student.getId();
		}
		else if (user.getRole() == UserRole.COMPANY) {
			Company company = companyRepository.findByUserId(user.getId())
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Company profile not found"));
			profileId = company.getId();
		}

		return new LoginResponse(token, user.getEmail(), user.getRole(), profileId);
	}
}
