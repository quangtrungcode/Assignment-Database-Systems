package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Enrollment") // Tên bảng trong DB
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    // 1. Nhúng khóa chính phức hợp vào đây
    @EmbeddedId
    private EnrollmentId id;

    // 2. Mapping quan hệ với Student (User)
    @ManyToOne
    @MapsId("studentId") // Map với field studentId trong EnrollmentId
    @JoinColumn(name = "StudentID") // Tên cột FK trong DB
    private User student;

    // 3. Mapping quan hệ với Course
    @ManyToOne
    @MapsId("courseId") // Map với field courseId trong EnrollmentId
    @JoinColumn(name = "CourseID") // Tên cột FK trong DB
    private Course course;

    // Các trường phụ khác (nếu có)
    // private Double grade;
    // private LocalDateTime enrollmentDate;
}