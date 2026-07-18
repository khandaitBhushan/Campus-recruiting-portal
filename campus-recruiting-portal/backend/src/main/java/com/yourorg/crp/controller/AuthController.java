package com.yourorg.crp.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yourorg.crp.dto.CompanyRegistrationRequest;
import com.yourorg.crp.dto.CompanyResponse;
import com.yourorg.crp.dto.LoginRequest;
import com.yourorg.crp.dto.LoginResponse;
import com.yourorg.crp.dto.StudentRegisterRequest;
import com.yourorg.crp.dto.StudentResponse;
import com.yourorg.crp.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/login")
	public LoginResponse login(@Valid @RequestBody LoginRequest request) {
		return authService.login(request);
	}

	@PostMapping("/register/student")
	public StudentResponse registerStudent(@Valid @RequestBody StudentRegisterRequest request) {
		return StudentResponse.from(authService.registerStudent(request));
	}

	@PostMapping("/register/company")
	public CompanyResponse registerCompany(@Valid @RequestBody CompanyRegistrationRequest request) {
		return CompanyResponse.from(authService.registerCompany(request));
	}
}
