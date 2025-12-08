

import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../styles/AdminLayout.css';
import ConfirmationModal from './ConfirmationModal'; 

const AdminLayout = ({ user, onLogout }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false); 
    onLogout(); 
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
          <div className="sidebar-user-info">
            <span>Chào, <strong>{user?.fullName || 'Admin'}</strong></span>
            <button
              onClick={() => setIsLogoutModalOpen(true)} 
              className="btn-logout-sidebar"
            >
              Đăng Xuất
            </button>
          </div>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            Bảng điều khiển
          </NavLink>
          
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active" : ""}>
            Quản lý Người dùng
          </NavLink>

          <NavLink to="/admin/courses" className={({ isActive }) => isActive ? "active" : ""}>
            Quản lý Khóa học
          </NavLink>

          <NavLink to="/admin/roles" className={({ isActive }) => isActive ? "active" : ""}>
            Quản lý Vai trò
          </NavLink>
          
          <NavLink to="/admin/permissions" className={({ isActive }) => isActive ? "active" : ""}>
            Quản lý Quyền
          </NavLink>

          {/*  */}
          <NavLink to="/admin/profile" className={({ isActive }) => isActive ? "active" : ""}>
            Hồ sơ cá nhân
          </NavLink>

        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>

      {/*  */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Xác nhận Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?"
      />
    </div>
  );
};

export default AdminLayout;