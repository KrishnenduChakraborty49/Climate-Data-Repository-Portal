package com.climate.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class DatasetResponse {
    private UUID id;
    private String title;
    private String description;
    private String originalFilename;
    private String mimeType;
    private Long fileSize;
    private String fileFormat;
    private Boolean isPublic;
    private String version;
    private Long downloadCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private CategoryResponse category;
    private DatasetMetadataDto metadata;
    // Potentially include user info who uploaded it, but for now omit for security/simplicity
}
