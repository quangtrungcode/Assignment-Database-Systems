package com.example.demo.mapper;

import com.example.demo.dto.request.CourseCreationRequest;
import com.example.demo.dto.response.CourseResponse;
import com.example.demo.dto.response.LecturerShortInfo;
import com.example.demo.dto.response.StudentCourseResponse;
import com.example.demo.entity.Course;
import com.example.demo.entity.Lecturer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.Set;

@Mapper(componentModel = "spring",nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CourseMapper {
    @Mapping(target = "courseID", ignore = true) // ID tự sinh trong Service
    @Mapping(target = "lecturers", ignore = true) // Lecturer set tay trong Service
    @Mapping(target = "students", ignore = true)
    Course toCourse(CourseCreationRequest request);

//    @Mapping(target = "id", source = "userID") // 👈 QUAN TRỌNG: Map userID -> id
//    LecturerShortInfo toLecturerShortInfo(Lecturer lecturer);

    //@Mapping(target = "lecturer", source = "lecturers")
    @Mapping(target = "maxCapacity", source = "maxCapacity")
    // Map số lượng sinh viên hiện tại
    @Mapping(target = "currentEnrollment", expression = "java(course.getStudents() == null ? 0 : course.getStudents().size())")
    CourseResponse toCourseResponse(Course course);

    Set<StudentCourseResponse> toStudentCourseResponseSet(Set<Course> courses);
}
