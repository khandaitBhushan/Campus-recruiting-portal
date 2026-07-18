package com.yourorg.crp;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.yourorg.crp.model.UserRole;
import com.yourorg.crp.config.JwtService;

@SpringBootTest
@AutoConfigureMockMvc
class ApiExceptionHandlingTests {
	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private JwtService jwtService;

	private String getAuthHeader(String email, UserRole role) {
		return "Bearer " + jwtService.generateToken(email, role);
	}

	@Test
	void missingPostingReturnsStructuredErrorResponse() throws Exception {
		mockMvc.perform(get("/api/postings/999999")
				.header("Authorization", getAuthHeader("priya.mehta@university.edu", UserRole.STUDENT)))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.error").value("Not Found"))
				.andExpect(jsonPath("$.message").value("Posting not found"))
				.andExpect(jsonPath("$.path").value("/api/postings/999999"));
	}

	@Test
	void invalidRequestBodyReturnsStructuredValidationError() throws Exception {
		String body = """
				{
				  "studentId": 1,
				  "postingId": 1,
				  "coverLetter": "",
				  "resumeUrl": ""
				}
				""";

		mockMvc.perform(post("/api/applications")
				.header("Authorization", getAuthHeader("priya.mehta@university.edu", UserRole.STUDENT))
				.contentType(MediaType.APPLICATION_JSON)
				.content(body))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.error").value("Bad Request"))
				.andExpect(jsonPath("$.message").value("Validation failed"))
				.andExpect(jsonPath("$.details", hasSize(2)));
	}
}
