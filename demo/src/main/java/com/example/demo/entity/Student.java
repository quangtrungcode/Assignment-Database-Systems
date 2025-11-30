package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Setter
@Getter
@SuperBuilder // Dùng SuperBuilder để kế thừa các trường của User
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "Students")
// Mapping: Cột StudentID trong bảng Students sẽ khớp với UserID trong bảng Users
@PrimaryKeyJoinColumn(name = "StudentID")
public class Student extends User {

    @Column(name = "Career", columnDefinition = "nvarchar(150)")
    String career;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "Enrollments", // Tên bảng trung gian trong SQL
            joinColumns = @JoinColumn(name = "StudentID"), // Khóa ngoại trỏ về Student
            inverseJoinColumns = @JoinColumn(name = "CourseID") // Khóa ngoại trỏ về Course
    )
    Set<Course> courses;
}