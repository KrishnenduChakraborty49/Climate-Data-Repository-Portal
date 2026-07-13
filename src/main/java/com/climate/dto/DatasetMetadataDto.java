package com.climate.dto;

import lombok.Data;

@Data
public class DatasetMetadataDto {
    private String resolution;
    private String coordinateSystem;
    private String coveragePeriod;
    private String license;
    private String citation;
    private String publisher;
}
