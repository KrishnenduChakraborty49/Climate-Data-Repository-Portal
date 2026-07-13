package com.climate.repository;

import com.climate.entity.DatasetMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DatasetMetadataRepository extends JpaRepository<DatasetMetadata, UUID> {
    DatasetMetadata findByDatasetId(UUID datasetId);
}
