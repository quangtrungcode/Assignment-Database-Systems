package com.example.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileUpdateRequest {
    @NotBlank(message = "FULL_NAME_REQUIRED")
    @Size(min = 8,message = "INVALID_FULL_NAME")
    String fullName;
    String phone;
    String gender;
    Date birthDate;
}