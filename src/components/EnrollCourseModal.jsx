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
// Gọi API riêng cho khóa học và user
import { courseAPI, userAPI } from '../services/apiService'; 
import Toast from './Toast';

// Component này chỉ cần props cơ bản
const EnrollCourseModal = ({ studentId, onClose, onSuccess }) => { 
    
    const [allCourses, setAllCourses] = useState([]); // List tất cả khóa học
    const [enrolledCourses, setEnrolledCourses] = useState([]); // List khóa học user đã đăng ký
    const [loadingMap, setLoadingMap] = useState({});
    const [toast, setToast] = useState(null);
    const [courseToUnenroll, setCourseToUnenroll] = useState(null); // State kiểm soát Modal Xác nhận

    // Tính toán Set ID các môn đã đăng ký từ state local
    const enrolledIds = new Set(enrolledCourses?.map(c => c.courseID) || []); 


    // 1. CHẠY SONG SONG: Fetch tất cả courses và MY enrollments
    useEffect(() => {
        const fetchDualData = async () => {
            try {
                // 1. Fetch ALL courses (cho bảng hiển thị)
                const coursesRes = await courseAPI.getAll(); 
                
                // 2. Fetch KHÓA HỌC ĐÃ ĐĂNG KÝ (cho logic so sánh)
                const enrolledRes = await courseAPI.getMyEnrollments(); 
                
                console.log("🔥 MY ENROLLMENTS API RESPONSE:", enrolledRes.data.result); 

                setAllCourses(coursesRes.data.result || []);
                setEnrolledCourses(enrolledRes.data.result || []); // Cập nhật state mới
                
            } catch (error) {
                console.error("Lỗi tải dữ liệu kép:", error);
                setToast({ message: 'Không thể tải dữ liệu khóa học. Vui lòng kiểm tra đăng nhập.', type: 'error' });
            }
        };
        fetchDualData();
    }, []); 

    // 2. Hàm xử lý ĐĂNG KÝ (Enroll)
    const handleEnroll = async (courseId) => {
        setLoadingMap(prev => ({ ...prev, [courseId]: true })); 

        try {
            await courseAPI.enroll(courseId);
            
            setToast({ message: 'Đăng ký thành công!', type: 'success' });
            
            setTimeout(() => {
                onClose(); 
                onSuccess(); 
            }, 2500); // Tăng thời gian chờ

        } catch (err) {
            const msg = err.response?.data?.message || 'Đăng ký thất bại.';
            setToast({ message: msg, type: 'error' });
            setTimeout(() => setToast(null), 3000); 
        } finally {
            setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
        }
    };
    
    // 3. Hàm xử lý HỦY ĐĂNG KÝ (Unenroll)
    const handleUnenrollConfirm = async (courseId) => {
        // Log để chắc chắn hàm này được gọi
        console.log("🚨 CONFIRMATION CLICKED. Attempting unenroll for ID:", courseId);
        
        setLoadingMap(prev => ({ ...prev, [courseId]: true })); 
        setCourseToUnenroll(null); // Đóng modal xác nhận ngay lập tức

        try {
            await courseAPI.unenroll(courseId); // GỬI REQUEST
            
            setToast({ message: 'Hủy đăng ký thành công!', type: 'success' });
            
            // Chờ 2.5 giây trước khi đóng modal
            setTimeout(() => {
                onClose(); 
                onSuccess(); 
            }, 2500); 

        } catch (err) {
            const msg = err.response?.data?.message || 'Hủy thất bại. Vui lòng kiểm tra console.';
            setToast({ message: msg, type: 'error' });
            setTimeout(() => setToast(null), 3000); 
        } finally {
            setLoadingMap(prev => ({ ...prev, [courseId]: false })); 
        }
    };


    return (
        <div className="modal-overlay">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* 🚨 BỔ SUNG: MODAL XÁC NHẬN HỦY ĐĂNG KÝ 🚨 */}
            {courseToUnenroll && (
                <div className="modal-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1000 }}>
                    <div className="modal-content" style={{ maxWidth: '400px', padding: '30px' }}>
                        <div className="modal-header" style={{borderBottom: 'none'}}>
                            <h3 style={{ margin: 0 }}>Xác Nhận Hủy Đăng Ký</h3>
                            <button onClick={() => setCourseToUnenroll(null)} className="modal-close-btn">&times;</button>
                        </div>
                        <div className="modal-body" style={{ textAlign: 'center' }}>
                            <p>Bạn có chắc chắn muốn hủy đăng ký khóa học **{courseToUnenroll.courseName}**?</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                            <button onClick={() => setCourseToUnenroll(null)} className="btn-cancel" style={{padding: '10px 25px'}}>
                                Hủy
                            </button>
                            {/* KẾT NỐI HÀM VÀ THAM SỐ CHÍNH XÁC */}
                            <button 
                                onClick={() => handleUnenrollConfirm(courseToUnenroll.courseID)} 
                                className="btn-primary"
                                style={{backgroundColor: '#e74c3c', padding: '10px 25px'}}
                            >
                                Đồng ý
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ----------------------------------------------- */}

            <div className="modal-content" style={{ maxWidth: '1090px', width: '90%', height: 'auto' }}>
                <div className="modal-header">
                    <h2>Đăng ký Môn Học</h2>
                    <button onClick={onClose} className="modal-close-btn">&times;</button>
                </div>

                <div className="modal-body table-container" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <table className="course-enrollment-table">
                        <thead>
                            <tr>
                                <th>Mã KH</th>
                                <th>Tên Khóa Học</th>
                                <th>Tín chỉ</th>
                                <th>Giảng viên</th>
                                <th>Sĩ số</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allCourses.length > 0 ? (
                                allCourses.map(course => {
                                    const isFull = course.currentEnrollment >= course.maxCapacity;
                                    const isLoading = loadingMap[course.courseID];
                                    const isRegistered = enrolledIds.has(course.courseID); 

                                    return (
                                        <tr key={course.courseID}>
                                            <td>{course.courseID}</td>
                                            <td>{course.courseName}</td>
                                            <td>{course.credits}</td>
                                            <td>{course.lecturer?.fullName || 'N/A'}</td>
                                            <td>
                                                <span style={{ color: isFull ? 'red' : 'green', fontWeight: 'bold' }}>
                                                    {course.currentEnrollment}
                                                </span> / {course.maxCapacity}
                                            </td>
                                            <td>
                                                {isRegistered ? (
                                                    // Nút HỦY ĐĂNG KÝ (gọi setCourseToUnenroll để mở modal xác nhận)
                                                    <button 
                                                        onClick={() => setCourseToUnenroll(course)}
                                                        className="btn-cancel"
                                                        style={{ width: '120px', fontSize: '14px', backgroundColor: '#e74c3c', color: 'white' }}
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? 'Đang Hủy...' : 'Hủy ĐK'}
                                                    </button>
                                                ) : (
                                                    // Nút ĐĂNG KÝ
                                                    <button 
                                                        onClick={() => handleEnroll(course.courseID)}
                                                        className="btn-primary"
                                                        disabled={isFull || isLoading}
                                                        style={{ width: '120px', fontSize: '14px' }}
                                                    >
                                                        {isLoading ? 'Đang ĐK...' : (isFull ? 'Đã Đầy' : 'Đăng ký')}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không tìm thấy khóa học nào để đăng ký.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
                    <button onClick={onClose} className="btn-cancel" style={{padding: '10px 25px'}}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnrollCourseModal;