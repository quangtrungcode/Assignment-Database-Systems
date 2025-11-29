package com.example.demo.mapper;

import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Bỏ qua passwordHash vì nó được mã hóa và gán bằng setter trong Service
    @Mapping(target = "role", ignore = true)
    User toUser (UserCreationRequest userCreationRequest);
    //@Mapping(target = "roleType", ignore = true)
    //@Mapping(target = "roleResponse", ignore = true)
   // @Mapping(target = "roleResponse", source = "role")
    UserResponse toUserResponse(User user);
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "role", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
