package com.example.demo.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseUpdateRequest {
     //@NotBlank(message = "COURSE_NAME_REQUIRED")
     String courseName;
     @Min(value = 1, message = "INVALID_CREDIT")
     int credits;
     @Min(value = 10, message = "INVALID_MAX_CAPACITY")
     int  maxCapacity;

     Integer semester;
}

