package com.yourorg.crp.controller;

import java.io.ByteArrayInputStream;
import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.yourorg.crp.dto.AnalyticsResponse;
import com.yourorg.crp.dto.StudentResponse;
import com.yourorg.crp.service.AnalyticsService;
import com.yourorg.crp.service.ReportService;
import com.yourorg.crp.service.StudentService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
	private final AnalyticsService analyticsService;
	private final StudentService studentService;
	private final ReportService reportService;

	public AdminController(AnalyticsService analyticsService, StudentService studentService, ReportService reportService) {
		this.analyticsService = analyticsService;
		this.studentService = studentService;
		this.reportService = reportService;
	}

	@GetMapping("/analytics")
	public AnalyticsResponse analytics() {
		return analyticsService.snapshot();
	}

	@GetMapping("/students")
	public List<StudentResponse> students() {
		return studentService.studentsForAdmin().stream().map(StudentResponse::from).toList();
	}

	@PostMapping(value = "/students/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> importStudents(@RequestParam("file") MultipartFile file) {
		studentService.importStudentsFromCsv(file);
		return ResponseEntity.ok("Students imported successfully");
	}

	@PutMapping("/students/{studentId}/placement")
	public StudentResponse updatePlacement(@PathVariable Long studentId, @RequestParam boolean placed) {
		return StudentResponse.from(studentService.updatePlacementStatus(studentId, placed));
	}

	@GetMapping("/reports/placement-pdf")
	public ResponseEntity<Resource> exportReport() {
		ByteArrayInputStream bis = reportService.generatePlacementReport();
		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=placement_report.pdf");
		return ResponseEntity.ok()
				.headers(headers)
				.contentType(MediaType.APPLICATION_PDF)
				.body(new InputStreamResource(bis));
	}
}
