package com.yourorg.crp.service;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.yourorg.crp.model.FileAttachment;
import com.yourorg.crp.repository.FileAttachmentRepository;

@Service
public class FileAttachmentService {
	private final FileAttachmentRepository repository;

	public FileAttachmentService(FileAttachmentRepository repository) {
		this.repository = repository;
	}

	@Transactional
	public FileAttachment uploadFile(MultipartFile file) {
		try {
			String fileName = file.getOriginalFilename();
			if (fileName == null || fileName.isBlank()) {
				fileName = "unnamed_file";
			}
			String contentType = file.getContentType();
			if (contentType == null || contentType.isBlank()) {
				contentType = "application/octet-stream";
			}
			FileAttachment attachment = new FileAttachment(fileName, contentType, file.getBytes());
			return repository.save(attachment);
		}
		catch (IOException e) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read upload file bytes", e);
		}
	}

	@Transactional(readOnly = true)
	public FileAttachment getFile(Long id) {
		return repository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found"));
	}
}
