package com.example.demo.repository;

import com.example.demo.entity.Course;
import com.example.demo.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, String> {

   // List<Course> findByLecturer_UserID(String lecturerId);

    @Query(value = "SELECT NEXT VALUE FOR Seq_Course", nativeQuery = true)
    Long getNextCourseId();
//
//    boolean existsByCourseName(String courseName);

    @Modifying
    @Query(value = "DELETE FROM Enrollment WHERE CourseID = :courseId", nativeQuery = true)
    void deleteEnrollmentByCourseId(@Param("courseId") String courseId);

    // 2. Xóa liên kết Giảng viên - Khóa học (Bảng Teach)
    @Modifying
    @Query(value = "DELETE FROM Teach WHERE CourseID = :courseId", nativeQuery = true)
    void deleteTeachByCourseId(@Param("courseId") String courseId);

    @Modifying
    @Query(value = "DELETE FROM COURSE_PREREQ WHERE CourseID = :courseId OR PrereqID = :courseId", nativeQuery = true)
    void deletePrereqByCourseId(@Param("courseId") String courseId);
}

