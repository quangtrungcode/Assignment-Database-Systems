import React from 'react';
import '../styles/Dashboard.css';

const LecturerDashboard = ({ user, onLogout }) => {
  const getRoleText = (roleName) => {
    if (!roleName) return 'Chưa có vai trò';
    let roleNameToRender = roleName;
    if (roleName === 'lecturers') roleNameToRender = 'lecturer';
    return roleNameToRender.charAt(0).toUpperCase() + roleNameToRender.slice(1);
  }

  const getGenderText = (gender) => {
    if (!gender) return 'Chưa cập nhật';
    switch(gender.toLowerCase()) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      case 'other': return 'Khác';
      default: return 'Chưa cập nhật';
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bảng điều khiển Giảng viên</h1>
        <button onClick={onLogout} className="btn-logout">Đăng Xuất</button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Thông Tin Tài Khoản</h2>
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
              <span className="info-value role-badge">{getRoleText(user.role?.name)}</span>
            </div>
            <div className="info-row info-row-permissions">
              <span className="info-label">Quyền hạn:</span>
              <div className="info-value">
                {user.role?.permissions && user.role.permissions.length > 0 ? (
                  <ul className="permissions-list">
                    {user.role.permissions.map(p => (
                      <li key={p.name} title={p.description}>{p.name}</li>
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
          <p className="success-message">✓ Chào mừng, {user.fullName}!</p>
        </div>

        <div className="dashboard-card">
          <h2>Chức Năng</h2>
          <ul>
            <li>Quản lý hồ sơ cá nhân</li>
            <li>Xem lịch sử hoạt động</li>
            <li>Cài đặt bảo mật</li>
            {user.role?.name === 'student' && (
              <>
                <li>Xem danh sách môn học</li>
                <li>Nộp bài tập</li>
              </>
            )}
            {user.role?.name === 'lecturers' && (
              <>
                <li>Quản lý lớp học</li>
                <li>Chấm điểm bài tập</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;


