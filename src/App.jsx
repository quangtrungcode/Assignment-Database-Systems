// import { useState, useEffect } from 'react';
// import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
// import './App.css';
// import Login from './components/Login';
// import Register from './components/Register';
// import AdminDashboard from './components/AdminDashboard';
// import LecturerDashboard from './components/LecturerDashboard';
// import StudentDashboard from './components/StudentDashboard';
// import { userAPI } from './services/apiService';

// // Layouts & Pages
// import AdminLayout from './components/AdminLayout';
// import UserManagementPage from './pages/UserManagementPage';
// import RoleManagementPage from './pages/RoleManagementPage.jsx';
// import PermissionManagementPage from './pages/PermissionManagement';

// const ProtectedRoute = ({ user, role, children }) => {
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
  
//   if (role && user.role?.name !== role) {
//     // Nếu có vai trò yêu cầu và vai trò người dùng không khớp, điều hướng
//     return <Navigate to={`/${user.role?.name}/dashboard`} replace />;
//   }

//   return children;
// };


// function App() {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem('authToken');
//       if (token) {
//         try {
//           const response = await userAPI.getMyInfo();
//           if (response.data?.code === 1000) {
//             setUser(response.data.result);
//           } else {
//             // Token không hợp lệ hoặc hết hạn trên backend
//             localStorage.removeItem('authToken');
//           }
//         } catch (error) {
//           console.error("Auth check failed:", error);
//           localStorage.removeItem('authToken');
//         }
//       }
//       setIsLoading(false);
//     };
//     checkAuth();
//   }, []);

//   const handleLoginSuccess = (userData) => {
//     setUser(userData);
//     // Điều hướng dựa trên vai trò trả về từ API
//     navigate(`/${userData.role?.name}/dashboard`, { replace: true });
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     setUser(null);
//     navigate('/login');
//   };
  
//   // Component điều hướng khi vào trang chủ
//   const HomeRedirect = () => {
//     if (isLoading) {
//       return <div className="loading">Loading...</div>;
//     }
//     if (!user) {
//       return <Navigate to="/login" />;
//     }
//     // Điều hướng đến dashboard tương ứng với vai trò
//     return <Navigate to={`/${user.role?.name}/dashboard`} />;
//   };

//   if (isLoading) {
//     return <div className="loading">Initializing...</div>;
//   }

//   return (
//     <div className="app-container">
//       <Routes>
//         <Route path="/" element={<HomeRedirect />} />
//         <Route 
//           path="/login" 
//           element={user ? <Navigate to={`/${user.role?.name}/dashboard`} /> : <Login onLoginSuccess={handleLoginSuccess} />} 
//         />
//         <Route 
//           path="/register" 
//           element={user ? <Navigate to={`/${user.role?.name}/dashboard`} /> : <Register />} 
//         />

//         {/* --- Admin Routes with Layout --- */}
//         <Route 
//           path="/admin"
//           element={
//             <ProtectedRoute user={user} role="admin">
//               <AdminLayout user={user} onLogout={handleLogout} />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route path="users" element={<UserManagementPage />} />
//           <Route path="roles" element={<RoleManagementPage />} />
//           <Route path="permissions" element={<PermissionManagementPage />} />
//           {/* Redirect /admin to /admin/dashboard */}
//           <Route index element={<Navigate to="dashboard" replace />} />
//         </Route>

//         <Route 
//           path="/lecturers/dashboard" 
//           element={
//             <ProtectedRoute user={user} role="lecturers">
//               <LecturerDashboard user={user} onLogout={handleLogout} />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/student/dashboard" 
//           element={
//             <ProtectedRoute user={user} role="student">
//               <StudentDashboard user={user} onLogout={handleLogout} />
//             </ProtectedRoute>
//           } 
//         />
        
//         {/* Fallback route */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
// import { useState, useEffect, useCallback } from 'react'; // Thêm useCallback
// import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
// import './App.css';
// import Login from './components/Login';
// import Register from './components/Register';
// import AdminDashboard from './components/AdminDashboard';
// import LecturerDashboard from './components/LecturerDashboard';
// import StudentDashboard from './components/StudentDashboard';
// import { userAPI } from './services/apiService';

// // Layouts & Pages
// import AdminLayout from './components/AdminLayout';
// import UserManagementPage from './pages/UserManagementPage';
// import RoleManagementPage from './pages/RoleManagementPage.jsx';
// import PermissionManagementPage from './pages/PermissionManagement';

// const ProtectedRoute = ({ user, role, children }) => {
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
  
//   if (role && user.role?.name !== role) {
//     return <Navigate to={`/${user.role?.name}/dashboard`} replace />;
//   }

//   return children;
// };

// function App() {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   // 👇 1. Tách logic lấy thông tin user ra thành hàm riêng
//   // Dùng useCallback để tránh tạo lại hàm không cần thiết
//   const fetchUserInfo = useCallback(async () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await userAPI.getMyInfo();
//       if (response.data?.code === 1000) {
//         setUser(response.data.result); // Cập nhật state User mới nhất
//       } else {
//         localStorage.removeItem('authToken');
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("Auth check failed:", error);
//       localStorage.removeItem('authToken');
//       setUser(null);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // 👇 2. useEffect chỉ gọi hàm này khi mount
//   useEffect(() => {
//     fetchUserInfo();
//   }, [fetchUserInfo]);

//   const handleLoginSuccess = (userData) => {
//     setUser(userData);
//     navigate(`/${userData.role?.name}/dashboard`, { replace: true });
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     setUser(null);
//     navigate('/login');
//   };
  
//   const HomeRedirect = () => {
//     if (isLoading) return <div className="loading">Loading...</div>;
//     if (!user) return <Navigate to="/login" />;
//     return <Navigate to={`/${user.role?.name}/dashboard`} />;
//   };

//   if (isLoading) {
//     return <div className="loading">Initializing...</div>;
//   }

//   return (
//     <div className="app-container">
//       <Routes>
//         <Route path="/" element={<HomeRedirect />} />
//         <Route 
//           path="/login" 
//           element={user ? <Navigate to={`/${user.role?.name}/dashboard`} /> : <Login onLoginSuccess={handleLoginSuccess} />} 
//         />
//         <Route 
//           path="/register" 
//           element={user ? <Navigate to={`/${user.role?.name}/dashboard`} /> : <Register />} 
//         />

//         {/* --- Admin Routes --- */}
//         <Route 
//           path="/admin"
//           element={
//             <ProtectedRoute user={user} role="admin">
//               <AdminLayout user={user} onLogout={handleLogout} />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route path="users" element={<UserManagementPage />} />
//           <Route path="roles" element={<RoleManagementPage />} />
//           <Route path="permissions" element={<PermissionManagementPage />} />
//           <Route index element={<Navigate to="dashboard" replace />} />
//         </Route>

//         <Route 
//           path="/lecturers/dashboard" 
//           element={
//             <ProtectedRoute user={user} role="lecturers">
//               {/* Truyền thêm onRefresh cho Lecturer luôn nếu cần sau này */}
//               <LecturerDashboard 
//                   user={user} 
//                   onLogout={handleLogout} 
//                   onRefresh={fetchUserInfo} 
//               />
//             </ProtectedRoute>
//           } 
//         />
        
//         <Route 
//           path="/student/dashboard" 
//           element={
//             <ProtectedRoute user={user} role="student">
//               {/* 👇 3. QUAN TRỌNG: Truyền hàm fetchUserInfo xuống dưới tên là onRefresh */}
//               <StudentDashboard 
//                   user={user} 
//                   onLogout={handleLogout} 
//                   onRefresh={fetchUserInfo} 
//               />
//             </ProtectedRoute>
//           } 
//         />
        
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import LecturerDashboard from './components/LecturerDashboard';
import StudentDashboard from './components/StudentDashboard';
import { userAPI } from './services/apiService';

// Layouts & Pages
import AdminLayout from './components/AdminLayout';
import UserManagementPage from './pages/UserManagementPage';
import RoleManagementPage from './pages/RoleManagementPage.jsx';
import PermissionManagementPage from './pages/PermissionManagement';
import CourseManagementPage from './pages/CourseManagementPage'; // Import trang khóa học

const ProtectedRoute = ({ user, role, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role?.name !== role) {
    return <Navigate to={`/${user.role?.name}/dashboard`} replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 👇 1. Hàm lấy thông tin user mới nhất từ Backend
  // Dùng useCallback để tránh hàm bị tạo lại liên tục gây loop
  const fetchUserInfo = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await userAPI.getMyInfo();
      if (response.data?.code === 1000) {
        setUser(response.data.result); // Cập nhật state User -> Giao diện tự đổi
      } else {
        localStorage.removeItem('authToken');
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 👇 2. Gọi hàm này khi ứng dụng vừa chạy (F5 trang)
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    navigate(`/${userData.role?.name}/dashboard`, { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };
  
  const HomeRedirect = () => {
    if (isLoading) return <div className="loading">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return <Navigate to={`/${user.role?.name}/dashboard`} />;
  };

  if (isLoading) {
    return <div className="loading">Initializing...</div>;
  }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to={`/${user.role?.name}/dashboard`} /> : <Login onLoginSuccess={handleLoginSuccess} />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to={`/${user.role?.name}/dashboard`} /> : <Register />} 
        />

        {/* --- Admin Routes --- */}
        <Route 
          path="/admin"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminLayout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="roles" element={<RoleManagementPage />} />
          <Route path="permissions" element={<PermissionManagementPage />} />
          <Route path="courses" element={<CourseManagementPage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* --- Lecturer Routes --- */}
        <Route 
          path="/lecturers/dashboard" 
          element={
            <ProtectedRoute user={user} role="lecturers">
              {/* 👇 Truyền hàm fetchUserInfo xuống dưới với tên onRefresh */}
              <LecturerDashboard 
                  user={user} 
                  onLogout={handleLogout} 
                  onRefresh={fetchUserInfo} 
              />
            </ProtectedRoute>
          } 
        />
        
        {/* --- Student Routes --- */}
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute user={user} role="student">
              {/* 👇 Truyền hàm fetchUserInfo xuống dưới với tên onRefresh */}
              <StudentDashboard 
                  user={user} 
                  onLogout={handleLogout} 
                  onRefresh={fetchUserInfo} 
              />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;