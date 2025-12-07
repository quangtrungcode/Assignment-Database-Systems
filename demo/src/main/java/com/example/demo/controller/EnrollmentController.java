package com.example.demo.controller;

import com.example.demo.dto.request.EnrollmentRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.CourseResponse;
import com.example.demo.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    // API: POST /api/enrollments/register
    @PostMapping("/register")
    public ApiResponse<String> registerCourse(@RequestBody EnrollmentRequest request) {
        enrollmentService.registerCourse(request);
        return ApiResponse.<String>builder()
                .result("Đăng ký thành công!")
                .build();
    }

    // API: POST /api/enrollments/cancel
    @PostMapping("/cancel")
    public ApiResponse<String> cancelCourse(@RequestBody EnrollmentRequest request) {
        enrollmentService.cancelRegistration(request);
        return ApiResponse.<String>builder()
                .result("Hủy đăng ký thành công!")
                .build();
    }

    @GetMapping("/student/{studentId}")
    public ApiResponse<List<CourseResponse>> getStudentEnrollments(@PathVariable String studentId) {
        return ApiResponse.<List<CourseResponse>>builder()
                .result(enrollmentService.getEnrollmentsByStudentId(studentId))
                .build();
    }

    @GetMapping("/total-credits/{studentId}")
    public ApiResponse<Integer> getTotalCredits(@PathVariable String studentId) {
        int credits = enrollmentService.getTotalCredits(studentId);

        return ApiResponse.<Integer>builder()
                .result(credits) // Trả về số int (ví dụ: 15)
                .build();
    }
}