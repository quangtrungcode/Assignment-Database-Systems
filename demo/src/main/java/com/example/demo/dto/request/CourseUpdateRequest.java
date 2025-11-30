package com.example.demo.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseUpdateRequest {
    String courseName;

    // Số tín chỉ mới (Có thể null nếu không đổi)
    Integer credits;

    // Sĩ số tối đa mới (Có thể null nếu không đổi)
    Integer maxCapacity;

    // ID Giảng viên mới (Có thể null nếu không đổi)
    String lecturerId;
}

