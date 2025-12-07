package com.example.demo.mapper;

import com.example.demo.dto.request.RoleRequest;
import com.example.demo.dto.request.RoleUpdateRequest;
import com.example.demo.dto.response.RoleResponse;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
//,nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
@Mapper(componentModel = "spring")
public interface RoleMapper {
   // @Mapping(target = "roleName", ignore = true)
    @Mapping(target = "permissions", ignore = true)
    @Mapping(target = "users", ignore = true)
    Role toRole(RoleRequest request);

   // @Mapping(target = "roleName", ignore = true)
    @Mapping(target = "permissions", ignore = true)
  //  @Mapping(target = "description", ignore = true)
    @Mapping(target = "users", ignore = true)
    Role toRoleUpdate(@MappingTarget Role role, RoleUpdateRequest request);

    RoleResponse toRoleResponse(Role role);
}
