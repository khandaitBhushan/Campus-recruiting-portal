package com.yourorg.crp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "file_attachments")
public class FileAttachment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String fileName;

	@Column(nullable = false)
	private String contentType;

	@Lob
	@Column(nullable = false, columnDefinition = "LONGBLOB")
	private byte[] data;

	protected FileAttachment() {
	}

	public FileAttachment(String fileName, String contentType, byte[] data) {
		this.fileName = fileName;
		this.contentType = contentType;
		this.data = data;
	}

	public Long getId() {
		return id;
	}

	public String getFileName() {
		return fileName;
	}

	public String getContentType() {
		return contentType;
	}

	public byte[] getData() {
		return data;
	}
}
