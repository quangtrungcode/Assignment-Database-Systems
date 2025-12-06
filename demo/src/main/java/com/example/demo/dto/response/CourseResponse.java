package com.example.demo.dto.response;

import com.example.demo.dto.request.ClassRequest;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
//public class CourseResponse {
//    String courseId;
//    String courseName;
//    int credits;
//  //  LecturerShortInfo lecturer;
//
//    // 👇 Hai thông số quan trọng
//    int maxCapacity;   // Sức chứa (Ví dụ: 60)
//    List<ClassRequest> classes;
//  //  int currentEnrollment; // Đã đăng ký (Ví dụ: 30)
//}

public class CourseResponse {
    private String courseId;
    private String courseName;
    private int credits;
    private int maxCapacity;
    Integer semester;
    // Hai trường tính toán (Computed fields)
    private int currentEnrollment; // Số lượng SV đã đăng ký
    private String lecturerName;   // Tên GV dạng chuỗi "A, B"
}
