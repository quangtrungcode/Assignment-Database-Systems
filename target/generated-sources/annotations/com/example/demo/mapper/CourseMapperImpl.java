package com.example.demo.mapper;

import com.example.demo.dto.request.CourseCreationRequest;
import com.example.demo.dto.response.CourseResponse;
import com.example.demo.dto.response.StudentCourseResponse;
import com.example.demo.entity.Course;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-03T19:58:00+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.9 (Oracle Corporation)"
)
@Component
public class CourseMapperImpl implements CourseMapper {

    @Override
    public Course toCourse(CourseCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Course.CourseBuilder course = Course.builder();

        course.courseName( request.getCourseName() );
        course.credits( request.getCredits() );
        course.maxCapacity( request.getMaxCapacity() );

        return course.build();
    }

    @Override
    public CourseResponse toCourseResponse(Course course) {
        if ( course == null ) {
            return null;
        }

        CourseResponse.CourseResponseBuilder courseResponse = CourseResponse.builder();

        courseResponse.maxCapacity( course.getMaxCapacity() );
        courseResponse.courseID( course.getCourseID() );
        courseResponse.courseName( course.getCourseName() );
        courseResponse.credits( course.getCredits() );

        courseResponse.currentEnrollment( course.getStudents() == null ? 0 : course.getStudents().size() );

        return courseResponse.build();
    }

    @Override
    public Set<StudentCourseResponse> toStudentCourseResponseSet(Set<Course> courses) {
        if ( courses == null ) {
            return null;
        }

        Set<StudentCourseResponse> set = new LinkedHashSet<StudentCourseResponse>( Math.max( (int) ( courses.size() / .75f ) + 1, 16 ) );
        for ( Course course : courses ) {
            set.add( courseToStudentCourseResponse( course ) );
        }

        return set;
    }

    protected StudentCourseResponse courseToStudentCourseResponse(Course course) {
        if ( course == null ) {
            return null;
        }

        StudentCourseResponse.StudentCourseResponseBuilder studentCourseResponse = StudentCourseResponse.builder();

        studentCourseResponse.courseID( course.getCourseID() );
        studentCourseResponse.courseName( course.getCourseName() );
        studentCourseResponse.credits( course.getCredits() );

        return studentCourseResponse.build();
    }
}
