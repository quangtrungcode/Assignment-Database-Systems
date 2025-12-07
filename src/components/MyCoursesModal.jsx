// import React, { useState, useEffect } from 'react'; 
// import '../styles/Modal.css';
// import { courseAPI } from "../services/apiService";

// /**
//  * MyCoursesModal Component
//  */
// function MyCoursesModal({ onClose, studentId, onSuccess, onRefresh }) {
    
//     const [courses, setCourses] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Xử lý logic cũ (không còn cần)
//     // const handleViewDetails = (course) => {
//     //     alert(`Xem chi tiết Khóa học: ${course.courseName} (${course.courseID})`);
//     // };
//     // const handleDropCourse = async (course) => { /* ... */ };

//     // 1. Fetch dữ liệu khi modal mở
//     useEffect(() => {
//         const fetchCourses = async () => {
//             try {
//                 setError(null);
//                 setIsLoading(true);

//                 const response = await courseAPI.getMyEnrollments(); 
                
//                 // Trích xuất mảng khóa học từ key "result"
//                 const enrolledCourses = response.data.result || [];
//                 setCourses(enrolledCourses); 
                
//             } catch (err) {
//                 console.error("Lỗi khi tải Khóa học của tôi:", err);
//                 let errorMessage = "Không thể tải danh sách khóa học. Vui lòng thử lại.";
//                 if (err.response && err.response.data && err.response.data.message) {
//                     errorMessage = err.response.data.message;
//                 } else if (err.response && err.response.status) {
//                      errorMessage = `Lỗi Server (${err.response.status}). Vui lòng kiểm tra log Server.`;
//                 } else if (err.request) {
//                     errorMessage = "Không thể kết nối đến Server. Vui lòng kiểm tra mạng hoặc Server đã chạy chưa.";
//                 }
                
//                 setError(errorMessage); 
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchCourses();
//     }, [studentId, onRefresh]); 
    
//     // --- HIỂN THỊ TRẠNG THÁI ---
    
//     if (isLoading) {
//         return (
//             <div className="modal-overlay">
//                 <div className="modal-content" style={{ maxWidth: '800px', textAlign: 'center' }}>
//                     <h2>📚 Khóa học của tôi</h2>
//                     <p>Đang tải dữ liệu...</p>
//                     <div className="spinner"></div>
//                     <button className="close-button" onClick={onClose}>&times;</button>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="modal-overlay">
//                 <div className="modal-content" style={{ maxWidth: '800px' }}>
//                     <div className="modal-header">
//                         <h2 style={{color: '#dc3545'}}>Lỗi</h2>
//                         <button className="close-button" onClick={onClose}>&times;</button>
//                     </div>
//                     <div className="modal-body" style={{padding: '20px', color: '#dc3545'}}>
//                         <p>❌ {error}</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // --- HIỂN THỊ DỮ LIỆU ---

//     return (
//         <div className="modal-overlay">
//             <div className="modal-content" style={{ maxWidth: '1100px' }}>
//                 <div className="modal-header">
//                     <h2 style={{color: '#007bff'}}>📚 Khóa học của tôi</h2>
//                     <button className="close-button" onClick={onClose}>&times;</button>
//                 </div>
//                 <div className="modal-body" style={{padding: '20px'}}>
                    
//                     {courses.length > 0 ? (
//                         <table className="courses-table" style={tableStyle}>
//                             <thead>
//                                 <tr>
//                                     <th style={thStyle}>Mã MH</th>
//                                     <th style={thStyle}>Tên Môn Học</th>
//                                     <th style={thStyle}>Tín Chỉ</th>
//                                     {/* <th style={thStyle}>Hành Động</th> 👈 ĐÃ XÓA CỘT HEADER */}
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {courses.map((course) => (
//                                     <tr key={course.courseID} style={trStyle}> 
//                                         <td style={tdStyle}>**{course.courseID}**</td>
//                                         <td style={tdStyle}>{course.courseName}</td> 
//                                         <td style={tdStyle}>{course.credits}</td>
//                                         {/* <td style={tdStyle}>... các nút Hành Động đã bị xóa ...</td> 👈 ĐÃ XÓA CỘT DATA */}
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     ) : (
//                         <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '8px' }}>
//                             <p style={{ color: '#856404', fontWeight: 'bold' }}>
//                                 🔔 Bạn chưa đăng ký khóa học nào trong hệ thống.
//                             </p>
//                             <p>Vui lòng chọn "Đăng ký môn học" để bắt đầu.</p>
//                         </div>
//                     )}
//                 </div>
//                 <div className="modal-footer">
//                     <button className="btn-secondary" onClick={onClose}>Đóng</button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// const tableStyle = {
//     width: '100%',
//     borderCollapse: 'collapse',
//     marginTop: '15px'
// };

// const thStyle = {
//     border: '1px solid #dee2e6',
//     padding: '12px',
//     textAlign: 'left',
//     backgroundColor: '#007bff',
//     color: 'white',
// };

// const trStyle = {
//     transition: 'background-color 0.2s',
// };

// const tdStyle = {
//     border: '1px solid #dee2e6',
//     padding: '12px',
//     textAlign: 'left',
// };

// // Đã loại bỏ styles của các nút Hành Động không còn sử dụng

// export default MyCoursesModal;

// import React, { useState, useEffect, useCallback } from 'react'; 
// import '../styles/Modal.css';
// import { enrollmentAPI } from "../services/apiService"; 
// // 👇 1. IMPORT SOCKET
// import { io } from 'socket.io-client';

// function MyCoursesModal({ onClose, studentId }) {
    
//     const [courses, setCourses] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Khóa cuộn trang khi mở Modal
//     useEffect(() => {
//         document.body.style.overflow = 'hidden';
//         return () => {
//             document.body.style.overflow = 'unset';
//         };
//     }, []); 

//     // 👇 2. TÁCH HÀM FETCH DATA (Sử dụng useCallback)
//     const fetchCourses = useCallback(async () => {
//         if (!studentId) return;
//         try {
//             // Không set loading = true ở đây để tránh nháy màn hình khi update ngầm qua socket
//             // Chỉ set loading lần đầu thông qua state khởi tạo hoặc check courses.length
            
//             const response = await enrollmentAPI.getByStudent(studentId); 
//             const data = response.data.result || [];
            
//             console.log("MyCourses - Data loaded:", data);
//             setCourses(data); 
            
//         } catch (err) {
//             console.error("Lỗi tải danh sách:", err);
//             setError("Không thể tải dữ liệu. Vui lòng thử lại.");
//         } finally {
//             setIsLoading(false);
//         }
//     }, [studentId]);

//     // Gọi lần đầu khi component mount
//     useEffect(() => {
//         if (courses.length === 0) setIsLoading(true);
//         fetchCourses();
//     }, [fetchCourses]);

//     // 👇 3. LẮNG NGHE SOCKET REAL-TIME
//     useEffect(() => {
//         const socket = io('http://localhost:8085');

//         // Socket 1: Có sự kiện Đăng ký (Của mình ở tab khác hoặc thiết bị khác)
//         socket.on('STUDENT_REGISTER_COURSE', () => {
//             console.log("Socket: REGISTER_COURSE -> Reloading...");
//             fetchCourses();
//         });

//         // Socket 2: Có sự kiện Hủy môn
//         socket.on('STUDENT_CANCEL_COURSE', () => {
//             console.log("Socket: CANCEL_COURSE -> Reloading...");
//             fetchCourses();
//         });

//         // Socket 3: Admin xóa môn học -> Môn đó phải biến mất khỏi danh sách của tôi
//         socket.on('DELETE_COURSE', () => {
//             console.log("Socket: DELETE_COURSE -> Reloading...");
//             fetchCourses();
//         });

//         // Socket 4 (Bổ sung): Admin sửa tên/tín chỉ môn học -> Cập nhật hiển thị
//         socket.on('UPDATE_COURSE_SUCCESS', () => {
//             fetchCourses();
//         });
//         socket.on('REGISTER_TEACHING', () => fetchData());
//         socket.on('CANCEL_TEACHING', () => fetchData());
//         // Cleanup
//         return () => {
//             socket.disconnect();
//         };
//     }, [fetchCourses]);


//     return (
//         <div className="modal-overlay">
//             <div className="modal-content" style={{ maxWidth: '1200px', width: '90%', overscrollBehavior: 'contain' }}>
                
//                 <div className="modal-header" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
//                     <h2 style={{color: '#333', margin: 0}}>📘 Khóa học của tôi</h2>
//                     <button className="close-button" onClick={onClose} style={{fontSize: '24px'}}>&times;</button>
//                 </div>
                
//                 <div className="modal-body" style={{padding: '20px', maxHeight: '70vh', overflowY: 'auto'}}>
                    
//                     {isLoading && courses.length === 0 ? (
//                          <div style={{textAlign: 'center', padding: '20px'}}>
//                              <div className="spinner"></div> 
//                              <p>Đang tải dữ liệu...</p>
//                          </div>
//                     ) : (
//                         <>
//                             {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}

//                             <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
//                                 <thead>
//                                     <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
//                                         <th style={thStyle}>Mã KH</th>
//                                         <th style={thStyle}>Tên Khóa Học</th>
//                                         <th style={{...thStyle, textAlign: 'center'}}>Học kỳ</th>
//                                         <th style={{...thStyle, textAlign: 'center'}}>Tín chỉ</th>
//                                         <th style={{...thStyle, textAlign: 'center'}}>Sĩ số</th>
//                                         <th style={thStyle}>Giảng viên</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {courses.length > 0 ? (
//                                         courses.map((course, index) => (
//                                             <tr key={course.courseId || index} style={{ borderBottom: '1px solid #eee' }} className="hover-row">
//                                                 <td style={tdStyle}>{course.courseId}</td>
//                                                 <td style={tdStyle}>
//                                                     <span style={{ fontWeight: 'bold', color: '#0369a1' }}>
//                                                         {course.courseName}
//                                                     </span>
//                                                 </td>
//                                                 <td style={{...tdStyle, textAlign: 'center'}}>{course.semester}</td>
//                                                 <td style={{...tdStyle, textAlign: 'center'}}>{course.credits}</td>
//                                                 <td style={{...tdStyle, textAlign: 'center'}}>
//                                                     <span style={{fontWeight: 'bold', color: course.currentEnrollment >= course.maxCapacity ? 'red' : '#27ae60'}}>
//                                                         {course.currentEnrollment}
//                                                     </span> 
//                                                     / {course.maxCapacity}
//                                                 </td>
//                                                 <td style={tdStyle}>{course.lecturerName || "Chưa phân công"}</td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan="6" style={{textAlign: 'center', padding: '30px', color: '#666', fontStyle: 'italic'}}>
//                                                 Bạn chưa đăng ký môn học nào.
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </>
//                     )}
//                 </div>
                
//                 <div className="modal-footer" style={{ borderTop: '1px solid #ddd', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <div style={{ fontWeight: 'bold', color: '#555' }}>
//                         Tổng số môn: {courses.length} | Tổng tín chỉ: {courses.reduce((acc, curr) => acc + (curr.credits || 0), 0)}
//                     </div>
//                     <button 
//                         onClick={onClose}
//                         style={{
//                             padding: '8px 25px',
//                             backgroundColor: '#6c757d',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '4px',
//                             cursor: 'pointer'
//                         }}
//                     >
//                         Đóng
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// const thStyle = {
//     padding: '12px 15px',
//     textAlign: 'left',
//     color: '#333',
//     fontWeight: '600',
//     whiteSpace: 'nowrap',
//     backgroundColor: '#f1f3f5'
// };

// const tdStyle = {
//     padding: '12px 15px',
//     color: '#333',
//     verticalAlign: 'middle'
// };

// export default MyCoursesModal;


import React, { useState, useEffect, useCallback } from 'react'; 
import '../styles/Modal.css';
import { enrollmentAPI } from "../services/apiService"; 
import { io } from 'socket.io-client';

function MyCoursesModal({ onClose, studentId }) {
    
    const [courses, setCourses] = useState([]);
    // 👇 1. STATE LƯU TỔNG TÍN CHỈ
    const [totalCredits, setTotalCredits] = useState(0);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Khóa cuộn trang khi mở Modal
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []); 

    // 👇 2. CẬP NHẬT HÀM FETCH DATA
    const fetchCourses = useCallback(async () => {
        if (!studentId) return;
        
        // --- PHẦN 1: Lấy danh sách khóa học ---
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

        // --- PHẦN 2: Lấy Tổng tín chỉ từ Database (API Function) ---
        try {
            const creditRes = await enrollmentAPI.getTotalCredits(studentId);
            setTotalCredits(creditRes.data?.result || 0);
        } catch (err) {
            console.error("Lỗi lấy tổng tín chỉ:", err);
            // Không set error chung để tránh làm ẩn danh sách môn học
        }

    }, [studentId]);

    // Gọi lần đầu khi component mount
    useEffect(() => {
        if (courses.length === 0) setIsLoading(true);
        fetchCourses();
    }, [fetchCourses]);

    // 👇 3. LẮNG NGHE SOCKET REAL-TIME
    useEffect(() => {
        const socket = io('http://localhost:8085');

        const handleReload = () => {
            console.log("Socket: Data changed -> Reloading...");
            fetchCourses();
        };

        // Các sự kiện thay đổi dữ liệu
        socket.on('STUDENT_REGISTER_COURSE', handleReload);
        socket.on('STUDENT_CANCEL_COURSE', handleReload);
        socket.on('DELETE_COURSE', handleReload);
        socket.on('UPDATE_COURSE_SUCCESS', handleReload);
        
        // Sửa lỗi cũ: Đổi fetchData() thành fetchCourses()
        socket.on('REGISTER_TEACHING', handleReload);
        socket.on('CANCEL_TEACHING', handleReload);

        // Cleanup
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
                        {/* 👇 4. HIỂN THỊ TOTAL CREDITS TỪ STATE (KHÔNG TÍNH TOÁN NỮA) */}
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