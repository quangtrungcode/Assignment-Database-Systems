package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "Roles")
public class Role {
    @Id
    @Column(name = "Name", length = 50)
    String name;
    @Column(name = "Description")
    String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "RolePermissions", // 👈 TÊN BẢNG BẠN MUỐN DÙNG
            joinColumns = @JoinColumn(name = "RoleName"), // Khóa ngoại trỏ về bảng Roles
            inverseJoinColumns = @JoinColumn(name = "PermissionName") // Khóa ngoại trỏ về bảng Permission
    )
    Set<Permission> permissions;
    //cascade = CascadeType.ALL, fetch = FetchType.LAZY
    @OneToMany(mappedBy = "role")
//    @JsonIgnore
    @JsonBackReference
    private Set<User> users; // Tập hợp tất cả Users có Role này
}
