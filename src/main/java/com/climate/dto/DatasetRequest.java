package com.climate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DatasetRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Category ID is required")
    private Integer categoryId;

    private Boolean isPublic = false;

    private String version = "1.0";

    private DatasetMetadataDto metadata;
}
