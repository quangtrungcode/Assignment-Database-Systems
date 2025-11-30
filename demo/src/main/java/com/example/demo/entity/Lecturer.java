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
@Table(name = "Lecturers")
// Mapping: Cột LectureID trong bảng Lecturers sẽ khớp với UserID trong bảng Users
@PrimaryKeyJoinColumn(name = "LectureID")
public class Lecturer extends User {

    @Column(name = "Profession", columnDefinition = "nvarchar(150)")
    String profession;

    @OneToMany(mappedBy = "lecturer", fetch = FetchType.LAZY)
    @JsonBackReference
    Set<Course> courses;
}