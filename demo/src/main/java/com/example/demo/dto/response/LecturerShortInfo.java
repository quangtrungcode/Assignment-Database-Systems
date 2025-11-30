package com.example.demo.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LecturerShortInfo {
    String id;       // ID giảng viên (để frontend link tới trang profile nếu cần)
    String fullName; // Tên hiển thị
}