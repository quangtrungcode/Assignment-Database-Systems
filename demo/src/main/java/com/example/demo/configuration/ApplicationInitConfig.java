package com.example.demo.configuration;

import com.example.demo.entity.Permission;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;

import com.example.demo.repository.PermissionRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;
    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository,
                                        RoleRepository roleRepository,
                                        PermissionRepository permissionRepository){
        return args -> {
            if (userRepository.findByFullName("admin123").isEmpty()
                    &&roleRepository.findById("Admin").isEmpty()){
                   // &&permissionRepository.findById("all").isEmpty()){

//                Permission permission=Permission.builder()
//                        .name("ALL")
//                        .description("ALL PERMISSION")
//                        .build();
//                  permissionRepository.save(permission);
//              var  permission1 =permissionRepository.findById(permission.getName()).orElseThrow();
                Role role=Role.builder()
                        .roleName("Admin")
                        .description("Quản trị viên hệ thống")
                       // .permissions(Set.of(permission1))
                        .build();

                roleRepository.save(role);

                Long nextValue = userRepository.getNextUserIdSequence();
                String formattedId = String.format("USER%04d", nextValue);
                User user = User.builder()
                        .userID(formattedId)
                        .fullName("admin123")
                        .email("admin@gmail.com")
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .phones(new HashSet<>(Collections.singleton("0123456789")))
                        .createdAt(new Date())
                        .birthDate(new Date())
                        .gender("Nam")
//                       .roles(roles)
//                        .roles(Role.admin.name())
                        .role(role)
                        .build();

                userRepository.save(user);
                log.warn("admin user has been created with default password: admin123, please change it");
            }
        };
    }
}
