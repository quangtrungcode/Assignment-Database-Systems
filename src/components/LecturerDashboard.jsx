


import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import LecturerProfileModal from './LecturerProfileModal';
import Toast from './Toast'; 
import { io } from 'socket.io-client';


import RegisterTeachingModal from './RegisterTeachingModal';
import TeachingCoursesModal from './TeachingCoursesModal'; 

function LecturerDashboard({ user, onLogout, onRefresh }) {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTeachingModalOpen, setIsTeachingModalOpen] = useState(false);
  
  
  const [isMyClassesModalOpen, setIsMyClassesModalOpen] = useState(false);
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [toast, setToast] = useState(null); 

  
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
        
        {/*  */}
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

        {/* */}
        <div className="dashboard-card col-actions">
          <h2>Chức Năng</h2>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {/*  */}
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

            {/*  */}
            <li 
                onClick={() => setIsMyClassesModalOpen(true)}
                className="menu-item-hover"
                style={{
                    cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px', padding: '12px', 
                    backgroundColor: '#eef2ff', color: '#4338ca', 
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

      {/* */}

      {/* */}
      {isModalOpen && (
        <LecturerProfileModal 
            user={user} 
            onClose={() => setIsModalOpen(false)} 
            onUserUpdated={handleUserUpdated}
        />
      )}

      {/*  */}
      {isTeachingModalOpen && (
        <RegisterTeachingModal
            lecturerId={user.userID}
            onClose={() => setIsTeachingModalOpen(false)}
            onSuccess={() => {
                if (onRefresh) onRefresh();
            }}
        />
      )}

      {/*  */}
      {isMyClassesModalOpen && (
        <TeachingCoursesModal
            lecturerId={user.userID}
            onClose={() => setIsMyClassesModalOpen(false)}
        />
      )}

      {/*  */}
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