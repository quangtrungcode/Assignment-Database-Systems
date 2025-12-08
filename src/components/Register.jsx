


import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { authAPI } from '../services/apiService';
import Toast from './Toast';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    passwordHash: '',
    confirmPassword: '',
    fullName: '',
    roleType: 'Student',
    gender: '',     
    phone: '',      
    birthDate: '',   
    major: '',       
    specialization: '', 
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isSubmitting = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    if (name === 'roleType') {
      setFormData(prev => ({
        ...prev,
        roleType: value,
        major: value === 'Student' ? prev.major : '',
        specialization: value === 'Lecturer' ? prev.specialization : '',
      }));
    }
  };

  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = null;

    switch (name) {
      case 'fullName':
        if (!value.trim()) error = "Họ tên không được để trống";
        else if (value.trim().length < 8) error = "Họ tên phải có ít nhất 8 ký tự";
        break;
      case 'email':
        
        if (!value.trim()) error = "Email không được để trống";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email không hợp lệ";
        break;
      case 'passwordHash':
        if (!value) error = "Mật khẩu không được để trống";
        else if (value.length < 8) error = "Mật khẩu phải có ít nhất 8 ký tự";
        break;
      case 'confirmPassword':
        if (formData.passwordHash !== value) error = "Mật khẩu xác nhận không khớp";
        break;
      case 'major':
       
        if ( !value.trim()) {
            error = "Vui lòng nhập ngành học";
        }
        break;
      case 'specialization':
       
        if ( !value.trim()) {
            error = "Vui lòng nhập chuyên môn";
        }
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

   
    const finalErrors = {};
    if (!formData.fullName.trim()) finalErrors.fullName = "Bắt buộc nhập";
    else if (formData.fullName.length < 8) finalErrors.fullName = "Tối thiểu 8 ký tự";

    if (!formData.email.trim()) finalErrors.email = "Bắt buộc nhập";
    
    if (!formData.passwordHash) finalErrors.passwordHash = "Bắt buộc nhập";
    else if (formData.passwordHash.length < 8) finalErrors.passwordHash = "Tối thiểu 8 ký tự";
    
    if (formData.passwordHash !== formData.confirmPassword) finalErrors.confirmPassword = "Mật khẩu không khớp";
    
    
    if (formData.roleType === 'Student' && !formData.major.trim()) finalErrors.major = "Vui lòng nhập ngành học";
    if (formData.roleType === 'Lecturer' && !formData.specialization.trim()) finalErrors.specialization = "Vui lòng nhập chuyên môn";

    setErrors(finalErrors);
    if (Object.keys(finalErrors).length > 0) {
      setToast({ message: "Vui lòng kiểm tra lại thông tin.", type: 'error' });
      isSubmitting.current = false;
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      
      const payload = {
        email: formData.email,
        passwordHash: formData.passwordHash,
        fullName: formData.fullName,
        roleType: formData.roleType,
        
        gender: formData.gender || null, 
        birthDate: formData.birthDate || null,
       
        phones: formData.phone ? [formData.phone] : [], 
      };

      if (formData.roleType === 'Student') payload.career = formData.major;
      else if (formData.roleType === 'Lecturer') payload.profession = formData.specialization;

     
      await authAPI.register(payload);

      setToast({ message: 'Đăng ký thành công! Đang chuyển hướng...', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);

    } catch (error) {
      console.error('Register error:', error);
      const apiError = error.response?.data;
      
      const newServerErrors = {};
      const generalMessages = []; 

      const processError = (err) => {
        if (!err || typeof err !== 'object') return;
        
        const backendMessage = err.message; 
        const code = err.code; 

        
        if (backendMessage) {
            generalMessages.push(backendMessage);
        }

      
        switch (code) {
          case 1004: 
          case 1007: 
          case 1015: 
            newServerErrors.email = backendMessage; 
            break;

          case 1002: 
          case 1006: 
          case 1008: 
            newServerErrors.fullName = backendMessage; 
            break;

          case 1005: 
          case 1009: 
            newServerErrors.passwordHash = backendMessage; 
            break;
            
          default: 
            generalMessages.push(backendMessage); 
            break;
        }
      };

      if (Array.isArray(apiError)) apiError.forEach(processError);
      else if (typeof apiError === 'object' && apiError !== null) processError(apiError);
      else generalMessages.push(error.message || 'Lỗi kết nối server.');

      if (Object.keys(newServerErrors).length > 0) setErrors(prev => ({ ...prev, ...newServerErrors }));
      if (generalMessages.length > 0) setToast({ message: generalMessages.join('; '), type: 'error' });

    } finally {
      setLoading(false); 
      isSubmitting.current = false;
    }
  };

  return (
    <div className="auth-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="auth-card">
        <h1>Đăng Ký</h1>
        <form onSubmit={handleSubmit} noValidate>
          {/*  */}
          <div className="form-group">
            <label>Họ và Tên <span className="required">*</span></label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} disabled={loading} placeholder="Ít nhất 8 ký tự" />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <label>Email <span className="required">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} disabled={loading} />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Mật Khẩu <span className="required">*</span></label>
            <div className="password-group">
              <input type={showPassword ? 'text' : 'password'} name="passwordHash" value={formData.passwordHash} onChange={handleChange} onBlur={handleBlur} disabled={loading} placeholder="Ít nhất 8 ký tự" />
              <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            {errors.passwordHash && <span className="error-message">{errors.passwordHash}</span>}
          </div>

          <div className="form-group">
            <label>Xác Nhận Mật Khẩu <span className="required">*</span></label>
            <div className="password-group">
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} disabled={loading} />
               <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}>
                {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          
          {/*  */}
          <div className="form-group">
            <label>Giới Tính</label>
            <select name="gender" value={formData.gender} onChange={handleChange} disabled={loading}>
              <option value="">-- Chọn --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label>Số Điện Thoại</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={loading} />
          </div>

          <div className="form-group">
            <label>Ngày Sinh</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} disabled={loading} />
          </div>

          {/*  */}
          <div className="form-group">
            <label>Vai Trò</label>
            <select name="roleType" value={formData.roleType} onChange={handleChange} disabled={loading}>
              <option value="">-- Chọn --</option>
              <option value="Student">Sinh viên</option>
              <option value="Lecturer">Giảng viên</option>
            </select>
          </div>

          {formData.roleType === 'Student' && (
            <div className="form-group">
              <label>Ngành Học <span className="required">*</span></label>
              <input type="text" name="major" value={formData.major} onChange={handleChange} onBlur={handleBlur}  disabled={loading} required/>
              {errors.major && <span className="error-message">{errors.major}</span>}
            </div>
          )}

          {formData.roleType === 'Lecturer' && (
            <div className="form-group">
              <label>Chuyên Môn <span className="required">*</span></label>
              <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} onBlur={handleBlur} disabled={loading} />
              {errors.specialization && <span className="error-message">{errors.specialization}</span>}
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </form>
        <p className="auth-link">
          Đã có tài khoản?{' '}
          <Link to="/login" className="btn-switch">Đăng nhập tại đây</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
