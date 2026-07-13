package com.climate.mapper;

import com.climate.dto.DatasetMetadataDto;
import com.climate.dto.DatasetRequest;
import com.climate.dto.DatasetResponse;
import com.climate.entity.Dataset;
import com.climate.entity.DatasetMetadata;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class})
public interface DatasetMapper {

    @Mapping(target = "metadata", source = "dataset")
    DatasetResponse toResponse(Dataset dataset);

    default DatasetMetadataDto toMetadataDto(Dataset dataset) {
        // Need to fetch from metadata repository or inverse relationship if set
        // In our entity, Dataset doesn't have direct ref to Metadata, Metadata has ref to Dataset.
        // For simplicity we will handle metadata mapping manually in service or via a custom method.
        return null;
    }

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "uploadedBy", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "originalFilename", ignore = true)
    @Mapping(target = "storedFilename", ignore = true)
    @Mapping(target = "mimeType", ignore = true)
    @Mapping(target = "fileSize", ignore = true)
    @Mapping(target = "fileFormat", ignore = true)
    @Mapping(target = "checksum", ignore = true)
    @Mapping(target = "downloadCount", ignore = true)
    Dataset toEntity(DatasetRequest request);

    DatasetMetadata toMetadataEntity(DatasetMetadataDto dto);
    
    void updateMetadataFromDto(DatasetMetadataDto dto, @MappingTarget DatasetMetadata metadata);
    
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateEntityFromRequest(DatasetRequest request, @MappingTarget Dataset dataset);
}
