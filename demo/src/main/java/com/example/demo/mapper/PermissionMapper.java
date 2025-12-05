package com.example.demo.mapper;

import com.example.demo.dto.request.PermissionRequest;
import com.example.demo.dto.request.PermissionUpadateRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.PermissionResponse;
import com.example.demo.entity.Permission;
import com.example.demo.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    @Mapping(target = "roles", ignore = true)
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);

    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "permissionName", ignore = true)
    void updatePermission(@MappingTarget Permission permission, PermissionUpadateRequest request);
}
