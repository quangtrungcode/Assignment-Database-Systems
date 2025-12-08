

import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Modal.css';
import { courseAPI, enrollmentAPI } from '../services/apiService'; 
import Toast from './Toast';
import { io } from 'socket.io-client';

const EnrollCourseModal = ({ studentId, onClose, onSuccess }) => { 
    
    const [allCourses, setAllCourses] = useState([]); 
    const [enrolledCourses, setEnrolledCourses] = useState([]); 
    
    const [totalCredits, setTotalCredits] = useState(0);

    const [loadingMap, setLoadingMap] = useState({});
    const [toast, setToast] = useState(null);
    const [courseToUnenroll, setCourseToUnenroll] = useState(null);
    const [hasChanged, setHasChanged] = useState(false);

    const enrolledIds = new Set(enrolledCourses?.map(c => c.courseId || c.courseID) || []);

    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    
    const fetchData = useCallback(async () => {
        if (!studentId) return;
        try {
            
            const [coursesRes, enrolledRes, creditsRes] = await Promise.all([
                courseAPI.getAll(),
                enrollmentAPI.getByStudent(studentId),
                enrollmentAPI.getTotalCredits(studentId) 
            ]);

            setAllCourses(coursesRes.data?.result || coursesRes.result || []);
            setEnrolledCourses(enrolledRes.data?.result || enrolledRes.result || []); 
            
           
            setTotalCredits(creditsRes.data?.result || 0);

        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        }
    }, [studentId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    
    useEffect(() => {
        const socket = io('http://localhost:8085');

        socket.on('CREATE_COURSE_SUCCESS', () => { fetchData(); setToast({ message: 'Có môn học mới!', type: 'info' }); });
        socket.on('UPDATE_COURSE_SUCCESS', () => fetchData());
        socket.on('DELETE_COURSE', () => { fetchData(); setToast({ message: 'Danh sách vừa cập nhật (Có môn bị xóa)', type: 'info' }); });
        
        
        socket.on('STUDENT_CANCEL_COURSE', () => fetchData());
        socket.on('STUDENT_REGISTER_COURSE', () => fetchData());
        socket.on('REGISTER_TEACHING', () => fetchData());
        socket.on('CANCEL_TEACHING', () => fetchData());

        return () => { socket.disconnect(); };
    }, [fetchData]);

   
    const getErrorMessage = (err) => {
        const data = err.response?.data;
        if (!data) return 'Thao tác thất bại (Lỗi mạng hoặc Server).';
        if (Array.isArray(data)) return data.map(e => e.message || JSON.stringify(e)).join('\n');
        if (data.message) return data.message;
        if (data.result) return data.result;
        if (data.errors && Array.isArray(data.errors)) {
            return data.errors.map(e => e.message || e.defaultMessage).join('\n');
        }
        return 'Đã có lỗi xảy ra.';
    };

  
    const handleEnroll = async (courseId) => {
        setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
        try {
            await enrollmentAPI.register(studentId, courseId);
            setToast({ message: 'Đăng ký thành công!', type: 'success' });
            setHasChanged(true);

            
            setEnrolledCourses(prev => [...prev, { courseId: courseId }]);
            
           
            fetchData(); 
            
        } catch (err) {
            const msg = getErrorMessage(err);
            setToast({ message: msg, type: 'error' });
            fetchData(); 
        } finally {
            setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
        }
    };
    
    
    const handleUnenrollConfirm = async (courseId) => {
        setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
        setCourseToUnenroll(null); 
        try {
            await enrollmentAPI.cancel(studentId, courseId);
            setToast({ message: 'Hủy đăng ký thành công!', type: 'success' });
            setHasChanged(true); 

            
            setEnrolledCourses(prev => prev.filter(c => (c.courseId || c.courseID) !== courseId));
            
            
            fetchData(); 

        } catch (err) {
            const msg = getErrorMessage(err);
            setToast({ message: msg, type: 'error' });
            fetchData(); 
        } finally {
            setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
        }
    };

    const handleManualClose = () => {
        if (hasChanged) onSuccess(); 
        onClose(); 
    };

    
    const totalSubjects = enrolledCourses.length;

    return (
        <div className="modal-overlay">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* */}
            {courseToUnenroll && (
                <div className="modal-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1100 }}>
                    <div className="modal-content" style={{ maxWidth: '400px', padding: '20px', marginTop: '10%' }}>
                        <h3 style={{ marginTop: 0, color: '#e74c3c' }}>Xác Nhận Hủy</h3>
                        <p>Bạn muốn hủy môn <b>{courseToUnenroll.courseName}</b>?</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => setCourseToUnenroll(null)} className="btn-cancel">Quay lại</button>
                            <button 
                                onClick={() => handleUnenrollConfirm(courseToUnenroll.courseId || courseToUnenroll.courseID)} 
                                className="btn-primary"
                                style={{backgroundColor: '#e74c3c'}}
                            >
                                Đồng ý Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/*  */}
            <div className="modal-content" style={{ maxWidth: '1200px', width: '95%', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                
                {/* */}
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ margin: '0 0 5px 0' }}>Đăng ký môn học</h2>
                        <div style={{ fontSize: '14px', color: '#555', display: 'flex', gap: '15px' }}>
                            <span style={{ fontWeight: '500' }}>Tổng số môn: <strong>{totalSubjects}</strong></span>
                            {/*  */}
                            <span style={{ fontWeight: '500' }}>Tổng tín chỉ: <strong>{totalCredits}</strong></span>
                        </div>
                    </div>
                    <button onClick={handleManualClose} className="modal-close-btn">&times;</button>
                </div>

                <div className="modal-body table-container" style={{ overflowY: 'auto', flex: 1, padding: 0 }}>
                    <table className="course-enrollment-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        
                        {/*  */}
                        <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#f8f9fa', boxShadow: '0 2px 2px -1px rgba(0,0,0,0.1)' }}>
                            <tr>
                                <th style={stickyHeaderStyle}>Mã KH</th>
                                <th style={stickyHeaderStyle}>Tên Khóa Học</th>
                                <th style={{...stickyHeaderStyle, textAlign: 'center', width: '80px'}}>Học kỳ</th> 
                                <th style={{...stickyHeaderStyle, textAlign: 'center', width: '60px'}}>TC</th>
                                <th style={stickyHeaderStyle}>Giảng viên</th>
                                <th style={{...stickyHeaderStyle, textAlign: 'center', width: '100px'}}>Sĩ số</th>
                                <th style={{...stickyHeaderStyle, textAlign: 'center', width: '120px'}}>Thao tác</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {allCourses.length > 0 ? (
                                allCourses.map(course => {
                                    const cId = course.courseId || course.courseID;
                                    const isFull = (course.currentEnrollment || 0) >= course.maxCapacity;
                                    const isLoading = loadingMap[cId];
                                    const isRegistered = enrolledIds.has(cId); 

                                    return (
                                        <tr key={cId} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{padding: '12px'}}>{cId}</td>
                                            <td style={{fontWeight: 'bold', color: '#2c3e50', padding: '12px'}}>{course.courseName}</td>
                                            <td style={{textAlign: 'center'}}>{course.semester || '-'}</td>
                                            <td style={{textAlign: 'center'}}>{course.credits}</td>
                                            <td style={{padding: '12px'}}>{course.lecturerName || '...'}</td>
                                            <td style={{textAlign: 'center'}}>
                                                <span style={{ color: isFull ? '#e74c3c' : '#27ae60', fontWeight: 'bold' }}>
                                                    {course.currentEnrollment || 0}
                                                </span> / {course.maxCapacity}
                                            </td>
                                            
                                            <td style={{textAlign: 'center', padding: '12px'}}>
                                                {isRegistered ? (
                                                    <button 
                                                        onClick={() => setCourseToUnenroll(course)}
                                                        className="btn-cancel"
                                                        style={{ width: '100%', backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px' }}
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? '...' : 'Hủy ĐK'}
                                                    </button>
                                                ) : isFull ? (
                                                    <button 
                                                        disabled
                                                        style={{ 
                                                            width: '100%', padding: '6px', 
                                                            backgroundColor: '#bdc3c7', color: '#fff', 
                                                            cursor: 'not-allowed', border: 'none'
                                                        }}
                                                    >
                                                        Đã Đầy
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleEnroll(cId)}
                                                        className="btn-primary"
                                                        style={{ width: '100%', padding: '6px' }}
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? '...' : 'Đăng ký'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Đang tải hoặc không có dữ liệu...</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="modal-footer">
                    <button onClick={handleManualClose} className="btn-cancel">Đóng</button>
                </div>
            </div>
        </div>
    );
};

const stickyHeaderStyle = {
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa', 
    borderBottom: '2px solid #dee2e6',
    whiteSpace: 'nowrap'
};

export default EnrollCourseModal;


