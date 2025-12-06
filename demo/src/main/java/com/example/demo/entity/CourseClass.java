//package com.example.demo.entity;
//
//import jakarta.persistence.*;
//import lombok.Data;
//import lombok.ToString;
//
//@Entity
//@Table(name = "Class")
//@Data
//public class CourseClass {
//
//    @EmbeddedId
//    private CourseClassId id;
//
//    // QUAN TRỌNG: @MapsId("courseId")
//    // Ý nghĩa: Cột khóa ngoại "CourseID" sẽ được map vào thuộc tính "courseId"
//    // nằm bên trong @EmbeddedId ở trên.
//    @MapsId("courseId")
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "CourseID") // Tên cột trong DB
//    @ToString.Exclude // Tránh vòng lặp vô tận khi in log
//    private Course course;
//
//    @Column(name = "ClassCapacity")
//    private Integer classCapacity;
//
//    @Column(name = "Semester")
//    private String semester;
//
//    @Column(name = "[Day]")
//    private String day;
//
//    @Column(name = "Room")
//    private String room;
//}
