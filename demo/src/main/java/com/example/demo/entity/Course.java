package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "Course")
public class Course {

    @Id
    @Column(name = "CourseID", length = 20)
    String courseID;

    @Column(name = "CourseName", nullable = false)
    String courseName;

    @Column(name = "Credits")
    int credits;

    @Column(name = "MaxCapacity")
    int maxCapacity;

    // --- Mối quan hệ N-1 với Lecturer ---
    // Nhiều khóa học thuộc về 1 giảng viên
//    @ManyToOne
//    @JoinColumn(name = "LectureID") // Tên cột FK trong bảng Courses
//    @JsonManagedReference
//    Lecturer lecturer;

    @ManyToMany(mappedBy = "courses")
    @JsonIgnore
    Set<Lecturer> lecturers;


    // --- Mối quan hệ M-N với Student ---
    // Khai báo ngược lại để Hibernate hiểu (mappedBy trỏ tới tên biến bên Student)
    @ManyToMany(mappedBy = "courses")
    @JsonIgnore
    Set<Student> students;
}