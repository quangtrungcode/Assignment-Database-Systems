


import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Dashboard.css';
import '../styles/AdminDashboard.css'; 
import { userAPI, permissionAPI, roleAPI, courseAPI } from '../services/apiService';
import { Link } from 'react-router-dom';
import { FaUserShield, FaClipboardList, FaBook, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';

const AdminDashboard = React.memo(() => { 
  const [studentCount, setStudentCount] = useState(0);
  const [lecturerCount, setLecturerCount] = useState(0);
  const [rolesCount, setRolesCount] = useState(0);
  const [permissionsCount, setPermissionsCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  
  const fetchAllStats = useCallback(async () => {
    try {
        const [usersRes, rolesRes, permissionsRes, coursesRes] = await Promise.all([
            userAPI.getAllUsers(),
            roleAPI.getAll(),
            permissionAPI.getAll(),
            courseAPI.getAll()
        ]);

        const userData = usersRes.data?.result || usersRes.data || [];
        
        // Đếm số lượng
        const students = userData.filter(u => (u.role?.roleName || u.role?.name || '').toLowerCase() === 'student').length;
        const lecturers = userData.filter(u => (u.role?.roleName || u.role?.name || '').toLowerCase() === 'lecturer').length;

        setStudentCount(students);
        setLecturerCount(lecturers);

        const rolesData = rolesRes.data?.result || rolesRes.data || [];
        const permsData = permissionsRes.data?.result || permissionsRes.data || [];
        const coursesData = coursesRes.data?.result || coursesRes.data || [];
        
        setRolesCount(rolesData.length);
        setPermissionsCount(permsData.length);
        setCoursesCount(coursesData.length);

    } catch (error) {
        console.error("Lỗi tải thống kê:", error);
    }
  }, []);

  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats]);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Tổng Quan Quản Trị</h1>
        <p className="current-date">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      {/*  */}
      <div className="stats-grid">
        
        <Link to="/admin/users" className="stat-card card-lecturer">
          <div className="card-inner">
            <div className="card-info">
              <h3>Giảng viên</h3>
              <h2>{lecturerCount}</h2>
            </div>
            <div className="card-icon">
              <FaChalkboardTeacher />
            </div>
          </div>
        </Link>

        <Link to="/admin/users" className="stat-card card-student">
          <div className="card-inner">
            <div className="card-info">
              <h3>Sinh viên</h3>
              <h2>{studentCount}</h2>
            </div>
            <div className="card-icon">
              <FaUserGraduate />
            </div>
          </div>
        </Link>
        
        <Link to="/admin/courses" className="stat-card card-course">
          <div className="card-inner">
            <div className="card-info">
              <h3>Khóa học</h3>
              <h2>{coursesCount}</h2>
            </div>
            <div className="card-icon">
              <FaBook />
            </div>
          </div>
        </Link>

        <Link to="/admin/roles" className="stat-card card-role">
          <div className="card-inner">
            <div className="card-info">
              <h3>Vai trò</h3>
              <h2>{rolesCount}</h2>
            </div>
            <div className="card-icon">
              <FaUserShield />
            </div>
          </div>
        </Link>

        <Link to="/admin/permissions" className="stat-card card-permission">
          <div className="card-inner">
            <div className="card-info">
              <h3>Quyền hạn</h3>
              <h2>{permissionsCount}</h2>
            </div>
            <div className="card-icon">
              <FaClipboardList />
            </div>
          </div>
        </Link>

      </div>

      {/*  */}
      <div className="welcome-section">
        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>Chào mừng trở lại! 👋</h2>
            <p>Hệ thống đang hoạt động ổn định. Bạn có thể quản lý người dùng, khóa học và phân quyền từ thanh menu bên trái.</p>
          </div>
          <div className="welcome-image">
            {/*  */}
          </div>
        </div>
      </div>
    </div>
  );
});

export default AdminDashboard;