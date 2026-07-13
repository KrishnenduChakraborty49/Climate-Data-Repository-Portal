package com.climate.repository;

import com.climate.entity.Download;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DownloadRepository extends JpaRepository<Download, UUID> {
}
