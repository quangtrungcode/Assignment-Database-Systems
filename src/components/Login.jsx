import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';
import { authAPI, userAPI } from '../services/apiService';
import Toast from './Toast';



function Login({ onLoginSuccess }) {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const submitting = useRef(false); // Ref to prevent double submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (submitting.current) return;

    if (!fullName || !password) {
      setToast({ message: 'Vui lòng điền đầy đủ thông tin!', type: 'error' });
      return;
    }

    submitting.current = true;
    setLoading(true);
    setToast(null);
    
    try {
      // Step 1: Login to get the token
      const loginResponse = await authAPI.login(fullName, password);
      
      if (loginResponse.data?.result?.token) {
        const token = loginResponse.data.result.token;
        localStorage.setItem('authToken', token);
        
        // Step 2: Use the token to get user info (which includes the role)
        const userResponse = await userAPI.getMyInfo();

        if (userResponse.data?.code === 1000) {
          // Step 3: Pass the full user object to the parent
          onLoginSuccess(userResponse.data.result);
        } else {
          throw new Error('Failed to fetch user data after login.');
        }
      } else {
        throw new Error('Login failed: No token received.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setToast({ message: errorMessage, type: 'error' });
      console.error('Login error:', err);
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  };

  return (
    <div className="auth-container">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="auth-card">
        <h1>Đăng Nhập</h1>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="fullName">Tên Người Dùng:</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật Khẩu:</label>
            <div className="password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password" // prevent autofill
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>

        <p className="auth-link">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="btn-switch">
            Đăng ký tại đây
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
