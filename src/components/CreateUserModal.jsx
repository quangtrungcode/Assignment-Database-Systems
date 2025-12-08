


import React, { useState, useEffect, useMemo, useRef } from 'react';
import '../styles/Modal.css';
import { userAPI } from '../services/apiService';
import Toast from './Toast';

const CreateUserModal = ({ onClose, onUserCreated, roles }) => {
  const filteredRoles = useMemo(() => {
    return roles ? roles.filter(r => {
      const rName = r.roleName || r.name || '';
      return rName.toLowerCase() !== 'admin'; 
    }) : [];
  }, [roles]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    birthDate: '',
    roleType: '', 
    major: '', 
    specialization: '', 
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const isSubmitting = useRef(false);

  useEffect(() => {
    setErrors({});
    setToast(null);
    setLoading(false);
  }, [filteredRoles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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
      case 'password':
        if (!value) error = "Mật khẩu không được để trống";
        else if (value.length < 8) error = "Mật khẩu phải có ít nhất 8 ký tự";
        break;
     
      case 'major':
        if (formData.roleType === 'Student' && !value.trim()) {
            error = "Vui lòng nhập ngành học";
        }
        break;
      case 'specialization':
        if (formData.roleType === 'Lecturer' && !value.trim()) {
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
    else if (!/\S+@\S+\.\S+/.test(formData.email)) finalErrors.email = "Email không hợp lệ";
    
    if (!formData.password) finalErrors.password = "Bắt buộc nhập";
    else if (formData.password.length < 8) finalErrors.password = "Tối thiểu 8 ký tự";

    
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
      const dataToSend = {
        fullName: formData.fullName,
        email: formData.email,
        passwordHash: formData.password,
       
        roleType: formData.roleType || null, 
        gender: formData.gender || null,
        birthDate: formData.birthDate || null,
        phones: formData.phone ? [formData.phone] : [],
      };
      
      if (formData.roleType === 'Student') {
        dataToSend.career = formData.major;
      } else if (formData.roleType === 'Lecturer') {
        dataToSend.profession = formData.specialization;
      }

      await userAPI.createUser(dataToSend);
      
      setToast({ message: 'Tạo người dùng thành công!', type: 'success' });
      onUserCreated(); 
      
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Create User error:', error);
      const apiError = error.response?.data;
      
      const newServerErrors = {};
      const toastMessages = []; 

      const processError = (err) => {
        if (!err || typeof err !== 'object') return;
        
        const backendMessage = err.message || "Lỗi hệ thống chưa xác định";
        const code = err.code; 

        toastMessages.push(backendMessage);

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
            newServerErrors.password = backendMessage; 
            break;
            
          default: 
            break;
        }
      };

      if (Array.isArray(apiError)) {
        apiError.forEach(processError);
      } else if (typeof apiError === 'object' && apiError !== null) {
        processError(apiError);
      } else {
        toastMessages.push(error.message || 'Lỗi kết nối server.');
      }

      if (Object.keys(newServerErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...newServerErrors }));
      }
      
      if (toastMessages.length > 0) {
        setToast({ message: toastMessages.join('\n'), type: 'error' });
      }

    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <div className="modal-overlay">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="modal-content">
        <div className="modal-header">
          <h2>Tạo người dùng mới</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body form-grid">
            
            <div className="form-group">
              <label>Họ Tên <span className="required">*</span></label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} disabled={loading} required className={errors.fullName ? 'input-error' : ''} placeholder="Ít nhất 8 ký tự" />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>
            
            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} disabled={loading} required className={errors.email ? 'input-error' : ''} />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Mật khẩu <span className="required">*</span></label>
              <div className="password-input-wrapper" style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} disabled={loading} required style={{ paddingRight: '40px' }} className={errors.password ? 'input-error' : ''} placeholder="Ít nhất 8 ký tự" />
                <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center' }}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </span>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={loading} /> 
            </div>
            
            <div className="form-group">
              <label>Ngày sinh</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} disabled={loading} />
            </div>
            
            <div className="form-group">
              <label>Giới tính</label>
              <select name="gender" value={formData.gender} onChange={handleChange} disabled={loading}>
                <option value="">-- Chọn --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            
            {/* ---  * --- */}
            <div className="form-group form-group-span-2">
              <label>Vai trò</label>
              <select 
                name="roleType" 
                value={formData.roleType} 
                onChange={handleChange} 
                onBlur={handleBlur}
                disabled={loading}
                
                className={errors.roleType ? 'input-error' : ''}
              >
                <option value="">-- Chọn vai trò (Không bắt buộc) --</option>
                
                {(!filteredRoles || filteredRoles.length === 0) ? (
                   null 
                ) : (
                  filteredRoles.map((role) => {
                      const rName = role.roleName || role.name || '';
                      return (
                          <option key={role.id || rName} value={rName}>
                              {rName}
                          </option>
                      );
                  })
                )}
              </select>
              {/* */}
              {errors.roleType && <span className="error-message">{errors.roleType}</span>}
            </div>

            {formData.roleType === 'Student' && (
              <div className="form-group form-group-span-2" style={{animation: 'fadeIn 0.3s'}}>
                <label>Ngành Học <span className="required">*</span></label>
                <input type="text" name="major" value={formData.major} onChange={handleChange} onBlur={handleBlur} disabled={loading} required placeholder="Ví dụ: Công nghệ thông tin..." className={errors.major ? 'input-error' : ''} />
                {errors.major && <span className="error-message">{errors.major}</span>}
              </div>
            )}

            {formData.roleType === 'Lecturer' && (
              <div className="form-group form-group-span-2" style={{animation: 'fadeIn 0.3s'}}>
                <label>Chuyên Môn <span className="required">*</span></label>
                <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} onBlur={handleBlur} disabled={loading} required placeholder="Ví dụ: Tiến sĩ Toán học..." className={errors.specialization ? 'input-error' : ''} />
                {errors.specialization && <span className="error-message">{errors.specialization}</span>}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo người dùng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;