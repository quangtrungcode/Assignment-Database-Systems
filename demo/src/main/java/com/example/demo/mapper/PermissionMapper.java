package com.example.demo.mapper;

import com.example.demo.dto.request.PermissionRequest;
import com.example.demo.dto.request.PermissionUpadateRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.PermissionResponse;
import com.example.demo.entity.Permission;
import com.example.demo.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);
    PermissionResponse toPermissionResponse(Permission permission);
    void updatePermission(@MappingTarget Permission permission, PermissionUpadateRequest request);
}
