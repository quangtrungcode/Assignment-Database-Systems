package com.example.demo.dto.request;

import com.example.demo.entity.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserSearchRequest {
    String userID;
    String email;
    String fullName;
    String gender;
    String phone;
    //Date birthDate;
    String roleName;
    //Date createdAt;
    Date birthDateFrom;
    Date birthDateTo;

    // Lọc theo Phạm vi Ngày Tạo
    Date createdAtFrom;
    Date createdAtTo;
}
