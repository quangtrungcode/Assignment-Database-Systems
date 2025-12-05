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
// import { useState, useEffect, useCallback } from 'react';
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
// import CourseManagementPage from './pages/CourseManagementPage'; // Import trang khóa học

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

//   // 👇 1. Hàm lấy thông tin user mới nhất từ Backend
//   // Dùng useCallback để tránh hàm bị tạo lại liên tục gây loop
//   const fetchUserInfo = useCallback(async () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await userAPI.getMyInfo();
//       if (response.data?.code === 1000) {
//         setUser(response.data.result); // Cập nhật state User -> Giao diện tự đổi
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

//   // 👇 2. Gọi hàm này khi ứng dụng vừa chạy (F5 trang)
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
//           <Route path="courses" element={<CourseManagementPage />} />
//           <Route index element={<Navigate to="dashboard" replace />} />
//         </Route>

//         {/* --- Lecturer Routes --- */}
//         <Route 
//           path="/lecturers/dashboard" 
//           element={
//             <ProtectedRoute user={user} role="lecturers">
//               {/* 👇 Truyền hàm fetchUserInfo xuống dưới với tên onRefresh */}
//               <LecturerDashboard 
//                   user={user} 
//                   onLogout={handleLogout} 
//                   onRefresh={fetchUserInfo} 
//               />
//             </ProtectedRoute>
//           } 
//         />
        
//         {/* --- Student Routes --- */}
//         <Route 
//           path="/student/dashboard" 
//           element={
//             <ProtectedRoute user={user} role="student">
//               {/* 👇 Truyền hàm fetchUserInfo xuống dưới với tên onRefresh */}
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

// import { useState, useEffect, useCallback } from 'react';
// import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
// import { io } from 'socket.io-client'; 
// import './App.css';

// import Login from './components/Login';
// import Register from './components/Register';
// import AdminDashboard from './components/AdminDashboard';
// import LecturerDashboard from './components/LecturerDashboard';
// import StudentDashboard from './components/StudentDashboard';
// import { userAPI } from './services/apiService';

// import AdminLayout from './components/AdminLayout';
// import UserManagementPage from './pages/UserManagementPage';
// import RoleManagementPage from './pages/RoleManagementPage.jsx';
// import PermissionManagementPage from './pages/PermissionManagementPage';
// import CourseManagementPage from './pages/CourseManagementPage'; 
// // 👇 THÊM IMPORT TRANG PROFILE MỚI
// import AdminProfilePage from './pages/AdminProfilePage'; 

// const SOCKET_SERVER_URL = "http://localhost:8085"; 

// const ProtectedRoute = ({ user, role, children }) => {
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
  
//   // 👇 Đã sửa: Dùng user.role.roleName và toLowerCase()
//   const userRole = user.role?.roleName?.toLowerCase();
//   const requiredRole = role.toLowerCase();

//   if (userRole !== requiredRole) {
//     return <Navigate to={`/${userRole}/dashboard`} replace />;
//   }

//   return children;
// };

// function App() {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   const fetchUserInfo = useCallback(async () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await userAPI.getMyInfo();
//       if (response.data?.code === 1000) {
//         setUser(response.data.result);
//         // Lưu ID vào localStorage để dùng cho AdminProfilePage nếu cần
//         if (response.data.result?.userID) {
//             localStorage.setItem('userID', response.data.result.userID);
//         }
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

//   // Socket logic
//   useEffect(() => {
//     if (user?.userID) {
//       const socket = io(SOCKET_SERVER_URL, {
//         query: { token: localStorage.getItem('authToken') }
//       });

//       socket.on('connect', () => {
//         console.log(`✅ SOCKET CONNECTED: ${user.userID}`);
//       });
      
//       socket.on('userUpdated', (payload) => {
//         if (payload.userId === user.userID) {
//           fetchUserInfo();
//         }
//       });
      
//       return () => {
//         socket.disconnect();
//       };
//     }
//   }, [user?.userID, fetchUserInfo]);

//   useEffect(() => {
//     fetchUserInfo();
//   }, [fetchUserInfo]);

//   const handleLoginSuccess = (userData) => {
//     setUser(userData);
//     if (userData?.userID) {
//         localStorage.setItem('userID', userData.userID);
//     }
//     const rolePath = userData.role?.roleName?.toLowerCase() || 'student';
//     navigate(`/${rolePath}/dashboard`, { replace: true });
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userID'); // Xóa cả ID
//     setUser(null);
//     navigate('/login');
//   };
  
//   const HomeRedirect = () => {
//     if (isLoading) return <div className="loading">Loading...</div>;
//     if (!user) return <Navigate to="/login" />;

//     if (!user.role || !user.role.roleName) {
//        return <div>Lỗi: Tài khoản thiếu thông tin Role.</div>;
//     }

//     const rolePath = user.role.roleName.toLowerCase();
//     return <Navigate to={`/${rolePath}/dashboard`} />;
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
//           element={user ? <HomeRedirect /> : <Login onLoginSuccess={handleLoginSuccess} />} 
//         />
//         <Route 
//           path="/register" 
//           element={user ? <HomeRedirect /> : <Register />} 
//         />

//         {/* --- Admin Routes --- */}
//         <Route 
//           path="/admin"
//           element={
//             <ProtectedRoute user={user} role="Admin">
//               <AdminLayout user={user} onLogout={handleLogout} onUserRefresh={fetchUserInfo} />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route 
//             path="users" 
//             element={
//               <UserManagementPage 
//                 onRefresh={fetchUserInfo} 
//                 currentUserId={user?.userID} 
//               />
//             } 
//           />
//           <Route path="roles" element={<RoleManagementPage />} />
//           <Route path="permissions" element={<PermissionManagementPage />} />
//           <Route path="courses" element={<CourseManagementPage />} />
          
//           {/* 👇 ROUTE MỚI CHO TRANG PROFILE ADMIN */}
//           <Route path="profile" element={<AdminProfilePage />} />
          
//           <Route index element={<Navigate to="dashboard" replace />} />
//         </Route>

//         {/* --- Lecturer Routes --- */}
//         <Route 
//           path="/lecturer/dashboard" 
//           element={
//             <ProtectedRoute user={user} role="Lecturer">
//               <LecturerDashboard user={user} onLogout={handleLogout} onRefresh={fetchUserInfo} />
//             </ProtectedRoute>
//           } 
//         />
        
//         {/* --- Student Routes --- */}
//         <Route 
//           path="/student/dashboard" 
//           element={
//             <ProtectedRoute user={user} role="Student">
//               <StudentDashboard user={user} onLogout={handleLogout} onRefresh={fetchUserInfo} />
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
import { io } from 'socket.io-client'; 
import './App.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import Toast from './components/Toast'; // 👈 Import Toast để hiển thị lỗi đẹp

// Dashboards
import AdminDashboard from './components/AdminDashboard';
import LecturerDashboard from './components/LecturerDashboard';
import StudentDashboard from './components/StudentDashboard';

// Services
import { userAPI } from './services/apiService';

// Layouts & Pages
import AdminLayout from './components/AdminLayout';
import UserManagementPage from './pages/UserManagementPage';
import RoleManagementPage from './pages/RoleManagementPage.jsx';
import PermissionManagementPage from './pages/PermissionManagementPage';
import CourseManagementPage from './pages/CourseManagementPage'; 
import AdminProfilePage from './pages/AdminProfilePage'; 

const SOCKET_SERVER_URL = "http://localhost:8085"; 

// --- 1. PROTECTED ROUTE: BẢO VỆ VÀ CHẶN VÒNG LẶP ---
const ProtectedRoute = ({ user, role, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Lấy role hiện tại an toàn (chuyển về chữ thường)
  const userRole = (user.role?.roleName || user.role?.name || '').toLowerCase();
  const requiredRole = role.toLowerCase();

  // 🛑 Nếu user bị lỗi không có role -> Đẩy về Login ngay để tránh lỗi trắng trang
  if (!userRole) {
    localStorage.removeItem('authToken'); 
    return <Navigate to="/login" replace />;
  }

  // So sánh quyền
  if (userRole !== requiredRole) {
    // Nếu sai quyền, tính toán đường dẫn đúng để trả về Dashboard của họ
    let returnPath = 'student';
    if (userRole === 'admin') returnPath = 'admin';
    else if (userRole.includes('lecturer')) returnPath = 'lecturer';
    
    return <Navigate to={`/${returnPath}/dashboard`} replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null); // 👈 State quản lý thông báo lỗi đẹp
  const navigate = useNavigate();

  // --- 2. HÀM LẤY THÔNG TIN USER (Dùng chung) ---
  const fetchUserInfo = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await userAPI.getMyInfo();
      if (response.data?.code === 1000) {
        setUser(response.data.result);
        if (response.data.result?.userID) {
            localStorage.setItem('userID', response.data.result.userID);
        }
      } else {
        throw new Error("Invalid token response");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userID');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- 3. SOCKET LOGIC ---
  useEffect(() => {
    if (user?.userID) {
      const socket = io(SOCKET_SERVER_URL, {
        query: { token: localStorage.getItem('authToken') }
      });

      socket.on('connect', () => {
        console.log(`✅ SOCKET CONNECTED: ${user.userID}`);
      });
      
      socket.on('userUpdated', (payload) => {
        if (payload.userId === user.userID) {
          fetchUserInfo();
        }
      });
      
      return () => {
        socket.disconnect();
      };
    }
  }, [user?.userID, fetchUserInfo]);

  // Gọi fetchUserInfo khi App khởi chạy
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  // --- 4. XỬ LÝ KHI ĐĂNG NHẬP THÀNH CÔNG ---
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData?.userID) {
        localStorage.setItem('userID', userData.userID);
    }

    const rawRole = userData.role?.roleName || userData.role?.name;
    
    // 🛑 KIỂM TRA ROLE: Nếu không có Role -> Hiển thị Toast lỗi đẹp & Logout
    if (!rawRole) {
        setToast({ 
            message: "Tài khoản của bạn chưa được cấp quyền (Role). Vui lòng liên hệ Admin!", 
            type: "error" 
        });
        
        localStorage.removeItem('authToken');
        setUser(null);
        return; // Dừng lại, không navigate
    }

    // Xử lý điều hướng chuẩn (Student/Lecturer/Admin)
    const roleKey = rawRole.toLowerCase(); 
    let path = 'student'; // Mặc định

    if (roleKey === 'admin') path = 'admin';
    else if (roleKey.includes('lecturer')) path = 'lecturer';
    // else path vẫn là student

    navigate(`/${path}/dashboard`, { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userID');
    setUser(null);
    navigate('/login');
  };
  
  // --- 5. LOGIC CHUYỂN HƯỚNG TRANG CHỦ ---
  const HomeRedirect = () => {
    if (isLoading) return <div className="loading">Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    const rawRole = user.role?.roleName || user.role?.name;
    
    // Nếu User F5 mà mất role -> Logout
    if (!rawRole) {
        localStorage.removeItem('authToken');
        return <Navigate to="/login" />;
    }

    const roleKey = rawRole.toLowerCase();
    let path = 'student';
    if (roleKey === 'admin') path = 'admin';
    else if (roleKey.includes('lecturer')) path = 'lecturer';
    
    return <Navigate to={`/${path}/dashboard`} />;
  };

  if (isLoading) {
    return <div className="loading">Initializing...</div>;
  }

  return (
    <div className="app-container">
      
      {/* 👈 HIỂN THỊ TOAST NẾU CÓ LỖI */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        
        <Route 
          path="/login" 
          element={user ? <HomeRedirect /> : <Login onLoginSuccess={handleLoginSuccess} />} 
        />
        <Route 
          path="/register" 
          element={user ? <HomeRedirect /> : <Register />} 
        />

        {/* --- Admin Routes --- */}
        <Route 
          path="/admin"
          element={
            <ProtectedRoute user={user} role="Admin">
              <AdminLayout user={user} onLogout={handleLogout} onUserRefresh={fetchUserInfo} />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagementPage onRefresh={fetchUserInfo} currentUserId={user?.userID} />} />
          <Route path="roles" element={<RoleManagementPage />} />
          <Route path="permissions" element={<PermissionManagementPage />} />
          <Route path="courses" element={<CourseManagementPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* --- Lecturer Routes --- */}
        <Route 
          path="/lecturer/dashboard" 
          element={
            <ProtectedRoute user={user} role="Lecturer">
              <LecturerDashboard user={user} onLogout={handleLogout} onRefresh={fetchUserInfo} />
            </ProtectedRoute>
          } 
        />
        
        {/* --- Student Routes --- */}
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute user={user} role="Student">
              <StudentDashboard user={user} onLogout={handleLogout} onRefresh={fetchUserInfo} />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;