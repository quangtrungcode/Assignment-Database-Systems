package com.example.demo.service;

import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserSearchRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.RoleResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.exception.AppException;
import com.example.demo.exception.CustomValidationException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.UserMapper;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
//    Validator validator;
    @Transactional
    public UserResponse createUser(UserCreationRequest request) {
        List<ErrorCode> errors = new ArrayList<>();

        if(userRepository.existsByFullName(request.getFullName())) {
            errors.add(ErrorCode.FULL_NAME_EXISTED);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            errors.add(ErrorCode.EMAIL_EXISTED);
        }
        if (!errors.isEmpty()) {
            throw new CustomValidationException(errors);
        }
        Long nextValue = userRepository.getNextUserIdSequence();
        String formattedId = String.format("USR%04d", nextValue);
        User user = userMapper.toUser(request);

        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));
        user.setUserID(formattedId);
        Role role=roleRepository.findById(request.getRoleType())
                .orElseThrow(()->new AppException(ErrorCode.ROLE_NOT_FOUND));
        user.setRole(role);
     return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse getMyInfo(){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByFullName(name).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND));

        return userMapper.toUserResponse(user);
    }

    @PreAuthorize("hasAuthority('ROLE_admin')")
    @Transactional
    public List<UserResponse> getAllUsers() {

        return  userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }

    @PostAuthorize("returnObject.fullName == authentication.name")
    @Transactional
    public UserResponse getUser(String userId){
        return userMapper.toUserResponse(userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
    }

    @PreAuthorize("hasAuthority('ROLE_admin')")
    @Transactional
    public UserResponse updateUser(String userId, UserUpdateRequest userUpdateRequest){
        User user=userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userMapper.updateUser(user,userUpdateRequest);
        user.setPasswordHash(passwordEncoder.encode(userUpdateRequest.getPasswordHash()));
        var role = roleRepository.findById(userUpdateRequest.getRole())
                .orElseThrow(()->new AppException(ErrorCode.ROLE_NOT_FOUND));
        user.setRole(role);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(String userId){
        userRepository.deleteById(userId);
    }

    public List<UserResponse> searchUsers(UserSearchRequest request) {
        // 1. Vẫn gọi hàm buildUserSpecification, chỉ là bên trong hàm này đã được cập nhật logic
        Specification<User> spec = buildUserSpecification(request);

        // 2. Vẫn dùng findAll với Specification
        List<User> users = userRepository.findAll(spec);

        // 3. Vẫn map kết quả
        return users.stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    private Specification<User> buildUserSpecification(UserSearchRequest request) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Lọc theo userID (Tìm kiếm chính xác)
            if (request.getUserID() != null && !request.getUserID().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("userID"), request.getUserID()));
            }

            // 2. Lọc theo email (Tìm kiếm tương đối - LIKE)
            if (request.getEmail() != null && !request.getEmail().isEmpty()) {
                // Sẽ tìm các email có chứa chuỗi tìm kiếm
                predicates.add(criteriaBuilder.like(root.get("email"), "%" + request.getEmail() + "%"));
            }

            // 3. Lọc theo fullName (Tìm kiếm tương đối - LIKE)
            if (request.getFullName() != null && !request.getFullName().isEmpty()) {
                // Sẽ tìm các tên có chứa chuỗi tìm kiếm
                predicates.add(criteriaBuilder.like(root.get("fullName"), "%" + request.getFullName() + "%"));
            }

            // 4. Lọc theo gender (Tìm kiếm chính xác)
            if (request.getGender() != null && !request.getGender().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("gender"), request.getGender()));
            }

            // 5. Lọc theo phone (Tìm kiếm chính xác)
            if (request.getPhone() != null && !request.getPhone().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("phone"), request.getPhone()));
            }

            // 6. Lọc theo roleId (Sử dụng JOIN, giả định Entity User có trường 'role' là quan hệ)
            if (request.getRoleId() != null && !request.getRoleId().isEmpty()) {
                // Giả định: Trường "role" trong Entity User là một quan hệ đến Entity Role
                predicates.add(criteriaBuilder.equal(root.get("role").get("name"), request.getRoleId()));
            }

            List<Predicate> birthDatePredicates = new ArrayList<>();

            // Điều kiện BẮT ĐẦU (birthDateFrom)
            if (request.getBirthDateFrom() != null) {
                birthDatePredicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("birthDate"), request.getBirthDateFrom()));
            }

            // Điều kiện KẾT THÚC (birthDateTo)
            if (request.getBirthDateTo() != null) {
                birthDatePredicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("birthDate"), request.getBirthDateTo()));
            }

            // Nếu có điều kiện về Ngày Sinh, tạo một Predicate kết hợp bằng AND
            if (!birthDatePredicates.isEmpty()) {
                // Predicate này = (birthDate >= From AND birthDate <= To)
                predicates.add(criteriaBuilder.and(birthDatePredicates.toArray(new Predicate[0])));
            }

            List<Predicate> createdAtPredicates = new ArrayList<>();

            // Điều kiện BẮT ĐẦU (createdAtFrom)
            if (request.getCreatedAtFrom() != null) {
                createdAtPredicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), request.getCreatedAtFrom()));
            }

            // Điều kiện KẾT THÚC (createdAtTo)
            if (request.getCreatedAtTo() != null) {
                createdAtPredicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), request.getCreatedAtTo()));
            }

            // Nếu có điều kiện về Ngày Tạo, tạo một Predicate kết hợp bằng AND
            if (!createdAtPredicates.isEmpty()) {
                // Predicate này = (createdAt >= From AND createdAt <= To)
                predicates.add(criteriaBuilder.and(createdAtPredicates.toArray(new Predicate[0])));
            }

            if (predicates.isEmpty()) {
                // Trả về một điều kiện 'luôn đúng' (truy vấn không có mệnh đề WHERE),
                // có nghĩa là trả về tất cả người dùng.
                return criteriaBuilder.conjunction();
            }
            // Kết hợp tất cả các điều kiện lọc bằng toán tử AND
            return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
        };
    }
}