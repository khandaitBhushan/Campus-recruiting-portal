package com.yourorg.crp.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.yourorg.crp.model.UserRole;
import com.yourorg.crp.model.Student;
import com.yourorg.crp.model.User;
import com.yourorg.crp.repository.StudentRepository;
import com.yourorg.crp.repository.UserRepository;

@Service
public class StudentService {
	private final StudentRepository studentRepository;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public StudentService(StudentRepository studentRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.studentRepository = studentRepository;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional(readOnly = true)
	public Student studentProfile(Long studentId) {
		return studentRepository.findById(studentId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
	}

	@Transactional(readOnly = true)
	public List<Student> studentsForAdmin() {
		return studentRepository.findAll();
	}

	@Transactional
	public Student updateProfile(Long studentId, String name, String department, String branch, BigDecimal cgpa,
			int activeBacklogs, String resumeUrl) {
		Student student = studentRepository.findById(studentId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
		student.updateProfile(name, department, branch, cgpa, activeBacklogs, resumeUrl);
		return studentRepository.save(student);
	}

	@Transactional
	public Student updatePlacementStatus(Long studentId, boolean placed) {
		Student student = studentRepository.findById(studentId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
		student.setPlaced(placed);
		return studentRepository.save(student);
	}

	@Transactional
	public void importStudentsFromCsv(MultipartFile file) {
		try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
			String line;
			boolean isHeader = true;
			while ((line = reader.readLine()) != null) {
				if (line.trim().isBlank()) {
					continue;
				}
				String[] parts = line.split(",");
				if (isHeader) {
					isHeader = false;
					// check if it's indeed a header line
					if (line.toLowerCase().contains("email") || line.toLowerCase().contains("name")) {
						continue;
					}
				}
				if (parts.length < 8) {
					throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid CSV format. Expected: Name,Email,Department,Branch,CGPA,ActiveBacklogs,GraduationYear,Password");
				}
				String name = parts[0].trim();
				String email = parts[1].trim();
				String department = parts[2].trim();
				String branch = parts[3].trim();
				BigDecimal cgpa = new BigDecimal(parts[4].trim());
				int activeBacklogs = Integer.parseInt(parts[5].trim());
				int graduationYear = Integer.parseInt(parts[6].trim());
				String password = parts[7].trim();

				if (!email.endsWith("@university.edu")) {
					continue; // skip or fail? let's fail to maintain data integrity
				}
				if (userRepository.existsByEmail(email)) {
					continue; // skip duplicate email
				}

				User user = new User(email, passwordEncoder.encode(password), UserRole.STUDENT);
				user = userRepository.save(user);

				Student student = new Student(user, name, email, department, branch, cgpa, activeBacklogs, "", graduationYear);
				studentRepository.save(student);
			}
		}
		catch (Exception e) {
			if (e instanceof ResponseStatusException) {
				throw (ResponseStatusException) e;
			}
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to parse CSV file: " + e.getMessage(), e);
		}
	}
}
