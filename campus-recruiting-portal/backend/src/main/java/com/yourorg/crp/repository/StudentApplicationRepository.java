package com.yourorg.crp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.yourorg.crp.model.ApplicationStatus;
import com.yourorg.crp.model.StudentApplication;

public interface StudentApplicationRepository extends JpaRepository<StudentApplication, Long> {
	boolean existsByStudentIdAndPostingId(Long studentId, Long postingId);

	List<StudentApplication> findByStudentIdOrderByAppliedAtDesc(Long studentId);

	List<StudentApplication> findByPostingIdOrderByAppliedAtDesc(Long postingId);

	List<StudentApplication> findAllByOrderByAppliedAtDesc();

	long countByPostingCompanyId(Long companyId);

	@Query("select count(distinct application.student.id) from StudentApplication application where application.status = :status")
	long countDistinctStudentsByStatus(ApplicationStatus status);
}
