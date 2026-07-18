package com.yourorg.crp.controller;

import java.util.Map;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.yourorg.crp.model.FileAttachment;
import com.yourorg.crp.service.FileAttachmentService;

@RestController
@RequestMapping("/api/files")
public class FileController {
	private final FileAttachmentService fileService;

	public FileController(FileAttachmentService fileService) {
		this.fileService = fileService;
	}

	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("hasAnyRole('STUDENT', 'COMPANY', 'ADMIN')")
	public ResponseEntity<Map<String, Object>> uploadFile(@RequestParam("file") MultipartFile file) {
		FileAttachment attachment = fileService.uploadFile(file);
		String downloadUrl = "/api/files/" + attachment.getId();
		return ResponseEntity.ok(Map.of(
				"id", attachment.getId(),
				"fileName", attachment.getFileName(),
				"contentType", attachment.getContentType(),
				"url", downloadUrl
		));
	}

	@GetMapping("/{id}")
	public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
		FileAttachment attachment = fileService.getFile(id);
		return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(attachment.getContentType()))
				.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + attachment.getFileName() + "\"")
				.body(new ByteArrayResource(attachment.getData()));
	}
}
