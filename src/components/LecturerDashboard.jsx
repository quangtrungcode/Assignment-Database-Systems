// import React, { useState } from 'react';
// import '../styles/Dashboard.css';
// import LecturerProfileModal from './LecturerProfileModal';
// import Toast from './Toast'; // Import Toast

// function LecturerDashboard({ user, onLogout, onRefresh }) {
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
//   const [toast, setToast] = useState(null); // State Toast ở Dashboard

//   const getRoleText = (roleName) => {
//     if (!roleName) return 'Chưa có vai trò';
//     let roleNameToRender = roleName;
//     if (roleName === 'lecturer') roleNameToRender = 'lecturer';
//     return roleNameToRender.charAt(0).toUpperCase() + roleNameToRender.slice(1);
//   }

//   const getGenderText = (gender) => {
//     if (!gender) return 'Chưa cập nhật';
//     switch(gender.toLowerCase()) {
//       case 'male': case 'nam': return 'Nam';
//       case 'female': case 'nữ': return 'Nữ';
//       case 'other': case 'khác': return 'Khác';
//       default: return 'Chưa cập nhật';
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Chưa cập nhật';
//     return new Date(dateString).toLocaleDateString('vi-VN');
//   }

//   // 👇 HÀM XỬ LÝ MỚI: MƯỢT HƠN
//   const handleUserUpdated = () => {
//     setIsModalOpen(false); 
    
//     // Hiện thông báo thành công ở đây
//     setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
//     setTimeout(() => setToast(null), 3000);

//     // Refresh dữ liệu
//     if (onRefresh) {
//         onRefresh(); 
//     } else {
//         window.location.reload(); 
//     }
//   };

//   const handleLogoutClick = () => {
//     setIsLogoutModalOpen(true);
//   };

//   const confirmLogout = () => {
//     setIsLogoutModalOpen(false);
//     onLogout();
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Toast hiển thị đè lên trên cùng */}
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="dashboard-header">
//         <h1>Bảng điều khiển Giảng viên</h1>
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
//           <p className="success-message">✓ Chào mừng thầy/cô, {user.fullName}!</p>
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

//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>📅 Xem lịch giảng dạy</li>
//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🔒 Cài đặt bảo mật</li>
            
//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🎓 Quản lý lớp học</li>
//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>✍️ Chấm điểm bài tập</li>
//           </ul>
//         </div>
//       </div>

//       {/* MODAL SỬA THÔNG TIN */}
//       {isModalOpen && (
//         <LecturerProfileModal 
//             user={user} 
//             onClose={() => setIsModalOpen(false)} 
//             onUserUpdated={handleUserUpdated}
//         />
//       )}

//       {/* MODAL XÁC NHẬN ĐĂNG XUẤT */}
//       {isLogoutModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
//             <h2 style={{color: '#e74c3c', marginTop: 0}}>Đăng Xuất</h2>
//             <p style={{fontSize: '16px', color: '#555', margin: '20px 0'}}>
//                 Thầy/Cô có chắc chắn muốn đăng xuất khỏi hệ thống không?
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
//   );
// };

// export default LecturerDashboard;


// import React, { useState } from 'react';
// import '../styles/Dashboard.css';
// import LecturerProfileModal from './LecturerProfileModal';
// import Toast from './Toast'; // Import Toast

// function LecturerDashboard({ user, onLogout, onRefresh }) {
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
//   const [toast, setToast] = useState(null); // State Toast ở Dashboard

  
//   // --- XỬ LÝ HIỂN THỊ TÊN VAI TRÒ (Dùng roleName) ---
//   const getRoleText = (roleName) => {
//     if (!roleName) return 'Chưa có vai trò';
//     // Chuyển về chữ thường để so sánh cho chính xác
//     const lowerName = roleName.toLowerCase();
    
//     if (lowerName === 'lecturer') return 'Giảng Viên';
//     if (lowerName === 'admin') return 'Quản Trị Viên';
//     if (lowerName === 'student') return 'Sinh Viên';
    
//     // Nếu không khớp case nào thì viết hoa chữ cái đầu
//     return roleName.charAt(0).toUpperCase() + roleName.slice(1);
//   }

//   const getRoleBadgeClass = (roleName) => {
//     if (!roleName) return 'badge-default';
//     const role = roleName.toLowerCase();
    
//     if (role === 'student') return 'badge-student';   
//     if (role === 'lecturer') return 'badge-lecturer'; 
    
//     return 'badge-default'; 
//   }
//   // --- XỬ LÝ HIỂN THỊ GIỚI TÍNH (Nam/Nữ) ---
//   const getGenderText = (gender) => {
//     if (!gender) return 'Chưa cập nhật';
//     switch(gender.toLowerCase()) {
//       case 'male': case 'nam': return 'Nam';
//       case 'female': case 'nữ': return 'Nữ';
//       case 'other': case 'khác': return 'Khác';
//       default: return gender;
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Chưa cập nhật';
//     return new Date(dateString).toLocaleDateString('vi-VN');
//   }

//   const handleUserUpdated = () => {
//     setIsModalOpen(false); 
    
//     // Hiện thông báo thành công ở đây
//     setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
//     setTimeout(() => setToast(null), 3000);

//     // Refresh dữ liệu
//     if (onRefresh) {
//         onRefresh(); 
//     } else {
//         window.location.reload(); 
//     }
//   };

//   const handleLogoutClick = () => {
//     setIsLogoutModalOpen(true);
//   };

//   const confirmLogout = () => {
//     setIsLogoutModalOpen(false);
//     onLogout();
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Toast hiển thị đè lên trên cùng */}
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="dashboard-header">
//         <h1>Bảng điều khiển Giảng viên</h1>
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
//               <span className={`info-value role-badge ${getRoleBadgeClass(user.role?.roleName)}`}>
//                 {getRoleText(user.role?.roleName)}
//               </span>
//             </div>

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
//                     {/* 👇 SỬA: Dùng permissionName thay vì name */}
//                     {user.role.permissions.map(p => (
//                       <li key={p.permissionName} title={p.description || p.permissionName}>
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
//           <p className="success-message">✓ Chào mừng thầy/cô, {user.fullName}!</p>
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

//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>📅 Xem lịch giảng dạy</li>
//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🔒 Cài đặt bảo mật</li>
            
//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🎓 Quản lý lớp học</li>
//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>✍️ Chấm điểm bài tập</li>
//           </ul>
//         </div>
//       </div>

//       {/* MODAL SỬA THÔNG TIN */}
//       {isModalOpen && (
//         <LecturerProfileModal 
//             user={user} 
//             onClose={() => setIsModalOpen(false)} 
//             onUserUpdated={handleUserUpdated}
//         />
//       )}

//       {/* MODAL XÁC NHẬN ĐĂNG XUẤT */}
//       {isLogoutModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
//             <h2 style={{color: '#e74c3c', marginTop: 0}}>Đăng Xuất</h2>
//             <p style={{fontSize: '16px', color: '#555', margin: '20px 0'}}>
//                 Thầy/Cô có chắc chắn muốn đăng xuất khỏi hệ thống không?
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
//   );
// };

// export default LecturerDashboard;

// import React, { useState, useEffect } from 'react';
// import '../styles/Dashboard.css';
// import LecturerProfileModal from './LecturerProfileModal';
// import Toast from './Toast'; // Import Toast
// import { io } from 'socket.io-client'; // 1. Import socket.io-client

// function LecturerDashboard({ user, onLogout, onRefresh }) {
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
//   const [toast, setToast] = useState(null); // State Toast ở Dashboard

//   // --- 👇 2. ĐOẠN CODE SOCKET.IO REAL-TIME MỚI THÊM 👇 ---
//     useEffect(() => {
//       // Kết nối đến Socket Server (Port 8085 như Java config)
//       const socket = io("http://localhost:8085", {
//           transports: ['websocket', 'polling'] 
//       });
  
//       // Lắng nghe sự kiện update từ Java
//       socket.on("UPDATE_USER_SUCCESS", (updatedUserID) => {
//         console.log("🔥 Socket nhận tín hiệu update ID:", updatedUserID);
  
//         // Kiểm tra: Nếu ID trả về trùng với user đang đăng nhập
//         if (String(updatedUserID) === String(user.userID)) {
//            console.log("=> Đúng là tôi! Tự động làm mới dữ liệu...");
//            if (onRefresh) {
//                onRefresh(); // Gọi hàm load lại API getMyInfo
//            }
//         }
//       });
//   socket.on("UPDATE_ROLE_SUCCESS", (updatedRoleName) => {
//         console.log("⚡ Role vừa được update cấu hình:", updatedRoleName);

//         // Kiểm tra an toàn: Đảm bảo user.role tồn tại trước khi so sánh
//         const myRoleName = user.role?.name || user.role?.roleName; 

//         // SO SÁNH: Role vừa bị sửa có phải là Role của tôi không?
//         if (myRoleName === updatedRoleName) {
//              console.log(`=> Tôi đang là ${myRoleName}, quyền của tôi đã thay đổi -> Refresh!`);
//              if (onRefresh) onRefresh();
//         }
//     });
//       // Dọn dẹp kết nối khi thoát trang
//       return () => {
//         socket.disconnect();
//       };
//     }, [user.userID,user.role, onRefresh]); 
//     // --- 👆 KẾT THÚC PHẦN SOCKET 👆 ---
//   // ------------------------------

//   // --- XỬ LÝ HIỂN THỊ TÊN VAI TRÒ (Dùng roleName) ---
//   const getRoleText = (roleName) => {
//     if (!roleName) return 'Chưa có vai trò';
//     const lowerName = roleName.toLowerCase();
    
//     if (lowerName === 'lecturer') return 'Giảng Viên';
//     if (lowerName === 'admin') return 'Quản Trị Viên';
//     if (lowerName === 'student') return 'Sinh Viên';
    
//     return roleName.charAt(0).toUpperCase() + roleName.slice(1);
//   }

//   const getRoleBadgeClass = (roleName) => {
//     if (!roleName) return 'badge-default';
//     const role = roleName.toLowerCase();
    
//     if (role === 'student') return 'badge-student';   
//     if (role === 'lecturer') return 'badge-lecturer'; 
    
//     return 'badge-default'; 
//   }

//   // --- XỬ LÝ HIỂN THỊ GIỚI TÍNH ---
//   const getGenderText = (gender) => {
//     if (!gender) return 'Chưa cập nhật';
//     switch(gender.toLowerCase()) {
//       case 'male': case 'nam': return 'Nam';
//       case 'female': case 'nữ': return 'Nữ';
//       case 'other': case 'khác': return 'Khác';
//       default: return gender;
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Chưa cập nhật';
//     return new Date(dateString).toLocaleDateString('vi-VN');
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

//   const handleLogoutClick = () => {
//     setIsLogoutModalOpen(true);
//   };

//   const confirmLogout = () => {
//     setIsLogoutModalOpen(false);
//     onLogout();
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Toast hiển thị đè lên trên cùng */}
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="dashboard-header">
//         <h1>Bảng điều khiển Giảng viên</h1>
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
//               <span className={`info-value role-badge ${getRoleBadgeClass(user.role?.roleName)}`}>
//                 {getRoleText(user.role?.roleName)}
//               </span>
//             </div>

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
//                       <li key={p.permissionName} title={p.description || p.permissionName}>
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
//           <p className="success-message">✓ Chào mừng thầy/cô, {user.fullName}!</p>
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

//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>📅 Xem lịch giảng dạy</li>
//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🔒 Cài đặt bảo mật</li>
            
//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>🎓 Quản lý lớp học</li>
//             <li style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>✍️ Chấm điểm bài tập</li>
//           </ul>
//         </div>
//       </div>

//       {/* MODAL SỬA THÔNG TIN */}
//       {isModalOpen && (
//         <LecturerProfileModal 
//             user={user} 
//             onClose={() => setIsModalOpen(false)} 
//             onUserUpdated={handleUserUpdated}
//         />
//       )}

//       {/* MODAL XÁC NHẬN ĐĂNG XUẤT */}
//       {isLogoutModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
//             <h2 style={{color: '#e74c3c', marginTop: 0}}>Đăng Xuất</h2>
//             <p style={{fontSize: '16px', color: '#555', margin: '20px 0'}}>
//                 Thầy/Cô có chắc chắn muốn đăng xuất khỏi hệ thống không?
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
//   );
// };

// export default LecturerDashboard;

// import React, { useState, useEffect } from 'react';
// import '../styles/Dashboard.css';
// import LecturerProfileModal from './LecturerProfileModal';
// import Toast from './Toast'; 
// import { io } from 'socket.io-client';

// // 👇 1. IMPORT MODAL ĐĂNG KÝ GIẢNG DẠY
// import RegisterTeachingModal from './RegisterTeachingModal';

// function LecturerDashboard({ user, onLogout, onRefresh }) {
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   // 👇 2. STATE MỚI CHO MODAL DẠY
//   const [isTeachingModalOpen, setIsTeachingModalOpen] = useState(false);
  
//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
//   const [toast, setToast] = useState(null); 

//   // --- SOCKET.IO REAL-TIME ---
//   useEffect(() => {
//       const socket = io("http://localhost:8085", {
//           transports: ['websocket', 'polling'] 
//       });
  
//       socket.on("UPDATE_USER_SUCCESS", (updatedUserID) => {
//         if (String(updatedUserID) === String(user.userID)) {
//            if (onRefresh) onRefresh(); 
//         }
//       });

//       socket.on("UPDATE_ROLE_SUCCESS", (updatedRoleName) => {
//         const myRoleName = user.role?.name || user.role?.roleName; 
//         if (myRoleName === updatedRoleName) {
//              if (onRefresh) onRefresh();
//         }
//       });
      
//       return () => {
//         socket.disconnect();
//       };
//     }, [user.userID, user.role, onRefresh]); 

//   // --- HELPER FUNCTIONS ---
//   const getRoleText = (roleName) => {
//     if (!roleName) return 'Chưa có vai trò';
//     const lowerName = roleName.toLowerCase();
    
//     if (lowerName === 'lecturer') return 'Giảng Viên';
//     if (lowerName === 'admin') return 'Quản Trị Viên';
//     if (lowerName === 'student') return 'Sinh Viên';
    
//     return roleName.charAt(0).toUpperCase() + roleName.slice(1);
//   }

//   const getRoleBadgeClass = (roleName) => {
//     if (!roleName) return 'badge-default';
//     const role = roleName.toLowerCase();
//     if (role === 'student') return 'badge-student';   
//     if (role === 'lecturer') return 'badge-lecturer'; 
//     return 'badge-default'; 
//   }

//   const getGenderText = (gender) => {
//     if (!gender) return 'Chưa cập nhật';
//     switch(gender.toLowerCase()) {
//       case 'male': case 'nam': return 'Nam';
//       case 'female': case 'nữ': return 'Nữ';
//       case 'other': case 'khác': return 'Khác';
//       default: return gender;
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Chưa cập nhật';
//     return new Date(dateString).toLocaleDateString('vi-VN');
//   }

//   const handleUserUpdated = () => {
//     setIsModalOpen(false); 
//     setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
//     setTimeout(() => setToast(null), 3000);
//     if (onRefresh) onRefresh(); else window.location.reload(); 
//   };

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
//         <h1>Bảng điều khiển Giảng viên</h1>
//         <button onClick={handleLogoutClick} className="btn-logout">Đăng Xuất</button>
//       </div>

//       <div className="dashboard-content">
        
//         {/* --- CỘT 1: THÔNG TIN TÀI KHOẢN (Giữ nguyên) --- */}
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
//               <span className={`info-value role-badge ${getRoleBadgeClass(user.role?.roleName)}`}>
//                 {getRoleText(user.role?.roleName)}
//               </span>
//             </div>

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
//                       <li key={p.permissionName} title={p.description || p.permissionName}>
//                         {p.permissionName}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <span>Không có quyền nào</span>
//                 )}
//               </div>
//             </div>
//             {/* Các thông tin cá nhân khác */}
//             <div className="info-row"><span className="info-label">Giới tính:</span><span className="info-value">{getGenderText(user.gender)}</span></div>
//             <div className="info-row"><span className="info-label">SĐT:</span><span className="info-value">{user.phone || 'Chưa cập nhật'}</span></div>
//             <div className="info-row"><span className="info-label">Ngày sinh:</span><span className="info-value">{formatDate(user.birthDate)}</span></div>
//           </div>
//           <p className="success-message">✓ Chào mừng thầy/cô, {user.fullName}!</p>
//         </div>

//         {/* --- CỘT 2: CHỨC NĂNG --- */}
//         <div className="dashboard-card col-actions">
//           <h2>Chức Năng</h2>
//           <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
//             {/* 1. Cập nhật thông tin */}
//             <li 
//                 onClick={() => setIsModalOpen(true)} 
//                 className="menu-item-hover"
//                 style={menuItemStyle}
//             >
//                 ✏️ Cập nhật thông tin cá nhân
//             </li>

//             {/* 👇 3. NÚT ĐĂNG KÝ GIẢNG DẠY (MỚI) */}
//             <li 
//                 onClick={() => setIsTeachingModalOpen(true)} 
//                 className="menu-item-hover"
//                 style={{...menuItemStyle, color: '#8e44ad', backgroundColor: '#fdf4ff'}} // Màu tím đặc trưng cho giảng viên
//             >
//                 🎓 Đăng ký giảng dạy / Nhận lớp
//             </li>

//             <li style={simpleItemStyle}>📅 Xem lịch giảng dạy</li>
//             <li style={simpleItemStyle}>🔒 Cài đặt bảo mật</li>
//             <li style={simpleItemStyle}>📂 Quản lý lớp học</li>
//             <li style={simpleItemStyle}>✍️ Chấm điểm bài tập</li>
//           </ul>
//         </div>
//       </div>

//       {/* --- CÁC MODAL --- */}

//       {/* 1. Modal Sửa thông tin */}
//       {isModalOpen && (
//         <LecturerProfileModal 
//             user={user} 
//             onClose={() => setIsModalOpen(false)} 
//             onUserUpdated={handleUserUpdated}
//         />
//       )}

//       {/* 👇 4. MODAL ĐĂNG KÝ GIẢNG DẠY */}
//       {isTeachingModalOpen && (
//         <RegisterTeachingModal
//             lecturerId={user.userID}
//             onClose={() => setIsTeachingModalOpen(false)}
//             onSuccess={() => {
//                 // Nếu muốn reload lại Dashboard sau khi đăng ký xong
//                 if (onRefresh) onRefresh();
//             }}
//         />
//       )}

//       {/* 5. Modal Đăng xuất */}
//       {isLogoutModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
//             <h2 style={{color: '#e74c3c', marginTop: 0}}>Đăng Xuất</h2>
//             <p style={{fontSize: '16px', color: '#555', margin: '20px 0'}}>
//                 Thầy/Cô có chắc chắn muốn đăng xuất khỏi hệ thống không?
//             </p>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
//                 <button onClick={() => setIsLogoutModalOpen(false)} className="btn-cancel" style={{padding: '10px 25px'}}>Hủy</button>
//                 <button onClick={confirmLogout} className="btn-logout" style={{padding: '10px 25px', width: 'auto'}}>Đồng ý</button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// // Style objects để code gọn hơn
// const menuItemStyle = {
//     cursor: 'pointer', 
//     color: '#667eea', 
//     fontWeight: 'bold', 
//     marginBottom: '10px', 
//     padding: '12px', 
//     backgroundColor: '#f4f6f8', 
//     borderRadius: '8px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//     transition: '0.2s'
// };

// const simpleItemStyle = {
//     marginBottom: '10px', 
//     padding: '10px', 
//     borderBottom: '1px solid #eee',
//     cursor: 'default' // Hoặc pointer nếu sau này làm chức năng
// };

// export default LecturerDashboard;


import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import LecturerProfileModal from './LecturerProfileModal';
import Toast from './Toast'; 
import { io } from 'socket.io-client';

// 👇 1. IMPORT CÁC MODAL
import RegisterTeachingModal from './RegisterTeachingModal';
import TeachingCoursesModal from './TeachingCoursesModal'; // <-- MỚI

function LecturerDashboard({ user, onLogout, onRefresh }) {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTeachingModalOpen, setIsTeachingModalOpen] = useState(false);
  
  // 👇 2. STATE MỚI CHO MODAL XEM LỚP DẠY
  const [isMyClassesModalOpen, setIsMyClassesModalOpen] = useState(false);
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [toast, setToast] = useState(null); 

  // --- SOCKET.IO REAL-TIME ---
  useEffect(() => {
      const socket = io("http://localhost:8085", {
          transports: ['websocket', 'polling'] 
      });
  
      socket.on("UPDATE_USER_SUCCESS", (updatedUserID) => {
        if (String(updatedUserID) === String(user.userID)) {
           if (onRefresh) onRefresh(); 
        }
      });

      socket.on("UPDATE_ROLE_SUCCESS", (updatedRoleName) => {
        const myRoleName = user.role?.name || user.role?.roleName; 
        if (myRoleName === updatedRoleName) {
             if (onRefresh) onRefresh();
        }
      });
      
      return () => {
        socket.disconnect();
      };
    }, [user.userID, user.role, onRefresh]); 

  // --- HELPER FUNCTIONS ---
  const getRoleText = (roleName) => {
    if (!roleName) return 'Chưa có vai trò';
    const lowerName = roleName.toLowerCase();
    
    if (lowerName === 'lecturer') return 'Giảng Viên';
    if (lowerName === 'admin') return 'Quản Trị Viên';
    if (lowerName === 'student') return 'Sinh Viên';
    
    return roleName.charAt(0).toUpperCase() + roleName.slice(1);
  }

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
      case 'male': case 'nam': return 'Nam';
      case 'female': case 'nữ': return 'Nữ';
      case 'other': case 'khác': return 'Khác';
      default: return gender;
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  }

  const handleUserUpdated = () => {
    setIsModalOpen(false); 
    setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
    if (onRefresh) onRefresh(); else window.location.reload(); 
  };

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
        <h1>Bảng điều khiển Giảng viên</h1>
        <button onClick={handleLogoutClick} className="btn-logout">Đăng Xuất</button>
      </div>

      <div className="dashboard-content">
        
        {/* --- CỘT 1: THÔNG TIN TÀI KHOẢN --- */}
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
                    {user.role.permissions.map(p => (
                      <li key={p.permissionName} title={p.description || p.permissionName}>
                        {p.permissionName}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>Không có quyền nào</span>
                )}
              </div>
            </div>
            <div className="info-row"><span className="info-label">Giới tính:</span><span className="info-value">{getGenderText(user.gender)}</span></div>
            <div className="info-row"><span className="info-label">SĐT:</span><span className="info-value">{user.phone || 'Chưa cập nhật'}</span></div>
            <div className="info-row"><span className="info-label">Ngày sinh:</span><span className="info-value">{formatDate(user.birthDate)}</span></div>
          </div>
          <p className="success-message">✓ Chào mừng thầy/cô, {user.fullName}!</p>
        </div>

        {/* --- CỘT 2: CHỨC NĂNG --- */}
        <div className="dashboard-card col-actions">
          <h2>Chức Năng</h2>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {/* 1. Cập nhật thông tin */}
            <li 
                onClick={() => setIsModalOpen(true)} 
                className="menu-item-hover"
                style={menuItemStyle}
            >
                ✏️ Cập nhật thông tin cá nhân
            </li>

            {/* 2. ĐĂNG KÝ GIẢNG DẠY */}
            <li 
                onClick={() => setIsTeachingModalOpen(true)} 
                className="menu-item-hover"
                style={{...menuItemStyle, color: '#8e44ad', backgroundColor: '#fdf4ff'}} 
            >
                🎓 Đăng ký giảng dạy / Nhận lớp
            </li>

            {/* 👇 3. NÚT MỚI: XEM LỚP ĐANG DẠY */}
            <li 
                onClick={() => setIsMyClassesModalOpen(true)}
                className="menu-item-hover"
                style={{
                    cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px', padding: '12px', 
                    backgroundColor: '#eef2ff', color: '#4338ca', // Màu xanh tím
                    borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px',
                    transition: '0.2s'
                }}
            >
                👨‍🏫 Khóa học giảng dạy 
            </li>

            <li style={simpleItemStyle}>📅 Xem lịch giảng dạy</li>
            <li style={simpleItemStyle}>🔒 Cài đặt bảo mật</li>
            <li style={simpleItemStyle}>✍️ Chấm điểm bài tập</li>
          </ul>
        </div>
      </div>

      {/* --- CÁC MODAL --- */}

      {/* 1. Modal Sửa thông tin cá nhân */}
      {isModalOpen && (
        <LecturerProfileModal 
            user={user} 
            onClose={() => setIsModalOpen(false)} 
            onUserUpdated={handleUserUpdated}
        />
      )}

      {/* 2. Modal Đăng ký giảng dạy */}
      {isTeachingModalOpen && (
        <RegisterTeachingModal
            lecturerId={user.userID}
            onClose={() => setIsTeachingModalOpen(false)}
            onSuccess={() => {
                if (onRefresh) onRefresh();
            }}
        />
      )}

      {/* 👇 3. MODAL XEM LỚP ĐANG DẠY (MỚI) */}
      {isMyClassesModalOpen && (
        <TeachingCoursesModal
            lecturerId={user.userID}
            onClose={() => setIsMyClassesModalOpen(false)}
        />
      )}

      {/* 4. Modal Đăng xuất */}
      {isLogoutModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
            <h2 style={{color: '#e74c3c', marginTop: 0}}>Đăng Xuất</h2>
            <p style={{fontSize: '16px', color: '#555', margin: '20px 0'}}>
                Thầy/Cô có chắc chắn muốn đăng xuất khỏi hệ thống không?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <button onClick={() => setIsLogoutModalOpen(false)} className="btn-cancel" style={{padding: '10px 25px'}}>Hủy</button>
                <button onClick={confirmLogout} className="btn-logout" style={{padding: '10px 25px', width: 'auto'}}>Đồng ý</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Style objects
const menuItemStyle = {
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
};

const simpleItemStyle = {
    marginBottom: '10px', 
    padding: '10px', 
    borderBottom: '1px solid #eee',
    cursor: 'default' 
};

export default LecturerDashboard;