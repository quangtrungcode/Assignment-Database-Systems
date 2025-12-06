// import React, { useState, useEffect } from 'react';
// import '../styles/Modal.css';
// import { courseAPI } from '../services/apiService';
// import Toast from './Toast';

// const EnrollCourseModal = ({ studentId, onClose, onSuccess }) => {
//     const [courses, setCourses] = useState([]);
//     const [loadingMap, setLoadingMap] = useState({});
//     const [toast, setToast] = useState(null);

//     // 1. Lấy danh sách khóa học khi modal mở
//     useEffect(() => {
//         const fetchCourses = async () => {
//             try {
//                 const res = await courseAPI.getAll();
//                 setCourses(res.data.result || []); 
//             } catch (error) {
//                 console.error("Lỗi tải khóa học:", error);
//                 setToast({ message: 'Không thể tải danh sách khóa học.', type: 'error' });
//             }
//         };
//         fetchCourses();
//     }, []);

//     // 2. Hàm xử lý đăng ký (ĐÃ SỬA LỖI TẮT NHANH)
//     const handleEnroll = async (courseId) => {
//         setLoadingMap(prev => ({ ...prev, [courseId]: true })); 

//         try {
//             await courseAPI.enroll(courseId);
            
//             // 👇 1. HIỆN TOAST THÀNH CÔNG TRONG MODAL
//             setToast({ message: 'Đăng ký thành công!', type: 'success' });
            
//             // 👇 2. ĐẶT TRONG TIMEOUT: Chờ 2 giây để Toast hiển thị
//             setTimeout(() => {
//                 onClose(); // Đóng Modal
//                 onSuccess(); // Sau khi đóng, mới làm mới dữ liệu Dashboard (onRefresh)
//             }, 1500); 

//         } catch (err) {
//             const msg = err.response?.data?.message || 'Đăng ký thất bại.';
//             // Xử lý lỗi: Đã đăng ký/Lớp đầy
//             if (msg.includes('ALREADY_ENROLLED')) {
//                  setToast({ message: 'Bạn đã đăng ký khóa học này rồi.', type: 'info' });
//             } else if (msg.includes('COURSE_FULL')) {
//                  setToast({ message: 'Lớp học đã đầy sĩ số.', type: 'error' });
//             } else {
//                  setToast({ message: msg, type: 'error' });
//             }
//         } finally {
//             // Tắt loading ngay sau khi có kết quả API, không ảnh hưởng đến Toast
//             setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
//         }
//     };

//     return (
//         <div className="modal-overlay">
//             {/* Toast phải được render ở đây để hiển thị trong Modal */}
//             {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//             <div className="modal-content" style={{ maxWidth: '1080px', width: '90%', height: 'auto' }}>
//                 <div className="modal-header">
//                     <h2>Đăng ký Môn Học</h2>
//                     <button onClick={onClose} className="modal-close-btn">&times;</button>
//                 </div>

//                 <div className="modal-body table-container" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
//                     <table className="course-enrollment-table">
//                         <thead>
//                             <tr>
//                                 <th>Mã KH</th>
//                                 <th>Tên Khóa Học</th>
//                                 <th>Tín chỉ</th>
//                                 <th>Giảng viên</th>
//                                 <th>Sĩ số</th>
//                                 <th>Thao tác</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {courses.length > 0 ? (
//                                 courses.map(course => {
//                                     const isFull = course.currentEnrollment >= course.maxCapacity;
//                                     const isLoading = loadingMap[course.courseID];
                                    
//                                     return (
//                                         <tr key={course.courseID}>
//                                             <td>{course.courseID}</td>
//                                             <td>{course.courseName}</td>
//                                             <td>{course.credits}</td>
//                                             <td>{course.lecturer?.fullName || 'N/A'}</td>
//                                             <td>
//                                                 <span style={{ color: isFull ? 'red' : 'green', fontWeight: 'bold' }}>
//                                                     {course.currentEnrollment}
//                                                 </span> / {course.maxCapacity}
//                                             </td>
//                                             <td>
//                                                 <button 
//                                                     onClick={() => handleEnroll(course.courseID)}
//                                                     className="btn-primary"
//                                                     disabled={isFull || isLoading}
//                                                     style={{ width: '120px', fontSize: '14px' }}
//                                                 >
//                                                     {isLoading ? 'Đang ĐK...' : (isFull ? 'Đã Đầy' : 'Đăng ký')}
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })
//                             ) : (
//                                 <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không tìm thấy khóa học nào để đăng ký.</td></tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
//                     <button onClick={onClose} className="btn-cancel" style={{padding: '10px 25px'}}>
//                         Đóng
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EnrollCourseModal;
// import React, { useState, useEffect } from 'react';
// import '../styles/Modal.css';
// import { courseAPI, userAPI } from '../services/apiService';
// import Toast from './Toast';

// // 👇 CHÚ Ý: Component này cần nhận prop userEnrolledCourses (list môn đã ĐK) từ Dashboard
// const EnrollCourseModal = ({ studentId, onClose, onSuccess, userEnrolledCourses }) => {
    
//     const [courses, setCourses] = useState([]);
//     const [loadingMap, setLoadingMap] = useState({});
//     const [toast, setToast] = useState(null);
    
//     // 👇 STATE MỚI: Dùng để xác nhận hủy đăng ký
//     const [courseToUnenroll, setCourseToUnenroll] = useState(null);

//     // Dùng Set để kiểm tra nhanh ID khóa học đã đăng ký (khắc phục lỗi không thấy nút Hủy)
//     const enrolledIds = new Set(userEnrolledCourses?.map(c => c.courseID) || []);


//     // 1. Lấy danh sách khóa học khi modal mở
//     useEffect(() => {
//         const fetchCourses = async () => {
//             try {
//                 // Tải danh sách tất cả các khóa học
//                 const res = await courseAPI.getAll();
//                 setCourses(res.data.result || []); 
//             } catch (error) {
//                 console.error("Lỗi tải khóa học:", error);
//                 setToast({ message: 'Không thể tải danh sách khóa học.', type: 'error' });
//             }
//         };
//         fetchCourses();
//     }, [userEnrolledCourses]); // Chạy lại nếu danh sách ĐK của user thay đổi

//     // 2. Hàm xử lý ĐĂNG KÝ (Enroll)
//     const handleEnroll = async (courseId) => {
//         setLoadingMap(prev => ({ ...prev, [courseId]: true })); 

//         try {
//             await courseAPI.enroll(courseId);
            
//             setToast({ message: 'Đăng ký thành công!', type: 'success' });
            
//             // Đóng Modal và Refresh data sau 1.5s
//             setTimeout(() => {
//                 onClose(); 
//                 onSuccess(); 
//             }, 1500); 

//         } catch (err) {
//             const msg = err.response?.data?.message || 'Đăng ký thất bại.';
//             // Xử lý lỗi
//             if (msg.includes('ALREADY_ENROLLED')) {
//                  setToast({ message: 'Bạn đã đăng ký khóa học này rồi.', type: 'info' });
//             } else if (msg.includes('COURSE_FULL')) {
//                  setToast({ message: 'Lớp học đã đầy sĩ số.', type: 'error' });
//             } else {
//                  setToast({ message: msg, type: 'error' });
//             }
//         } finally {
//             setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
//         }
//     };
    
//     // 3. Hàm xử lý HỦY ĐĂNG KÝ (Unenroll) - MỚI
//     const handleUnenrollConfirm = async (courseId) => {
//         setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
//         setCourseToUnenroll(null); // Đóng modal xác nhận

//         try {
//             await courseAPI.unenroll(courseId); // Gọi API DELETE
//             setToast({ message: 'Hủy đăng ký thành công!', type: 'success' });
            
//             // Đóng Modal và Refresh data sau 1.5s
//             setTimeout(() => {
//                 onClose(); 
//                 onSuccess(); 
//             }, 1500);

//         } catch (err) {
//             const msg = err.response?.data?.message || 'Hủy thất bại.';
//             setToast({ message: msg, type: 'error' });
//         } finally {
//             setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
//         }
//     };


//     return (
//         <div className="modal-overlay">
//             {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//             {/* 👇 MODAL XÁC NHẬN HỦY ĐĂNG KÝ (Inline) */}
//             {courseToUnenroll && (
//                 <div className="modal-overlay">
//                     <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
//                         <h2 style={{color: '#e74c3c', marginTop: 0}}>Xác nhận Hủy</h2>
//                         <p>Bạn có chắc chắn muốn hủy đăng ký khóa học "{courseToUnenroll.courseName}" không?</p>
//                         <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
//                             <button onClick={() => setCourseToUnenroll(null)} className="btn-cancel">
//                                 Hủy
//                             </button>
//                             <button 
//                                 onClick={() => handleUnenrollConfirm(courseToUnenroll.courseID)} 
//                                 className="btn-primary"
//                                 style={{backgroundColor: '#e74c3c'}}
//                             >
//                                 Đồng ý
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}


//             <div className="modal-content" style={{ maxWidth: '950px', width: '90%', height: 'auto' }}>
//                 <div className="modal-header">
//                     <h2>Đăng ký Môn Học</h2>
//                     <button onClick={onClose} className="modal-close-btn">&times;</button>
//                 </div>

//                 <div className="modal-body table-container" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
//                     <table className="course-enrollment-table">
//                         <thead>
//                             <tr>
//                                 <th>Mã KH</th>
//                                 <th>Tên Khóa Học</th>
//                                 <th>Tín chỉ</th>
//                                 <th>Giảng viên</th>
//                                 <th>Sĩ số</th>
//                                 <th>Thao tác</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {courses.length > 0 ? (
//                                 courses.map(course => {
//                                     const isFull = course.currentEnrollment >= course.maxCapacity;
//                                     const isLoading = loadingMap[course.courseID];
//                                     const isRegistered = enrolledIds.has(course.courseID); // 👈 KIỂM TRA ĐĂNG KÝ

//                                     return (
//                                         <tr key={course.courseID}>
//                                             <td>{course.courseID}</td>
//                                             <td>{course.courseName}</td>
//                                             <td>{course.credits}</td>
//                                             <td>{course.lecturer?.fullName || 'N/A'}</td>
//                                             <td>
//                                                 <span style={{ color: isFull ? 'red' : 'green', fontWeight: 'bold' }}>
//                                                     {course.currentEnrollment}
//                                                 </span> / {course.maxCapacity}
//                                             </td>
//                                             <td>
//                                                 {isRegistered ? (
//                                                     // Nút HỦY ĐĂNG KÝ
//                                                     <button 
//                                                         onClick={() => setCourseToUnenroll(course)}
//                                                         className="btn-cancel"
//                                                         style={{ width: '120px', fontSize: '14px', backgroundColor: '#e74c3c', color: 'white' }}
//                                                         disabled={isLoading}
//                                                     >
//                                                         {isLoading ? 'Đang Hủy...' : 'Hủy ĐK'}
//                                                     </button>
//                                                 ) : (
//                                                     // Nút ĐĂNG KÝ
//                                                     <button 
//                                                         onClick={() => handleEnroll(course.courseID)}
//                                                         className="btn-primary"
//                                                         disabled={isFull || isLoading}
//                                                         style={{ width: '120px', fontSize: '14px' }}
//                                                     >
//                                                         {isLoading ? 'Đang ĐK...' : (isFull ? 'Đã Đầy' : 'Đăng ký')}
//                                                     </button>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })
//                             ) : (
//                                 <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không tìm thấy khóa học nào để đăng ký.</td></tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
//                     <button onClick={onClose} className="btn-cancel" style={{padding: '10px 25px'}}>
//                         Đóng
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EnrollCourseModal;

import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';
import { courseAPI, enrollmentAPI } from '../services/apiService'; 
import Toast from './Toast';

const EnrollCourseModal = ({ studentId, onClose, onSuccess }) => { 
    
    const [allCourses, setAllCourses] = useState([]); 
    const [enrolledCourses, setEnrolledCourses] = useState([]); 
    const [loadingMap, setLoadingMap] = useState({});
    const [toast, setToast] = useState(null);
    const [courseToUnenroll, setCourseToUnenroll] = useState(null);
    const [hasChanged, setHasChanged] = useState(false);

    const enrolledIds = new Set(enrolledCourses?.map(c => c.courseId || c.courseID) || []);

    // 👇 1. KHÓA CUỘN TRANG BODY KHI MODAL MỞ
    useEffect(() => {
        // Khóa cuộn trang chính
        document.body.style.overflow = 'hidden';
        
        // Mở lại cuộn khi đóng Modal
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // 2. FETCH DỮ LIỆU
    useEffect(() => {
        const fetchDualData = async () => {
            if (!studentId) return;
            try {
                const [coursesRes, enrolledRes] = await Promise.all([
                    courseAPI.getAll(),
                    enrollmentAPI.getByStudent(studentId)
                ]);
                setAllCourses(coursesRes.data?.result || coursesRes.result || []);
                setEnrolledCourses(enrolledRes.data?.result || enrolledRes.result || []); 
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
                setToast({ message: 'Lỗi tải dữ liệu.', type: 'error' });
            }
        };
        fetchDualData();
    }, [studentId]); 

    // 3. XỬ LÝ ĐĂNG KÝ
    const handleEnroll = async (courseId) => {
        setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
        try {
            await enrollmentAPI.register(studentId, courseId);
            setToast({ message: 'Đăng ký thành công!', type: 'success' });
            setHasChanged(true);

            setEnrolledCourses(prev => [...prev, { courseId: courseId }]);
            setAllCourses(prevCourses => prevCourses.map(course => 
                (course.courseId === courseId || course.courseID === courseId)
                    ? { ...course, currentEnrollment: (course.currentEnrollment || 0) + 1 }
                    : course
            ));
        } catch (err) {
            const msg = err.response?.data?.result || err.response?.data?.message || 'Đăng ký thất bại.';
            setToast({ message: msg, type: 'error' });
            reloadOriginalData();
        } finally {
            setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
        }
    };
    
    // 4. XỬ LÝ HỦY ĐĂNG KÝ
    const handleUnenrollConfirm = async (courseId) => {
        setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
        setCourseToUnenroll(null); 
        try {
            await enrollmentAPI.cancel(studentId, courseId);
            setToast({ message: 'Hủy đăng ký thành công!', type: 'success' });
            setHasChanged(true); 

            setEnrolledCourses(prev => prev.filter(c => (c.courseId || c.courseID) !== courseId));
            setAllCourses(prevCourses => prevCourses.map(course => 
                (course.courseId === courseId || course.courseID === courseId)
                    ? { ...course, currentEnrollment: Math.max(0, (course.currentEnrollment || 0) - 1) }
                    : course
            ));
        } catch (err) {
            const msg = err.response?.data?.result || err.response?.data?.message || 'Hủy thất bại.';
            setToast({ message: msg, type: 'error' });
            reloadOriginalData();
        } finally {
            setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
        }
    };

    const reloadOriginalData = async () => {
        try {
            const [coursesRes, enrolledRes] = await Promise.all([
                courseAPI.getAll(),
                enrollmentAPI.getByStudent(studentId)
            ]);
            setAllCourses(coursesRes.data?.result || []);
            setEnrolledCourses(enrolledRes.data?.result || []);
        } catch (e) { console.error(e); }
    };

    const handleManualClose = () => {
        if (hasChanged) onSuccess(); 
        onClose(); 
    };

    return (
        <div className="modal-overlay">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Modal xác nhận hủy */}
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

            {/* Modal chính */}
            <div className="modal-content" style={{ maxWidth: '1200px', width: '95%', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                <div className="modal-header">
                    <h2>Đăng ký Môn Học</h2>
                    <button onClick={handleManualClose} className="modal-close-btn">&times;</button>
                </div>

                {/* 👇 2. SỬA CSS CHO TABLE CONTAINER:
                   - overflowY: 'auto' (Cho phép cuộn nội dung)
                   - flex: 1 (Chiếm hết chiều cao còn lại của modal)
                */}
                <div className="modal-body table-container" style={{ overflowY: 'auto', flex: 1, padding: 0 }}>
                    <table className="course-enrollment-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        
                        {/* 👇 3. LÀM STICKY HEADER (CỐ ĐỊNH TIÊU ĐỀ) */}
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
                                                <span style={{ color: isFull ? 'red' : 'green', fontWeight: 'bold' }}>
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
                                                ) : (
                                                    <button 
                                                        onClick={() => handleEnroll(cId)}
                                                        className="btn-primary"
                                                        style={{ width: '100%', padding: '6px' }}
                                                        disabled={isFull || isLoading}
                                                    >
                                                        {isLoading ? '...' : (isFull ? 'Đã Đầy' : 'Đăng ký')}
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

// 👇 STYLE RIÊNG CHO HEADER ĐỂ GỌN CODE
const stickyHeaderStyle = {
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa', // Màu nền đục (quan trọng để che nội dung khi cuộn)
    borderBottom: '2px solid #dee2e6',
    whiteSpace: 'nowrap'
};

export default EnrollCourseModal;


