package com.example.demo.mapper;

import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.PermissionResponse;
import com.example.demo.dto.response.RoleResponse;
import com.example.demo.dto.response.StudentCourseResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.entity.Course;
import com.example.demo.entity.Permission;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-05T00:32:33+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.9 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toUser(UserCreationRequest userCreationRequest) {
        if ( userCreationRequest == null ) {
            return null;
        }

        User.UserBuilder<?, ?> user = User.builder();

        user.email( userCreationRequest.getEmail() );
        user.fullName( userCreationRequest.getFullName() );
        user.gender( userCreationRequest.getGender() );
        user.birthDate( userCreationRequest.getBirthDate() );
        user.passwordHash( userCreationRequest.getPasswordHash() );
        Set<String> set = userCreationRequest.getPhones();
        if ( set != null ) {
            user.phones( new LinkedHashSet<String>( set ) );
        }

        return user.build();
    }

    @Override
    public UserResponse toUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.userID( user.getUserID() );
        userResponse.email( user.getEmail() );
        userResponse.fullName( user.getFullName() );
        userResponse.gender( user.getGender() );
        Set<String> set = user.getPhones();
        if ( set != null ) {
            userResponse.phones( new LinkedHashSet<String>( set ) );
        }
        userResponse.birthDate( user.getBirthDate() );
        userResponse.passwordHash( user.getPasswordHash() );
        userResponse.role( roleToRoleResponse( user.getRole() ) );
        userResponse.createdAt( user.getCreatedAt() );

        mapSpecificFields( userResponse, user );

        return userResponse.build();
    }

    @Override
    public void updateUser(User user, UserUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        user.setEmail( request.getEmail() );
        user.setFullName( request.getFullName() );
        user.setGender( request.getGender() );
        user.setBirthDate( request.getBirthDate() );
        if ( user.getPhones() != null ) {
            Set<String> set = request.getPhones();
            if ( set != null ) {
                user.getPhones().clear();
                user.getPhones().addAll( set );
            }
            else {
                user.setPhones( null );
            }
        }
        else {
            Set<String> set = request.getPhones();
            if ( set != null ) {
                user.setPhones( new LinkedHashSet<String>( set ) );
            }
        }
    }

    @Override
    public StudentCourseResponse toStudentCourseResponse(Course course) {
        if ( course == null ) {
            return null;
        }

        StudentCourseResponse.StudentCourseResponseBuilder studentCourseResponse = StudentCourseResponse.builder();

        studentCourseResponse.courseID( course.getCourseID() );
        studentCourseResponse.courseName( course.getCourseName() );
        studentCourseResponse.credits( course.getCredits() );

        return studentCourseResponse.build();
    }

    protected PermissionResponse permissionToPermissionResponse(Permission permission) {
        if ( permission == null ) {
            return null;
        }

        PermissionResponse.PermissionResponseBuilder permissionResponse = PermissionResponse.builder();

        permissionResponse.permissionName( permission.getPermissionName() );
        permissionResponse.description( permission.getDescription() );

        return permissionResponse.build();
    }

    protected Set<PermissionResponse> permissionSetToPermissionResponseSet(Set<Permission> set) {
        if ( set == null ) {
            return null;
        }

        Set<PermissionResponse> set1 = new LinkedHashSet<PermissionResponse>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( Permission permission : set ) {
            set1.add( permissionToPermissionResponse( permission ) );
        }

        return set1;
    }

    protected RoleResponse roleToRoleResponse(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleResponse.RoleResponseBuilder roleResponse = RoleResponse.builder();

        roleResponse.roleName( role.getRoleName() );
        roleResponse.description( role.getDescription() );
        roleResponse.level( role.getLevel() );
        roleResponse.permissions( permissionSetToPermissionResponseSet( role.getPermissions() ) );

        return roleResponse.build();
    }
}
