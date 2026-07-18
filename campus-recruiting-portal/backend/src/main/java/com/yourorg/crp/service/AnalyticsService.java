package com.yourorg.crp.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yourorg.crp.dto.AnalyticsResponse;
import com.yourorg.crp.dto.BranchPlacementStats;
import com.yourorg.crp.dto.CgpaBandPlacementStats;
import com.yourorg.crp.dto.CompanyApplicationStats;
import com.yourorg.crp.model.ApplicationStatus;
import com.yourorg.crp.model.ApprovalStatus;
import com.yourorg.crp.model.Student;
import com.yourorg.crp.repository.CompanyRepository;
import com.yourorg.crp.repository.JobPostingRepository;
import com.yourorg.crp.repository.StudentApplicationRepository;
import com.yourorg.crp.repository.StudentRepository;

@Service
public class AnalyticsService {
	private final CompanyRepository companyRepository;
	private final StudentRepository studentRepository;
	private final JobPostingRepository postingRepository;
	private final StudentApplicationRepository applicationRepository;

	public AnalyticsService(CompanyRepository companyRepository, StudentRepository studentRepository,
			JobPostingRepository postingRepository, StudentApplicationRepository applicationRepository) {
		this.companyRepository = companyRepository;
		this.studentRepository = studentRepository;
		this.postingRepository = postingRepository;
		this.applicationRepository = applicationRepository;
	}

	@Transactional(readOnly = true)
	public AnalyticsResponse snapshot() {
		long totalStudents = studentRepository.count();
		long placedStudents = applicationRepository.countDistinctStudentsByStatus(ApplicationStatus.SELECTED);
		BigDecimal placementRate = totalStudents == 0
				? BigDecimal.ZERO
				: BigDecimal.valueOf(placedStudents * 100.0 / totalStudents).setScale(1, RoundingMode.HALF_UP);
		List<CompanyApplicationStats> applicationsPerCompany = companyRepository.findAll()
				.stream()
				.map(company -> new CompanyApplicationStats(company.getId(), company.getName(),
						applicationRepository.countByPostingCompanyId(company.getId())))
				.toList();
		List<Student> students = studentRepository.findAll();
		Set<Long> placedStudentIds = applicationRepository.findAll()
				.stream()
				.filter(application -> application.getStatus() == ApplicationStatus.SELECTED)
				.map(application -> application.getStudent().getId())
				.collect(Collectors.toSet());
		List<BranchPlacementStats> branchStats = students.stream()
				.collect(Collectors.groupingBy(Student::getBranch))
				.entrySet()
				.stream()
				.sorted(Map.Entry.comparingByKey())
				.map(entry -> new BranchPlacementStats(entry.getKey(), entry.getValue().size(),
						entry.getValue().stream().filter(student -> placedStudentIds.contains(student.getId())).count()))
				.toList();
		List<CgpaBandPlacementStats> cgpaBandStats = students.stream()
				.collect(Collectors.groupingBy(this::cgpaBand))
				.entrySet()
				.stream()
				.sorted(Comparator.comparing(Map.Entry::getKey))
				.map(entry -> new CgpaBandPlacementStats(entry.getKey(), entry.getValue().size(),
						entry.getValue().stream().filter(student -> placedStudentIds.contains(student.getId())).count()))
				.toList();

		return new AnalyticsResponse(
				companyRepository.count(),
				totalStudents,
				postingRepository.count(),
				postingRepository.countByStatus(ApprovalStatus.PENDING),
				postingRepository.countByStatus(ApprovalStatus.APPROVED),
				postingRepository.countByStatus(ApprovalStatus.REJECTED),
				postingRepository.countByStatus(ApprovalStatus.CLOSED),
				applicationRepository.count(),
				placedStudents,
				placementRate,
				applicationsPerCompany,
				branchStats,
				cgpaBandStats);
	}

	private String cgpaBand(Student student) {
		BigDecimal cgpa = student.getCgpa();
		if (cgpa.compareTo(BigDecimal.valueOf(8.5)) >= 0) {
			return "8.5+";
		}
		if (cgpa.compareTo(BigDecimal.valueOf(7.5)) >= 0) {
			return "7.5-8.49";
		}
		if (cgpa.compareTo(BigDecimal.valueOf(6.5)) >= 0) {
			return "6.5-7.49";
		}
		return "Below 6.5";
	}
}
