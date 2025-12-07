package com.example.demo.repository;

import com.example.demo.entity.Enrollment;
import com.example.demo.entity.EnrollmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

// Chú ý: JpaRepository nhận vào <Entity, ID Type>
@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {

    // 👇 Function tính tổng tín chỉ dưới DB
    @Query(value = "SELECT dbo.fn_GetTotalCredits(:studentId)", nativeQuery = true)
    Integer getTotalCredits(@Param("studentId") String studentId);

    // 👇 (Bonus) Ví dụ hàm lấy danh sách môn đã đăng ký
    // List<Enrollment> findByStudent_UserId(String studentId);
}