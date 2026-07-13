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
    @org.springframework.data.jpa.repository.Query("SELECT d FROM Dataset d WHERE " +
           "(:category = '' OR LOWER(d.category.name) = LOWER(:category)) AND " +
           "(:search = '' OR LOWER(d.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(d.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Dataset> searchDatasets(@org.springframework.data.repository.query.Param("category") String category, @org.springframework.data.repository.query.Param("search") String search, Pageable pageable);

    boolean existsByStoredFilename(String storedFilename);
}
