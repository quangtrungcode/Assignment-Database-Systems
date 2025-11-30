import React, { useState, useEffect } from 'react'; 
import '../styles/Modal.css';
import { courseAPI } from "../services/apiService";

/**
 * MyCoursesModal Component
 */
function MyCoursesModal({ onClose, studentId, onSuccess, onRefresh }) {
    
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Xử lý logic cũ (không còn cần)
    // const handleViewDetails = (course) => {
    //     alert(`Xem chi tiết Khóa học: ${course.courseName} (${course.courseID})`);
    // };
    // const handleDropCourse = async (course) => { /* ... */ };

    // 1. Fetch dữ liệu khi modal mở
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setError(null);
                setIsLoading(true);

                const response = await courseAPI.getMyEnrollments(); 
                
                // Trích xuất mảng khóa học từ key "result"
                const enrolledCourses = response.data.result || [];
                setCourses(enrolledCourses); 
                
            } catch (err) {
                console.error("Lỗi khi tải Khóa học của tôi:", err);
                let errorMessage = "Không thể tải danh sách khóa học. Vui lòng thử lại.";
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response && err.response.status) {
                     errorMessage = `Lỗi Server (${err.response.status}). Vui lòng kiểm tra log Server.`;
                } else if (err.request) {
                    errorMessage = "Không thể kết nối đến Server. Vui lòng kiểm tra mạng hoặc Server đã chạy chưa.";
                }
                
                setError(errorMessage); 
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [studentId, onRefresh]); 
    
    // --- HIỂN THỊ TRẠNG THÁI ---
    
    if (isLoading) {
        return (
            <div className="modal-overlay">
                <div className="modal-content" style={{ maxWidth: '800px', textAlign: 'center' }}>
                    <h2>📚 Khóa học của tôi</h2>
                    <p>Đang tải dữ liệu...</p>
                    <div className="spinner"></div>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="modal-overlay">
                <div className="modal-content" style={{ maxWidth: '800px' }}>
                    <div className="modal-header">
                        <h2 style={{color: '#dc3545'}}>Lỗi</h2>
                        <button className="close-button" onClick={onClose}>&times;</button>
                    </div>
                    <div className="modal-body" style={{padding: '20px', color: '#dc3545'}}>
                        <p>❌ {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // --- HIỂN THỊ DỮ LIỆU ---

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '1100px' }}>
                <div className="modal-header">
                    <h2 style={{color: '#007bff'}}>📚 Khóa học của tôi</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body" style={{padding: '20px'}}>
                    
                    {courses.length > 0 ? (
                        <table className="courses-table" style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Mã MH</th>
                                    <th style={thStyle}>Tên Môn Học</th>
                                    <th style={thStyle}>Tín Chỉ</th>
                                    {/* <th style={thStyle}>Hành Động</th> 👈 ĐÃ XÓA CỘT HEADER */}
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course.courseID} style={trStyle}> 
                                        <td style={tdStyle}>**{course.courseID}**</td>
                                        <td style={tdStyle}>{course.courseName}</td> 
                                        <td style={tdStyle}>{course.credits}</td>
                                        {/* <td style={tdStyle}>... các nút Hành Động đã bị xóa ...</td> 👈 ĐÃ XÓA CỘT DATA */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '8px' }}>
                            <p style={{ color: '#856404', fontWeight: 'bold' }}>
                                🔔 Bạn chưa đăng ký khóa học nào trong hệ thống.
                            </p>
                            <p>Vui lòng chọn "Đăng ký môn học" để bắt đầu.</p>
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
}

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px'
};

const thStyle = {
    border: '1px solid #dee2e6',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#007bff',
    color: 'white',
};

const trStyle = {
    transition: 'background-color 0.2s',
};

const tdStyle = {
    border: '1px solid #dee2e6',
    padding: '12px',
    textAlign: 'left',
};

// Đã loại bỏ styles của các nút Hành Động không còn sử dụng

export default MyCoursesModal;