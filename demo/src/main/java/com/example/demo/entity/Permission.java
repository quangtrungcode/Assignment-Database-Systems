package com.example.demo.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "Permission")
public class Permission {
    @Id
    @Column(name = "Name", length = 50)
    String name;
    @Column(name = "Description")
    String description;

//    @ManyToMany(mappedBy = "permissions")
    @ManyToMany(mappedBy = "permissions")
    @JsonIgnore
    private Set<Role> roles;
}
