package com.example.demo.exception;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
//    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
//    INVALID_KEY(1001, "Uncategorized error",HttpStatus.BAD_REQUEST),
//    FULL_NAME_EXISTED(1002, "User existed",HttpStatus.BAD_REQUEST),
//    USER_NOT_FOUND(1003, "User not found",HttpStatus.NOT_FOUND),
//    EMAIL_EXISTED(1004, "Email existed",HttpStatus.BAD_REQUEST),
//    INVALID_PASSWORD (1005, "Password must be at least 8 characters",HttpStatus.BAD_REQUEST),
//    INVALID_FULL_NAME(1006, "Full name must be at least 8 characters",HttpStatus.BAD_REQUEST),
//    EMAIL_REQUIRED(1007, "Email can't be blank",HttpStatus.BAD_REQUEST),
//    FULL_NAME_REQUIRED(1008, "Full name can't be blank",HttpStatus.BAD_REQUEST),
//    PASSWORD_REQUIRED(1009, "Password can't be blank",HttpStatus.BAD_REQUEST),
//    UNAUTHENTICATED(1010, "Unauthenticated",HttpStatus.UNAUTHORIZED),
//    UNAUTHORIZED(1011, "You do not have permission", HttpStatus.FORBIDDEN),
//    PERMISSION_NOT_FOUND(1012, "Permission not found", HttpStatus.BAD_REQUEST),
//    ROLE_NOT_FOUND(1013, "Role not found", HttpStatus.BAD_REQUEST),
//    CANNOT_DELETE(1014, "Cannot delete the resource as it is being referenced by other entities", HttpStatus.BAD_REQUEST),
//    INVALID_EMAIL_FORMAT(1015,"Email is not in valid format",HttpStatus.BAD_REQUEST);
UNCATEGORIZED_EXCEPTION(9999, "Lỗi không được phân loại", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Khoá không hợp lệ", HttpStatus.BAD_REQUEST),
    //FULL_NAME_EXISTED(1002, "Họ và tên đã tồn tại", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1003, "Không tìm thấy người dùng", HttpStatus.NOT_FOUND),
    EMAIL_EXISTED(1004, "Email đã tồn tại", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD (1005, "Mật khẩu phải có ít nhất 8 ký tự", HttpStatus.BAD_REQUEST),
    INVALID_FULL_NAME(1006, "Họ và tên phải có ít nhất 8 ký tự", HttpStatus.BAD_REQUEST),
    EMAIL_REQUIRED(1007, "Email không được để trống", HttpStatus.BAD_REQUEST),
    FULL_NAME_REQUIRED(1008, "Họ và tên không được để trống", HttpStatus.BAD_REQUEST),
    PASSWORD_REQUIRED(1009, "Mật khẩu không được để trống", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1010, "Bạn chưa xác thực", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1011, "Bạn không có quyền truy cập", HttpStatus.FORBIDDEN),
    PERMISSION_NOT_FOUND(1012, "Không tìm thấy quyền hạn", HttpStatus.BAD_REQUEST),
    ROLE_NOT_FOUND(1013, "Không tìm thấy vai trò", HttpStatus.BAD_REQUEST),
    CANNOT_DELETE(1014, "Không thể xoá vì tài nguyên đang được tham chiếu", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL_FORMAT(1015,"Email không đúng định dạng", HttpStatus.BAD_REQUEST),
    ROLE_EXISTED(1016,"Vai trò đã tồn tại", HttpStatus.BAD_REQUEST),
    PERMISSION_EXISTED(1017,"Quyền đã tồn tại", HttpStatus.BAD_REQUEST),
    COURSE_NOT_FOUND(1018,"Khóa học không tìm thấy", HttpStatus.BAD_REQUEST),
    COURSE_FULL(1019,"Môn học này đã đạt tối đa số lượng sinh viên đăng ký", HttpStatus.BAD_REQUEST),
    ALREADY_ENROLLED(1020,"Đã đăng ký khóa học", HttpStatus.BAD_REQUEST),
    NOT_ENROLLED(1021,"Sinh viên không đăng ký khóa học này", HttpStatus.BAD_REQUEST),
    INVALID_MAX_CAPACITY(1022,"Sĩ số tối thiểu là 10", HttpStatus.BAD_REQUEST),
    INVALID_CREDIT(1023,"Số tín chỉ tối thiểu là 1", HttpStatus.BAD_REQUEST),
    COURSE_NAME_REQUIRED(1024,"Không được để trống tên khóa học", HttpStatus.BAD_REQUEST),
    ROLE_NAME_REQUIRED(1025,"Vai trò không được để trống", HttpStatus.BAD_REQUEST),
    INVALID_LEVEL(1026,"Cấp độ tôí thiểu là 1", HttpStatus.BAD_REQUEST),
    PERMISSION_REQUIRED(1027,"Không được để trống tên quyền", HttpStatus.BAD_REQUEST),
    COURSE_MAX_LECTURER_REACHED(1028,"Lớp đã đạt số lượng giảng viên tối đa.", HttpStatus.BAD_REQUEST),
    CANNOT_DELETE_ADMIN_ROLE(1029,"Vai trò Admin không thể bị xóa", HttpStatus.BAD_REQUEST);
    int code;
    String message;
    HttpStatusCode statusCode;
}
