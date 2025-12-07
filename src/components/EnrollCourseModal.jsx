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

// import React, { useState, useEffect } from 'react';
// import '../styles/Modal.css';
// import { courseAPI, enrollmentAPI } from '../services/apiService'; 
// import Toast from './Toast';

// const EnrollCourseModal = ({ studentId, onClose, onSuccess }) => { 
    
//     const [allCourses, setAllCourses] = useState([]); 
//     const [enrolledCourses, setEnrolledCourses] = useState([]); 
//     const [loadingMap, setLoadingMap] = useState({});
//     const [toast, setToast] = useState(null);
//     const [courseToUnenroll, setCourseToUnenroll] = useState(null);
//     const [hasChanged, setHasChanged] = useState(false);

//     const enrolledIds = new Set(enrolledCourses?.map(c => c.courseId || c.courseID) || []);

//     // 👇 1. KHÓA CUỘN TRANG BODY KHI MODAL MỞ
//     useEffect(() => {
//         // Khóa cuộn trang chính
//         document.body.style.overflow = 'hidden';
        
//         // Mở lại cuộn khi đóng Modal
//         return () => {
//             document.body.style.overflow = 'unset';
//         };
//     }, []);

//     // 2. FETCH DỮ LIỆU
//     useEffect(() => {
//         const fetchDualData = async () => {
//             if (!studentId) return;
//             try {
//                 const [coursesRes, enrolledRes] = await Promise.all([
//                     courseAPI.getAll(),
//                     enrollmentAPI.getByStudent(studentId)
//                 ]);
//                 setAllCourses(coursesRes.data?.result || coursesRes.result || []);
//                 setEnrolledCourses(enrolledRes.data?.result || enrolledRes.result || []); 
//             } catch (error) {
//                 console.error("Lỗi tải dữ liệu:", error);
//                 setToast({ message: 'Lỗi tải dữ liệu.', type: 'error' });
//             }
//         };
//         fetchDualData();
//     }, [studentId]); 

//     // 3. XỬ LÝ ĐĂNG KÝ
//     const handleEnroll = async (courseId) => {
//         setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
//         try {
//             await enrollmentAPI.register(studentId, courseId);
//             setToast({ message: 'Đăng ký thành công!', type: 'success' });
//             setHasChanged(true);

//             setEnrolledCourses(prev => [...prev, { courseId: courseId }]);
//             setAllCourses(prevCourses => prevCourses.map(course => 
//                 (course.courseId === courseId || course.courseID === courseId)
//                     ? { ...course, currentEnrollment: (course.currentEnrollment || 0) + 1 }
//                     : course
//             ));
//         } catch (err) {
//             const msg = err.response?.data?.result || err.response?.data?.message || 'Đăng ký thất bại.';
//             setToast({ message: msg, type: 'error' });
//             reloadOriginalData();
//         } finally {
//             setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
//         }
//     };
    
//     // 4. XỬ LÝ HỦY ĐĂNG KÝ
//     const handleUnenrollConfirm = async (courseId) => {
//         setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
//         setCourseToUnenroll(null); 
//         try {
//             await enrollmentAPI.cancel(studentId, courseId);
//             setToast({ message: 'Hủy đăng ký thành công!', type: 'success' });
//             setHasChanged(true); 

//             setEnrolledCourses(prev => prev.filter(c => (c.courseId || c.courseID) !== courseId));
//             setAllCourses(prevCourses => prevCourses.map(course => 
//                 (course.courseId === courseId || course.courseID === courseId)
//                     ? { ...course, currentEnrollment: Math.max(0, (course.currentEnrollment || 0) - 1) }
//                     : course
//             ));
//         } catch (err) {
//             const msg = err.response?.data?.result || err.response?.data?.message || 'Hủy thất bại.';
//             setToast({ message: msg, type: 'error' });
//             reloadOriginalData();
//         } finally {
//             setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
//         }
//     };

//     const reloadOriginalData = async () => {
//         try {
//             const [coursesRes, enrolledRes] = await Promise.all([
//                 courseAPI.getAll(),
//                 enrollmentAPI.getByStudent(studentId)
//             ]);
//             setAllCourses(coursesRes.data?.result || []);
//             setEnrolledCourses(enrolledRes.data?.result || []);
//         } catch (e) { console.error(e); }
//     };

//     const handleManualClose = () => {
//         if (hasChanged) onSuccess(); 
//         onClose(); 
//     };

//     return (
//         <div className="modal-overlay">
//             {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//             {/* Modal xác nhận hủy */}
//             {courseToUnenroll && (
//                 <div className="modal-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1100 }}>
//                     <div className="modal-content" style={{ maxWidth: '400px', padding: '20px', marginTop: '10%' }}>
//                         <h3 style={{ marginTop: 0, color: '#e74c3c' }}>Xác Nhận Hủy</h3>
//                         <p>Bạn muốn hủy môn <b>{courseToUnenroll.courseName}</b>?</p>
//                         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
//                             <button onClick={() => setCourseToUnenroll(null)} className="btn-cancel">Quay lại</button>
//                             <button 
//                                 onClick={() => handleUnenrollConfirm(courseToUnenroll.courseId || courseToUnenroll.courseID)} 
//                                 className="btn-primary"
//                                 style={{backgroundColor: '#e74c3c'}}
//                             >
//                                 Đồng ý Hủy
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Modal chính */}
//             <div className="modal-content" style={{ maxWidth: '1200px', width: '95%', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
//                 <div className="modal-header">
//                     <h2>Đăng ký Môn Học</h2>
//                     <button onClick={handleManualClose} className="modal-close-btn">&times;</button>
//                 </div>

//                 {/* 👇 2. SỬA CSS CHO TABLE CONTAINER:
//                    - overflowY: 'auto' (Cho phép cuộn nội dung)
//                    - flex: 1 (Chiếm hết chiều cao còn lại của modal)
//                 */}
//                 <div className="modal-body table-container" style={{ overflowY: 'auto', flex: 1, padding: 0 }}>
//                     <table className="course-enrollment-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        
//                         {/* 👇 3. LÀM STICKY HEADER (CỐ ĐỊNH TIÊU ĐỀ) */}
//                         <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#f8f9fa', boxShadow: '0 2px 2px -1px rgba(0,0,0,0.1)' }}>
//                             <tr>
//                                 <th style={stickyHeaderStyle}>Mã KH</th>
//                                 <th style={stickyHeaderStyle}>Tên Khóa Học</th>
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '80px'}}>Học kỳ</th> 
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '60px'}}>TC</th>
//                                 <th style={stickyHeaderStyle}>Giảng viên</th>
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '100px'}}>Sĩ số</th>
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '120px'}}>Thao tác</th>
//                             </tr>
//                         </thead>
                        
//                         <tbody>
//                             {allCourses.length > 0 ? (
//                                 allCourses.map(course => {
//                                     const cId = course.courseId || course.courseID;
//                                     const isFull = (course.currentEnrollment || 0) >= course.maxCapacity;
//                                     const isLoading = loadingMap[cId];
//                                     const isRegistered = enrolledIds.has(cId); 

//                                     return (
//                                         <tr key={cId} style={{ borderBottom: '1px solid #eee' }}>
//                                             <td style={{padding: '12px'}}>{cId}</td>
//                                             <td style={{fontWeight: 'bold', color: '#2c3e50', padding: '12px'}}>{course.courseName}</td>
//                                             <td style={{textAlign: 'center'}}>{course.semester || '-'}</td>
//                                             <td style={{textAlign: 'center'}}>{course.credits}</td>
//                                             <td style={{padding: '12px'}}>{course.lecturerName || '...'}</td>
//                                             <td style={{textAlign: 'center'}}>
//                                                 <span style={{ color: isFull ? 'red' : 'green', fontWeight: 'bold' }}>
//                                                     {course.currentEnrollment || 0}
//                                                 </span> / {course.maxCapacity}
//                                             </td>
//                                             <td style={{textAlign: 'center', padding: '12px'}}>
//                                                 {isRegistered ? (
//                                                     <button 
//                                                         onClick={() => setCourseToUnenroll(course)}
//                                                         className="btn-cancel"
//                                                         style={{ width: '100%', backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px' }}
//                                                         disabled={isLoading}
//                                                     >
//                                                         {isLoading ? '...' : 'Hủy ĐK'}
//                                                     </button>
//                                                 ) : (
//                                                     <button 
//                                                         onClick={() => handleEnroll(cId)}
//                                                         className="btn-primary"
//                                                         style={{ width: '100%', padding: '6px' }}
//                                                         disabled={isFull || isLoading}
//                                                     >
//                                                         {isLoading ? '...' : (isFull ? 'Đã Đầy' : 'Đăng ký')}
//                                                     </button>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })
//                             ) : (
//                                 <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Đang tải hoặc không có dữ liệu...</td></tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 <div className="modal-footer">
//                     <button onClick={handleManualClose} className="btn-cancel">Đóng</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // 👇 STYLE RIÊNG CHO HEADER ĐỂ GỌN CODE
// const stickyHeaderStyle = {
//     padding: '12px',
//     textAlign: 'left',
//     backgroundColor: '#f8f9fa', // Màu nền đục (quan trọng để che nội dung khi cuộn)
//     borderBottom: '2px solid #dee2e6',
//     whiteSpace: 'nowrap'
// };

// export default EnrollCourseModal;


// import React, { useState, useEffect, useCallback } from 'react';
// import '../styles/Modal.css';
// import { courseAPI, enrollmentAPI } from '../services/apiService'; 
// import Toast from './Toast';
// // 👇 1. IMPORT SOCKET
// import { io } from 'socket.io-client';

// const EnrollCourseModal = ({ studentId, onClose, onSuccess }) => { 
    
//     const [allCourses, setAllCourses] = useState([]); 
//     const [enrolledCourses, setEnrolledCourses] = useState([]); 
//     const [loadingMap, setLoadingMap] = useState({});
//     const [toast, setToast] = useState(null);
//     const [courseToUnenroll, setCourseToUnenroll] = useState(null);
//     const [hasChanged, setHasChanged] = useState(false);

//     const enrolledIds = new Set(enrolledCourses?.map(c => c.courseId || c.courseID) || []);

//     // Khóa cuộn trang body
//     useEffect(() => {
//         document.body.style.overflow = 'hidden';
//         return () => {
//             document.body.style.overflow = 'unset';
//         };
//     }, []);

//     // 👇 2. TÁCH LOGIC FETCH DATA RA RIÊNG ĐỂ DÙNG LẠI
//     const fetchData = useCallback(async () => {
//         if (!studentId) return;
//         try {
//             // Lấy song song: List tất cả môn & List môn đã đăng ký
//             const [coursesRes, enrolledRes] = await Promise.all([
//                 courseAPI.getAll(),
//                 enrollmentAPI.getByStudent(studentId)
//             ]);
//             setAllCourses(coursesRes.data?.result || coursesRes.result || []);
//             setEnrolledCourses(enrolledRes.data?.result || enrolledRes.result || []); 
//         } catch (error) {
//             console.error("Lỗi tải dữ liệu:", error);
//             // Không hiện toast lỗi ở đây để tránh spam khi socket update liên tục
//         }
//     }, [studentId]);

//     // Gọi data lần đầu khi mở modal
//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     // 👇 3. LẮNG NGHE SOCKET REAL-TIME
//     useEffect(() => {
//         // Kết nối socket (đảm bảo port 8085 đúng với backend của bạn)
//         const socket = io('http://localhost:8085');

//         // Sự kiện: Có khóa học mới được tạo
//         socket.on('CREATE_COURSE_SUCCESS', (newCourseId) => {
//             console.log("Socket: Có khóa học mới created:", newCourseId);
//             fetchData(); // Tải lại danh sách ngay lập tức
//             setToast({ message: 'Danh sách vừa được cập nhật (Có môn mới)', type: 'info' });
//         });

//         // Sự kiện: Khóa học vừa được cập nhật (Sửa tên, tín chỉ, hoặc thay đổi sĩ số từ Admin)
//         socket.on('UPDATE_COURSE_SUCCESS', (updatedCourseId) => {
//             console.log("Socket: Khóa học updated:", updatedCourseId);
//             fetchData(); // Tải lại danh sách
//             // setToast({ message: 'Dữ liệu khóa học vừa thay đổi', type: 'info' });
//         });

//         socket.on('DELETE_COURSE', (deletedCourseId) => {
//             console.log("Socket: Có khóa học bị xóa:", deletedCourseId);
            
//             // Cách 1: Gọi API tải lại toàn bộ (An toàn nhất)
//             fetchData(); 
            
//             // Hoặc Cách 2: Tự lọc bỏ khỏi state (Nhanh hơn, không cần gọi API)
//             /*
//             setAllCourses(prev => prev.filter(c => c.courseId !== deletedCourseId && c.courseID !== deletedCourseId));
//             */
//             setToast({ message: 'Danh sách vừa cập nhật (Có môn bị xóa)', type: 'info' });
//         });
//         // Sự kiện cũ (nếu có): Sinh viên khác đăng ký/hủy -> Cập nhật sĩ số
//         socket.on('STUDENT_CANCEL_COURSE', () => fetchData());
//         socket.on('STUDENT_REGISTER_COURSE', () => fetchData());
//         socket.on('DELETE_COURSE', () => fetchData());
//         socket.on('REGISTER_TEACHING', () => fetchData());
//         socket.on('CANCEL_TEACHING', () => fetchData());
//         // Cleanup khi đóng modal
//         return () => {
//             socket.disconnect();
//         };
//     }, [fetchData]);


//     // --- CÁC HÀM XỬ LÝ ĐĂNG KÝ/HỦY (GIỮ NGUYÊN) ---

//     const handleEnroll = async (courseId) => {
//         setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
//         try {
//             await enrollmentAPI.register(studentId, courseId);
//             setToast({ message: 'Đăng ký thành công!', type: 'success' });
//             setHasChanged(true);

//             // Update Local State giả lập để phản hồi nhanh
//             setEnrolledCourses(prev => [...prev, { courseId: courseId }]);
//             setAllCourses(prevCourses => prevCourses.map(course => 
//                 (course.courseId === courseId || course.courseID === courseId)
//                     ? { ...course, currentEnrollment: (course.currentEnrollment || 0) + 1 }
//                     : course
//             ));
//         } catch (err) {
//             const msg = err.response?.data?.result || err.response?.data?.message || 'Đăng ký thất bại.';
//             setToast({ message: msg, type: 'error' });
//             fetchData(); // Reload lại nếu lỗi để đồng bộ data chuẩn
//         } finally {
//             setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
//         }
//     };
    
//     const handleUnenrollConfirm = async (courseId) => {
//         setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
//         setCourseToUnenroll(null); 
//         try {
//             await enrollmentAPI.cancel(studentId, courseId);
//             setToast({ message: 'Hủy đăng ký thành công!', type: 'success' });
//             setHasChanged(true); 

//             setEnrolledCourses(prev => prev.filter(c => (c.courseId || c.courseID) !== courseId));
//             setAllCourses(prevCourses => prevCourses.map(course => 
//                 (course.courseId === courseId || course.courseID === courseId)
//                     ? { ...course, currentEnrollment: Math.max(0, (course.currentEnrollment || 0) - 1) }
//                     : course
//             ));
//         } catch (err) {
//             const msg = err.response?.data?.result || err.response?.data?.message || 'Hủy thất bại.';
//             setToast({ message: msg, type: 'error' });
//             fetchData(); 
//         } finally {
//             setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
//         }
//     };

//     const handleManualClose = () => {
//         if (hasChanged) onSuccess(); 
//         onClose(); 
//     };

//     return (
//         <div className="modal-overlay">
//             {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//             {/* Modal xác nhận hủy */}
//             {courseToUnenroll && (
//                 <div className="modal-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1100 }}>
//                     <div className="modal-content" style={{ maxWidth: '400px', padding: '20px', marginTop: '10%' }}>
//                         <h3 style={{ marginTop: 0, color: '#e74c3c' }}>Xác Nhận Hủy</h3>
//                         <p>Bạn muốn hủy môn <b>{courseToUnenroll.courseName}</b>?</p>
//                         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
//                             <button onClick={() => setCourseToUnenroll(null)} className="btn-cancel">Quay lại</button>
//                             <button 
//                                 onClick={() => handleUnenrollConfirm(courseToUnenroll.courseId || courseToUnenroll.courseID)} 
//                                 className="btn-primary"
//                                 style={{backgroundColor: '#e74c3c'}}
//                             >
//                                 Đồng ý Hủy
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Modal chính */}
//             <div className="modal-content" style={{ maxWidth: '1200px', width: '95%', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
//                 <div className="modal-header">
//                     <h2>Đăng ký Môn Học</h2>
//                     <button onClick={handleManualClose} className="modal-close-btn">&times;</button>
//                 </div>

//                 <div className="modal-body table-container" style={{ overflowY: 'auto', flex: 1, padding: 0 }}>
//                     <table className="course-enrollment-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        
//                         {/* Sticky Header */}
//                         <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#f8f9fa', boxShadow: '0 2px 2px -1px rgba(0,0,0,0.1)' }}>
//                             <tr>
//                                 <th style={stickyHeaderStyle}>Mã KH</th>
//                                 <th style={stickyHeaderStyle}>Tên Khóa Học</th>
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '80px'}}>Học kỳ</th> 
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '60px'}}>TC</th>
//                                 <th style={stickyHeaderStyle}>Giảng viên</th>
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '100px'}}>Sĩ số</th>
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '120px'}}>Thao tác</th>
//                             </tr>
//                         </thead>
                        
//                         <tbody>
//                             {allCourses.length > 0 ? (
//                                 allCourses.map(course => {
//                                     const cId = course.courseId || course.courseID;
//                                     const isFull = (course.currentEnrollment || 0) >= course.maxCapacity;
//                                     const isLoading = loadingMap[cId];
//                                     const isRegistered = enrolledIds.has(cId); 

//                                     return (
//                                         <tr key={cId} style={{ borderBottom: '1px solid #eee' }}>
//                                             <td style={{padding: '12px'}}>{cId}</td>
//                                             <td style={{fontWeight: 'bold', color: '#2c3e50', padding: '12px'}}>{course.courseName}</td>
//                                             <td style={{textAlign: 'center'}}>{course.semester || '-'}</td>
//                                             <td style={{textAlign: 'center'}}>{course.credits}</td>
//                                             <td style={{padding: '12px'}}>{course.lecturerName || '...'}</td>
//                                             <td style={{textAlign: 'center'}}>
//                                                 <span style={{ color: isFull ? 'red' : 'green', fontWeight: 'bold' }}>
//                                                     {course.currentEnrollment || 0}
//                                                 </span> / {course.maxCapacity}
//                                             </td>
//                                             <td style={{textAlign: 'center', padding: '12px'}}>
//                                                 {isRegistered ? (
//                                                     <button 
//                                                         onClick={() => setCourseToUnenroll(course)}
//                                                         className="btn-cancel"
//                                                         style={{ width: '100%', backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px' }}
//                                                         disabled={isLoading}
//                                                     >
//                                                         {isLoading ? '...' : 'Hủy ĐK'}
//                                                     </button>
//                                                 ) : (
//                                                     <button 
//                                                         onClick={() => handleEnroll(cId)}
//                                                         className="btn-primary"
//                                                         style={{ width: '100%', padding: '6px' }}
//                                                         disabled={isFull || isLoading}
//                                                     >
//                                                         {isLoading ? '...' : (isFull ? 'Đã Đầy' : 'Đăng ký')}
//                                                     </button>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })
//                             ) : (
//                                 <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Đang tải hoặc không có dữ liệu...</td></tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 <div className="modal-footer">
//                     <button onClick={handleManualClose} className="btn-cancel">Đóng</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const stickyHeaderStyle = {
//     padding: '12px',
//     textAlign: 'left',
//     backgroundColor: '#f8f9fa', 
//     borderBottom: '2px solid #dee2e6',
//     whiteSpace: 'nowrap'
// };

// export default EnrollCourseModal;


// import React, { useState, useEffect, useCallback } from 'react';
// import '../styles/Modal.css';
// import { courseAPI, enrollmentAPI } from '../services/apiService'; 
// import Toast from './Toast';
// import { io } from 'socket.io-client';

// const EnrollCourseModal = ({ studentId, onClose, onSuccess }) => { 
    
//     const [allCourses, setAllCourses] = useState([]); 
//     const [enrolledCourses, setEnrolledCourses] = useState([]); 
//     const [loadingMap, setLoadingMap] = useState({});
//     const [toast, setToast] = useState(null);
//     const [courseToUnenroll, setCourseToUnenroll] = useState(null);
//     const [hasChanged, setHasChanged] = useState(false);

//     const enrolledIds = new Set(enrolledCourses?.map(c => c.courseId || c.courseID) || []);

//     // Khóa cuộn trang body
//     useEffect(() => {
//         document.body.style.overflow = 'hidden';
//         return () => {
//             document.body.style.overflow = 'unset';
//         };
//     }, []);

//     // FETCH DATA
//     const fetchData = useCallback(async () => {
//         if (!studentId) return;
//         try {
//             const [coursesRes, enrolledRes] = await Promise.all([
//                 courseAPI.getAll(),
//                 enrollmentAPI.getByStudent(studentId)
//             ]);
//             setAllCourses(coursesRes.data?.result || coursesRes.result || []);
//             setEnrolledCourses(enrolledRes.data?.result || enrolledRes.result || []); 
//         } catch (error) {
//             console.error("Lỗi tải dữ liệu:", error);
//         }
//     }, [studentId]);

//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     // SOCKET REAL-TIME
//     useEffect(() => {
//         const socket = io('http://localhost:8085');

//         socket.on('CREATE_COURSE_SUCCESS', () => { fetchData(); setToast({ message: 'Có môn học mới!', type: 'info' }); });
//         socket.on('UPDATE_COURSE_SUCCESS', () => fetchData());
//         socket.on('DELETE_COURSE', () => { fetchData(); setToast({ message: 'Danh sách vừa cập nhật (Có môn bị xóa)', type: 'info' }); });
        
//         // Các sự kiện thay đổi sĩ số
//         socket.on('STUDENT_CANCEL_COURSE', () => fetchData());
//         socket.on('STUDENT_REGISTER_COURSE', () => fetchData());
//         socket.on('REGISTER_TEACHING', () => fetchData());
//         socket.on('CANCEL_TEACHING', () => fetchData());

//         return () => { socket.disconnect(); };
//     }, [fetchData]);

//     // 👇 HÀM HELPER XỬ LÝ LỖI (MỚI THÊM)
//     const getErrorMessage = (err) => {
//         const data = err.response?.data;
        
//         if (!data) return 'Thao tác thất bại (Lỗi mạng hoặc Server).';

//         // 1. Trường hợp trả về List lỗi [{code:..., message:...}]
//         if (Array.isArray(data)) {
//             return data.map(e => e.message || JSON.stringify(e)).join('\n');
//         }

//         // 2. Trường hợp trả về Object đơn lẻ
//         if (data.message) return data.message;
//         if (data.result) return data.result;

//         // 3. Trường hợp lỗi nằm trong field 'errors'
//         if (data.errors && Array.isArray(data.errors)) {
//             return data.errors.map(e => e.message || e.defaultMessage).join('\n');
//         }

//         return 'Đã có lỗi xảy ra.';
//     };

//     // --- XỬ LÝ ĐĂNG KÝ ---
//     const handleEnroll = async (courseId) => {
//         setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
//         try {
//             await enrollmentAPI.register(studentId, courseId);
//             setToast({ message: 'Đăng ký thành công!', type: 'success' });
//             setHasChanged(true);

//             // Cập nhật state tạm thời để UI phản hồi nhanh
//             setEnrolledCourses(prev => [...prev, { courseId: courseId }]);
//             setAllCourses(prevCourses => prevCourses.map(course => 
//                 (course.courseId === courseId || course.courseID === courseId)
//                     ? { ...course, currentEnrollment: (course.currentEnrollment || 0) + 1 }
//                     : course
//             ));
//         } catch (err) {
//             // 👇 SỬ DỤNG HÀM BẮT LỖI MỚI
//             const msg = getErrorMessage(err);
//             setToast({ message: msg, type: 'error' });
            
//             // Reload lại data chuẩn từ server để tránh lệch sĩ số khi lỗi
//             fetchData(); 
//         } finally {
//             setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
//         }
//     };
    
//     // --- XỬ LÝ HỦY ĐĂNG KÝ ---
//     const handleUnenrollConfirm = async (courseId) => {
//         setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
//         setCourseToUnenroll(null); 
//         try {
//             await enrollmentAPI.cancel(studentId, courseId);
//             setToast({ message: 'Hủy đăng ký thành công!', type: 'success' });
//             setHasChanged(true); 

//             setEnrolledCourses(prev => prev.filter(c => (c.courseId || c.courseID) !== courseId));
//             setAllCourses(prevCourses => prevCourses.map(course => 
//                 (course.courseId === courseId || course.courseID === courseId)
//                     ? { ...course, currentEnrollment: Math.max(0, (course.currentEnrollment || 0) - 1) }
//                     : course
//             ));
//         } catch (err) {
//             // 👇 SỬ DỤNG HÀM BẮT LỖI MỚI
//             const msg = getErrorMessage(err);
//             setToast({ message: msg, type: 'error' });
            
//             fetchData(); 
//         } finally {
//             setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
//         }
//     };

//     const handleManualClose = () => {
//         if (hasChanged) onSuccess(); 
//         onClose(); 
//     };

//     return (
//         <div className="modal-overlay">
//             {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//             {/* Modal xác nhận hủy */}
//             {courseToUnenroll && (
//                 <div className="modal-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1100 }}>
//                     <div className="modal-content" style={{ maxWidth: '400px', padding: '20px', marginTop: '10%' }}>
//                         <h3 style={{ marginTop: 0, color: '#e74c3c' }}>Xác Nhận Hủy</h3>
//                         <p>Bạn muốn hủy môn <b>{courseToUnenroll.courseName}</b>?</p>
//                         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
//                             <button onClick={() => setCourseToUnenroll(null)} className="btn-cancel">Quay lại</button>
//                             <button 
//                                 onClick={() => handleUnenrollConfirm(courseToUnenroll.courseId || courseToUnenroll.courseID)} 
//                                 className="btn-primary"
//                                 style={{backgroundColor: '#e74c3c'}}
//                             >
//                                 Đồng ý Hủy
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Modal chính */}
//             <div className="modal-content" style={{ maxWidth: '1200px', width: '95%', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
//                 <div className="modal-header">
//                     <h2>Đăng ký Môn Học</h2>
//                     <button onClick={handleManualClose} className="modal-close-btn">&times;</button>
//                 </div>

//                 <div className="modal-body table-container" style={{ overflowY: 'auto', flex: 1, padding: 0 }}>
//                     <table className="course-enrollment-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        
//                         {/* Sticky Header */}
//                         <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#f8f9fa', boxShadow: '0 2px 2px -1px rgba(0,0,0,0.1)' }}>
//                             <tr>
//                                 <th style={stickyHeaderStyle}>Mã KH</th>
//                                 <th style={stickyHeaderStyle}>Tên Khóa Học</th>
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '80px'}}>Học kỳ</th> 
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '60px'}}>TC</th>
//                                 <th style={stickyHeaderStyle}>Giảng viên</th>
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '100px'}}>Sĩ số</th>
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '120px'}}>Thao tác</th>
//                             </tr>
//                         </thead>
                        
//                         <tbody>
//                             {allCourses.length > 0 ? (
//                                 allCourses.map(course => {
//                                     const cId = course.courseId || course.courseID;
//                                     const isFull = (course.currentEnrollment || 0) >= course.maxCapacity;
//                                     const isLoading = loadingMap[cId];
//                                     const isRegistered = enrolledIds.has(cId); 

//                                     return (
//                                         <tr key={cId} style={{ borderBottom: '1px solid #eee' }}>
//                                             <td style={{padding: '12px'}}>{cId}</td>
//                                             <td style={{fontWeight: 'bold', color: '#2c3e50', padding: '12px'}}>{course.courseName}</td>
//                                             <td style={{textAlign: 'center'}}>{course.semester || '-'}</td>
//                                             <td style={{textAlign: 'center'}}>{course.credits}</td>
//                                             <td style={{padding: '12px'}}>{course.lecturerName || '...'}</td>
//                                             <td style={{textAlign: 'center'}}>
//                                                 <span style={{ color: isFull ? 'red' : 'green', fontWeight: 'bold' }}>
//                                                     {course.currentEnrollment || 0}
//                                                 </span> / {course.maxCapacity}
//                                             </td>
//                                             <td style={{textAlign: 'center', padding: '12px'}}>
//                                                 {isRegistered ? (
//                                                     <button 
//                                                         onClick={() => setCourseToUnenroll(course)}
//                                                         className="btn-cancel"
//                                                         style={{ width: '100%', backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px' }}
//                                                         disabled={isLoading}
//                                                     >
//                                                         {isLoading ? '...' : 'Hủy ĐK'}
//                                                     </button>
//                                                 ) : (
//                                                     <button 
//                                                         onClick={() => handleEnroll(cId)}
//                                                         className="btn-primary"
//                                                         style={{ width: '100%', padding: '6px' }}
//                                                         disabled={isFull || isLoading}
//                                                     >
//                                                         {isLoading ? '...' : (isFull ? 'Đã Đầy' : 'Đăng ký')}
//                                                     </button>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })
//                             ) : (
//                                 <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Đang tải hoặc không có dữ liệu...</td></tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 <div className="modal-footer">
//                     <button onClick={handleManualClose} className="btn-cancel">Đóng</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const stickyHeaderStyle = {
//     padding: '12px',
//     textAlign: 'left',
//     backgroundColor: '#f8f9fa', 
//     borderBottom: '2px solid #dee2e6',
//     whiteSpace: 'nowrap'
// };

// export default EnrollCourseModal;

// import React, { useState, useEffect, useCallback } from 'react';
// import '../styles/Modal.css';
// import { courseAPI, enrollmentAPI } from '../services/apiService'; 
// import Toast from './Toast';
// import { io } from 'socket.io-client';

// const EnrollCourseModal = ({ studentId, onClose, onSuccess }) => { 
    
//     const [allCourses, setAllCourses] = useState([]); 
//     const [enrolledCourses, setEnrolledCourses] = useState([]); 
//     const [loadingMap, setLoadingMap] = useState({});
//     const [toast, setToast] = useState(null);
//     const [courseToUnenroll, setCourseToUnenroll] = useState(null);
//     const [hasChanged, setHasChanged] = useState(false);

//     const enrolledIds = new Set(enrolledCourses?.map(c => c.courseId || c.courseID) || []);

//     // Khóa cuộn trang body
//     useEffect(() => {
//         document.body.style.overflow = 'hidden';
//         return () => {
//             document.body.style.overflow = 'unset';
//         };
//     }, []);

//     // FETCH DATA
//     const fetchData = useCallback(async () => {
//         if (!studentId) return;
//         try {
//             const [coursesRes, enrolledRes] = await Promise.all([
//                 courseAPI.getAll(),
//                 enrollmentAPI.getByStudent(studentId)
//             ]);
//             setAllCourses(coursesRes.data?.result || coursesRes.result || []);
//             setEnrolledCourses(enrolledRes.data?.result || enrolledRes.result || []); 
//         } catch (error) {
//             console.error("Lỗi tải dữ liệu:", error);
//         }
//     }, [studentId]);

//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     // SOCKET REAL-TIME
//     useEffect(() => {
//         const socket = io('http://localhost:8085');

//         socket.on('CREATE_COURSE_SUCCESS', () => { fetchData(); setToast({ message: 'Có môn học mới!', type: 'info' }); });
//         socket.on('UPDATE_COURSE_SUCCESS', () => fetchData());
//         socket.on('DELETE_COURSE', () => { fetchData(); setToast({ message: 'Danh sách vừa cập nhật (Có môn bị xóa)', type: 'info' }); });
        
//         // Các sự kiện thay đổi sĩ số
//         socket.on('STUDENT_CANCEL_COURSE', () => fetchData());
//         socket.on('STUDENT_REGISTER_COURSE', () => fetchData());
//         socket.on('REGISTER_TEACHING', () => fetchData());
//         socket.on('CANCEL_TEACHING', () => fetchData());

//         return () => { socket.disconnect(); };
//     }, [fetchData]);

//     // HÀM HELPER XỬ LÝ LỖI
//     const getErrorMessage = (err) => {
//         const data = err.response?.data;
//         if (!data) return 'Thao tác thất bại (Lỗi mạng hoặc Server).';
//         if (Array.isArray(data)) return data.map(e => e.message || JSON.stringify(e)).join('\n');
//         if (data.message) return data.message;
//         if (data.result) return data.result;
//         if (data.errors && Array.isArray(data.errors)) {
//             return data.errors.map(e => e.message || e.defaultMessage).join('\n');
//         }
//         return 'Đã có lỗi xảy ra.';
//     };

//     // --- XỬ LÝ ĐĂNG KÝ ---
//     const handleEnroll = async (courseId) => {
//         setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
//         try {
//             await enrollmentAPI.register(studentId, courseId);
//             setToast({ message: 'Đăng ký thành công!', type: 'success' });
//             setHasChanged(true);

//             // Cập nhật state tạm thời
//             setEnrolledCourses(prev => [...prev, { courseId: courseId }]);
//             // Reload lại để lấy thông tin đầy đủ của khóa học vừa đăng ký (credits, name...) cho phần tổng kết
//             fetchData(); 
//         } catch (err) {
//             const msg = getErrorMessage(err);
//             setToast({ message: msg, type: 'error' });
//             fetchData(); 
//         } finally {
//             setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
//         }
//     };
    
//     // --- XỬ LÝ HỦY ĐĂNG KÝ ---
//     const handleUnenrollConfirm = async (courseId) => {
//         setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
//         setCourseToUnenroll(null); 
//         try {
//             await enrollmentAPI.cancel(studentId, courseId);
//             setToast({ message: 'Hủy đăng ký thành công!', type: 'success' });
//             setHasChanged(true); 

//             setEnrolledCourses(prev => prev.filter(c => (c.courseId || c.courseID) !== courseId));
//             fetchData(); // Reload lại data để đồng bộ sĩ số
//         } catch (err) {
//             const msg = getErrorMessage(err);
//             setToast({ message: msg, type: 'error' });
//             fetchData(); 
//         } finally {
//             setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
//         }
//     };

//     const handleManualClose = () => {
//         if (hasChanged) onSuccess(); 
//         onClose(); 
//     };

//     // 👇 1. TÍNH TOÁN TỔNG KẾT (MỚI THÊM)
//     // Lấy danh sách chi tiết các môn ĐÃ ĐĂNG KÝ từ allCourses để đảm bảo có field 'credits'
//     // (Vì đôi khi API getByStudent chỉ trả về ID hoặc object thiếu thông tin)
//     const myDetailedCourses = allCourses.filter(c => enrolledIds.has(c.courseId || c.courseID));
    
//     // Nếu enrolledCourses đã có đủ thông tin credits thì dùng trực tiếp, ở đây tôi map qua allCourses cho chắc chắn
//     const totalCredits = myDetailedCourses.reduce((acc, curr) => acc + (curr.credits || 0), 0);
//     const totalSubjects = myDetailedCourses.length;


//     return (
//         <div className="modal-overlay">
//             {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//             {/* Modal xác nhận hủy */}
//             {courseToUnenroll && (
//                 <div className="modal-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1100 }}>
//                     <div className="modal-content" style={{ maxWidth: '400px', padding: '20px', marginTop: '10%' }}>
//                         <h3 style={{ marginTop: 0, color: '#e74c3c' }}>Xác Nhận Hủy</h3>
//                         <p>Bạn muốn hủy môn <b>{courseToUnenroll.courseName}</b>?</p>
//                         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
//                             <button onClick={() => setCourseToUnenroll(null)} className="btn-cancel">Quay lại</button>
//                             <button 
//                                 onClick={() => handleUnenrollConfirm(courseToUnenroll.courseId || courseToUnenroll.courseID)} 
//                                 className="btn-primary"
//                                 style={{backgroundColor: '#e74c3c'}}
//                             >
//                                 Đồng ý Hủy
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Modal chính */}
//             <div className="modal-content" style={{ maxWidth: '1200px', width: '95%', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                
//                 {/* 👇 2. CẬP NHẬT HEADER VỚI THÔNG TIN TỔNG KẾT */}
//                 <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <div>
//                         <h2 style={{ margin: '0 0 5px 0' }}>Đăng ký Môn Học</h2>
//                         <div style={{ fontSize: '14px', color: '#555', display: 'flex', gap: '15px' }}>
//                             <span style={{ fontWeight: '500' }}>Tổng số môn: <strong>{totalSubjects}</strong></span>
//                             <span style={{ fontWeight: '500' }}>Tổng tín chỉ: <strong>{totalCredits}</strong></span>
//                         </div>
//                     </div>
//                     <button onClick={handleManualClose} className="modal-close-btn">&times;</button>
//                 </div>

//                 <div className="modal-body table-container" style={{ overflowY: 'auto', flex: 1, padding: 0 }}>
//                     <table className="course-enrollment-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        
//                         {/* Sticky Header */}
//                         <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#f8f9fa', boxShadow: '0 2px 2px -1px rgba(0,0,0,0.1)' }}>
//                             <tr>
//                                 <th style={stickyHeaderStyle}>Mã KH</th>
//                                 <th style={stickyHeaderStyle}>Tên Khóa Học</th>
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '80px'}}>Học kỳ</th> 
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '60px'}}>TC</th>
//                                 <th style={stickyHeaderStyle}>Giảng viên</th>
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '100px'}}>Sĩ số</th>
//                                 <th style={{...stickyHeaderStyle, textAlign: 'center', width: '120px'}}>Thao tác</th>
//                             </tr>
//                         </thead>
                        
//                         <tbody>
//                             {allCourses.length > 0 ? (
//                                 allCourses.map(course => {
//                                     const cId = course.courseId || course.courseID;
//                                     const isFull = (course.currentEnrollment || 0) >= course.maxCapacity;
//                                     const isLoading = loadingMap[cId];
//                                     const isRegistered = enrolledIds.has(cId); 

//                                     return (
//                                         <tr key={cId} style={{ borderBottom: '1px solid #eee' }}>
//                                             <td style={{padding: '12px'}}>{cId}</td>
//                                             <td style={{fontWeight: 'bold', color: '#2c3e50', padding: '12px'}}>{course.courseName}</td>
//                                             <td style={{textAlign: 'center'}}>{course.semester || '-'}</td>
//                                             <td style={{textAlign: 'center'}}>{course.credits}</td>
//                                             <td style={{padding: '12px'}}>{course.lecturerName || '...'}</td>
//                                             <td style={{textAlign: 'center'}}>
//                                                 <span style={{ color: isFull ? '#e74c3c' : '#27ae60', fontWeight: 'bold' }}>
//                                                     {course.currentEnrollment || 0}
//                                                 </span> / {course.maxCapacity}
//                                             </td>
                                            
//                                             {/* 👇 3. LOGIC NÚT BẤM CẬP NHẬT (FULL -> DISABLE) */}
//                                             <td style={{textAlign: 'center', padding: '12px'}}>
//                                                 {isRegistered ? (
//                                                     <button 
//                                                         onClick={() => setCourseToUnenroll(course)}
//                                                         className="btn-cancel"
//                                                         style={{ width: '100%', backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px' }}
//                                                         disabled={isLoading}
//                                                     >
//                                                         {isLoading ? '...' : 'Hủy ĐK'}
//                                                     </button>
//                                                 ) : isFull ? (
//                                                     // NẾU FULL THÌ DISABLE LUÔN
//                                                     <button 
//                                                         disabled
//                                                         style={{ 
//                                                             width: '100%', padding: '6px', 
//                                                             backgroundColor: '#bdc3c7', color: '#fff', // Màu xám
//                                                             cursor: 'not-allowed', border: 'none'
//                                                         }}
//                                                     >
//                                                         Đã Đầy
//                                                     </button>
//                                                 ) : (
//                                                     <button 
//                                                         onClick={() => handleEnroll(cId)}
//                                                         className="btn-primary"
//                                                         style={{ width: '100%', padding: '6px' }}
//                                                         disabled={isLoading}
//                                                     >
//                                                         {isLoading ? '...' : 'Đăng ký'}
//                                                     </button>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })
//                             ) : (
//                                 <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Đang tải hoặc không có dữ liệu...</td></tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 <div className="modal-footer">
//                     <button onClick={handleManualClose} className="btn-cancel">Đóng</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const stickyHeaderStyle = {
//     padding: '12px',
//     textAlign: 'left',
//     backgroundColor: '#f8f9fa', 
//     borderBottom: '2px solid #dee2e6',
//     whiteSpace: 'nowrap'
// };

// export default EnrollCourseModal;

import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Modal.css';
import { courseAPI, enrollmentAPI } from '../services/apiService'; 
import Toast from './Toast';
import { io } from 'socket.io-client';

const EnrollCourseModal = ({ studentId, onClose, onSuccess }) => { 
    
    const [allCourses, setAllCourses] = useState([]); 
    const [enrolledCourses, setEnrolledCourses] = useState([]); 
    // 👇 1. THÊM STATE LƯU TỔNG TÍN CHỈ
    const [totalCredits, setTotalCredits] = useState(0);

    const [loadingMap, setLoadingMap] = useState({});
    const [toast, setToast] = useState(null);
    const [courseToUnenroll, setCourseToUnenroll] = useState(null);
    const [hasChanged, setHasChanged] = useState(false);

    const enrolledIds = new Set(enrolledCourses?.map(c => c.courseId || c.courseID) || []);

    // Khóa cuộn trang body
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // 👇 2. CẬP NHẬT FETCH DATA ĐỂ GỌI API TÍNH TÍN CHỈ TỪ DB
    const fetchData = useCallback(async () => {
        if (!studentId) return;
        try {
            // Gọi song song 3 API: Khóa học, DS đã đăng ký, Tổng tín chỉ (Function DB)
            const [coursesRes, enrolledRes, creditsRes] = await Promise.all([
                courseAPI.getAll(),
                enrollmentAPI.getByStudent(studentId),
                enrollmentAPI.getTotalCredits(studentId) // API mới bạn cung cấp
            ]);

            setAllCourses(coursesRes.data?.result || coursesRes.result || []);
            setEnrolledCourses(enrolledRes.data?.result || enrolledRes.result || []); 
            
            // Cập nhật tổng tín chỉ từ kết quả trả về
            setTotalCredits(creditsRes.data?.result || 0);

        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        }
    }, [studentId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // SOCKET REAL-TIME
    useEffect(() => {
        const socket = io('http://localhost:8085');

        socket.on('CREATE_COURSE_SUCCESS', () => { fetchData(); setToast({ message: 'Có môn học mới!', type: 'info' }); });
        socket.on('UPDATE_COURSE_SUCCESS', () => fetchData());
        socket.on('DELETE_COURSE', () => { fetchData(); setToast({ message: 'Danh sách vừa cập nhật (Có môn bị xóa)', type: 'info' }); });
        
        // Các sự kiện thay đổi sĩ số
        socket.on('STUDENT_CANCEL_COURSE', () => fetchData());
        socket.on('STUDENT_REGISTER_COURSE', () => fetchData());
        socket.on('REGISTER_TEACHING', () => fetchData());
        socket.on('CANCEL_TEACHING', () => fetchData());

        return () => { socket.disconnect(); };
    }, [fetchData]);

    // HÀM HELPER XỬ LÝ LỖI
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

    // --- XỬ LÝ ĐĂNG KÝ ---
    const handleEnroll = async (courseId) => {
        setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
        try {
            await enrollmentAPI.register(studentId, courseId);
            setToast({ message: 'Đăng ký thành công!', type: 'success' });
            setHasChanged(true);

            // Cập nhật state tạm thời để UI phản hồi ngay lập tức
            setEnrolledCourses(prev => [...prev, { courseId: courseId }]);
            
            // 👇 QUAN TRỌNG: Gọi lại fetchData để cập nhật lại Tổng tín chỉ chính xác từ DB
            fetchData(); 
            
        } catch (err) {
            const msg = getErrorMessage(err);
            setToast({ message: msg, type: 'error' });
            fetchData(); 
        } finally {
            setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
        }
    };
    
    // --- XỬ LÝ HỦY ĐĂNG KÝ ---
    const handleUnenrollConfirm = async (courseId) => {
        setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
        setCourseToUnenroll(null); 
        try {
            await enrollmentAPI.cancel(studentId, courseId);
            setToast({ message: 'Hủy đăng ký thành công!', type: 'success' });
            setHasChanged(true); 

            // Update UI tạm
            setEnrolledCourses(prev => prev.filter(c => (c.courseId || c.courseID) !== courseId));
            
            // 👇 QUAN TRỌNG: Gọi lại fetchData để cập nhật lại Tổng tín chỉ (trừ đi tín chỉ vừa hủy)
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

    // 👇 3. BỎ LOGIC TÍNH TOÁN CLIENT (reduce), CHỈ CẦN LẤY SỐ LƯỢNG MÔN
    const totalSubjects = enrolledCourses.length;

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
                
                {/* Header với thông tin tổng kết từ DB */}
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ margin: '0 0 5px 0' }}>Đăng ký môn học</h2>
                        <div style={{ fontSize: '14px', color: '#555', display: 'flex', gap: '15px' }}>
                            <span style={{ fontWeight: '500' }}>Tổng số môn: <strong>{totalSubjects}</strong></span>
                            {/* 👇 HIỂN THỊ TOTAL CREDITS TỪ DB */}
                            <span style={{ fontWeight: '500' }}>Tổng tín chỉ: <strong>{totalCredits}</strong></span>
                        </div>
                    </div>
                    <button onClick={handleManualClose} className="modal-close-btn">&times;</button>
                </div>

                <div className="modal-body table-container" style={{ overflowY: 'auto', flex: 1, padding: 0 }}>
                    <table className="course-enrollment-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        
                        {/* Sticky Header */}
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


