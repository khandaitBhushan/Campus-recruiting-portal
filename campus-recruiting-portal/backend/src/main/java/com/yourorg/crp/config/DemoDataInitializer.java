package com.yourorg.crp.config;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.yourorg.crp.model.UserRole;
import com.yourorg.crp.model.ApplicationStatus;
import com.yourorg.crp.model.Company;
import com.yourorg.crp.model.JobPosting;
import com.yourorg.crp.model.Student;
import com.yourorg.crp.model.StudentApplication;
import com.yourorg.crp.model.User;
import com.yourorg.crp.repository.CompanyRepository;
import com.yourorg.crp.repository.JobPostingRepository;
import com.yourorg.crp.repository.StudentApplicationRepository;
import com.yourorg.crp.repository.StudentRepository;
import com.yourorg.crp.repository.UserRepository;

@Component
public class DemoDataInitializer implements CommandLineRunner {
	private final CompanyRepository companyRepository;
	private final StudentRepository studentRepository;
	private final JobPostingRepository postingRepository;
	private final StudentApplicationRepository applicationRepository;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public DemoDataInitializer(CompanyRepository companyRepository, StudentRepository studentRepository,
			JobPostingRepository postingRepository, StudentApplicationRepository applicationRepository,
			UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.companyRepository = companyRepository;
		this.studentRepository = studentRepository;
		this.postingRepository = postingRepository;
		this.applicationRepository = applicationRepository;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	@Transactional
	public void run(String... args) {
		seedCorpayIfMissing();

		if (userRepository.count() > 1) {
			return;
		}

		User admin = new User("admin@university.edu", passwordEncoder.encode("admin123"), UserRole.ADMIN);
		userRepository.save(admin);

		User orbitUser = userRepository.save(new User("recruiting@orbit.example", passwordEncoder.encode("password123"), UserRole.COMPANY));
		Company orbit = new Company(orbitUser, "Orbit Analytics", "Data platforms", "recruiting@orbit.example");
		orbit.approve();

		User prismUser = userRepository.save(new User("talent@prism.example", passwordEncoder.encode("password123"), UserRole.COMPANY));
		Company prism = new Company(prismUser, "Prism Circuit Labs", "Embedded systems", "talent@prism.example");
		prism.approve();

		User rivertonUser = userRepository.save(new User("campus@riverton.example", passwordEncoder.encode("password123"), UserRole.COMPANY));
		Company riverton = new Company(rivertonUser, "Riverton Finance", "Fintech", "campus@riverton.example");
		riverton.reject("Company documents need placement-cell verification.");

		User bluefieldUser = userRepository.save(new User("hr@bluefield.example", passwordEncoder.encode("password123"), UserRole.COMPANY));
		Company bluefield = new Company(bluefieldUser, "Bluefield Mobility", "Urban logistics", "hr@bluefield.example");

		// Cognizant
		User ctsUser = userRepository.save(new User("recruiting@cognizant.example", passwordEncoder.encode("password123"), UserRole.COMPANY));
		Company cognizant = new Company(ctsUser, "Cognizant Technology Solutions", "IT Services", "recruiting@cognizant.example");
		cognizant.approve();

		// TCS
		User tcsUser = userRepository.save(new User("campus@tcs.example", passwordEncoder.encode("password123"), UserRole.COMPANY));
		Company tcs = new Company(tcsUser, "Tata Consultancy Services", "Consulting", "campus@tcs.example");
		tcs.approve();

		// LTIMindtree
		User ltiUser = userRepository.save(new User("talent@ltimindtree.example", passwordEncoder.encode("password123"), UserRole.COMPANY));
		Company lti = new Company(ltiUser, "LTI Mindtree", "Technology Solutions", "talent@ltimindtree.example");
		lti.approve();

		// Capgemini
		User capgUser = userRepository.save(new User("careers@capgemini.example", passwordEncoder.encode("password123"), UserRole.COMPANY));
		Company capgemini = new Company(capgUser, "Capgemini", "Management Consulting", "careers@capgemini.example");
		capgemini.approve();

		companyRepository.save(orbit);
		companyRepository.save(prism);
		companyRepository.save(riverton);
		companyRepository.save(bluefield);
		companyRepository.save(cognizant);
		companyRepository.save(tcs);
		companyRepository.save(lti);
		companyRepository.save(capgemini);

		User priyaUser = userRepository.save(new User("priya.mehta@university.edu", passwordEncoder.encode("password123"), UserRole.STUDENT));
		Student priya = studentRepository.save(new Student(priyaUser, "Priya Mehta", "priya.mehta@university.edu",
			"Engineering", "CSE", BigDecimal.valueOf(8.72), 0, "", 2027));

		User arjunUser = userRepository.save(new User("arjun.rao@university.edu", passwordEncoder.encode("password123"), UserRole.STUDENT));
		Student arjun = studentRepository.save(new Student(arjunUser, "Arjun Rao", "arjun.rao@university.edu", "Engineering",
			"ECE", BigDecimal.valueOf(7.86), 0, "", 2027));

		User sanaUser = userRepository.save(new User("sana.qureshi@university.edu", passwordEncoder.encode("password123"), UserRole.STUDENT));
		Student sana = studentRepository.save(new Student(sanaUser, "Sana Qureshi", "sana.qureshi@university.edu",
			"Engineering", "IT", BigDecimal.valueOf(8.21), 0, "", 2027));

		User vikramUser = userRepository.save(new User("vikram.iyer@university.edu", passwordEncoder.encode("password123"), UserRole.STUDENT));
		Student vikram = studentRepository.save(new Student(vikramUser, "Vikram Iyer", "vikram.iyer@university.edu",
			"Engineering", "Mechanical", BigDecimal.valueOf(6.92), 1, "", 2027));

		JobPosting dataAnalyst = new JobPosting(orbit, "Associate data analyst", "Bengaluru", "Full-time",
			BigDecimal.valueOf(12.4), "Build dashboards and decision models for campus retail clients.",
			"CGPA 7.5+, CSE/IT/ECE, no active backlogs", BigDecimal.valueOf(7.5), "CSE, IT, ECE", false,
			LocalDate.now().plusDays(24));
		dataAnalyst.approve();

		JobPosting firmware = new JobPosting(prism, "Firmware engineer intern", "Hyderabad", "Internship",
			BigDecimal.valueOf(5.8), "Prototype firmware for sensor boards and validation rigs.",
			"CGPA 7.0+, ECE/EEE/Mechanical, one backlog allowed", BigDecimal.valueOf(7.0), "ECE, EEE, Mechanical",
			true, LocalDate.now().plusDays(18));
		firmware.approve();

		JobPosting quant = new JobPosting(orbit, "Risk modeling trainee", "Remote", "Full-time",
			BigDecimal.valueOf(14.2), "Work with model monitoring and credit-risk experiments.",
			"CGPA 8.0+, CSE/IT/Mathematics, no active backlogs", BigDecimal.valueOf(8.0), "CSE, IT, Mathematics",
			false, LocalDate.now().plusDays(30));

		JobPosting ops = new JobPosting(prism, "Graduate operations associate", "Pune", "Full-time",
			BigDecimal.valueOf(7.6), "Coordinate production readiness and vendor metrics.",
			"CGPA 6.5+, all branches, backlogs allowed", BigDecimal.valueOf(6.5), "All branches", true,
			LocalDate.now().minusDays(2));
		ops.approve();
		ops.close();

		JobPosting ctsDeveloper = new JobPosting(cognizant, "Programmer Analyst Trainee", "Chennai", "Full-time",
			BigDecimal.valueOf(4.5), "Develop and maintain enterprise applications.",
			"CGPA 6.0+, CSE/IT/ECE, backlogs allowed", BigDecimal.valueOf(6.0), "CSE, IT, ECE", true,
			LocalDate.now().plusDays(30));
		ctsDeveloper.approve();

		JobPosting tcsNinja = new JobPosting(tcs, "System Engineer (TCS Ninja)", "Mumbai", "Full-time",
			BigDecimal.valueOf(3.6), "Work on digital technologies and cloud applications.",
			"CGPA 6.0+, all branches, no active backlogs", BigDecimal.valueOf(6.0), "CSE, IT, ECE, EEE, ME, CE", false,
			LocalDate.now().plusDays(25));
		tcsNinja.approve();

		JobPosting ltiAssociate = new JobPosting(lti, "Software Engineer Associate", "Pune", "Full-time",
			BigDecimal.valueOf(5.0), "Design and develop high-performance software tools.",
			"CGPA 6.5+, CSE/IT, no active backlogs", BigDecimal.valueOf(6.5), "CSE, IT", false,
			LocalDate.now().plusDays(20));
		ltiAssociate.approve();

		JobPosting capgAnalyst = new JobPosting(capgemini, "Analyst - Software Development", "Hyderabad", "Full-time",
			BigDecimal.valueOf(4.0), "Implement modular systems and cloud deployments.",
			"CGPA 6.25+, CSE/IT/ECE, one active backlog allowed", BigDecimal.valueOf(6.25), "CSE, IT, ECE", true,
			LocalDate.now().plusDays(15));
		capgAnalyst.approve();

		postingRepository.save(dataAnalyst);
		postingRepository.save(firmware);
		postingRepository.save(quant);
		postingRepository.save(ops);
		postingRepository.save(ctsDeveloper);
		postingRepository.save(tcsNinja);
		postingRepository.save(ltiAssociate);
		postingRepository.save(capgAnalyst);

		StudentApplication priyaApplication = new StudentApplication(priya, dataAnalyst,
				"I have built analytics dashboards for the student entrepreneur entrepreneurship cell.", "priya-resume-mock-id");
		priyaApplication.advanceTo(ApplicationStatus.SELECTED);
		StudentApplication arjunApplication = new StudentApplication(arjun, firmware,
				"I have lab experience with embedded C and board bring-up.", "arjun-resume-mock-id");
		arjunApplication.advanceTo(ApplicationStatus.INTERVIEW);
		StudentApplication sanaApplication = new StudentApplication(sana, dataAnalyst,
				"I want to work on product metrics and decision support.", "sana-resume-mock-id");
		sanaApplication.advanceTo(ApplicationStatus.SHORTLISTED);
		StudentApplication vikramApplication = new StudentApplication(vikram, firmware,
				"I can contribute mechanical validation experience to firmware test rigs.", "vikram-resume-mock-id");
		applicationRepository.save(priyaApplication);
		applicationRepository.save(arjunApplication);
		applicationRepository.save(sanaApplication);
		applicationRepository.save(vikramApplication);
	}

	private void seedCorpayIfMissing() {
		if (userRepository.existsByEmail("campus@corpay.example")) {
			return;
		}
		User corpayUser = userRepository.save(new User("campus@corpay.example", passwordEncoder.encode("password123"), UserRole.COMPANY));
		Company corpay = new Company(corpayUser, "Corpay", "Fintech & Global Payments", "campus@corpay.example");
		corpay.approve();
		companyRepository.save(corpay);

		JobPosting corpaySde = new JobPosting(corpay, "Software Development Engineer (Fintech)", "Bengaluru", "Full-time",
				BigDecimal.valueOf(14.5), "Build high-throughput global payment processing microservices using Java and cloud APIs.",
				"CGPA 7.0+, CSE/IT, no active backlogs", BigDecimal.valueOf(7.0), "CSE, IT", false,
				LocalDate.now().plusDays(25));
		corpaySde.approve();

		JobPosting corpayCloud = new JobPosting(corpay, "Cloud Systems & DevOps Engineer", "Pune", "Full-time",
				BigDecimal.valueOf(12.0), "Automate multi-region AWS infrastructure, Kubernetes clusters, and payment pipelines.",
				"CGPA 6.5+, CSE/IT/ECE, backlogs allowed", BigDecimal.valueOf(6.5), "CSE, IT, ECE", true,
				LocalDate.now().plusDays(20));
		corpayCloud.approve();

		JobPosting corpayData = new JobPosting(corpay, "Data Platform Engineer", "Hyderabad", "Full-time",
				BigDecimal.valueOf(13.2), "Develop real-time fraud monitoring data pipelines and financial streaming analytics.",
				"CGPA 7.5+, CSE/IT/Mathematics, no active backlogs", BigDecimal.valueOf(7.5), "CSE, IT", false,
				LocalDate.now().plusDays(30));
		corpayData.approve();

		postingRepository.save(corpaySde);
		postingRepository.save(corpayCloud);
		postingRepository.save(corpayData);
	}
}
