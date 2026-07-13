package com.climate.controller;

import com.climate.dto.ApiResponse;
import com.climate.dto.DatasetRequest;
import com.climate.dto.DatasetResponse;
import com.climate.service.DatasetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/datasets")
@RequiredArgsConstructor
public class DatasetController {

    private final DatasetService datasetService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DatasetResponse>>> getAllDatasets(
            @RequestParam(required = false) String category,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Datasets retrieved successfully", datasetService.getAllDatasets(category, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DatasetResponse>> getDatasetById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Dataset retrieved successfully", datasetService.getDatasetById(id)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DatasetResponse>> uploadDataset(
            @RequestPart("dataset") @Valid DatasetRequest request,
            @RequestPart("file") MultipartFile file,
            Authentication authentication) {
        
        DatasetResponse response = datasetService.uploadDataset(request, file, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Dataset uploaded successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDataset(@PathVariable UUID id) {
        datasetService.deleteDataset(id);
        return ResponseEntity.ok(ApiResponse.success("Dataset deleted successfully", null));
    }
}
