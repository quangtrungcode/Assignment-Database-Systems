package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Setter
@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "Lecturer")
// Mapping: Cột LectureID trong bảng Lecturers sẽ khớp với UserID trong bảng Users
@PrimaryKeyJoinColumn(name = "LectureID")
public class Lecturer extends User {

    @Column(name = "Profession", columnDefinition = "nvarchar(150)")
    String profession;

//    @OneToMany(mappedBy = "lecturer", fetch = FetchType.LAZY)
//    @JsonBackReference
//    Set<Course> courses;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "Teach", // Tên bảng trung gian trong SQL
            joinColumns = @JoinColumn(name = "LectureID"), // Khóa ngoại trỏ về Student
            inverseJoinColumns = @JoinColumn(name = "CourseID") // Khóa ngoại trỏ về Course
    )
    Set<Course> courses;
}