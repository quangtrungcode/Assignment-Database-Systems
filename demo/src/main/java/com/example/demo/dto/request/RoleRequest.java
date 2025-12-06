package com.example.demo.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleRequest {
    @NotBlank(message = "ROLE_NAME_REQUIRED")
    String roleName;
    String description;
   // @Min(value = 1, message = "INVALID_LEVEL")
    Integer level;
    Set<String> permissions;
}
