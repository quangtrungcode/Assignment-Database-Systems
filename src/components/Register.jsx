import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { authAPI } from '../services/apiService';
import Toast from './Toast';

// Updated error map based on backend definitions
const ERROR_MESSAGES = {
  9999: "Lỗi không xác định",
  1002: "Tên đăng nhập đã tồn tại",
  1004: "Email đã tồn tại",
  1003: "Người dùng không tồn tại",
  1005: "Mật khẩu phải có ít nhất 8 ký tự",
  1006: "Họ và tên phải có ít nhất 8 ký tự",
  1007: "Email không được để trống",
  1008: "Họ và tên không được để trống",
  1009: "Mật khẩu không được để trống",
  1010: "Chưa xác thực",
  1011: "Bạn không có quyền truy cập",
  1012: "Quyền hạn không tồn tại",
  1013: "Vai trò không tồn tại",
  1014: "Không thể xóa vì tài nguyên đang được tham chiếu",
};

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    passwordHash: '',
    confirmPassword: '',
    fullName: '',
    gender: '',
    phone: '',
    birthDate: '',
    roleType: 'student',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // Track interacted fields for real-time validation
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isSubmitting = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // As user types, clear any existing error for that field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = null;

    // Perform client-side validation for the specific field that was blurred
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = ERROR_MESSAGES[1008];
        else if (value.trim().length < 8) error = ERROR_MESSAGES[1006];
        break;
      case 'email':
        if (!value.trim()) error = ERROR_MESSAGES[1007];
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Địa chỉ email không hợp lệ";
        break;
      case 'passwordHash':
        if (!value) error = ERROR_MESSAGES[1009];
        else if (value.length < 8) error = ERROR_MESSAGES[1005];
        break;
      case 'confirmPassword':
        if (formData.passwordHash !== value) error = "Mật khẩu xác nhận không khớp";
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting.current) return;
    isSubmitting.current = true;


    // 1. Run a final, complete validation check
    const finalErrors = {};
    if (!formData.fullName.trim()) finalErrors.fullName = ERROR_MESSAGES[1008];
    else if (formData.fullName.trim().length < 8) finalErrors.fullName = ERROR_MESSAGES[1006];
    if (!formData.email.trim()) finalErrors.email = ERROR_MESSAGES[1007];
    else if (!/\S+@\S+\.\S+/.test(formData.email)) finalErrors.email = "Địa chỉ email không hợp lệ";
    if (!formData.passwordHash) finalErrors.passwordHash = ERROR_MESSAGES[1009];
    else if (formData.passwordHash.length < 8) finalErrors.passwordHash = ERROR_MESSAGES[1005];
    if (formData.passwordHash !== formData.confirmPassword) finalErrors.confirmPassword = "Mật khẩu xác nhận không khớp";

    setErrors(finalErrors);
    setTouched({ fullName: true, email: true, passwordHash: true, confirmPassword: true });

    if (Object.keys(finalErrors).length > 0) {
      setToast({ message: "Vui lòng kiểm tra lại các lỗi trong form.", type: 'error' });
      isSubmitting.current = false;
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      await authAPI.register({
        email: formData.email,
        passwordHash: formData.passwordHash,
        fullName: formData.fullName,
        gender: formData.gender || null,
        phone: formData.phone || null,
        birthDate: formData.birthDate || null,
        roleType: formData.roleType,
      });

      setToast({
        message: 'Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.',
        type: 'success',
      });

      setTimeout(() => navigate('/login'), 2000);

    } catch (error) {
      console.error('Register error:', error);
      const apiError = error.response?.data;
      
      const newServerErrors = {};
      const generalMessages = [];

      const processError = (err) => {
        if (typeof err !== 'object' || err === null) return;
        const message = err.message || ERROR_MESSAGES[err.code];
        if (!message) return;

        switch (err.code) {
          case 1004: case 1007: case 1015:
            newServerErrors.email = message; 
            break;
          case 1002: case 1006: case 1008:
            newServerErrors.fullName = message; 
            break;
          case 1005: case 1009:
            newServerErrors.passwordHash = message; 
            break;
          default: 
            generalMessages.push(message); 
            break;
        }
      };

      if (Array.isArray(apiError)) apiError.forEach(processError);
      else if (typeof apiError === 'object' && apiError !== null) processError(apiError);
      else generalMessages.push(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');

      const allMessages = [...Object.values(newServerErrors), ...generalMessages];

      if (Object.keys(newServerErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...newServerErrors }));
      }
      if (allMessages.length > 0) {
        setToast({ message: allMessages.join('; '), type: 'error' });
      }
    } finally {
      setLoading(false); // Always release loading state
      isSubmitting.current = false;
    }
  };

  return (
    <div className="auth-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="auth-card">
        <h1>Đăng Ký</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="fullName">Họ và Tên</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} disabled={loading} required minLength="8" placeholder="Ít nhất 8 ký tự" />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} disabled={loading} required placeholder="vi_du@email.com" />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="passwordHash">Mật Khẩu</label>
            <div className="password-group">
              <input type={showPassword ? 'text' : 'password'} id="passwordHash" name="passwordHash" value={formData.passwordHash} onChange={handleChange} onBlur={handleBlur} disabled={loading} required minLength="8" placeholder="Ít nhất 8 ký tự" />
              <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            {errors.passwordHash && <span className="error-message">{errors.passwordHash}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</label>
            <div className="password-group">
              <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} disabled={loading} required />
               <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}>
                {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Giới Tính</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} onBlur={handleBlur} disabled={loading}>
              <option value="">-- Chọn giới tính --</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Số Điện Thoại</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="birthDate">Ngày Sinh</label>
            <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} onBlur={handleBlur} disabled={loading} />
          </div>

          <div className="form-group">
            <label htmlFor="roleType">Vai Trò</label>
            <select id="roleType" name="roleType" value={formData.roleType} onChange={handleChange} onBlur={handleBlur} disabled={loading}>
              <option value="student">Sinh viên</option>
              <option value="lecturers">Giảng viên</option>
            </select>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </form>
        <p className="auth-link">
          Đã có tài khoản?{' '}
          <Link to="/login" className="btn-switch">
            Đăng nhập tại đây
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
