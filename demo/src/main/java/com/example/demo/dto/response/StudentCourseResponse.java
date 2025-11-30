package com.example.demo.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentCourseResponse {
    String courseID;       // Cần thiết cho việc kiểm tra Set lookup ở Frontend
    String courseName;     // Tên hiển thị
    int credits;           // Số tín chỉ
}
