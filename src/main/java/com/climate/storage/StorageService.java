package com.climate.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String store(MultipartFile file, String originalFilename);
    Resource loadAsResource(String storedFilename);
    void delete(String storedFilename);
    long getFileSize(MultipartFile file);
    String getMimeType(MultipartFile file);
    String calculateChecksum(MultipartFile file);
}
