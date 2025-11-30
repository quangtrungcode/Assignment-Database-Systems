package com.example.demo.mapper;

import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.StudentCourseResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.entity.Course;
import com.example.demo.entity.Lecturer;
import com.example.demo.entity.Student;
import com.example.demo.entity.User;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Bỏ qua passwordHash vì nó được mã hóa và gán bằng setter trong Service
    @Mapping(target = "role", ignore = true)
    User toUser (UserCreationRequest userCreationRequest);
    //@Mapping(target = "roleType", ignore = true)
    //@Mapping(target = "roleResponse", ignore = true)
   // @Mapping(target = "roleResponse", source = "role")
    @Mapping(target = "career", ignore = true)     // Tạm thời ignore để xử lý sau
    @Mapping(target = "profession", ignore = true)
    UserResponse toUserResponse(User user);

    @AfterMapping
    default void mapSpecificFields(@MappingTarget UserResponse.UserResponseBuilder response, User user) {
        if (user instanceof Student student) {
            // Khi dùng Builder, cú pháp là .career() chứ không phải .setCareer()
            response.career(student.getCareer());
        }
        else if (user instanceof Lecturer lecturer) {
            // Tương tự, dùng .profession()
            response.profession(lecturer.getProfession());
        }
    }

    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "role", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);

    StudentCourseResponse toStudentCourseResponse(Course course);

}
