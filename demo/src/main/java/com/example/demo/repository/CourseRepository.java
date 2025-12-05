package com.example.demo.repository;

import com.example.demo.entity.Course;
import com.example.demo.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, String> {

   // List<Course> findByLecturer_UserID(String lecturerId);

    @Query(value = "SELECT NEXT VALUE FOR Seq_Course", nativeQuery = true)
    Long getNextCourseIdSequence();

    boolean existsByCourseName(String courseName);
}

