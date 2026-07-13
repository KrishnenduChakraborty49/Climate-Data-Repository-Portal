package com.climate.controller;

import com.climate.entity.Dataset;
import com.climate.exception.ResourceNotFoundException;
import com.climate.repository.DatasetRepository;
import com.climate.service.DownloadService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/download")
@RequiredArgsConstructor
public class DownloadController {

    private final DownloadService downloadService;
    private final DatasetRepository datasetRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Resource> downloadDataset(
            @PathVariable UUID id,
            HttpServletRequest request,
            Authentication authentication) {

        String userEmail = authentication != null ? authentication.getName() : null;
        String ipAddress = request.getRemoteAddr();

        Resource resource = downloadService.downloadDataset(id, userEmail, ipAddress);

        Dataset dataset = datasetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dataset not found"));

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(dataset.getMimeType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + dataset.getOriginalFilename() + "\"")
                .body(resource);
    }
}
