package com.example.demo.dto.response;

import com.example.demo.entity.Role;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.Set;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String userID;
    String email;
    String fullName;
    String gender;
    String phone;
    Date birthDate;
    String passwordHash;
//    Set<String> roles;
    RoleResponse role;
    //String roleName;
   // String roleType;
    Date createdAt;
}
