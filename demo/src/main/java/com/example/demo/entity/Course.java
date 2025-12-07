package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;
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

//    @Id
//    @Column(name = "CourseID", length = 20)
//    String courseID;
//
//    @Column(name = "CourseName", nullable = false)
//    String courseName;
//
//    @Column(name = "Credits")
//    int credits;
//
//    @Column(name = "MaxCapacity")
//    int maxCapacity;
//
//    // --- Mối quan hệ N-1 với Lecturer ---
//    // Nhiều khóa học thuộc về 1 giảng viên
////    @ManyToOne
////    @JoinColumn(name = "LectureID") // Tên cột FK trong bảng Courses
////    @JsonManagedReference
////    Lecturer lecturer;
//
//    @ManyToMany(mappedBy = "courses")
//    @JsonIgnore
//    Set<Lecturer> lecturers;


@Id
@Column(name = "CourseID", length = 20)

private String courseId;

    @Column(name = "CourseName")
    private String courseName;

    @Column(name = "Credits")
    int credits;

    @Column(name = "MaxCapacity")
    int maxCapacity;

    @Column(name = "Semester")
    Integer semester;


    // orphanRemoval = true: Nếu xóa Class khỏi list này, nó sẽ bị xóa khỏi DB.
    // CascadeType.ALL: Save Course sẽ tự động Save luôn Class.
//    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
//    @ToString.Exclude
//    private List<CourseClass> classes = new ArrayList<>();
//
//    // Helper method để thêm Class vào Course đúng chuẩn quan hệ 2 chiều
//    public void addClass(CourseClass courseClass) {
//        // Tạo ID mới nếu chưa có
//        if (courseClass.getId() == null) {
//            courseClass.setId(new CourseClassId());
//        }
//
//        // Gán quan hệ 2 chiều
//        classes.add(courseClass);
//        courseClass.setCourse(this);
//    }

    // --- Mối quan hệ M-N với Student ---
    // Khai báo ngược lại để Hibernate hiểu (mappedBy trỏ tới tên biến bên Student)
    @ManyToMany(mappedBy = "courses")
    @JsonIgnore
    Set<Student> students;

    // 2. Map ngược về Lecturer
    // "courses" là tên biến Set<Course> trong class Lecturer
    @ManyToMany(mappedBy = "courses")
    @JsonIgnore
    Set<Lecturer> lecturers;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Course course = (Course) o;
        return getCourseId() != null && Objects.equals(getCourseId(), course.getCourseId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}