package com.example.demo.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.Date;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    @NotBlank(message = "PASSWORD_REQUIRED")
    @Size(min = 8,message = "INVALID_PASSWORD")
    String passwordHash;
    @NotBlank(message = "EMAIL_REQUIRED")
    @Email(message = "INVALID_EMAIL_FORMAT")
    String email;
    @NotBlank(message = "FULL_NAME_REQUIRED")
    @Size(min = 8,message = "INVALID_FULL_NAME")
    String fullName;
    String gender;
    String phone;
    Date birthDate;
    String roleType;
}