import { useState, useEffect } from 'react';
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

const ProtectedRoute = ({ user, role, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role?.name !== role) {
    // Nếu có vai trò yêu cầu và vai trò người dùng không khớp, điều hướng
    return <Navigate to={`/${user.role?.name}/dashboard`} replace />;
  }

  return children;
};


function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await userAPI.getMyInfo();
          if (response.data?.code === 1000) {
            setUser(response.data.result);
          } else {
            // Token không hợp lệ hoặc hết hạn trên backend
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Điều hướng dựa trên vai trò trả về từ API
    navigate(`/${userData.role?.name}/dashboard`, { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };
  
  // Component điều hướng khi vào trang chủ
  const HomeRedirect = () => {
    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }
    if (!user) {
      return <Navigate to="/login" />;
    }
    // Điều hướng đến dashboard tương ứng với vai trò
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

        {/* --- Admin Routes with Layout --- */}
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
          {/* Redirect /admin to /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route 
          path="/lecturers/dashboard" 
          element={
            <ProtectedRoute user={user} role="lecturers">
              <LecturerDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute user={user} role="student">
              <StudentDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;