package com.yourorg.crp.controller;

import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;

import com.yourorg.crp.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex, WebRequest request) {
		HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
		return ResponseEntity.status(status).body(buildErrorResponse(status, ex.getReason(), request, null));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex, WebRequest request) {
		List<String> errors = ex.getBindingResult().getFieldErrors().stream()
				.map(this::formatFieldError)
				.toList();
		HttpStatus status = HttpStatus.BAD_REQUEST;
		return ResponseEntity.badRequest().body(buildErrorResponse(status, "Validation failed", request, errors));
	}

	@ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
	public ResponseEntity<ErrorResponse> handleAccessDeniedException(org.springframework.security.access.AccessDeniedException ex, WebRequest request) {
		HttpStatus status = HttpStatus.FORBIDDEN;
		return ResponseEntity.status(status).body(buildErrorResponse(status, "Access denied", request, null));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, WebRequest request) {
		ex.printStackTrace();
		HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
		return ResponseEntity.status(status).body(buildErrorResponse(status, "Unexpected server error", request, null));
	}

	private ErrorResponse buildErrorResponse(HttpStatus status, String message, WebRequest request, List<String> details) {
		return new ErrorResponse(
				Instant.now(),
				status.value(),
				status.getReasonPhrase(),
				message,
				request.getDescription(false).replace("uri=", ""),
				details);
	}

	private String formatFieldError(FieldError error) {
		return error.getField() + " " + error.getDefaultMessage();
	}
}
