package com.example.demo.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseCreationRequest {
    String courseName;
    int credits;
    int maxCapacity; // Sĩ số tối đa (nếu không gửi thì sẽ lấy default)
    String lecturerId; // Chỉ cần gửi ID của giảng viên phụ trách
}
