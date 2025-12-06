// import React, { useState } from 'react';
// import '../styles/Dashboard.css';
// import StudentProfileModal from './StudentProfileModal'; 
// import Toast from './Toast';

// function StudentDashboard({ user, onLogout, onRefresh }) {
  
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal sửa thông tin
//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // 👇 Modal xác nhận đăng xuất
//   const [toast, setToast] = useState(null);

//   const getRoleText = (roleName) => {
//     if (!roleName) return 'Chưa có vai trò';
//     return roleName.charAt(0).toUpperCase() + roleName.slice(1);
//   }

//   const getGenderText = (gender) => {
//     if (!gender) return 'Chưa cập nhật';
//     switch(gender.toLowerCase()) {
//       case 'male': case 'nam': return 'Nam'
//       case 'female': case 'nữ': return 'Nữ'
//       case 'other': case 'khác': return 'Khác'
//       default: return 'Chưa cập nhật'
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Chưa cập nhật'
//     return new Date(dateString).toLocaleDateString('vi-VN')
//   }

//   const handleUserUpdated = () => {
//     setIsModalOpen(false); 
//     setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
//     setTimeout(() => setToast(null), 3000);

//     if (onRefresh) {
//         onRefresh(); 
//     } else {
//         window.location.reload(); 
//     }
//   };

//   // 👇 HÀM XỬ LÝ KHI BẤM NÚT ĐĂNG XUẤT
//   const handleLogoutClick = () => {
//     setIsLogoutModalOpen(true); // Mở hộp thoại xác nhận thay vì thoát luôn
//   };

//   // 👇 HÀM XÁC NHẬN ĐĂNG XUẤT THẬT
//   const confirmLogout = () => {
//     setIsLogoutModalOpen(false);
//     onLogout(); // Gọi hàm đăng xuất từ cha
//   };

//   return (
//     <div className="dashboard-container">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="dashboard-header">
//         <h1>Chào mừng, {user.fullName}!</h1>
//         {/* 👇 Sửa onClick ở đây */}
//         <button onClick={handleLogoutClick} className="btn-logout">Đăng Xuất</button>
//       </div>

//       <div className="dashboard-content">
        
//         {/* --- CỘT 1: THÔNG TIN --- */}
//         <div className="dashboard-card col-info">
//           <div style={{borderBottom: '2px solid #667eea', marginBottom: '20px', paddingBottom: '10px'}}>
//             <h2 style={{margin: 0, padding: 0, border: 'none'}}>Thông Tin Tài Khoản</h2>
//           </div>
          
//           <div className="user-info">
//             <div className="info-row">
//               <span className="info-label">User ID:</span>
//               <span className="info-value">{user.userID}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Email:</span>
//               <span className="info-value">{user.email}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Họ tên:</span>
//               <span className="info-value">{user.fullName}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Vai trò:</span>
//               <span className="info-value role-badge">{getRoleText(user.role?.name)}</span>
//             </div>

//             {user.career && (
//               <div className="info-row">
//                 <span className="info-label">Chuyên ngành:</span>
//                 <span className="info-value" style={{fontWeight: 'bold', color: '#0369a1'}}>{user.career}</span>
//               </div>
//             )}

//             {user.profession && (
//               <div className="info-row">
//                 <span className="info-label">Chuyên môn:</span>
//                 <span className="info-value" style={{fontWeight: 'bold', color: '#a21caf'}}>{user.profession}</span>
//               </div>
//             )}

//             <div className="info-row info-row-permissions">
//               <span className="info-label">Quyền hạn:</span>
//               <div className="info-value">
//                 {user.role?.permissions && user.role.permissions.length > 0 ? (
//                   <ul className="permissions-list">
//                     {user.role.permissions.map(p => (
//                       <li key={p.name} title={p.description}>{p.name}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <span>Không có quyền nào</span>
//                 )}
//               </div>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Giới tính:</span>
//               <span className="info-value">{getGenderText(user.gender)}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Số điện thoại:</span>
//               <span className="info-value">{user.phone || 'Chưa cập nhật'}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Ngày sinh:</span>
//               <span className="info-value">{formatDate(user.birthDate)}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Ngày tạo:</span>
//               <span className="info-value">{formatDate(user.createdAt)}</span>
//             </div>
//           </div>
//           <p className="success-message">✓ Bạn đã đăng nhập thành công!</p>
//         </div>

//         {/* --- CỘT 2: CHỨC NĂNG --- */}
//         <div className="dashboard-card col-actions">
//           <h2>Chức Năng</h2>
//           <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
//             <li 
//                 onClick={() => setIsModalOpen(true)} 
//                 style={{
//                     cursor: 'pointer', 
//                     color: '#667eea', 
//                     fontWeight: 'bold', 
//                     marginBottom: '10px', 
//                     padding: '12px', 
//                     backgroundColor: '#f4f6f8', 
//                     borderRadius: '8px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '10px',
//                     transition: '0.2s'
//                 }}
//                 className="menu-item-hover"
//             >
//                 ✏️ Cập nhật thông tin cá nhân
//             </li>

//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>📅 Xem lịch sử hoạt động</li>
//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🔒 Cài đặt bảo mật</li>
            
//             {user.role?.name === 'student' && (
//               <>
//                 <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>📚 Xem danh sách môn học</li>
//                 <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>📝 Nộp bài tập</li>
//               </>
//             )}
//             {user.role?.name === 'lecturer' && (
//               <>
//                 <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🎓 Quản lý lớp học</li>
//                 <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>✍️ Chấm điểm bài tập</li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>

//       {/* MODAL SỬA THÔNG TIN */}
//       {isModalOpen && (
//         <StudentProfileModal 
//             user={user} 
//             onClose={() => setIsModalOpen(false)} 
//             onUserUpdated={handleUserUpdated}
//         />
//       )}

//       {/* 👇👇👇 MODAL XÁC NHẬN ĐĂNG XUẤT 👇👇👇 */}
//       {isLogoutModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
//             <h2 style={{color: '#e74c3c', marginTop: 0}}>Đăng Xuất</h2>
//             <p style={{fontSize: '16px', color: '#555', margin: '20px 0'}}>
//                 Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
//             </p>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
//                 <button 
//                     onClick={() => setIsLogoutModalOpen(false)} 
//                     className="btn-cancel"
//                     style={{padding: '10px 25px'}}
//                 >
//                     Hủy
//                 </button>
//                 <button 
//                     onClick={confirmLogout} 
//                     className="btn-logout"
//                     style={{padding: '10px 25px', width: 'auto'}} // Ghi đè width 100% của responsive cũ
//                 >
//                     Đồng ý
//                 </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* 👆👆👆 KẾT THÚC MODAL ĐĂNG XUẤT 👆👆👆 */}

//     </div>
//   )
// }

// export default StudentDashboard;

// import React, { useState } from 'react';
// import '../styles/Dashboard.css';
// // Imports cho các Modals
// import StudentProfileModal from './StudentProfileModal'; 
// import EnrollCourseModal from './EnrollCourseModal'; // 👈 Modal Đăng ký
// import Toast from './Toast';

// function StudentDashboard({ user, onLogout, onRefresh }) {
  
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal sửa thông tin
//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
//   const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false); // 👈 State cho Modal Đăng ký
//   const [toast, setToast] = useState(null);

//   const getRoleText = (roleName) => {
//     if (!roleName) return 'Chưa có vai trò';
//     return roleName.charAt(0).toUpperCase() + roleName.slice(1);
//   }

//   const getGenderText = (gender) => {
//     if (!gender) return 'Chưa cập nhật';
//     switch(gender.toLowerCase()) {
//       case 'male': case 'nam': return 'Nam'
//       case 'female': case 'nữ': return 'Nữ'
//       case 'other': case 'khác': return 'Khác'
//       default: return 'Chưa cập nhật'
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Chưa cập nhật'
//     return new Date(dateString).toLocaleDateString('vi-VN')
//   }

//   // Xử lý sau khi cập nhật Profile thành công
//   const handleUserUpdated = () => {
//     setIsModalOpen(false); 
//     setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
//     setTimeout(() => setToast(null), 3000);

//     if (onRefresh) {
//         onRefresh(); 
//     } else {
//         window.location.reload(); 
//     }
//   };

//   // Xử lý sau khi đăng ký khóa học thành công (sẽ đóng modal và refresh data)
//   const handleEnrollSuccess = () => {
//     setIsEnrollModalOpen(false); // Đóng modal đăng ký
//     // Toast và Refresh data đã được xử lý bên trong EnrollCourseModal.js
//     // Ở đây chỉ cần đảm bảo refresh lại dashboard
//     if (onRefresh) {
//         onRefresh(); 
//     } else {
//         window.location.reload(); 
//     }
//   }

//   // Logic Đăng xuất
//   const handleLogoutClick = () => {
//     setIsLogoutModalOpen(true); 
//   };

//   const confirmLogout = () => {
//     setIsLogoutModalOpen(false);
//     onLogout(); 
//   };

//   return (
//     <div className="dashboard-container">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="dashboard-header">
//         <h1>Chào mừng, {user.fullName}!</h1>
//         <button onClick={handleLogoutClick} className="btn-logout">Đăng Xuất</button>
//       </div>

//       <div className="dashboard-content">
        
//         {/* --- CỘT 1: THÔNG TIN --- */}
//         <div className="dashboard-card col-info">
//           <div style={{borderBottom: '2px solid #667eea', marginBottom: '20px', paddingBottom: '10px'}}>
//             <h2 style={{margin: 0, padding: 0, border: 'none'}}>Thông Tin Tài Khoản</h2>
//           </div>
          
//           <div className="user-info">
//             <div className="info-row">
//               <span className="info-label">User ID:</span>
//               <span className="info-value">{user.userID}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Email:</span>
//               <span className="info-value">{user.email}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Họ tên:</span>
//               <span className="info-value">{user.fullName}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Vai trò:</span>
//               <span className="info-value role-badge">{getRoleText(user.role?.name)}</span>
//             </div>

//             {user.career && (
//               <div className="info-row">
//                 <span className="info-label">Chuyên ngành:</span>
//                 <span className="info-value" style={{fontWeight: 'bold', color: '#0369a1'}}>{user.career}</span>
//               </div>
//             )}

//             {user.profession && (
//               <div className="info-row">
//                 <span className="info-label">Chuyên môn:</span>
//                 <span className="info-value" style={{fontWeight: 'bold', color: '#a21caf'}}>{user.profession}</span>
//               </div>
//             )}

//             <div className="info-row info-row-permissions">
//               <span className="info-label">Quyền hạn:</span>
//               <div className="info-value">
//                 {user.role?.permissions && user.role.permissions.length > 0 ? (
//                   <ul className="permissions-list">
//                     {user.role.permissions.map(p => (
//                       <li key={p.name} title={p.description}>{p.name}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <span>Không có quyền nào</span>
//                 )}
//               </div>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Giới tính:</span>
//               <span className="info-value">{getGenderText(user.gender)}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Số điện thoại:</span>
//               <span className="info-value">{user.phone || 'Chưa cập nhật'}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Ngày sinh:</span>
//               <span className="info-value">{formatDate(user.birthDate)}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Ngày tạo:</span>
//               <span className="info-value">{formatDate(user.createdAt)}</span>
//             </div>
//           </div>
//           <p className="success-message">✓ Bạn đã đăng nhập thành công!</p>
//         </div>

//         {/* --- CỘT 2: CHỨC NĂNG --- */}
//         <div className="dashboard-card col-actions">
//           <h2>Chức Năng</h2>
//           <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
//             {/* Cập nhật thông tin cá nhân */}
//             <li 
//                 onClick={() => setIsModalOpen(true)} 
//                 style={{
//                     cursor: 'pointer', 
//                     color: '#667eea', 
//                     fontWeight: 'bold', 
//                     marginBottom: '10px', 
//                     padding: '12px', 
//                     backgroundColor: '#f4f6f8', 
//                     borderRadius: '8px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '10px',
//                     transition: '0.2s'
//                 }}
//                 className="menu-item-hover"
//             >
//                 ✏️ Cập nhật thông tin cá nhân
//             </li>

//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>📅 Xem lịch sử hoạt động</li>
//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🔒 Cài đặt bảo mật</li>
            
//             {user.role?.name === 'student' && (
//               <>
//                 {/* 👇 ĐĂNG KÝ MÔN HỌC */}
//                 <li 
//                     onClick={() => setIsEnrollModalOpen(true)} 
//                     style={{
//                         cursor: 'pointer', 
//                         color: '#28a745', 
//                         fontWeight: 'bold', 
//                         marginBottom: '10px', 
//                         padding: '12px', 
//                         backgroundColor: '#e6f7ff', 
//                         borderRadius: '8px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px',
//                         border: '1px solid #91d5ff'
//                     }}
//                 >
//                     📖 Đăng ký môn học
//                 </li>
//                 {/* Xem danh sách môn học và Nộp bài tập */}
//                 <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>📚 Xem danh sách môn học</li>
//                 <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>📝 Nộp bài tập</li>
//               </>
//             )}
//             {user.role?.name === 'lecturer' && (
//               <>
//                 <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🎓 Quản lý lớp học</li>
//                 <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>✍️ Chấm điểm bài tập</li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>

//       {/* MODAL SỬA THÔNG TIN */}
//       {isModalOpen && (
//         <StudentProfileModal 
//             user={user} 
//             onClose={() => setIsModalOpen(false)} 
//             onUserUpdated={handleUserUpdated}
//         />
//       )}

//       {/* 👇 MODAL ĐĂNG KÝ MÔN HỌC */}
//       {isEnrollModalOpen && (
//         <EnrollCourseModal 
//             studentId={user.userID} 
//             userEnrolledCourses={user.courses}
//             onClose={() => setIsEnrollModalOpen(false)} 
//             onSuccess={handleEnrollSuccess} // 👇 Hàm này sẽ tự gọi onRefresh
//         />
//       )}

//       {/* MODAL XÁC NHẬN ĐĂNG XUẤT */}
//       {isLogoutModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
//             <h2 style={{color: '#e74c3c', marginTop: 0}}>Đăng Xuất</h2>
//             <p style={{fontSize: '16px', color: '#555', margin: '20px 0'}}>
//                 Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
//             </p>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
//                 <button 
//                     onClick={() => setIsLogoutModalOpen(false)} 
//                     className="btn-cancel"
//                     style={{padding: '10px 25px'}}
//                 >
//                     Hủy
//                 </button>
//                 <button 
//                     onClick={confirmLogout} 
//                     className="btn-logout"
//                     style={{padding: '10px 25px', width: 'auto'}}
//                 >
//                     Đồng ý
//                 </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default StudentDashboard;

// import React, { useState, useEffect } from 'react'; 
// import '../styles/Dashboard.css';
// // Imports cho các Modals
// import StudentProfileModal from './StudentProfileModal'; 
// import EnrollCourseModal from './EnrollCourseModal'; 
// import MyCoursesModal from './MyCoursesModal'; 
// import Toast from './Toast';

// function StudentDashboard({ user, onLogout, onRefresh }) {
  
//   const [isModalOpen, setIsModalOpen] = useState(false); 
//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
//   const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false); 
//   const [isMyCoursesModalOpen, setIsMyCoursesModalOpen] = useState(false); 
//   const [toast, setToast] = useState(null);

//   const getRoleText = (roleName) => {
//     if (!roleName) return 'Chưa có vai trò';
//     return roleName.charAt(0).toUpperCase() + roleName.slice(1);
//   }

//   const getGenderText = (gender) => {
//     if (!gender) return 'Chưa cập nhật';
//     switch(gender.toLowerCase()) {
//       case 'male': case 'nam': return 'Nam'
//       case 'female': case 'nữ': return 'Nữ'
//       case 'other': case 'khác': return 'Khác'
//       default: return 'Chưa cập nhật'
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Chưa cập nhật'
//     return new Date(dateString).toLocaleDateString('vi-VN')
//   }

//   // Xử lý sau khi cập nhật Profile thành công
//   const handleUserUpdated = () => {
//     setIsModalOpen(false); 
//     setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
//     setTimeout(() => setToast(null), 3000);

//     if (onRefresh) {
//         onRefresh(); 
//     } 
//   };

//   // Xử lý sau khi đăng ký khóa học thành công 
//   const handleEnrollSuccess = () => {
//     setIsEnrollModalOpen(false); 
//     if (onRefresh) {
//         onRefresh(); 
//     }
//   }

//   // Logic Đăng xuất
//   const handleLogoutClick = () => {
//     setIsLogoutModalOpen(true); 
//   };

//   const confirmLogout = () => {
//     setIsLogoutModalOpen(false);
//     onLogout(); 
//   };

//   return (
//     <div className="dashboard-container">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="dashboard-header">
//         <h1>Chào mừng, {user.fullName}!</h1>
//         <button onClick={handleLogoutClick} className="btn-logout">Đăng Xuất</button>
//       </div>

//       <div className="dashboard-content">
        
//         {/* --- CỘT 1: THÔNG TIN --- */}
//         <div className="dashboard-card col-info">
//           <div style={{borderBottom: '2px solid #667eea', marginBottom: '20px', paddingBottom: '10px'}}>
//             <h2 style={{margin: 0, padding: 0, border: 'none'}}>Thông Tin Tài Khoản</h2>
//           </div>
          
//           <div className="user-info">
//             <div className="info-row">
//               <span className="info-label">User ID:</span>
//               <span className="info-value">{user.userID}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Email:</span>
//               <span className="info-value">{user.email}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Họ tên:</span>
//               <span className="info-value">{user.fullName}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Vai trò:</span>
//               {/* 👇 ĐÃ SỬA: role.name -> role.roleName */}
//               <span className="info-value role-badge">{getRoleText(user.role?.roleName)}</span>
//             </div>

//             {user.career && (
//               <div className="info-row">
//                 <span className="info-label">Chuyên ngành:</span>
//                 <span className="info-value" style={{fontWeight: 'bold', color: '#0369a1'}}>{user.career}</span>
//               </div>
//             )}

//             {user.profession && (
//               <div className="info-row">
//                 <span className="info-label">Chuyên môn:</span>
//                 <span className="info-value" style={{fontWeight: 'bold', color: '#a21caf'}}>{user.profession}</span>
//               </div>
//             )}

//             <div className="info-row info-row-permissions">
//               <span className="info-label">Quyền hạn:</span>
//               <div className="info-value">
//                 {user.role?.permissions && user.role.permissions.length > 0 ? (
//                   <ul className="permissions-list">
//                     {user.role.permissions.map((p, index) => (
//                       /* 👇 SỬA Ở ĐÂY: Dùng permissionName thay vì name */
//                       <li key={p.permissionName || index} title={p.description}>
//                         {p.permissionName}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <span>Không có quyền nào</span>
//                 )}
//               </div>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Giới tính:</span>
//               <span className="info-value">{getGenderText(user.gender)}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Số điện thoại:</span>
//               <span className="info-value">{user.phone || 'Chưa cập nhật'}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Ngày sinh:</span>
//               <span className="info-value">{formatDate(user.birthDate)}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Ngày tạo:</span>
//               <span className="info-value">{formatDate(user.createdAt)}</span>
//             </div>
//           </div>
//           <p className="success-message">✓ Bạn đã đăng nhập thành công!</p>
//         </div>

//         {/* --- CỘT 2: CHỨC NĂNG --- */}
//         <div className="dashboard-card col-actions">
//           <h2>Chức Năng</h2>
//           <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
//             {/* Cập nhật thông tin cá nhân */}
//             <li 
//                 onClick={() => setIsModalOpen(true)} 
//                 style={{
//                     cursor: 'pointer', 
//                     color: '#667eea', 
//                     fontWeight: 'bold', 
//                     marginBottom: '10px', 
//                     padding: '12px', 
//                     backgroundColor: '#f4f6f8', 
//                     borderRadius: '8px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '10px',
//                     transition: '0.2s'
//                 }}
//                 className="menu-item-hover"
//             >
//                 ✏️ Cập nhật thông tin cá nhân
//             </li>

//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>📅 Xem lịch sử hoạt động</li>
//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🔒 Cài đặt bảo mật</li>
            
//             {/* 👇 ĐÃ SỬA: role.name -> role.roleName */}
//             {user.role?.roleName === 'Student' && (
//               <>
//                 <li 
//                     onClick={() => setIsEnrollModalOpen(true)} 
//                     style={{
//                         cursor: 'pointer', 
//                         color: '#28a745', 
//                         fontWeight: 'bold', 
//                         marginBottom: '10px', 
//                         padding: '12px', 
//                         backgroundColor: '#e6f7ff', 
//                         borderRadius: '8px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px',
//                         border: '1px solid #91d5ff'
//                     }}
//                 >
//                     📖 Đăng ký môn học
//                 </li>
                
//                 <li 
//                     onClick={() => setIsMyCoursesModalOpen(true)} 
//                     style={{
//                         cursor: 'pointer', 
//                         color: '#007bff', 
//                         fontWeight: 'bold', 
//                         marginBottom: '10px', 
//                         padding: '12px', 
//                         backgroundColor: '#e9ecef', 
//                         borderRadius: '8px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px',
//                         transition: '0.2s',
//                         border: '1px solid #ced4da'
//                     }}
//                     className="menu-item-hover"
//                 >
//                     📚 Khóa học của tôi
//                 </li>

//                 <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>📝 Nộp bài tập</li>
//               </>
//             )}

//             {/* 👇 ĐÃ SỬA: role.name -> role.roleName */}
//             {user.role?.roleName === 'Lecturer' && (
//               <>
//                 <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🎓 Quản lý lớp học</li>
//                 <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>✍️ Chấm điểm bài tập</li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>

//       {/* MODAL SỬA THÔNG TIN */}
//       {isModalOpen && (
//         <StudentProfileModal 
//             user={user} 
//             onClose={() => setIsModalOpen(false)} 
//             onUserUpdated={handleUserUpdated}
//         />
//       )}

//       {/* MODAL ĐĂNG KÝ MÔN HỌC */}
//       {isEnrollModalOpen && (
//         <EnrollCourseModal 
//             studentId={user.userID} 
//             userEnrolledCourses={user.courses}
//             onClose={() => setIsEnrollModalOpen(false)} 
//             onSuccess={handleEnrollSuccess} 
//         />
//       )}

//       {/* MODAL KHÓA HỌC CỦA TÔI */}
//       {isMyCoursesModalOpen && (
//         <MyCoursesModal 
//             studentId={user.userID} 
//             userEnrolledCourses={user.courses}
//             onClose={() => setIsMyCoursesModalOpen(false)} 
//         />
//       )}

//       {/* MODAL XÁC NHẬN ĐĂNG XUẤT */}
//       {isLogoutModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
//             <h2 style={{color: '#e74c3c', marginTop: 0}}>Đăng Xuất</h2>
//             <p style={{fontSize: '16px', color: '#555', margin: '20px 0'}}>
//                 Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
//             </p>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
//                 <button 
//                     onClick={() => setIsLogoutModalOpen(false)} 
//                     className="btn-cancel"
//                     style={{padding: '10px 25px'}}
//                 >
//                     Hủy
//                 </button>
//                 <button 
//                     onClick={confirmLogout} 
//                     className="btn-logout"
//                     style={{padding: '10px 25px', width: 'auto'}}
//                 >
//                     Đồng ý
//                 </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default StudentDashboard;

// import React, { useState, useEffect } from 'react'; 
// import '../styles/Dashboard.css';
// // Imports cho các Modals
// import StudentProfileModal from './StudentProfileModal'; 
// import EnrollCourseModal from './EnrollCourseModal'; 
// import MyCoursesModal from './MyCoursesModal'; 
// import Toast from './Toast';

// function StudentDashboard({ user, onLogout, onRefresh }) {
  
//   const [isModalOpen, setIsModalOpen] = useState(false); 
//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
//   const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false); 
//   const [isMyCoursesModalOpen, setIsMyCoursesModalOpen] = useState(false); 
//   const [toast, setToast] = useState(null);

//   const getRoleText = (roleName) => {
//     if (!roleName) return 'Chưa có vai trò';
//     return roleName.charAt(0).toUpperCase() + roleName.slice(1);
//   }

//   // 👇 MỚI THÊM: Hàm lấy class màu sắc cho Badge dựa trên vai trò
//   const getRoleBadgeClass = (roleName) => {
//     if (!roleName) return 'badge-default';
//     const role = roleName.toLowerCase();
    
//     // Các class này đã có sẵn trong file Dashboard.css của bạn
//     if (role === 'student') return 'badge-student';   // Màu xanh lá
//     if (role === 'lecturer') return 'badge-lecturer'; // Màu tím
    
//     return 'badge-default'; // Màu xám mặc định
//   }

//   const getGenderText = (gender) => {
//     if (!gender) return 'Chưa cập nhật';
//     switch(gender.toLowerCase()) {
//       case 'male': case 'nam': return 'Nam'
//       case 'female': case 'nữ': return 'Nữ'
//       case 'other': case 'khác': return 'Khác'
//       default: return 'Chưa cập nhật'
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Chưa cập nhật'
//     return new Date(dateString).toLocaleDateString('vi-VN')
//   }

//   // Xử lý sau khi cập nhật Profile thành công
//   const handleUserUpdated = () => {
//     setIsModalOpen(false); 
//     setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
//     setTimeout(() => setToast(null), 3000);

//     if (onRefresh) {
//         onRefresh(); 
//     } 
//   };

//   // Xử lý sau khi đăng ký khóa học thành công 
//   const handleEnrollSuccess = () => {
//     setIsEnrollModalOpen(false); 
//     if (onRefresh) {
//         onRefresh(); 
//     }
//   }

//   // Logic Đăng xuất
//   const handleLogoutClick = () => {
//     setIsLogoutModalOpen(true); 
//   };

//   const confirmLogout = () => {
//     setIsLogoutModalOpen(false);
//     onLogout(); 
//   };

//   return (
//     <div className="dashboard-container">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="dashboard-header">
//         <h1>Chào mừng, {user.fullName}!</h1>
//         <button onClick={handleLogoutClick} className="btn-logout">Đăng Xuất</button>
//       </div>

//       <div className="dashboard-content">
        
//         {/* --- CỘT 1: THÔNG TIN --- */}
//         <div className="dashboard-card col-info">
//           <div style={{borderBottom: '2px solid #667eea', marginBottom: '20px', paddingBottom: '10px'}}>
//             <h2 style={{margin: 0, padding: 0, border: 'none'}}>Thông Tin Tài Khoản</h2>
//           </div>
          
//           <div className="user-info">
//             <div className="info-row">
//               <span className="info-label">User ID:</span>
//               <span className="info-value">{user.userID}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Email:</span>
//               <span className="info-value">{user.email}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Họ tên:</span>
//               <span className="info-value">{user.fullName}</span>
//             </div>
            
//             {/* 👇 ĐÃ SỬA: Thêm logic getRoleBadgeClass để hiện màu nền */}
//             <div className="info-row">
//               <span className="info-label">Vai trò:</span>
//               <span className={`info-value role-badge ${getRoleBadgeClass(user.role?.roleName)}`}>
//                 {getRoleText(user.role?.roleName)}
//               </span>
//             </div>

//             {user.career && (
//               <div className="info-row">
//                 <span className="info-label">Chuyên ngành:</span>
//                 <span className="info-value" style={{fontWeight: 'bold', color: '#0369a1'}}>{user.career}</span>
//               </div>
//             )}

//             {user.profession && (
//               <div className="info-row">
//                 <span className="info-label">Chuyên môn:</span>
//                 <span className="info-value" style={{fontWeight: 'bold', color: '#a21caf'}}>{user.profession}</span>
//               </div>
//             )}

//             <div className="info-row info-row-permissions">
//               <span className="info-label">Quyền hạn:</span>
//               <div className="info-value">
//                 {user.role?.permissions && user.role.permissions.length > 0 ? (
//                   <ul className="permissions-list">
//                     {user.role.permissions.map((p, index) => (
//                       <li key={p.permissionName || index} title={p.description}>
//                         {p.permissionName}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <span>Không có quyền nào</span>
//                 )}
//               </div>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Giới tính:</span>
//               <span className="info-value">{getGenderText(user.gender)}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Số điện thoại:</span>
//               <span className="info-value">{user.phone || 'Chưa cập nhật'}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Ngày sinh:</span>
//               <span className="info-value">{formatDate(user.birthDate)}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Ngày tạo:</span>
//               <span className="info-value">{formatDate(user.createdAt)}</span>
//             </div>
//           </div>
//           <p className="success-message">✓ Bạn đã đăng nhập thành công!</p>
//         </div>

//         {/* --- CỘT 2: CHỨC NĂNG --- */}
//         <div className="dashboard-card col-actions">
//           <h2>Chức Năng</h2>
//           <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
//             {/* Cập nhật thông tin cá nhân */}
//             <li 
//                 onClick={() => setIsModalOpen(true)} 
//                 style={{
//                     cursor: 'pointer', 
//                     color: '#667eea', 
//                     fontWeight: 'bold', 
//                     marginBottom: '10px', 
//                     padding: '12px', 
//                     backgroundColor: '#f4f6f8', 
//                     borderRadius: '8px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '10px',
//                     transition: '0.2s'
//                 }}
//                 className="menu-item-hover"
//             >
//                 ✏️ Cập nhật thông tin cá nhân
//             </li>

//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>📅 Xem lịch sử hoạt động</li>
//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🔒 Cài đặt bảo mật</li>
            
//             {user.role?.roleName === 'Student' && (
//               <>
//                 <li 
//                     onClick={() => setIsEnrollModalOpen(true)} 
//                     style={{
//                         cursor: 'pointer', 
//                         color: '#28a745', 
//                         fontWeight: 'bold', 
//                         marginBottom: '10px', 
//                         padding: '12px', 
//                         backgroundColor: '#e6f7ff', 
//                         borderRadius: '8px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px',
//                         border: '1px solid #91d5ff'
//                     }}
//                 >
//                     📖 Đăng ký môn học
//                 </li>
                
//                 <li 
//                     onClick={() => setIsMyCoursesModalOpen(true)} 
//                     style={{
//                         cursor: 'pointer', 
//                         color: '#007bff', 
//                         fontWeight: 'bold', 
//                         marginBottom: '10px', 
//                         padding: '12px', 
//                         backgroundColor: '#e9ecef', 
//                         borderRadius: '8px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px',
//                         transition: '0.2s',
//                         border: '1px solid #ced4da'
//                     }}
//                     className="menu-item-hover"
//                 >
//                     📚 Khóa học của tôi
//                 </li>

//                 <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>📝 Nộp bài tập</li>
//               </>
//             )}

//             {user.role?.roleName === 'Lecturer' && (
//               <>
//                 <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🎓 Quản lý lớp học</li>
//                 <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>✍️ Chấm điểm bài tập</li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>

//       {/* MODAL SỬA THÔNG TIN */}
//       {isModalOpen && (
//         <StudentProfileModal 
//             user={user} 
//             onClose={() => setIsModalOpen(false)} 
//             onUserUpdated={handleUserUpdated}
//         />
//       )}

//       {/* MODAL ĐĂNG KÝ MÔN HỌC */}
//       {isEnrollModalOpen && (
//         <EnrollCourseModal 
//             studentId={user.userID} 
//             userEnrolledCourses={user.courses}
//             onClose={() => setIsEnrollModalOpen(false)} 
//             onSuccess={handleEnrollSuccess} 
//         />
//       )}

//       {/* MODAL KHÓA HỌC CỦA TÔI */}
//       {isMyCoursesModalOpen && (
//         <MyCoursesModal 
//             studentId={user.userID} 
//             userEnrolledCourses={user.courses}
//             onClose={() => setIsMyCoursesModalOpen(false)} 
//         />
//       )}

//       {/* MODAL XÁC NHẬN ĐĂNG XUẤT */}
//       {isLogoutModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
//             <h2 style={{color: '#e74c3c', marginTop: 0}}>Đăng Xuất</h2>
//             <p style={{fontSize: '16px', color: '#555', margin: '20px 0'}}>
//                 Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
//             </p>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
//                 <button 
//                     onClick={() => setIsLogoutModalOpen(false)} 
//                     className="btn-cancel"
//                     style={{padding: '10px 25px'}}
//                 >
//                     Hủy
//                 </button>
//                 <button 
//                     onClick={confirmLogout} 
//                     className="btn-logout"
//                     style={{padding: '10px 25px', width: 'auto'}}
//                 >
//                     Đồng ý
//                 </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default StudentDashboard;

import React, { useState, useEffect } from 'react'; 
import '../styles/Dashboard.css';
// 👇 1. IMPORT SOCKET CLIENT
import { io } from "socket.io-client"; 

// Imports cho các Modals
import StudentProfileModal from './StudentProfileModal'; 
import EnrollCourseModal from './EnrollCourseModal'; 
import MyCoursesModal from './MyCoursesModal'; 
import Toast from './Toast';

function StudentDashboard({ user, onLogout, onRefresh }) {
  
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false); 
  const [isMyCoursesModalOpen, setIsMyCoursesModalOpen] = useState(false); 
  const [toast, setToast] = useState(null);

  // --- 👇 2. ĐOẠN CODE SOCKET.IO REAL-TIME MỚI THÊM 👇 ---
  useEffect(() => {
    // Kết nối đến Socket Server (Port 8085 như Java config)
    const socket = io("http://localhost:8085", {
        transports: ['websocket', 'polling'] 
    });

    // Lắng nghe sự kiện update từ Java
    socket.on("UPDATE_USER_SUCCESS", (updatedUserID) => {
      console.log("🔥 Socket nhận tín hiệu update ID:", updatedUserID);

      // Kiểm tra: Nếu ID trả về trùng với user đang đăng nhập
      if (String(updatedUserID) === String(user.userID)) {
         console.log("=> Đúng là tôi! Tự động làm mới dữ liệu...");
         if (onRefresh) {
             onRefresh(); // Gọi hàm load lại API getMyInfo
         }
      }
    });
socket.on("UPDATE_ROLE_SUCCESS", (updatedRoleName) => {
        console.log("⚡ Role vừa được update cấu hình:", updatedRoleName);

        // Kiểm tra an toàn: Đảm bảo user.role tồn tại trước khi so sánh
        const myRoleName = user.role?.name || user.role?.roleName; 

        // SO SÁNH: Role vừa bị sửa có phải là Role của tôi không?
        if (myRoleName === updatedRoleName) {
             console.log(`=> Tôi đang là ${myRoleName}, quyền của tôi đã thay đổi -> Refresh!`);
             if (onRefresh) onRefresh();
        }
    });
    // Dọn dẹp kết nối khi thoát trang
    return () => {
      socket.disconnect();
    };
  }, [user.userID, user.role, onRefresh]); 
  // --- 👆 KẾT THÚC PHẦN SOCKET 👆 ---

  const getRoleText = (roleName) => {
    if (!roleName) return 'Chưa có vai trò';
    return roleName.charAt(0).toUpperCase() + roleName.slice(1);
  }

  // Hàm lấy class màu sắc cho Badge
  const getRoleBadgeClass = (roleName) => {
    if (!roleName) return 'badge-default';
    const role = roleName.toLowerCase();
    
    if (role === 'student') return 'badge-student';   
    if (role === 'lecturer') return 'badge-lecturer'; 
    
    return 'badge-default'; 
  }

  const getGenderText = (gender) => {
    if (!gender) return 'Chưa cập nhật';
    switch(gender.toLowerCase()) {
      case 'male': case 'nam': return 'Nam'
      case 'female': case 'nữ': return 'Nữ'
      case 'other': case 'khác': return 'Khác'
      default: return 'Chưa cập nhật'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật'
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  // Xử lý sau khi cập nhật Profile thành công
  const handleUserUpdated = () => {
    setIsModalOpen(false); 
    setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
    setTimeout(() => setToast(null), 3000);

    // Tab hiện tại tự refresh
    if (onRefresh) onRefresh(); 
  };

  const handleEnrollSuccess = () => {
    setIsEnrollModalOpen(false); 
    if (onRefresh) onRefresh(); 
  }

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true); 
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    onLogout(); 
  };

  return (
    <div className="dashboard-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="dashboard-header">
        <h1>Chào mừng, {user.fullName}!</h1>
        <button onClick={handleLogoutClick} className="btn-logout">Đăng Xuất</button>
      </div>

      <div className="dashboard-content">
        
        {/* --- CỘT 1: THÔNG TIN --- */}
        <div className="dashboard-card col-info">
          <div style={{borderBottom: '2px solid #667eea', marginBottom: '20px', paddingBottom: '10px'}}>
            <h2 style={{margin: 0, padding: 0, border: 'none'}}>Thông Tin Tài Khoản</h2>
          </div>
          
          <div className="user-info">
            <div className="info-row">
              <span className="info-label">User ID:</span>
              <span className="info-value">{user.userID}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Họ tên:</span>
              <span className="info-value">{user.fullName}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Vai trò:</span>
              <span className={`info-value role-badge ${getRoleBadgeClass(user.role?.roleName)}`}>
                {getRoleText(user.role?.roleName)}
              </span>
            </div>

            {user.career && (
              <div className="info-row">
                <span className="info-label">Chuyên ngành:</span>
                <span className="info-value" style={{fontWeight: 'bold', color: '#0369a1'}}>{user.career}</span>
              </div>
            )}

            {user.profession && (
              <div className="info-row">
                <span className="info-label">Chuyên môn:</span>
                <span className="info-value" style={{fontWeight: 'bold', color: '#a21caf'}}>{user.profession}</span>
              </div>
            )}

            <div className="info-row info-row-permissions">
              <span className="info-label">Quyền hạn:</span>
              <div className="info-value">
                {user.role?.permissions && user.role.permissions.length > 0 ? (
                  <ul className="permissions-list">
                    {user.role.permissions.map((p, index) => (
                      <li key={p.permissionName || index} title={p.description}>
                        {p.permissionName}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>Không có quyền nào</span>
                )}
              </div>
            </div>
            <div className="info-row">
              <span className="info-label">Giới tính:</span>
              <span className="info-value">{getGenderText(user.gender)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Số điện thoại:</span>
              <span className="info-value">{user.phone || 'Chưa cập nhật'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ngày sinh:</span>
              <span className="info-value">{formatDate(user.birthDate)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ngày tạo:</span>
              <span className="info-value">{formatDate(user.createdAt)}</span>
            </div>
          </div>
          <p className="success-message">✓ Bạn đã đăng nhập thành công!</p>
        </div>

        {/* --- CỘT 2: CHỨC NĂNG --- */}
        <div className="dashboard-card col-actions">
          <h2>Chức Năng</h2>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {/* Cập nhật thông tin cá nhân */}
            <li 
                onClick={() => setIsModalOpen(true)} 
                style={{
                    cursor: 'pointer', 
                    color: '#667eea', 
                    fontWeight: 'bold', 
                    marginBottom: '10px', 
                    padding: '12px', 
                    backgroundColor: '#f4f6f8', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: '0.2s'
                }}
                className="menu-item-hover"
            >
                ✏️ Cập nhật thông tin cá nhân
            </li>

            <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>📅 Xem lịch sử hoạt động</li>
            <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🔒 Cài đặt bảo mật</li>
            
            {user.role?.roleName === 'Student' && (
              <>
                <li 
                    onClick={() => setIsEnrollModalOpen(true)} 
                    style={{
                        cursor: 'pointer', 
                        color: '#28a745', 
                        fontWeight: 'bold', 
                        marginBottom: '10px', 
                        padding: '12px', 
                        backgroundColor: '#e6f7ff', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        border: '1px solid #91d5ff'
                    }}
                >
                    📖 Đăng ký môn học
                </li>
                
                <li 
                    onClick={() => setIsMyCoursesModalOpen(true)} 
                    style={{
                        cursor: 'pointer', 
                        color: '#007bff', 
                        fontWeight: 'bold', 
                        marginBottom: '10px', 
                        padding: '12px', 
                        backgroundColor: '#e9ecef', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: '0.2s',
                        border: '1px solid #ced4da'
                    }}
                    className="menu-item-hover"
                >
                    📚 Khóa học của tôi
                </li>

                <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>📝 Nộp bài tập</li>
              </>
            )}

            {user.role?.roleName === 'Lecturer' && (
              <>
                <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🎓 Quản lý lớp học</li>
                <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>✍️ Chấm điểm bài tập</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <StudentProfileModal 
            user={user} 
            onClose={() => setIsModalOpen(false)} 
            onUserUpdated={handleUserUpdated}
        />
      )}

      {isEnrollModalOpen && (
        <EnrollCourseModal 
            studentId={user.userID} 
            userEnrolledCourses={user.courses}
            onClose={() => setIsEnrollModalOpen(false)} 
            onSuccess={handleEnrollSuccess} 
        />
      )}

      {isMyCoursesModalOpen && (
        <MyCoursesModal 
            studentId={user.userID} 
            userEnrolledCourses={user.courses}
            onClose={() => setIsMyCoursesModalOpen(false)} 
        />
      )}

      {isLogoutModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
            <h2 style={{color: '#e74c3c', marginTop: 0}}>Đăng Xuất</h2>
            <p style={{fontSize: '16px', color: '#555', margin: '20px 0'}}>
                Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <button 
                    onClick={() => setIsLogoutModalOpen(false)} 
                    className="btn-cancel"
                    style={{padding: '10px 25px'}}
                >
                    Hủy
                </button>
                <button 
                    onClick={confirmLogout} 
                    className="btn-logout"
                    style={{padding: '10px 25px', width: 'auto'}}
                >
                    Đồng ý
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard;