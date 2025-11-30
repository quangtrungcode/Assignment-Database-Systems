//package com.example.demo.service;
//
//import com.example.demo.entity.Course;
//import com.example.demo.entity.Student;
//import com.example.demo.exception.AppException;
//import com.example.demo.exception.ErrorCode;
//import com.example.demo.repository.CourseRepository;
//import com.example.demo.repository.StudentRepository;
//import com.example.demo.repository.UserRepository;
//import lombok.AccessLevel;
//import lombok.RequiredArgsConstructor;
//import lombok.experimental.FieldDefaults;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//
//import java.util.HashSet;
//
//@Service
//@RequiredArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//public class EnrollStudentService {
//    UserRepository userRepository;
//    StudentRepository studentRepository;
//    CourseRepository courseRepository;
//
//    public void enrollStudent(String courseId) {
//        // 1. Lấy ID sinh viên từ JWT Token (Security Context)
//        // Giả định bạn đã cấu hình để lưu UserID vào principal name
//        var context = SecurityContextHolder.getContext();
//        String studentId = context.getAuthentication().getName();
//
//        // 2. Tìm Entity
//        Course course = courseRepository.findById(courseId)
//                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
//
//        Student student = studentRepository.findById(studentId)
//                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
//
//        // 3. VALIDATION: Kiểm tra lớp học đã đầy chưa
//        if (course.getStudents() != null) {
//            int currentCount = course.getStudents().size();
//
//            if (currentCount >= course.getMaxCapacity()) {
//                throw new AppException(ErrorCode.COURSE_FULL); // Báo lỗi: Lớp đã đầy
//            }
//
//            // 4. VALIDATION: Kiểm tra đã đăng ký khóa học này chưa
//            if (course.getStudents().contains(student)) {
//                throw new AppException(ErrorCode.ALREADY_ENROLLED); // Báo lỗi: Đã đăng ký rồi
//            }
//        }
//
//        // 5. Thêm sinh viên vào danh sách của Khóa học
//        // Hibernate sẽ tự động tạo dòng mới trong bảng Enrollments
//        if (course.getStudents() == null) {
//            course.setStudents(new HashSet<>());
//        }
//        course.getStudents().add(student);
//
//        // 6. Lưu Khóa học
//        courseRepository.save(course);
//    }
//
//}
