package com.climate.mapper;

import com.climate.dto.CategoryRequest;
import com.climate.dto.CategoryResponse;
import com.climate.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toResponse(Category category);
    List<CategoryResponse> toResponseList(List<Category> categories);
    Category toEntity(CategoryRequest request);
    void updateEntityFromRequest(CategoryRequest request, @MappingTarget Category category);
}
