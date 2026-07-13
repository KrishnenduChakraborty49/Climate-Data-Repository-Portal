package com.climate.service;

import com.climate.entity.Dataset;
import com.climate.entity.Download;
import com.climate.entity.User;
import com.climate.exception.ResourceNotFoundException;
import com.climate.repository.DatasetRepository;
import com.climate.repository.DownloadRepository;
import com.climate.repository.UserRepository;
import com.climate.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DownloadService {

    private final StorageService storageService;
    private final DatasetRepository datasetRepository;
    private final DownloadRepository downloadRepository;
    private final UserRepository userRepository;

    @Transactional
    public Resource downloadDataset(UUID datasetId, String userEmail, String ipAddress) {
        Dataset dataset = datasetRepository.findById(datasetId)
                .orElseThrow(() -> new ResourceNotFoundException("Dataset not found"));

        if (!dataset.getIsPublic() && userEmail == null) {
            throw new RuntimeException("Access Denied: This dataset requires authentication.");
        }

        Resource resource = storageService.loadAsResource(dataset.getStoredFilename());

        // Log the download
        Download downloadLog = Download.builder()
                .dataset(dataset)
                .ipAddress(ipAddress)
                .build();

        if (userEmail != null) {
            userRepository.findByEmail(userEmail).ifPresent(downloadLog::setUser);
        }

        downloadRepository.save(downloadLog);

        // Increment download counter
        dataset.setDownloadCount(dataset.getDownloadCount() + 1);
        datasetRepository.save(dataset);

        return resource;
    }
}
