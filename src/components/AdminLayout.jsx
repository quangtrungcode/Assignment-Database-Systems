import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../styles/AdminLayout.css';
import ConfirmationModal from './ConfirmationModal'; // Import the ConfirmationModal

const AdminLayout = ({ user, onLogout }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false); // Close the modal
    onLogout(); // Proceed with logout
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
          <div className="sidebar-user-info">
            <span>Chào, <strong>{user?.fullName || 'Admin'}</strong></span>
            <button
              onClick={() => setIsLogoutModalOpen(true)} // Open modal on click
              className="btn-logout-sidebar"
            >
              Đăng Xuất
            </button>
          </div>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard">Bảng điều khiển</NavLink>
          <NavLink to="/admin/users">Quản lý Người dùng</NavLink>
          <NavLink to="/admin/roles">Quản lý Vai trò</NavLink>
          <NavLink to="/admin/permissions">Quản lý Quyền</NavLink>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>

      {/* Confirmation Modal for Logout */}
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