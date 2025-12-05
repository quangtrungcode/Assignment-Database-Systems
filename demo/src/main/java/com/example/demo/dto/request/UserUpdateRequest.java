package com.example.demo.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    @Size(min = 8,message = "INVALID_PASSWORD")
    String passwordHash;


    @Email(message = "INVALID_EMAIL_FORMAT")
    String email;


    @Size(min = 8,message = "INVALID_FULL_NAME")
    String fullName;

    String gender;
    Set<String> phones;
    Date birthDate;
    String role;
    String career;
    String profession;
}
