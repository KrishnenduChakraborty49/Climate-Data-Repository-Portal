package com.climate.service;

import com.climate.dto.DatasetRequest;
import com.climate.dto.DatasetResponse;
import com.climate.entity.Category;
import com.climate.entity.Dataset;
import com.climate.entity.DatasetMetadata;
import com.climate.entity.User;
import com.climate.exception.ResourceNotFoundException;
import com.climate.mapper.DatasetMapper;
import com.climate.repository.CategoryRepository;
import com.climate.repository.DatasetMetadataRepository;
import com.climate.repository.DatasetRepository;
import com.climate.repository.UserRepository;
import com.climate.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DatasetService {

    private final DatasetRepository datasetRepository;
    private final DatasetMetadataRepository metadataRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final DatasetMapper datasetMapper;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public Page<DatasetResponse> getAllDatasets(String categoryName, String search, Pageable pageable) {
        String cat = (categoryName != null && !categoryName.trim().isEmpty()) ? categoryName.trim() : null;
        String term = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        return datasetRepository.searchDatasets(cat, term, pageable).map(this::mapToResponseWithMetadata);
    }

    @Transactional(readOnly = true)
    public DatasetResponse getDatasetById(UUID id) {
        Dataset dataset = datasetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dataset not found"));
        return mapToResponseWithMetadata(dataset);
    }

    @Transactional
    public DatasetResponse uploadDataset(DatasetRequest request, MultipartFile file, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        String originalFilename = file.getOriginalFilename();
        String storedFilename = storageService.store(file, originalFilename);
        String checksum = storageService.calculateChecksum(file);

        Dataset dataset = datasetMapper.toEntity(request);
        dataset.setOriginalFilename(originalFilename);
        dataset.setStoredFilename(storedFilename);
        dataset.setMimeType(storageService.getMimeType(file));
        dataset.setFileSize(storageService.getFileSize(file));
        dataset.setFileFormat(getFileExtension(originalFilename));
        dataset.setChecksum(checksum);
        dataset.setUploadedBy(user);
        dataset.setCategory(category);

        dataset = datasetRepository.save(dataset);

        if (request.getMetadata() != null) {
            DatasetMetadata metadata = datasetMapper.toMetadataEntity(request.getMetadata());
            metadata.setDataset(dataset);
            metadataRepository.save(metadata);
        }

        return mapToResponseWithMetadata(dataset);
    }

    @Transactional
    public void deleteDataset(UUID id) {
        Dataset dataset = datasetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dataset not found"));
        
        storageService.delete(dataset.getStoredFilename());
        datasetRepository.delete(dataset);
    }

    private DatasetResponse mapToResponseWithMetadata(Dataset dataset) {
        DatasetResponse response = datasetMapper.toResponse(dataset);
        DatasetMetadata metadata = metadataRepository.findByDatasetId(dataset.getId());
        if (metadata != null) {
            response.setMetadata(datasetMapper.toMetadataDto(dataset)); // Fix mapper logic or map manually
            // Manual mapping for now
            response.getMetadata().setResolution(metadata.getResolution());
            response.getMetadata().setCoordinateSystem(metadata.getCoordinateSystem());
            response.getMetadata().setCoveragePeriod(metadata.getCoveragePeriod());
            response.getMetadata().setLicense(metadata.getLicense());
            response.getMetadata().setCitation(metadata.getCitation());
            response.getMetadata().setPublisher(metadata.getPublisher());
        }
        return response;
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "UNKNOWN";
        return filename.substring(filename.lastIndexOf(".") + 1).toUpperCase();
    }
}
