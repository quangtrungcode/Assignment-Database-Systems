package com.example.demo.service;

import com.corundumstudio.socketio.SocketIOServer;
import com.example.demo.dto.request.TeachingRequest; // DTO chứa lecturerId và courseId
import com.example.demo.dto.response.CourseResponse;
import com.example.demo.entity.Course;
import com.example.demo.entity.Lecturer;
import com.example.demo.entity.User; // Entity User đóng vai trò là Lecturer
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.CourseMapper;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.LectureRepository;
import com.example.demo.repository.UserRepository;
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
public class TeachingAssignmentService {

    UserRepository userRepository; // Repository tìm Giảng viên
    CourseRepository courseRepository;
    SocketIOServer socketIOServer;
    private final LectureRepository lectureRepository;
    CourseMapper courseMapper;

    // --- GIẢNG VIÊN ĐĂNG KÝ DẠY (N-N) ---
    @Transactional
    public void registerTeaching(TeachingRequest request) {
        // 1. Tìm User theo ID
        User user = userRepository.findById(request.getLecturerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng id: " + request.getLecturerId()));

        // 2. Kiểm tra xem User này có phải là Lecturer không?
        if (!(user instanceof Lecturer)) {
            throw new RuntimeException("ID này không phải là Giảng viên!");
        }

        Lecturer lecturer = (Lecturer) user;
        // 2. Tìm Khóa học
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học id: " + request.getCourseId()));

        // 3. CHECK: Giảng viên đã đăng ký dạy môn này chưa?
        // Vì quan hệ là N-N, ta check trong danh sách courses của giảng viên
        if (lecturer.getCourses().contains(course)) {
            throw new RuntimeException("Bạn đã đăng ký giảng dạy lớp này rồi!");
        }

        // 4. CHECK SĨ SỐ GIẢNG VIÊN (Tùy chọn)
        // Nếu bạn muốn giới hạn 1 lớp tối đa 2 GV, bạn có thể check size ở đây
        if (course.getLecturers().size() >= 2) throw new AppException(ErrorCode.COURSE_MAX_LECTURER_REACHED);

        // 5. THỰC HIỆN ĐĂNG KÝ (Thêm vào Set)
        lecturer.getCourses().add(course);

        // 6. Lưu xuống DB
        // Save lecturer vì Lecturer là bên sở hữu quan hệ (owning side) giống Student
        User user1=userRepository.save(lecturer);

        // 7. Gửi Socket SAU KHI Commit
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                // Sự kiện: REGISTER_TEACHING
                // Gửi về ID khóa học để Frontend reload lại sĩ số/trạng thái
                socketIOServer.getBroadcastOperations().sendEvent("REGISTER_TEACHING", user1.getUserID());
            }
        });
    }

    // --- GIẢNG VIÊN HỦY DẠY (N-N) ---
    @Transactional
    public void cancelTeaching(TeachingRequest request) {
        // 1. Tìm User theo ID
        User user = userRepository.findById(request.getLecturerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng id: " + request.getLecturerId()));

        // 2. Kiểm tra xem User này có phải là Lecturer không?
        if (!(user instanceof Lecturer)) {
            throw new RuntimeException("ID này không phải là Giảng viên!");
        }

        Lecturer lecturer = (Lecturer) user;

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Khóa học không tồn tại"));

        // 2. CHECK: GV có đang dạy lớp này không?
        if (!lecturer.getCourses().contains(course)) {
            throw new RuntimeException("Bạn chưa đăng ký dạy lớp này, không thể hủy.");
        }

        // 3. HỦY DẠY (Xóa khỏi Set)
        lecturer.getCourses().remove(course);

        // 4. Lưu DB
        User user1=userRepository.save(lecturer);

        // 5. Gửi Socket
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                socketIOServer.getBroadcastOperations().sendEvent("CANCEL_TEACHING", user1.getUserID());
            }
        });
    }

    public List<CourseResponse> getTeachingCourses(String lecturerId) {
        // 1. Tìm User theo ID
        User user = userRepository.findById(lecturerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng id: " + "lecturerId"));

        // 2. Kiểm tra xem User này có phải là Lecturer không?
        if (!(user instanceof Lecturer)) {
            throw new RuntimeException("ID này không phải là Giảng viên!");
        }

        Lecturer lecturer = (Lecturer) user;

        // 2. Lấy danh sách Courses từ Set<Course> của giảng viên
        // Và Map sang DTO (CourseResponse) để trả về Frontend
        return lecturer.getCourses().stream()
                .map(courseMapper::toCourseResponse)
                .collect(Collectors.toList());
    }
}