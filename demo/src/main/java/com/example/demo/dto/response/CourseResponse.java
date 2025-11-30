package com.example.demo.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseResponse {
    String courseID;
    String courseName;
    int credits;
    LecturerShortInfo lecturer;

    // 👇 Hai thông số quan trọng
    int maxCapacity;   // Sức chứa (Ví dụ: 60)
    int currentEnrollment; // Đã đăng ký (Ví dụ: 30)
}
