package com.yourorg.crp.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.yourorg.crp.model.ApplicationStatus;
import com.yourorg.crp.model.JobPosting;
import com.yourorg.crp.model.Student;
import com.yourorg.crp.model.StudentApplication;
import com.yourorg.crp.repository.JobPostingRepository;
import com.yourorg.crp.repository.StudentApplicationRepository;
import com.yourorg.crp.repository.StudentRepository;

@Service
public class ApplicationService {
	private final StudentRepository studentRepository;
	private final JobPostingRepository postingRepository;
	private final StudentApplicationRepository applicationRepository;

	public ApplicationService(StudentRepository studentRepository, JobPostingRepository postingRepository,
			StudentApplicationRepository applicationRepository) {
		this.studentRepository = studentRepository;
		this.postingRepository = postingRepository;
		this.applicationRepository = applicationRepository;
	}

	@Transactional
	public StudentApplication apply(Long studentId, Long postingId, String coverLetter, String resumeUrl) {
		Student student = studentRepository.findById(studentId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
		JobPosting posting = postingRepository.findById(postingId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Posting not found"));
		if (!posting.isOpenForApplications(LocalDate.now())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Students can apply only to open approved postings");
		}
		if (applicationRepository.existsByStudentIdAndPostingId(student.getId(), posting.getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Student already applied to this posting");
		}
		return applicationRepository.save(new StudentApplication(student, posting, coverLetter, resumeUrl));
	}

	@Transactional(readOnly = true)
	public List<StudentApplication> applicationsForStudent(Long studentId) {
		if (!studentRepository.existsById(studentId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
		}
		return applicationRepository.findByStudentIdOrderByAppliedAtDesc(studentId);
	}

	@Transactional(readOnly = true)
	public List<StudentApplication> allApplications() {
		return applicationRepository.findAllByOrderByAppliedAtDesc();
	}

	@Transactional(readOnly = true)
	public List<StudentApplication> applicationsForPosting(Long postingId) {
		if (!postingRepository.existsById(postingId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Posting not found");
		}
		return applicationRepository.findByPostingIdOrderByAppliedAtDesc(postingId);
	}

	@Transactional
	public StudentApplication advanceApplication(Long applicationId, ApplicationStatus status) {
		StudentApplication application = applicationRepository.findById(applicationId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
		try {
			application.advanceTo(status);
		}
		catch (IllegalArgumentException ex) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
		}
		return application;
	}
}
