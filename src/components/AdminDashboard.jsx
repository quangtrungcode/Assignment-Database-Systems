import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { userAPI, permissionAPI, roleAPI } from '../services/apiService';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      if (Array.isArray(response.data)) setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await permissionAPI.getAll();
      if (response.data?.code === 1000 && Array.isArray(response.data.result)) {
        setAllPermissions(response.data.result);
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await roleAPI.getAll();
      if (response.data?.code === 1000 && Array.isArray(response.data.result)) {
        setRoles(response.data.result);
      } else if (Array.isArray(response.data)) {
        setRoles(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
    fetchRoles();
  }, []);

  return (
    <div>
      <h1>Tổng quan</h1>
      <div className="dashboard-cards-container">
        <Link to="/admin/users" className="dashboard-card stat-card">
          <h3>Tổng số người dùng</h3>
          <p className="stat-number">{users.length}</p>
        </Link>
        <Link to="/admin/roles" className="dashboard-card stat-card">
          <h3>Tổng số vai trò</h3>
          <p className="stat-number">{roles.length}</p>
        </Link>
        <Link to="/admin/permissions" className="dashboard-card stat-card">
          <h3>Tổng số quyền</h3>
          <p className="stat-number">{allPermissions.length}</p>
        </Link>
      </div>
      <div className="dashboard-card">
        <h2>Chào mừng đến với trang quản trị!</h2>
        <p>Sử dụng thanh điều hướng bên trái để truy cập các chức năng quản lý.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
