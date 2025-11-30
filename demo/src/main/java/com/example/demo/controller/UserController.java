package com.example.demo.controller;

import com.example.demo.dto.request.ProfileUpdateRequest;
import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserSearchRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @PostMapping
    public ApiResponse<UserResponse> createUser(@RequestBody  @Valid UserCreationRequest request) {
        ApiResponse<UserResponse>apiResponse=new ApiResponse<>();
        apiResponse.setResult(userService.createUser(request));
        return apiResponse;
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{userId}")
    public ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId) {
        ApiResponse<UserResponse>apiResponse=new ApiResponse<>();
        apiResponse.setResult(userService.getUser(userId));
        return apiResponse;
    }

    @GetMapping("/myInfo")
    ApiResponse<UserResponse> getMyInfo(){
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @PostMapping("/search") // Hoặc /users/search
    public ApiResponse<List<UserResponse>> searchUsers(@RequestBody UserSearchRequest request) {
        // @ModelAttribute sẽ tự động ánh xạ các query parameter (vd: ?username=abc&email=xyz)
        // sang đối tượng UserSearchRequest

        List<UserResponse> users = userService.searchUsers(request);

        return ApiResponse.<List<UserResponse>>builder()
                .result(users)
                .build();
    }

    @PutMapping("/{userId}")
    public ApiResponse<UserResponse> updateUser(@PathVariable("userId") String userId, @RequestBody @Valid UserUpdateRequest userUpdateRequest) {
        ApiResponse<UserResponse>apiResponse=new ApiResponse<>();
        apiResponse.setResult(userService.updateUser(userId,userUpdateRequest));
        return apiResponse;
    }

    @DeleteMapping ("/{userId}")
    public String deleteUser(@PathVariable("userId") String userId) {
        userService.deleteUser(userId);
        return "User has been deleted";
    }

    @PutMapping("/{userId}/profile") // Đường dẫn sẽ là: PUT /users/USR001/profile
// @PreAuthorize("hasRole('student')") // Nếu muốn chặn chỉ cho student
    public ApiResponse<UserResponse> updateProfile(@PathVariable String userId, @RequestBody ProfileUpdateRequest request) {
        ApiResponse<UserResponse>apiResponse=new ApiResponse<>();
        apiResponse.setResult(userService.updateProfile(userId,request));
        return apiResponse;
    }
}