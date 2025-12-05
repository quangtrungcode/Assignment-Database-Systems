package com.example.demo.service;

import com.corundumstudio.socketio.SocketIOServer;
import com.example.demo.dto.request.ProfileUpdateRequest;
import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserSearchRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.RoleResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.entity.*;
import com.example.demo.exception.AppException;
import com.example.demo.exception.CustomValidationException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.UserMapper;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.StudentRepository;
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


import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    CourseRepository courseRepository;
    StudentRepository studentRepository;
    SocketIOServer socketIOServer;
//    Validator validator;
    @Transactional
//    public UserResponse createUser(UserCreationRequest request) {
//        List<ErrorCode> errors = new ArrayList<>();
//
//        if(userRepository.existsByFullName(request.getFullName())) {
//            errors.add(ErrorCode.FULL_NAME_EXISTED);
//        }
//        if (userRepository.existsByEmail(request.getEmail())) {
//            errors.add(ErrorCode.EMAIL_EXISTED);
//        }
//        if (!errors.isEmpty()) {
//            throw new CustomValidationException(errors);
//        }
//        Long nextValue = userRepository.getNextUserIdSequence();
//        String formattedId = String.format("USR%04d", nextValue);
//        User user = userMapper.toUser(request);
//
//        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));
//        user.setUserID(formattedId);
//        Role role=roleRepository.findById(request.getRoleType())
//                .orElseThrow(()->new AppException(ErrorCode.ROLE_NOT_FOUND));
//        user.setRole(role);
//     return userMapper.toUserResponse(userRepository.save(user));
//    }

    public UserResponse createUser(UserCreationRequest request) {

        List<ErrorCode> errors = new ArrayList<>();

        // 1. Validation cơ bản
        if (userRepository.existsByEmail(request.getEmail())) {
            errors.add(ErrorCode.EMAIL_EXISTED);
        }
        if (!errors.isEmpty()) {
            throw new CustomValidationException(errors);
        }

        // 2. Lấy Role (FIX LỖI: Kiểm tra null trước khi findById)
        Role role = null;
        if (request.getRoleType() != null && !request.getRoleType().trim().isEmpty()) {
            role = roleRepository.findById(request.getRoleType()).orElse(null);
        }

        // 3. Sinh ID
        Long nextValue = userRepository.getNextUserIdSequence();
        String formattedId = String.format("USER%04d", nextValue);

        // 4. Khởi tạo đối tượng dựa trên Role
        User user;

        // Kiểm tra role có null không trước khi getRoleName
        String roleName = (role != null && role.getRoleName() != null)
                ? role.getRoleName().toUpperCase()
                : "";

        user = switch (roleName) {
            case "STUDENT" ->
                    Student.builder()
                            .career(request.getCareer())
                            .build();
            case "LECTURER" ->
                    Lecturer.builder()
                            .profession(request.getProfession())
                            .build();
            default ->
                    User.builder().build(); // Nếu không chọn role, tạo User thường
        };

        // 5. Map dữ liệu chung
        user.setUserID(formattedId);
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setGender(request.getGender());
        user.setPhones(request.getPhones());
        user.setBirthDate(request.getBirthDate()); // Lưu ý: Nếu birthDate null thì trường này sẽ là null trong DB
        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));

        user.setRole(role); // Set role (có thể là null)

        // 6. Lưu vào DB
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse getMyInfo(){
        var context = SecurityContextHolder.getContext();
        String userID = context.getAuthentication().getName();

        User user = userRepository.findByUserID(userID).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND));

        return userMapper.toUserResponse(user);
    }

    @Transactional
    @PreAuthorize("hasAuthority('ROLE_Admin')")
    public List<UserResponse> getAllUsers() {

        return  userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }

    @PostAuthorize("returnObject.fullName == authentication.name")
    @Transactional
    public UserResponse getUser(String userId){
        return userMapper.toUserResponse(userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
    }

//    @PreAuthorize("hasAuthority('ROLE_admin')")
//    @Transactional
//    public UserResponse updateUser(String userId, UserUpdateRequest userUpdateRequest){
//        User user=userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
//        userMapper.updateUser(user,userUpdateRequest);
//        user.setPasswordHash(passwordEncoder.encode(userUpdateRequest.getPasswordHash()));
//        var role = roleRepository.findById(userUpdateRequest.getRole())
//                .orElseThrow(()->new AppException(ErrorCode.ROLE_NOT_FOUND));
//        user.setRole(role);
//        return userMapper.toUserResponse(userRepository.save(user));
//    }


    public UserResponse updateUser(String userId, UserUpdateRequest request) {
        // 1. Tìm User trong DB
        List<ErrorCode> errors = new ArrayList<>();

        // 1. Validation cơ bản
//        if(userRepository.existsByFullName(request.getFullName())) {
//            errors.add(ErrorCode.FULL_NAME_EXISTED);
//        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if(!(user.getEmail().equals(request.getEmail()))) {
            if (userRepository.existsByEmail(request.getEmail())) {
                errors.add(ErrorCode.EMAIL_EXISTED);
            }
        }
        if (!errors.isEmpty()) {
            throw new CustomValidationException(errors);
        }
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Role role = null;
        if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
            role = roleRepository.findById(request.getRole()).orElse(null);
        }
        // 2. Map các thông tin chung (Họ tên, Email, SĐT, Ngày sinh...)
        // Lưu ý: Trong UserMapper, nên ignore field 'role' để tránh lỗi đè
        userMapper.updateUser(user, request);

        // 3. Xử lý Password (nếu có thay đổi)
        if (request.getPasswordHash() != null && !request.getPasswordHash().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));
        }

        // 4. Xử lý trường riêng cho từng loại (KHÔNG ĐỔI ROLE, chỉ sửa thông tin)
        if (user instanceof Student student) {
            // Nếu user đang là Student -> Cập nhật Career
            if (request.getCareer() != null) {
                student.setCareer(request.getCareer());
            }
        } else if (user instanceof Lecturer lecturer) {
            // Nếu user đang là Lecturer -> Cập nhật Profession
            if (request.getProfession() != null) {
                lecturer.setProfession(request.getProfession());
            }
        }
        user.setRole(role);
        // 5. Lưu và trả về
        // Hibernate tự động update vào bảng Users và bảng con tương ứng
        UserResponse userResponse=userMapper.toUserResponse(userRepository.save(user));
        socketIOServer.getBroadcastOperations().sendEvent("UPDATE_USER_SUCCESS", userResponse.getUserID());
       // return userMapper.toUserResponse(userRepository.save(user));
        return userResponse;
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

            // 1. UserID: Đổi sang LIKE để tìm gần đúng (VD: nhập "001" ra "USER001")
            if (request.getUserID() != null && !request.getUserID().trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("userID")),
                        "%" + request.getUserID().toLowerCase().trim() + "%"
                ));
            }

            // 2. Email: Đã dùng LIKE, thêm lower() để không phân biệt hoa thường
            if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("email")),
                        "%" + request.getEmail().toLowerCase().trim() + "%"
                ));
            }

            // 3. FullName: Thêm lower()
            if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("fullName")),
                        "%" + request.getFullName().toLowerCase().trim() + "%"
                ));
            }

            // 4. Gender: Thường là Dropdown cố định nên giữ nguyên EQUAL
            // (Nếu muốn nhập tay thì mới đổi sang LIKE)
            if (request.getGender() != null && !request.getGender().trim().isEmpty()) {
                // Giả sử DB lưu "Nam", "Nữ" chính xác
                predicates.add(criteriaBuilder.equal(root.get("gender"), request.getGender().trim()));
            }

            // 5. Phone: Đổi sang LIKE (VD: nhập "999" tìm số đuôi 999)
            if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
                // Lưu ý: Nếu cột phone trong DB là List<String> (@ElementCollection) thì cần dùng JOIN.
                // Nếu là String đơn giản thì dùng code dưới:
                predicates.add(criteriaBuilder.like(root.get("phone"), "%" + request.getPhone().trim() + "%"));
            }

            // 6. Role: Đổi sang LIKE (Tìm role gần đúng)
            if (request.getRoleName() != null && !request.getRoleName().trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("role").get("roleName")),
                        "%" + request.getRoleName().toLowerCase().trim() + "%"
                ));
            }

            // --- XỬ LÝ NGÀY THÁNG (GIỮ NGUYÊN) ---
            List<Predicate> birthDatePredicates = new ArrayList<>();
            if (request.getBirthDateFrom() != null) {
                birthDatePredicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("birthDate"), request.getBirthDateFrom()));
            }
            if (request.getBirthDateTo() != null) {
                birthDatePredicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("birthDate"), request.getBirthDateTo()));
            }
            if (!birthDatePredicates.isEmpty()) {
                predicates.add(criteriaBuilder.and(birthDatePredicates.toArray(new Predicate[0])));
            }

            List<Predicate> createdAtPredicates = new ArrayList<>();
            if (request.getCreatedAtFrom() != null) {
                createdAtPredicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), request.getCreatedAtFrom()));
            }
            if (request.getCreatedAtTo() != null) {
                createdAtPredicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), request.getCreatedAtTo()));
            }
            if (!createdAtPredicates.isEmpty()) {
                predicates.add(criteriaBuilder.and(createdAtPredicates.toArray(new Predicate[0])));
            }

            // --- KẾT QUẢ CUỐI CÙNG ---

            if (predicates.isEmpty()) {
                return criteriaBuilder.conjunction(); // Trả về tất cả nếu không lọc
            }

            // QUAN TRỌNG: Đổi 'or' thành 'and'
            // Logic bộ lọc phải là: Tên là A VÀ Email là B (chứ không phải hoặc)
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
//    private Specification<User> buildUserSpecification(UserSearchRequest request) {
//        return (root, query, criteriaBuilder) -> {
//            List<Predicate> predicates = new ArrayList<>();
//
//            // 1. Lọc theo userID (Tìm kiếm chính xác)
//            if (request.getUserID() != null && !request.getUserID().isEmpty()) {
//                predicates.add(criteriaBuilder.equal(root.get("userID"), request.getUserID()));
//            }
//
//            // 2. Lọc theo email (Tìm kiếm tương đối - LIKE)
//            if (request.getEmail() != null && !request.getEmail().isEmpty()) {
//                // Sẽ tìm các email có chứa chuỗi tìm kiếm
//                predicates.add(criteriaBuilder.like(root.get("email"), "%" + request.getEmail() + "%"));
//            }
//
//            // 3. Lọc theo fullName (Tìm kiếm tương đối - LIKE)
//            if (request.getFullName() != null && !request.getFullName().isEmpty()) {
//                // Sẽ tìm các tên có chứa chuỗi tìm kiếm
//                predicates.add(criteriaBuilder.like(root.get("fullName"), "%" + request.getFullName() + "%"));
//            }
//
//            // 4. Lọc theo gender (Tìm kiếm chính xác)
//            if (request.getGender() != null && !request.getGender().isEmpty()) {
//                predicates.add(criteriaBuilder.equal(root.get("gender"), request.getGender()));
//            }
//
//            // 5. Lọc theo phone (Tìm kiếm chính xác)
//            if (request.getPhone() != null && !request.getPhone().isEmpty()) {
//                predicates.add(criteriaBuilder.equal(root.get("phone"), request.getPhone()));
//            }
//
//            // 6. Lọc theo roleId (Sử dụng JOIN, giả định Entity User có trường 'role' là quan hệ)
//            if (request.getRoleId() != null && !request.getRoleId().isEmpty()) {
//                // Giả định: Trường "role" trong Entity User là một quan hệ đến Entity Role
//                predicates.add(criteriaBuilder.equal(root.get("role").get("roleName"), request.getRoleId()));
//            }
//
//            List<Predicate> birthDatePredicates = new ArrayList<>();
//
//            // Điều kiện BẮT ĐẦU (birthDateFrom)
//            if (request.getBirthDateFrom() != null) {
//                birthDatePredicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("birthDate"), request.getBirthDateFrom()));
//            }
//
//            // Điều kiện KẾT THÚC (birthDateTo)
//            if (request.getBirthDateTo() != null) {
//                birthDatePredicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("birthDate"), request.getBirthDateTo()));
//            }
//
//            // Nếu có điều kiện về Ngày Sinh, tạo một Predicate kết hợp bằng AND
//            if (!birthDatePredicates.isEmpty()) {
//                // Predicate này = (birthDate >= From AND birthDate <= To)
//                predicates.add(criteriaBuilder.and(birthDatePredicates.toArray(new Predicate[0])));
//            }
//
//            List<Predicate> createdAtPredicates = new ArrayList<>();
//
//            // Điều kiện BẮT ĐẦU (createdAtFrom)
//            if (request.getCreatedAtFrom() != null) {
//                createdAtPredicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), request.getCreatedAtFrom()));
//            }
//
//            // Điều kiện KẾT THÚC (createdAtTo)
//            if (request.getCreatedAtTo() != null) {
//                createdAtPredicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), request.getCreatedAtTo()));
//            }
//
//            // Nếu có điều kiện về Ngày Tạo, tạo một Predicate kết hợp bằng AND
//            if (!createdAtPredicates.isEmpty()) {
//                // Predicate này = (createdAt >= From AND createdAt <= To)
//                predicates.add(criteriaBuilder.and(createdAtPredicates.toArray(new Predicate[0])));
//            }
//
//            if (predicates.isEmpty()) {
//                // Trả về một điều kiện 'luôn đúng' (truy vấn không có mệnh đề WHERE),
//                // có nghĩa là trả về tất cả người dùng.
//                return criteriaBuilder.conjunction();
//            }
//            // Kết hợp tất cả các điều kiện lọc bằng toán tử AND
//            return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
//        };
//    }

    public UserResponse updateProfile(String userId, ProfileUpdateRequest request) {
        // 1. Tìm User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. Cập nhật các trường chung (Nằm ở bảng Users)
        user.setFullName(request.getFullName());
        user.setPhones(new HashSet<>(Collections.singleton(request.getPhone())));
        user.setGender(request.getGender());
        user.setBirthDate(request.getBirthDate());

        User savedUser = userRepository.save(user);
        UserResponse userResponse = userMapper.toUserResponse(savedUser);
        socketIOServer.getBroadcastOperations().sendEvent("UPDATE_USER_SUCCESS", userResponse);
        return userMapper.toUserResponse(userRepository.save(user));
    }


}