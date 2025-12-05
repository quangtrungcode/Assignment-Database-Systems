package com.example.demo.service;

import com.example.demo.dto.request.CourseCreationRequest;
import com.example.demo.dto.request.CourseUpdateRequest;
import com.example.demo.dto.response.CourseResponse;
import com.example.demo.dto.response.StudentCourseResponse;
import com.example.demo.entity.Course;
import com.example.demo.entity.Lecturer;
import com.example.demo.entity.Student;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.CourseMapper;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.LectureRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseService {
    CourseRepository courseRepository;
    CourseMapper courseMapper;
    UserRepository userRepository;
    private final LectureRepository lectureRepository;
    private final StudentRepository studentRepository;

    // 1. Admin hoặc Client xem khóa học của một Giảng viên cụ thể
//    public List<CourseResponse> getCoursesByLecturerId(String lecturerId) {
//        // Kiểm tra xem giảng viên có tồn tại không (Optional)
//        if (!userRepository.existsById(lecturerId)) {
//            throw new AppException(ErrorCode.USER_NOT_FOUND);
//        }
//
//        List<Course> courses = courseRepository.findByLecturer_UserID(lecturerId);
//        return courses.stream()
//                .map(courseMapper::toCourseResponse)
//                .toList();
//    }

    // 2. Giảng viên tự xem khóa học của mình (Lấy ID từ Token)
//    public List<CourseResponse> getMyTeachingCourses() {
//        // Lấy ID người dùng đang đăng nhập từ Security Context
//        var context = SecurityContextHolder.getContext();
//        String currentUserId = context.getAuthentication().getName();
//
//        List<Course> courses = courseRepository.findByLecturer_UserID(currentUserId);
//        return courses.stream()
//                .map(courseMapper::toCourseResponse)
//                .toList();
//    }



//    public CourseResponse createCourse(CourseCreationRequest request) {
//        // 1. Kiểm tra Giảng viên có tồn tại không
//        Lecturer lecturer = lectureRepository.findById(request.getLecturerId())
//                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
//
//        // 2. Sinh Course ID tự động (CRS + 4 số)
//        Long nextValue = courseRepository.getNextCourseIdSequence();
//        String formattedId = String.format("CRS%04d", nextValue);
//
//        // 3. Map dữ liệu từ Request sang Entity
//        Course course = courseMapper.toCourse(request);
//        course.setCourseID(formattedId);
//        course.setLecturer(lecturer);
//
//        // Xử lý giá trị mặc định cho MaxCapacity nếu người dùng không nhập
//        if (course.getMaxCapacity() <= 0) {
//            course.setMaxCapacity(60); // Mặc định 60
//        }
//
//        // 4. Lưu vào Database
//        return courseMapper.toCourseResponse(courseRepository.save(course));
//    }

    public List<CourseResponse> getAllCourses() {
        // Lấy tất cả khóa học
        List<Course> courses = courseRepository.findAll();

        // Convert sang DTO Response
        return courses.stream()
                .map(courseMapper::toCourseResponse)
                .toList();
    }

//    public CourseResponse updateCourse(String courseId, CourseUpdateRequest request) {
//        // 1. Tìm khóa học cần cập nhật
//        Course existingCourse = courseRepository.findById(courseId)
//                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
//
//        // 2. Cập nhật các trường (Chỉ cập nhật nếu Request cung cấp giá trị mới)
//
//        // Cập nhật Tên khóa học
//        if (request.getCourseName() != null && !request.getCourseName().isEmpty()) {
//            existingCourse.setCourseName(request.getCourseName());
//        }
//
//        // Cập nhật Tín chỉ
//        if (request.getCredits() != null && request.getCredits() > 0) {
//            existingCourse.setCredits(request.getCredits());
//        }
//
//        // Cập nhật Sĩ số tối đa
//        if (request.getMaxCapacity() != null && request.getMaxCapacity() > 0) {
//            existingCourse.setMaxCapacity(request.getMaxCapacity());
//        }
//
//        // Cập nhật Giảng viên
//        if (request.getLecturerId() != null && !request.getLecturerId().isEmpty()) {
//            Lecturer newLecturer = lectureRepository.findById(request.getLecturerId())
//                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)); // Giả sử lỗi này bao gồm cả Lecturer
//            existingCourse.setLecturer(newLecturer);
//        }
//
//        // 3. Lưu và trả về kết quả
//        return courseMapper.toCourseResponse(courseRepository.save(existingCourse));
//    }

    public void deleteCourse(String courseId) {
        // 1. Kiểm tra khóa học có tồn tại không
        if (!courseRepository.existsById(courseId)) {
            throw new AppException(ErrorCode.COURSE_NOT_FOUND);
        }

        // 2. Tiến hành xóa
        courseRepository.deleteById(courseId);

        // Lưu ý: Nếu khóa học đang có sinh viên đăng ký, bạn cần xử lý thêm:
        // a) Xóa hết liên kết trong bảng trung gian Course_Student trước, hoặc
        // b) Đặt CascadeType.ALL trong Entity để JPA tự xóa.
    }

    public void enrollStudent(String courseId) {
        // 1. Lấy ID sinh viên từ JWT Token (Security Context)
        // Giả định bạn đã cấu hình để lưu UserID vào principal name
        var context = SecurityContextHolder.getContext();
        String studentId = context.getAuthentication().getName();

        // 2. Tìm Entity
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 3. VALIDATION: Kiểm tra lớp học đã đầy chưa
        if (course.getStudents() != null) {
            int currentCount = course.getStudents().size();

            if (currentCount >= course.getMaxCapacity()) {
                throw new AppException(ErrorCode.COURSE_FULL); // Báo lỗi: Lớp đã đầy
            }

            // 4. VALIDATION: Kiểm tra đã đăng ký khóa học này chưa
            if (course.getStudents().contains(student)) {
                throw new AppException(ErrorCode.ALREADY_ENROLLED); // Báo lỗi: Đã đăng ký rồi
            }
        }

        // 5. Thêm sinh viên vào danh sách của Khóa học
        // Hibernate sẽ tự động tạo dòng mới trong bảng Enrollments
        if (course.getStudents() == null) {
            course.setStudents(new HashSet<>());
        }
        course.getStudents().add(student);
// 👇 6. THÊM VÀO PHÍA SỞ HỮU (Owning Side) - BẮT BUỘC ĐỂ LƯU VÀO BẢNG ENROLLMENTS
        if (student.getCourses() == null) {
            student.setCourses(new HashSet<>());
        }
        student.getCourses().add(course); // Thêm khóa học vào danh sách của sinh viên

// 👇 7. LƯU ENTITY SỞ HỮU
// Đổi từ courseRepository.save(course) thành:
        studentRepository.save(student);
    }


    public void unenrollStudent(String courseId) {
        // 1. Lấy ID sinh viên từ JWT Token
        String studentId = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Tìm Entity (Khóa học cần hủy)
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        // 3. Tìm Entity (Sinh viên đang thao tác)
        // Giả sử bạn đã inject StudentRepository hoặc UserRepository có thể tìm Student
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 4. VALIDATION: Kiểm tra xem sinh viên có đang học môn này không
        if (!student.getCourses().contains(course)) {
            throw new AppException(ErrorCode.NOT_ENROLLED) ;
        }

        // 5. XÓA MỐI QUAN HỆ (Remove from Owning Side)
        // - Xóa Khóa học khỏi Set của Sinh viên (Lệnh này khiến JPA xóa dòng trong bảng Enrollments)
        student.getCourses().remove(course);

        // - Xóa Sinh viên khỏi Set của Khóa học (Duy trì tính toàn vẹn Java Object)
        course.getStudents().remove(student);

        // 6. Lưu lại Entity Sở hữu (Student)
        studentRepository.save(student);

        // Lưu ý: Nếu bạn muốn làm gọn code hơn, bạn có thể viết một Native Query DELETE trực tiếp
        // vào bảng Enrollments, nhưng cách trên là cách JPA chuẩn.
    }

    public Set<StudentCourseResponse> getEnrolledCoursesForCurrentUser() {
        // 1. Lấy ID sinh viên từ Token (đã fix ở bước trước)
        String studentId = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Tìm Entity Student
        // Lệnh findById này sẽ trả về đúng entity Student (nhờ Joined Inheritance)
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 3. Trích xuất Set<Course> và map sang Set<StudentCourseResponse>
        // Hàm này sẽ trả về Set<Course> đã được lazy load
        if (student.getCourses() == null) {
            return Collections.emptySet();
        }

        // Dùng CourseMapper để chuyển đổi Set<Course> Entity sang Set<StudentCourseResponse> DTO
        return courseMapper.toStudentCourseResponseSet(student.getCourses());
    }
}
