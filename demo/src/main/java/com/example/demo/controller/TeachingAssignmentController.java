package com.example.demo.controller;

import com.example.demo.dto.request.TeachingRequest;
import com.example.demo.dto.response.ApiResponse; // Wrapper response chuẩn của bạn
import com.example.demo.dto.response.CourseResponse;
import com.example.demo.service.TeachingAssignmentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teaching") // Endpoint gốc, bạn có thể sửa tùy ý
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TeachingAssignmentController {

    TeachingAssignmentService teachingService;

    // 1. API Đăng ký dạy
    @PostMapping("/register")
    public ApiResponse<Void> registerTeaching(@RequestBody TeachingRequest request) {
        teachingService.registerTeaching(request);
        return ApiResponse.<Void>builder()
                .message("Đăng ký giảng dạy thành công")
                .build();
    }

    // 2. API Hủy dạy
    @PostMapping("/cancel")
    public ApiResponse<Void> cancelTeaching(@RequestBody TeachingRequest request) {
        teachingService.cancelTeaching(request);
        return ApiResponse.<Void>builder()
                .message("Hủy giảng dạy thành công")
                .build();
    }

    // 3. API Xem danh sách lớp giảng viên đang dạy
    @GetMapping("/lecturer/{lecturerId}")
    public ApiResponse<List<CourseResponse>> getTeachingCourses(@PathVariable String lecturerId) {
        var result = teachingService.getTeachingCourses(lecturerId);
        return ApiResponse.<List<CourseResponse>>builder()
                .result(result)
                .build();
    }
}