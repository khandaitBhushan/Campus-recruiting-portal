package com.yourorg.crp;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import com.yourorg.crp.model.UserRole;
import com.yourorg.crp.config.JwtService;
import com.yourorg.crp.config.DemoDataInitializer;
import com.yourorg.crp.repository.CompanyRepository;
import com.yourorg.crp.repository.JobPostingRepository;
import com.yourorg.crp.repository.StudentApplicationRepository;
import com.yourorg.crp.repository.StudentRepository;
import com.yourorg.crp.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
class RecruitingWorkflowIntegrationTests {
	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private StudentApplicationRepository applicationRepository;

	@Autowired
	private JobPostingRepository postingRepository;

	@Autowired
	private StudentRepository studentRepository;

	@Autowired
	private CompanyRepository companyRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private DemoDataInitializer demoDataInitializer;

	@BeforeEach
	void setUp() {
		applicationRepository.deleteAll();
		postingRepository.deleteAll();
		studentRepository.deleteAll();
		companyRepository.deleteAll();
		userRepository.deleteAll();
		demoDataInitializer.run();
	}

	private String getAuthHeader(String email, UserRole role) {
		return "Bearer " + jwtService.generateToken(email, role);
	}

	@Test
	void studentsSeeOnlyApprovedOpenPostings() throws Exception {
		mockMvc.perform(get("/api/postings/student")
				.header("Authorization", getAuthHeader("priya.mehta@university.edu", UserRole.STUDENT)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[*].title", hasItem("Associate data analyst")))
				.andExpect(jsonPath("$[*].title", hasItem("Firmware engineer intern")))
				.andExpect(jsonPath("$[*].title", not(hasItem("Risk modeling trainee"))))
				.andExpect(jsonPath("$[*].title", not(hasItem("Graduate operations associate"))))
				.andExpect(jsonPath("$[*].status", not(hasItem("PENDING"))))
				.andExpect(jsonPath("$[*].status", not(hasItem("CLOSED"))));
	}

	@Test
	void studentRoutesRejectNonStudentRole() throws Exception {
		mockMvc.perform(get("/api/postings/student")
				.header("Authorization", getAuthHeader("recruiting@orbit.example", UserRole.COMPANY)))
				.andExpect(status().isForbidden());
	}

	@Test
	void adminAnalyticsReportsApplicationsAndPlacementRate() throws Exception {
		mockMvc.perform(get("/api/admin/analytics")
				.header("Authorization", getAuthHeader("admin@university.edu", UserRole.ADMIN)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.applications").value(4))
				.andExpect(jsonPath("$.placedStudents").value(1))
				.andExpect(jsonPath("$.placementRate").value(25.0))
				.andExpect(jsonPath("$.applicationsPerCompany[?(@.companyName == 'Orbit Analytics')].applications")
						.value(hasItem(2)))
				.andExpect(jsonPath("$.branchPlacementStats[?(@.branch == 'CSE')].placed").value(hasItem(1)))
				.andExpect(jsonPath("$.cgpaBandPlacementStats[?(@.band == '8.5+')].placed").value(hasItem(1)));
	}
}
