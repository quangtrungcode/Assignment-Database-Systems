package com.example.demo.mapper;

import com.example.demo.dto.request.CourseCreationRequest;
import com.example.demo.dto.request.CourseUpdateRequest;
import com.example.demo.dto.response.CourseResponse;
import com.example.demo.entity.Course;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-07T19:05:06+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.9 (Oracle Corporation)"
)
@Component
public class CourseMapperImpl implements CourseMapper {

    @Override
    public Course toEntity(CourseCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Course.CourseBuilder course = Course.builder();

        course.courseName( request.getCourseName() );
        course.credits( request.getCredits() );
        course.maxCapacity( request.getMaxCapacity() );
        course.semester( request.getSemester() );

        return course.build();
    }

    @Override
    public void updateCourseFromRequest(CourseUpdateRequest request, Course course) {
        if ( request == null ) {
            return;
        }

        course.setCourseName( request.getCourseName() );
        course.setCredits( request.getCredits() );
        course.setMaxCapacity( request.getMaxCapacity() );
        course.setSemester( request.getSemester() );
    }

    @Override
    public CourseResponse toCourseResponse(Course course) {
        if ( course == null ) {
            return null;
        }

        CourseResponse.CourseResponseBuilder courseResponse = CourseResponse.builder();

        courseResponse.currentEnrollment( countStudents( course.getStudents() ) );
        courseResponse.lecturerName( joinLecturerNames( course.getLecturers() ) );
        courseResponse.courseId( course.getCourseId() );
        courseResponse.courseName( course.getCourseName() );
        courseResponse.credits( course.getCredits() );
        courseResponse.maxCapacity( course.getMaxCapacity() );
        courseResponse.semester( course.getSemester() );

        return courseResponse.build();
    }
}
