// import React, { useState, useEffect } from 'react';
// import '../styles/Dashboard.css'; // For general dashboard-related styles
// import '../styles/AdminDashboard.css'; // For specific AdminDashboard styling
// import { userAPI, permissionAPI, roleAPI } from '../services/apiService';
// import { Link } from 'react-router-dom';
// import { FaUsers, FaUserShield, FaClipboardList } from 'react-icons/fa'; // Import icons

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [allPermissions, setAllPermissions] = useState([]);

//   const fetchUsers = async () => {
//     try {
//       const response = await userAPI.getAllUsers();
//       if (Array.isArray(response.data)) setUsers(response.data);
//     } catch (error) {
//       console.error("Failed to fetch users:", error);
//     }
//   };

//   const fetchPermissions = async () => {
//     try {
//       const response = await permissionAPI.getAll();
//       if (response.data?.code === 1000 && Array.isArray(response.data.result)) {
//         setAllPermissions(response.data.result);
//       }
//     } catch (error) {
//       console.error("Failed to fetch permissions:", error);
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const response = await roleAPI.getAll();
//       if (response.data?.code === 1000 && Array.isArray(response.data.result)) {
//         setRoles(response.data.result);
//       } else if (Array.isArray(response.data)) {
//         setRoles(response.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch roles:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//     fetchPermissions();
//     fetchRoles();
//   }, []);

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1>Tổng quan quản trị</h1>
//       </div>
//       <div className="dashboard-content">
//         <div className="dashboard-cards-grid"> {/* Changed to grid */}
//           <Link to="/admin/users" className="dashboard-card stat-card user-card">
//             <div className="card-icon">
//               <FaUsers />
//             </div>
//             <div className="card-info">
//               <h3>Tổng số người dùng</h3>
//               <p className="stat-number">{users.length}</p>
//             </div>
//           </Link>
//           <Link to="/admin/roles" className="dashboard-card stat-card role-card">
//             <div className="card-icon">
//               <FaUserShield />
//             </div>
//             <div className="card-info">
//               <h3>Tổng số vai trò</h3>
//               <p className="stat-number">{roles.length}</p>
//             </div>
//           </Link>
//           <Link to="/admin/permissions" className="dashboard-card stat-card permission-card">
//             <div className="card-icon">
//               <FaClipboardList />
//             </div>
//             <div className="card-info">
//               <h3>Tổng số quyền</h3>
//               <p className="stat-number">{allPermissions.length}</p>
//             </div>
//           </Link>
//         </div>
//         <div className="dashboard-card welcome-card">
//           <h2>Chào mừng đến với trang quản trị!</h2>
//           <p>Sử dụng thanh điều hướng bên trái để truy cập các chức năng quản lý, theo dõi số liệu thống kê và quản lý hệ thống hiệu quả.</p>
//           <p>Chúc bạn có một ngày làm việc hiệu quả!</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useState, useEffect, useCallback } from 'react'; // 👈 Thêm useCallback
import '../styles/Dashboard.css';
import '../styles/AdminDashboard.css';
import { userAPI, permissionAPI, roleAPI, courseAPI } from '../services/apiService'; // Thêm courseAPI
import { Link } from 'react-router-dom';
import { FaUsers, FaUserShield, FaClipboardList, FaBook } from 'react-icons/fa';

// Sử dụng React.memo để ngăn component re-render nếu props không đổi (tối ưu hiệu suất)
const AdminDashboard = React.memo(() => { 
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [courses, setCourses] = useState([]);
  
  // 👇 HÀM GỘP 4 API VÀ CHẠY SONG SONG
  const fetchAllStats = useCallback(async () => {
    try {
        // Chạy tất cả các API cùng một lúc
        const [usersRes, rolesRes, permissionsRes, coursesRes] = await Promise.all([
            userAPI.getAllUsers(),
            roleAPI.getAll(),
            permissionAPI.getAll(),
            courseAPI.getAll()
        ]);

        // 1. Xử lý và trích xuất dữ liệu
        const userData = usersRes.data?.result || usersRes.data || [];
        const rolesData = rolesRes.data?.result || rolesRes.data || [];
        const permsData = permissionsRes.data?.result || permissionsRes.data || [];
        const coursesData = coursesRes.data?.result || coursesRes.data || [];
        
        // 2. Cập nhật tất cả State MỘT LẦN DUY NHẤT
        setUsers(userData);
        setRoles(rolesData);
        setAllPermissions(permsData);
        setCourses(coursesData);

    } catch (error) {
        // Chỉ log lỗi thay vì crash ứng dụng nếu một API thất bại
        console.error("Lỗi tải toàn bộ số liệu thống kê:", error);
    }
  }, []); // Hàm này không có dependency nên chạy 1 lần

  // 👇 GỌI HÀM KHI COMPONENT MOUNT
  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Tổng quan quản trị</h1>
      </div>
      
      <div className="dashboard-content">
        
        {/* 👇 Bổ sung Style để đảm bảo 4 cột nằm ngang hàng nhau */}
        <div className="dashboard-cards-grid" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
          
          {/* Card Users */}
          <Link to="/admin/users" className="stat-card user-card">
            <div className="card-icon">
              <FaUsers />
            </div>
            <div className="card-info">
              <h3>Người dùng</h3>
              <p className="stat-number">{users.length}</p>
            </div>
          </Link>
          
          {/* Card Courses */}
          <Link to="/admin/courses" className="stat-card course-card">
            <div className="card-icon">
              <FaBook />
            </div>
            <div className="card-info">
              <h3>Khóa học</h3>
              <p className="stat-number">{courses.length}</p>
            </div>
          </Link>

          {/* Card Roles */}
          <Link to="/admin/roles" className="stat-card role-card">
            <div className="card-icon">
              <FaUserShield />
            </div>
            <div className="card-info">
              <h3>Vai trò</h3>
              <p className="stat-number">{roles.length}</p>
            </div>
          </Link>

          {/* Card Permissions (Cột thứ 4) */}
          <Link to="/admin/permissions" className="stat-card permission-card">
            <div className="card-icon">
              <FaClipboardList />
            </div>
            <div className="card-info">
              <h3>Quyền hạn</h3>
              <p className="stat-number">{allPermissions.length}</p>
            </div>
          </Link>

        </div>

        <div className="dashboard-card welcome-card">
          <h2>Chào mừng đến với trang quản trị!</h2>
          <p>Sử dụng thanh điều hướng bên trái để truy cập các chức năng quản lý, theo dõi số liệu thống kê và quản lý hệ thống hiệu quả.</p>
        </div>
      </div>
    </div>
  );
}); // 👈 Kết thúc với React.memo

export default AdminDashboard;