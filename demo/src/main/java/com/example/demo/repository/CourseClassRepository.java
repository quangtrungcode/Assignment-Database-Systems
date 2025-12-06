//package com.example.demo.repository;
//
//import com.example.demo.entity.CourseClass;
//import com.example.demo.entity.CourseClassId;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//public interface CourseClassRepository extends JpaRepository<CourseClass, CourseClassId> {
//    @Query("SELECT COALESCE(MAX(c.id.classNo), 0) FROM CourseClass c WHERE c.id.courseId = :courseId")
//    Integer findMaxClassNoByCourseId(@Param("courseId") String courseId);
//}
