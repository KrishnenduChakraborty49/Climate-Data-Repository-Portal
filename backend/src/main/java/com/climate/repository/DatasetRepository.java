package com.climate.repository;

import com.climate.entity.Dataset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DatasetRepository extends JpaRepository<Dataset, UUID>, JpaSpecificationExecutor<Dataset> {
    Page<Dataset> findByIsPublicTrue(Pageable pageable);
    Page<Dataset> findByCategoryNameIgnoreCase(String categoryName, Pageable pageable);
    boolean existsByStoredFilename(String storedFilename);
}
