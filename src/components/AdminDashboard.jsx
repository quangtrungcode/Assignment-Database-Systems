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
import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css'; // Style chung
import '../styles/AdminDashboard.css'; // Style riêng cho trang Admin (Grid layout nằm ở đây)
import { userAPI, permissionAPI, roleAPI } from '../services/apiService';
import { Link } from 'react-router-dom';
import { FaUsers, FaUserShield, FaClipboardList } from 'react-icons/fa';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);

  // Hàm lấy Users
  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      // Xử lý linh hoạt: API có thể trả về mảng trực tiếp hoặc nằm trong object .result
      const data = response.data?.result || response.data || [];
      if (Array.isArray(data)) setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // Hàm lấy Permissions
  const fetchPermissions = async () => {
    try {
      const response = await permissionAPI.getAll();
      const data = response.data?.result || response.data || [];
      if (Array.isArray(data)) setAllPermissions(data);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };

  // Hàm lấy Roles
  const fetchRoles = async () => {
    try {
      const response = await roleAPI.getAll();
      const data = response.data?.result || response.data || [];
      if (Array.isArray(data)) setRoles(data);
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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Tổng quan quản trị</h1>
      </div>
      
      <div className="dashboard-content">
        
        {/* 👇 Class này sẽ được CSS xử lý thành 3 cột ngang hàng */}
        <div className="dashboard-cards-grid">
          
          {/* Card Users */}
          <Link to="/admin/users" className="stat-card user-card">
            <div className="card-icon">
              <FaUsers />
            </div>
            <div className="card-info">
              <h3>Tổng số người dùng</h3>
              <p className="stat-number">{users.length}</p>
            </div>
          </Link>

          {/* Card Roles */}
          <Link to="/admin/roles" className="stat-card role-card">
            <div className="card-icon">
              <FaUserShield />
            </div>
            <div className="card-info">
              <h3>Tổng số vai trò</h3>
              <p className="stat-number">{roles.length}</p>
            </div>
          </Link>

          {/* Card Permissions */}
          <Link to="/admin/permissions" className="stat-card permission-card">
            <div className="card-icon">
              <FaClipboardList />
            </div>
            <div className="card-info">
              <h3>Tổng số quyền</h3>
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
};

export default AdminDashboard;