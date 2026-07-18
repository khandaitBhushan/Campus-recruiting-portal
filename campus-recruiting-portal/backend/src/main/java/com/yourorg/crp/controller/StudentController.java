package com.yourorg.crp.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yourorg.crp.dto.StudentResponse;
import com.yourorg.crp.dto.UpdateStudentProfileRequest;
import com.yourorg.crp.service.StudentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/students")
public class StudentController {
	private final StudentService studentService;

	public StudentController(StudentService studentService) {
		this.studentService = studentService;
	}

	@GetMapping("/{studentId}")
	@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
	public StudentResponse profile(@PathVariable Long studentId) {
		return StudentResponse.from(studentService.studentProfile(studentId));
	}

	@PutMapping("/{studentId}")
	@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
	public StudentResponse updateProfile(@PathVariable Long studentId, @Valid @RequestBody UpdateStudentProfileRequest request) {
		return StudentResponse.from(studentService.updateProfile(studentId, request.name(), request.department(), request.branch(), request.cgpa(), request.activeBacklogs(), request.resumeUrl()));
	}
}
