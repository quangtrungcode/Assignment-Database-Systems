


import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Modal.css';
import { courseAPI, teachingAPI } from '../services/apiService'; 
import Toast from './Toast';
import { io } from 'socket.io-client';

const RegisterTeachingModal = ({ lecturerId, onClose, onSuccess }) => { 
    
    const [allCourses, setAllCourses] = useState([]); 
    const [teachingCourses, setTeachingCourses] = useState([]); 
    const [loadingMap, setLoadingMap] = useState({});
    const [toast, setToast] = useState(null);
    const [courseToCancel, setCourseToCancel] = useState(null); 
    const [hasChanged, setHasChanged] = useState(false);

   
    const teachingIds = new Set(teachingCourses?.map(c => c.courseId || c.courseID) || []);

    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    
    const fetchData = useCallback(async () => {
        if (!lecturerId) return;
        try {
            const [coursesRes, teachingRes] = await Promise.all([
                courseAPI.getAll(),
                teachingAPI.getMyClasses(lecturerId)
            ]);
            setAllCourses(coursesRes.data?.result || []);
            setTeachingCourses(teachingRes.data?.result || []); 
        } catch (error) {
            console.error("Lỗi tải dữ liệu giảng dạy:", error);
        }
    }, [lecturerId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    
    useEffect(() => {
        const socket = io('http://localhost:8085');
        const events = [
            'CREATE_COURSE_SUCCESS', 'UPDATE_COURSE_SUCCESS', 'DELETE_COURSE',
            'REGISTER_TEACHING', 'CANCEL_TEACHING',
            'STUDENT_REGISTER_COURSE', 'STUDENT_CANCEL_COURSE'
        ];
        events.forEach(event => socket.on(event, () => fetchData()));
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

    
    const handleRegister = async (courseId) => {
        setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
        try {
            await teachingAPI.register(lecturerId, courseId);
            setToast({ message: 'Đăng ký giảng dạy thành công!', type: 'success' });
            setHasChanged(true);
            setTeachingCourses(prev => [...prev, { courseId: courseId }]);
        } catch (err) {
            const msg = getErrorMessage(err);
            setToast({ message: msg, type: 'error' });
            fetchData(); 
        } finally {
            setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
        }
    };
    
    
    const handleCancelConfirm = async (courseId) => {
        setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
        setCourseToCancel(null); 
        try {
            await teachingAPI.cancel(lecturerId, courseId);
            setToast({ message: 'Hủy lớp dạy thành công!', type: 'success' });
            setHasChanged(true); 
            setTeachingCourses(prev => prev.filter(c => (c.courseId || c.courseID) !== courseId));
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

    
    const myDetailedCourses = allCourses.filter(c => teachingIds.has(c.courseId || c.courseID));
    const totalCredits = myDetailedCourses.reduce((acc, curr) => acc + (curr.credits || 0), 0);
    const totalSubjects = myDetailedCourses.length;

    return (
        <div className="modal-overlay">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/*  */}
            {courseToCancel && (
                <div className="modal-overlay" style={{ zIndex: 1100, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-content" style={{ maxWidth: '400px', padding: '20px', marginTop: '10%' }}>
                        <h3 style={{ marginTop: 0, color: '#e74c3c' }}>Hủy Lớp Dạy</h3>
                        <p>Bạn chắc chắn muốn hủy dạy môn <b>{courseToCancel.courseName}</b>?</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => setCourseToCancel(null)} className="btn-cancel">Quay lại</button>
                            <button 
                                onClick={() => handleCancelConfirm(courseToCancel.courseId || courseToCancel.courseID)} 
                                className="btn-primary"
                                style={{backgroundColor: '#e74c3c'}}
                            >
                                Xác nhận Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="modal-content" style={{ maxWidth: '1200px', width: '95%', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ margin: '0 0 5px 0' }}>📚 Đăng ký giảng dạy</h2>
                        <div style={{ fontSize: '14px', color: '#555', display: 'flex', gap: '15px' }}>
                            <span style={{ fontWeight: '500' }}>Tổng số môn: <strong>{totalSubjects}</strong></span>
                            <span style={{ fontWeight: '500' }}>Tổng tín chỉ: <strong>{totalCredits}</strong></span>
                        </div>
                    </div>
                    <button onClick={handleManualClose} className="modal-close-btn">&times;</button>
                </div>

                <div className="modal-body table-container" style={{ overflowY: 'auto', flex: 1, padding: 0 }}>
                    <table className="course-enrollment-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#f8f9fa', boxShadow: '0 2px 2px -1px rgba(0,0,0,0.1)' }}>
                            <tr>
                                <th style={stickyHeaderStyle}>Mã KH</th>
                                <th style={stickyHeaderStyle}>Tên Khóa Học</th>
                                <th style={{...stickyHeaderStyle, textAlign: 'center'}}>HK</th> 
                                <th style={{...stickyHeaderStyle, textAlign: 'center'}}>TC</th>
                                <th style={{...stickyHeaderStyle, textAlign: 'center'}}>Sĩ số SV</th>
                                <th style={stickyHeaderStyle}>Giảng viên (Max 2)</th>
                                <th style={{...stickyHeaderStyle, textAlign: 'center'}}>Thao tác</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {allCourses.length > 0 ? (
                                allCourses.map(course => {
                                    const cId = course.courseId || course.courseID;
                                    const isLoading = loadingMap[cId];
                                    const isTeaching = teachingIds.has(cId); 
                                    const isStudentFull = (course.currentEnrollment || 0) >= course.maxCapacity;

                                   
                                    let currentLecturersCount = 0;
                                    const rawName = course.lecturerName ? course.lecturerName.trim() : '';

                                    
                                    if (rawName !== '' && 
                                        !rawName.toLowerCase().includes('chưa phân công') && 
                                        !rawName.toLowerCase().includes('chưa có gv')) {
                                        currentLecturersCount = rawName.split(',').length;
                                    }
                                    
                                    const isLecturerFull = !isTeaching && currentLecturersCount >= 2;

                                    return (
                                        <tr key={cId} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{padding: '12px'}}>{cId}</td>
                                            <td style={{fontWeight: 'bold', color: '#2c3e50', padding: '12px'}}>{course.courseName}</td>
                                            <td style={{textAlign: 'center'}}>{course.semester || '-'}</td>
                                            <td style={{textAlign: 'center'}}>{course.credits}</td>
                                            
                                            <td style={{textAlign: 'center'}}>
                                                <span style={{ color: isStudentFull ? '#e74c3c' : '#27ae60', fontWeight: 'bold' }}>
                                                    {course.currentEnrollment || 0}
                                                </span> 
                                                / {course.maxCapacity}
                                            </td>

                                            <td style={{padding: '12px'}}>
                                                <div style={{ fontStyle: 'italic', color: '#666', marginBottom: '4px' }}>
                                                    {course.lecturerName || 'Chưa phân công'}
                                                </div>
                                                <div style={{ fontSize: '11px', color: currentLecturersCount >= 2 ? '#e74c3c' : '#2980b9', fontWeight: 'bold' }}>
                                                    Slot GV: {currentLecturersCount}/2
                                                </div>
                                            </td>

                                            <td style={{textAlign: 'center', padding: '12px'}}>
                                                {isTeaching ? (
                                                    <button 
                                                        onClick={() => setCourseToCancel(course)}
                                                        className="btn-cancel"
                                                        style={{ width: '100%', backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px' }}
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? '...' : 'Hủy Dạy'}
                                                    </button>
                                                ) : (
                                                    isLecturerFull ? (
                                                        <button 
                                                            disabled 
                                                            style={{ 
                                                                width: '100%', padding: '6px', 
                                                                backgroundColor: '#bdc3c7', color: '#fff', 
                                                                cursor: 'not-allowed', border: 'none' 
                                                            }}
                                                        >
                                                            Đã đủ GV
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleRegister(cId)}
                                                            className="btn-primary"
                                                            style={{ width: '100%', padding: '6px', backgroundColor: '#8e44ad' }} 
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? '...' : 'Nhận Lớp'}
                                                        </button>
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu khóa học...</td></tr>
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

export default RegisterTeachingModal;