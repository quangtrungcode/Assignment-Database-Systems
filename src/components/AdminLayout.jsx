import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../styles/AdminLayout.css'; // Sẽ tạo file này ở bước tiếp theo

const AdminLayout = ({ user, onLogout }) => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
          <div className="sidebar-user-info">
            <span>Chào, <strong>{user?.fullName || 'Admin'}</strong></span>
            <button onClick={onLogout} className="btn-logout-sidebar">Đăng Xuất</button>
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
    </div>
  );
};

export default AdminLayout;