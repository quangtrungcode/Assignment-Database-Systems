package com.example.demo.controller;

import com.example.demo.dto.request.CourseCreationRequest;
import com.example.demo.dto.request.CourseUpdateRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.CourseResponse;
import com.example.demo.dto.response.StudentCourseResponse;
import com.example.demo.service.CourseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseController {
    CourseService courseService;

    // API 1: Dành cho Admin xem danh sách dạy của GV bất kỳ
    @GetMapping("/lecturer/{lecturerId}")
    @PreAuthorize("hasAuthority('ROLE_admin')")
    public ApiResponse<List<CourseResponse>> getCoursesByLecturer(@PathVariable String lecturerId) {
        return ApiResponse.<List<CourseResponse>>builder()
                .result(courseService.getCoursesByLecturerId(lecturerId))
                .build();
    }

    // API 2: Dành cho Giảng viên tự xem lớp mình dạy
    @GetMapping("/my-teaching")
    @PreAuthorize("hasAuthority('ROLE_lecturer')") // Chỉ giảng viên mới vào được
    public ApiResponse<List<CourseResponse>> getMyTeachingCourses() {
        return ApiResponse.<List<CourseResponse>>builder()
                .result(courseService.getMyTeachingCourses())
                .build();
    }

    @PostMapping
    //@PreAuthorize("hasAuthority('ROLE_admin')") // Chỉ Admin mới được tạo khóa học
    public ApiResponse<CourseResponse> createCourse(@RequestBody CourseCreationRequest request) {
        return ApiResponse.<CourseResponse>builder()
                .result(courseService.createCourse(request))
                .build();
    }

    @GetMapping
// @PreAuthorize("hasAuthority('ROLE_admin')") // Nếu muốn chỉ Admin mới xem được
// Hoặc để "hasAnyAuthority('ROLE_admin', 'ROLE_student', 'ROLE_lecturer')" nếu ai cũng xem được
    public ApiResponse<List<CourseResponse>> getAllCourses() {
        return ApiResponse.<List<CourseResponse>>builder()
                .result(courseService.getAllCourses())
                .build();
    }

    @PutMapping("/{courseId}")
    //@PreAuthorize("hasAuthority('ROLE_admin')") // Chỉ Admin được cập nhật
    public ApiResponse<CourseResponse> updateCourse(
            @PathVariable String courseId,
            @RequestBody CourseUpdateRequest request) {

        return ApiResponse.<CourseResponse>builder()
                .result(courseService.updateCourse(courseId, request))
                .build();
    }

    @DeleteMapping("/{courseId}")
    //@PreAuthorize("hasAuthority('ROLE_admin')") // Chỉ Admin được xóa
    public ApiResponse<Void> deleteCourse(@PathVariable String courseId) {
        courseService.deleteCourse(courseId);

        return ApiResponse.<Void>builder()
                .message("Xóa khóa học thành công: " + courseId)
                .build();
    }

    @PostMapping("/{courseId}/enroll")
// Chỉ cho phép sinh viên (ROLE_student) đăng ký
    //@PreAuthorize("hasAuthority('ROLE_student')")
    public ApiResponse<Void> enrollStudentToCourse(@PathVariable String courseId) {

        courseService.enrollStudent(courseId);

        return ApiResponse.<Void>builder()
                .message("Đăng ký khóa học thành công!")
                .build();
    }

    @DeleteMapping("/{courseId}/unenroll")
// Chỉ sinh viên (ROLE_student) mới có quyền tự hủy đăng ký
    //@PreAuthorize("hasAuthority('ROLE_student')")
    public ApiResponse<Void> unenrollStudentFromCourse(@PathVariable String courseId) {

        courseService.unenrollStudent(courseId);

        return ApiResponse.<Void>builder()
                .message("Hủy đăng ký khóa học thành công!")
                .build();
    }

    @GetMapping("/my-enrollments")
// Chỉ sinh viên mới được gọi API này
    //@PreAuthorize("hasAuthority('ROLE_student')")
    public ApiResponse<Set<StudentCourseResponse>> getMyEnrollments() {
        return ApiResponse.<Set<StudentCourseResponse>>builder()
                .result(courseService.getEnrolledCoursesForCurrentUser())
                .build();
    }
}
