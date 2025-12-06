package com.example.demo.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
//public class CourseCreationRequest {
//    @NotBlank(message = "COURSE_NAME_REQUIRED")
//    String courseName;
//    @Min(value = 1, message = "INVALID_CREDIT")
//    int credits;
//    @Min(value = 1, message = "INVALID_MAX_CAPACITY")
//    int maxCapacity; // Sĩ số tối đa (nếu không gửi thì sẽ lấy default)
//    String lecturerId; // Chỉ cần gửi ID của giảng viên phụ trách
//}


public class CourseCreationRequest {
    //@NotBlank(message = "COURSE_NAME_REQUIRED")
     String courseName;
    @Min(value = 1, message = "INVALID_CREDIT")
     int credits;
    @Min(value = 10, message = "INVALID_MAX_CAPACITY")
     int  maxCapacity;

    Integer semester;
  //  private List<ClassRequest> classes; // Danh sách lớp muốn tạo ngay lúc tạo môn
}
