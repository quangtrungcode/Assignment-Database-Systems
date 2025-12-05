package com.example.demo.service;

import com.example.demo.dto.request.RoleRequest;
import com.example.demo.dto.request.RoleUpdateRequest;
import com.example.demo.dto.response.RoleResponse;
import com.example.demo.entity.Role;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.RoleMapper;
import com.example.demo.repository.PermissionRepository;
import com.example.demo.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;

    @Transactional
    public RoleResponse create(RoleRequest request){
        var permissions = permissionRepository.findAllById(request.getPermissions());
//        if(permissions.isEmpty())
//            throw new AppException(ErrorCode.PERMISSION_NOT_FOUND);
//        if(roleRepository.existsByRoleName(request.getName())) {
//            throw new AppException(ErrorCode.ROLE_EXISTED);
//        }
        var role = roleMapper.toRole(request);
        role.setPermissions(new HashSet<>(permissions));
       // role = roleRepository.save(role);
        return roleMapper.toRoleResponse(roleRepository.save(role));

    }

    public RoleResponse updateRole(RoleUpdateRequest roleUpdateRequest){
        var permissions = permissionRepository.findAllById(roleUpdateRequest.getPermissions());
//        if(permissions.isEmpty())
//            throw new AppException(ErrorCode.PERMISSION_NOT_FOUND);
        var role= roleRepository.findById(roleUpdateRequest.getRoleName()).orElseThrow(()->new AppException(ErrorCode.ROLE_NOT_FOUND));

        role.setPermissions(new HashSet<>(permissions));
        role = roleMapper.toRoleUpdate(roleUpdateRequest);

     //  role.setPermissions(new HashSet<>(permissions));
       // role.setPermissions(new HashSet<>(roleUpdateRequest.getPermissions()));

      //  role.setDescription(role.getName());
        // role = roleRepository.save(role);
        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    public RoleResponse getRole(String roleId) {
        var role = roleRepository.findById(roleId).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        return roleMapper.toRoleResponse(role);
    }

    public List<RoleResponse> getAll(){
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::toRoleResponse)
                .toList();
    }

    public void delete(String role){
        roleRepository.deleteById(role);
    }
}
