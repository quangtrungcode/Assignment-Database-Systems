package com.example.demo.service;

import com.corundumstudio.socketio.SocketIOServer;
import com.example.demo.dto.request.EnrollmentRequest;
import com.example.demo.dto.response.CourseResponse;
import com.example.demo.entity.Course;
import com.example.demo.entity.Student;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.CourseMapper;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.EnrollmentRepository;
import com.example.demo.repository.StudentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EnrollmentService {

    StudentRepository studentRepository;
    CourseRepository courseRepository;
    CourseMapper courseMapper;
    SocketIOServer socketIOServer;
    EnrollmentRepository enrollmentRepository;
    // --- ĐĂNG KÝ HỌC PHẦN ---
    @Transactional
    public void registerCourse(EnrollmentRequest request) {
        // 1. Tìm Sinh viên
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên id: " + request.getStudentId()));

        // 2. Tìm Khóa học
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học id: " + request.getCourseId()));

        // 3. CHECK: Sinh viên đã đăng ký môn này chưa?
        // (Kiểm tra trong Set courses của student)
        if (student.getCourses().contains(course)) {
            throw new RuntimeException("Sinh viên đã đăng ký môn học này rồi!");
        }

        // 4. CHECK: Lớp đã đầy chưa?
        // Lưu ý: course.getStudents().size() sẽ đếm số lượng hiện tại
        int currentSize = course.getStudents().size();
        if (currentSize >= course.getMaxCapacity()) {
            throw new AppException(ErrorCode.COURSE_FULL);
        }

        // 5. THỰC HIỆN ĐĂNG KÝ
        // Vì Student là bên sở hữu quan hệ (@JoinTable nằm ở Student), ta add course vào student
        student.getCourses().add(course);

        // 6. Lưu xuống DB
        Student student1 = studentRepository.save(student);
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                // Chỉ bắn socket khi DB đã lưu xong xuôi
                socketIOServer.getBroadcastOperations().sendEvent("STUDENT_REGISTER_COURSE", student1.getUserID());
            }
        });
      //  socketIOServer.getBroadcastOperations().sendEvent("REGISTER_COURSE", student1.getUserID());
    }

    // --- HỦY ĐĂNG KÝ (NẾU CẦN) ---
    @Transactional
    public void cancelRegistration(EnrollmentRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!student.getCourses().contains(course)) {
            throw new RuntimeException("Sinh viên chưa đăng ký môn này, không thể hủy.");
        }

        // Xóa course khỏi danh sách
        student.getCourses().remove(course);
        Student student1 = studentRepository.save(student);
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                // Chỉ bắn socket khi DB đã lưu xong xuôi
                socketIOServer.getBroadcastOperations().sendEvent("STUDENT_CANCEL_COURSE", student1.getUserID());
            }
        });
        //socketIOServer.getBroadcastOperations().sendEvent("CANCEL_COURSE", student1.getUserID());
    }

    public List<CourseResponse> getEnrollmentsByStudentId(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return student.getCourses().stream()
                .map(courseMapper::toCourseResponse) // Chuyển Entity -> DTO
                .collect(Collectors.toList());


    }

    public int getTotalCredits(String studentId) {
        // Gọi repository chạy native query
        Integer total = enrollmentRepository.getTotalCredits(studentId);

        // Xử lý null (nếu DB trả về null thì coi là 0)
        return total != null ? total : 0;
    }
}