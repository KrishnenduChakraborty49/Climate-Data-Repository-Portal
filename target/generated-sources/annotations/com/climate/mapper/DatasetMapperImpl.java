package com.climate.mapper;

import com.climate.dto.DatasetMetadataDto;
import com.climate.dto.DatasetRequest;
import com.climate.dto.DatasetResponse;
import com.climate.entity.Dataset;
import com.climate.entity.DatasetMetadata;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-13T15:23:58+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Microsoft)"
)
@Component
public class DatasetMapperImpl implements DatasetMapper {

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public DatasetResponse toResponse(Dataset dataset) {
        if ( dataset == null ) {
            return null;
        }

        DatasetResponse datasetResponse = new DatasetResponse();

        datasetResponse.setMetadata( toMetadataDto( dataset ) );
        datasetResponse.setId( dataset.getId() );
        datasetResponse.setTitle( dataset.getTitle() );
        datasetResponse.setDescription( dataset.getDescription() );
        datasetResponse.setOriginalFilename( dataset.getOriginalFilename() );
        datasetResponse.setMimeType( dataset.getMimeType() );
        datasetResponse.setFileSize( dataset.getFileSize() );
        datasetResponse.setFileFormat( dataset.getFileFormat() );
        datasetResponse.setIsPublic( dataset.getIsPublic() );
        datasetResponse.setVersion( dataset.getVersion() );
        datasetResponse.setDownloadCount( dataset.getDownloadCount() );
        datasetResponse.setCreatedAt( dataset.getCreatedAt() );
        datasetResponse.setUpdatedAt( dataset.getUpdatedAt() );
        datasetResponse.setCategory( categoryMapper.toResponse( dataset.getCategory() ) );

        return datasetResponse;
    }

    @Override
    public Dataset toEntity(DatasetRequest request) {
        if ( request == null ) {
            return null;
        }

        Dataset.DatasetBuilder dataset = Dataset.builder();

        dataset.title( request.getTitle() );
        dataset.description( request.getDescription() );
        dataset.isPublic( request.getIsPublic() );
        dataset.version( request.getVersion() );

        return dataset.build();
    }

    @Override
    public DatasetMetadata toMetadataEntity(DatasetMetadataDto dto) {
        if ( dto == null ) {
            return null;
        }

        DatasetMetadata.DatasetMetadataBuilder datasetMetadata = DatasetMetadata.builder();

        datasetMetadata.resolution( dto.getResolution() );
        datasetMetadata.coordinateSystem( dto.getCoordinateSystem() );
        datasetMetadata.coveragePeriod( dto.getCoveragePeriod() );
        datasetMetadata.license( dto.getLicense() );
        datasetMetadata.citation( dto.getCitation() );
        datasetMetadata.publisher( dto.getPublisher() );

        return datasetMetadata.build();
    }

    @Override
    public void updateMetadataFromDto(DatasetMetadataDto dto, DatasetMetadata metadata) {
        if ( dto == null ) {
            return;
        }

        metadata.setResolution( dto.getResolution() );
        metadata.setCoordinateSystem( dto.getCoordinateSystem() );
        metadata.setCoveragePeriod( dto.getCoveragePeriod() );
        metadata.setLicense( dto.getLicense() );
        metadata.setCitation( dto.getCitation() );
        metadata.setPublisher( dto.getPublisher() );
    }

    @Override
    public void updateEntityFromRequest(DatasetRequest request, Dataset dataset) {
        if ( request == null ) {
            return;
        }

        dataset.setTitle( request.getTitle() );
        dataset.setDescription( request.getDescription() );
        dataset.setIsPublic( request.getIsPublic() );
        dataset.setVersion( request.getVersion() );
    }
}
