


import React, { useState, useEffect, useCallback } from 'react'; 
import '../styles/Modal.css';
import { enrollmentAPI } from "../services/apiService"; 
import { io } from 'socket.io-client';

function MyCoursesModal({ onClose, studentId }) {
    
    const [courses, setCourses] = useState([]);
    
    const [totalCredits, setTotalCredits] = useState(0);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []); 

   
    const fetchCourses = useCallback(async () => {
        if (!studentId) return;
        
        
        try {
            const response = await enrollmentAPI.getByStudent(studentId); 
            const data = response.data.result || [];
            console.log("MyCourses - Data loaded:", data);
            setCourses(data); 
        } catch (err) {
            console.error("Lỗi tải danh sách:", err);
            setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }

        
        try {
            const creditRes = await enrollmentAPI.getTotalCredits(studentId);
            setTotalCredits(creditRes.data?.result || 0);
        } catch (err) {
            console.error("Lỗi lấy tổng tín chỉ:", err);
            
        }

    }, [studentId]);

   
    useEffect(() => {
        if (courses.length === 0) setIsLoading(true);
        fetchCourses();
    }, [fetchCourses]);

    useEffect(() => {
        const socket = io('http://localhost:8085');

        const handleReload = () => {
            console.log("Socket: Data changed -> Reloading...");
            fetchCourses();
        };

    
        socket.on('STUDENT_REGISTER_COURSE', handleReload);
        socket.on('STUDENT_CANCEL_COURSE', handleReload);
        socket.on('DELETE_COURSE', handleReload);
        socket.on('UPDATE_COURSE_SUCCESS', handleReload);
        
       
        socket.on('REGISTER_TEACHING', handleReload);
        socket.on('CANCEL_TEACHING', handleReload);

       
        return () => {
            socket.disconnect();
        };
    }, [fetchCourses]);


    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '1200px', width: '90%', overscrollBehavior: 'contain' }}>
                
                <div className="modal-header" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                    <h2 style={{color: '#333', margin: 0}}>📘 Khóa học của tôi</h2>
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
                                <thead>
                                    <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                        <th style={thStyle}>Mã KH</th>
                                        <th style={thStyle}>Tên Khóa Học</th>
                                        <th style={{...thStyle, textAlign: 'center'}}>Học kỳ</th>
                                        <th style={{...thStyle, textAlign: 'center'}}>Tín chỉ</th>
                                        <th style={{...thStyle, textAlign: 'center'}}>Sĩ số</th>
                                        <th style={thStyle}>Giảng viên</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.length > 0 ? (
                                        courses.map((course, index) => (
                                            <tr key={course.courseId || index} style={{ borderBottom: '1px solid #eee' }} className="hover-row">
                                                <td style={tdStyle}>{course.courseId}</td>
                                                <td style={tdStyle}>
                                                    <span style={{ fontWeight: 'bold', color: '#0369a1' }}>
                                                        {course.courseName}
                                                    </span>
                                                </td>
                                                <td style={{...tdStyle, textAlign: 'center'}}>{course.semester}</td>
                                                <td style={{...tdStyle, textAlign: 'center'}}>{course.credits}</td>
                                                <td style={{...tdStyle, textAlign: 'center'}}>
                                                    <span style={{fontWeight: 'bold', color: course.currentEnrollment >= course.maxCapacity ? 'red' : '#27ae60'}}>
                                                        {course.currentEnrollment}
                                                    </span> 
                                                    / {course.maxCapacity}
                                                </td>
                                                <td style={tdStyle}>{course.lecturerName || "Chưa phân công"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{textAlign: 'center', padding: '30px', color: '#666', fontStyle: 'italic'}}>
                                                Bạn chưa đăng ký môn học nào.
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
                        {/* */}
                        Tổng số môn: {courses.length} | Tổng tín chỉ: {totalCredits}
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

export default MyCoursesModal;