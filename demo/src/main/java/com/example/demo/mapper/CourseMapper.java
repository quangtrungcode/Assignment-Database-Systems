package com.example.demo.mapper;

import com.example.demo.dto.request.ClassRequest;
import com.example.demo.dto.request.CourseCreationRequest;
import com.example.demo.dto.request.CourseUpdateRequest;
import com.example.demo.dto.response.CourseResponse;
import com.example.demo.dto.response.LecturerShortInfo;
import com.example.demo.dto.response.StudentCourseResponse;
import com.example.demo.entity.Course;
//import com.example.demo.entity.CourseClass;
import com.example.demo.entity.Lecturer;
import com.example.demo.entity.Student;
import org.mapstruct.*;

import java.util.Set;
import java.util.stream.Collectors;

//@Mapper(componentModel = "spring",nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
//public interface CourseMapper {
//    @Mapping(target = "courseID", ignore = true) // ID tự sinh trong Service
//    @Mapping(target = "lecturers", ignore = true) // Lecturer set tay trong Service
//    @Mapping(target = "students", ignore = true)
//    Course toCourse(CourseCreationRequest request);
//
////    @Mapping(target = "id", source = "userID") // 👈 QUAN TRỌNG: Map userID -> id
////    LecturerShortInfo toLecturerShortInfo(Lecturer lecturer);
//
//    //@Mapping(target = "lecturer", source = "lecturers")
//    @Mapping(target = "maxCapacity", source = "maxCapacity")
//    // Map số lượng sinh viên hiện tại
//    @Mapping(target = "currentEnrollment", expression = "java(course.getStudents() == null ? 0 : course.getStudents().size())")
//    CourseResponse toCourseResponse(Course course);
//
//    Set<StudentCourseResponse> toStudentCourseResponseSet(Set<Course> courses);
//}

@Mapper(componentModel = "spring") // Để Spring có thể @Autowired
public interface CourseMapper {

//    // 1. Map từ Request tạo Course sang Entity Course
//    // MapStruct tự động map List<ClassRequest> sang List<CourseClass> nhờ hàm bên dưới
//    @Mapping(target = "courseId", ignore = true) // ID sinh tự động
//    @Mapping(target = "classes", source = "classes")
//    @Mapping(target = "students", ignore = true)
//    Course toCourseEntity(CourseCreationRequest request);
//
//
//    CourseResponse toCourseResponse(Course course);
//    // 2. Map từ Request tạo Class sang Entity CourseClass
//    @Mapping(target = "id", ignore = true)     // ID (ClassNo) phải tính toán trong Service
//    @Mapping(target = "course", ignore = true) // Quan hệ cha con gán trong Service
//    CourseClass toClassEntity(ClassRequest request);
//
//    // (Optional) Map ngược lại từ Entity sang DTO để trả về Client
//    // @Mapping(...)
//    // CourseResponse toResponse(Course course);

    // Tạo mới: Ignore các trường quan hệ và ID (ID tự sinh ở Service)
    @Mapping(target = "courseId", ignore = true)
    @Mapping(target = "students", ignore = true)
    @Mapping(target = "lecturers", ignore = true)
    Course toEntity(CourseCreationRequest request);

    // Update: Copy data từ request vào entity
    //@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "students", ignore = true)
    @Mapping(target = "lecturers", ignore = true)
    void updateCourseFromRequest(CourseUpdateRequest request, @MappingTarget Course course);

    // --- MAPPING QUAN TRỌNG NHẤT: TRẢ VỀ RESPONSE ---

    // 1. Map students -> currentEnrollment (Đếm số lượng)
    @Mapping(target = "currentEnrollment", source = "students", qualifiedByName = "countStudents")
    // 2. Map lecturers -> lecturerName (Nối chuỗi tên)
    @Mapping(target = "lecturerName", source = "lecturers", qualifiedByName = "joinLecturerNames")
    CourseResponse toCourseResponse(Course course);

    // --- CÁC HÀM XỬ LÝ LOGIC ---

    @Named("countStudents")
    default int countStudents(Set<Student> students) {
        if (students == null) return 0;
        return students.size();
    }

    @Named("joinLecturerNames")
    default String joinLecturerNames(Set<Lecturer> lecturers) {
        if (lecturers == null || lecturers.isEmpty()) {
            return "Chưa phân công";
        }
        // Vì Lecturer extends User, nên gọi được getFullName() từ User
        return lecturers.stream()
                .map(Lecturer::getFullName)
                .collect(Collectors.joining(", "));
    }
}
