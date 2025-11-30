package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.Date;
import java.util.Set;

@Setter
@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Users")
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

    @Id
    @Column(name = "UserID", length = 20)
    String userID; // Lombok sẽ sinh getter/setter

    @Column(name = "Email", length = 100, nullable = false, unique = true)
    String email;

    @Column(name = "FullName", length = 100, nullable = false)
    String fullName;

    @Column(name = "Gender", length = 10)
    String gender;

    @Column(name = "Phone", length = 15)
    String phone;

    @Column(name = "BirthDate")
    @Temporal(TemporalType.DATE)
    Date birthDate;

    @Column(name = "PasswordHash", length = 255, nullable = false)
    String passwordHash;

//    @Column(name = "Roles", length = 20, nullable = false)
//    @ManyToMany
////    Set<String> roles;
//    Set<Role> roles;
////    String roles;

    @Column(name = "CreatedAt", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    Date createdAt;

//    @Column(name = "RoleName", length = 100, nullable = false)
//    String roleName;
//(fetch = FetchType.LAZY)
    @ManyToOne // Khuyến nghị dùng LAZY
    @JoinColumn(name = "RoleName") // 👈 Cột khóa ngoại trong bảng Users
    @JsonManagedReference
    Role role; // Tên trường là Role


    /**
     * Phương thức được gọi trước khi đối tượng được lưu (persist) lần đầu tiên.
     * Vẫn giữ nguyên để xử lý giá trị mặc định cho CreatedAt và Roles.
     */
    @PrePersist
    protected void onCreate() {
        // Thiết lập CreatedAt mặc định (GETDATE() trong SQL)
        if (this.createdAt == null) {
            this.createdAt = new Date();
        }
//        // Thiết lập Roles mặc định ('student')
//        if (this.roles == null) {
//            this.roles = setRoles("student");
//        }
    }
}