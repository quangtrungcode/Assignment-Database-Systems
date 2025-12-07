import React, { useState, useEffect, useCallback } from 'react'; 
import '../styles/Modal.css';
import { teachingAPI } from "../services/apiService"; 
// 👇 1. IMPORT SOCKET
import { io } from 'socket.io-client';

function TeachingCoursesModal({ onClose, lecturerId }) {
    
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Khóa cuộn trang khi mở Modal
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []); 

    // 👇 2. FETCH DATA (Dùng teachingAPI)
    const fetchTeachingCourses = useCallback(async () => {
        if (!lecturerId) return;
        try {
            // Không set loading = true lại để tránh nháy màn hình khi update socket
            
            // Gọi API lấy danh sách lớp giảng viên đang dạy
            const response = await teachingAPI.getMyClasses(lecturerId); 
            const data = response.data.result || [];
            
            console.log("TeachingCourses - Data loaded:", data);
            setCourses(data); 
            
        } catch (err) {
            console.error("Lỗi tải danh sách lớp dạy:", err);
            setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    }, [lecturerId]);

    // Gọi lần đầu khi component mount
    useEffect(() => {
        if (courses.length === 0) setIsLoading(true);
        fetchTeachingCourses();
    }, [fetchTeachingCourses]);

    // 👇 3. LẮNG NGHE SOCKET REAL-TIME
    useEffect(() => {
        const socket = io('http://localhost:8085');

        // --- CÁC SỰ KIỆN QUAN TRỌNG VỚI GIẢNG VIÊN ---

        // 1. REGISTER_TEACHING / CANCEL_TEACHING:
        // Cập nhật nếu chính giảng viên thao tác ở tab khác
        socket.on('REGISTER_TEACHING', () => fetchTeachingCourses());
        socket.on('CANCEL_TEACHING', () => fetchTeachingCourses());

        // 2. REGISTER_COURSE / CANCEL_COURSE (Của Sinh viên):
        // QUAN TRỌNG: Để Giảng viên thấy Sĩ số lớp mình dạy tăng/giảm ngay lập tức
        socket.on('REGISTER_COURSE', () => {
            console.log("Socket: Có sinh viên đăng ký -> Update sĩ số");
            fetchTeachingCourses();
        });
        socket.on('CANCEL_COURSE', () => {
            console.log("Socket: Có sinh viên hủy môn -> Update sĩ số");
            fetchTeachingCourses();
        });

        // 3. Admin sửa/xóa môn học
        socket.on('DELETE_COURSE', () => fetchTeachingCourses());
        socket.on('UPDATE_COURSE_SUCCESS', () => fetchTeachingCourses());

        // Cleanup
        return () => {
            socket.disconnect();
        };
    }, [fetchTeachingCourses]);


    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '1200px', width: '90%', overscrollBehavior: 'contain' }}>
                
                <div className="modal-header" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                    {/* Đổi tiêu đề cho phù hợp */}
                    <h2 style={{color: '#8e44ad', margin: 0}}>🎓 Lớp học giảng dạy</h2>
                    <button className="close-button" onClick={onClose} style={{fontSize: '24px'}}>&times;</button>
                </div>
                
                <div className="modal-body" style={{padding: '20px', maxHeight: '70vh', overflowY: 'auto'}}>
                    
                    {isLoading && courses.length === 0 ? (
                         <div style={{textAlign: 'center', padding: '20px'}}>
                             <div className="spinner"></div> 
                             <p>Đang tải dữ liệu...</p>
                         </div>
                    ) : (
                        <>
                            {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}

                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#f8f9fa', boxShadow: '0 2px 2px -1px rgba(0,0,0,0.1)' }}>
                                    <tr>
                                        <th style={thStyle}>Mã KH</th>
                                        <th style={thStyle}>Tên Khóa Học</th>
                                        <th style={{...thStyle, textAlign: 'center'}}>Học kỳ</th>
                                        <th style={{...thStyle, textAlign: 'center'}}>Tín chỉ</th>
                                        
                                        {/* Cột Sĩ số quan trọng với GV */}
                                        <th style={{...thStyle, textAlign: 'center'}}>Sĩ số hiện tại</th>
                                        
                                        {/* Không cần cột "Giảng viên" nữa vì đây là lớp của mình */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.length > 0 ? (
                                        courses.map((course, index) => (
                                            <tr key={course.courseId || index} style={{ borderBottom: '1px solid #eee' }} className="hover-row">
                                                <td style={tdStyle}>{course.courseId}</td>
                                                <td style={tdStyle}>
                                                    <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                                                        {course.courseName}
                                                    </span>
                                                </td>
                                                <td style={{...tdStyle, textAlign: 'center'}}>{course.semester}</td>
                                                <td style={{...tdStyle, textAlign: 'center'}}>{course.credits}</td>
                                                
                                                <td style={{...tdStyle, textAlign: 'center'}}>
                                                    <span style={{
                                                        fontWeight: 'bold', 
                                                        color: course.currentEnrollment >= course.maxCapacity ? '#e74c3c' : '#27ae60',
                                                        fontSize: '15px'
                                                    }}>
                                                        {course.currentEnrollment}
                                                    </span> 
                                                    <span style={{color: '#888', fontSize: '13px'}}> / {course.maxCapacity}</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{textAlign: 'center', padding: '30px', color: '#666', fontStyle: 'italic'}}>
                                                Bạn chưa đăng ký dạy lớp nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
                
                <div className="modal-footer" style={{ borderTop: '1px solid #ddd', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 'bold', color: '#555' }}>
                        Tổng số môn: {courses.length} |
                        Tổng tín chỉ: {courses.reduce((acc, curr) => acc + (curr.credits || 0), 0)}
                    </div>
                    <button 
                        onClick={onClose}
                        style={{
                            padding: '8px 25px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

const thStyle = {
    padding: '12px 15px',
    textAlign: 'left',
    color: '#333',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    backgroundColor: '#f1f3f5'
};

const tdStyle = {
    padding: '12px 15px',
    color: '#333',
    verticalAlign: 'middle'
};

export default TeachingCoursesModal;