package com.yourorg.crp.controller;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

	@RequestMapping(value = {"/health", "/api/health"}, method = {RequestMethod.GET, RequestMethod.HEAD})
	public ResponseEntity<Map<String, Object>> health() {
		return ResponseEntity.ok(Map.of(
				"status", "UP",
				"message", "Campus Recruiting Portal is healthy and active",
				"timestamp", Instant.now().toString()
		));
	}

	@RequestMapping(value = "favicon.ico", method = {RequestMethod.GET, RequestMethod.HEAD})
	public ResponseEntity<Void> favicon() {
		return ResponseEntity.noContent().build();
	}
}
