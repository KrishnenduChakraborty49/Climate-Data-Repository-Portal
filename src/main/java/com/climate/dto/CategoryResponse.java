package com.climate.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CategoryResponse {
    private Integer id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
