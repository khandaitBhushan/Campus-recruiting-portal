package com.yourorg.crp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yourorg.crp.model.FileAttachment;

public interface FileAttachmentRepository extends JpaRepository<FileAttachment, Long> {
}
