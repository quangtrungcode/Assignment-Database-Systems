

import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/apiService';
import '../styles/Modal.css';
import Toast from './Toast';

const UpdateUserModal = ({ user, roles, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    birthDate: '',
    roleName: '', 
    password: '',
    career: '',
    profession: '',
  });

  const [selectedRoleName, setSelectedRoleName] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      setErrors({});
      setToast(null);
      setLoading(false);

      const backendRoleName = user.role?.roleName || user.role?.name || '';
      
      
      const phoneValue = (user.phones && user.phones.length > 0) ? user.phones[0] : (user.phone || '');

      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: phoneValue, 
        gender: user.gender || '',
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
        roleName: backendRoleName,
        password: '', 
        career: user.career || '',
        profession: user.profession || '',
      });

      if (backendRoleName) {
        setSelectedRoleName(backendRoleName.toLowerCase().trim());
      }
    }
  }, [user, roles]);

  
  const validateField = (name, value) => {
    let errorMsg = '';
    const rawVal = value ? String(value) : ''; 
    const trimmedVal = rawVal.trim();

    switch (name) {
      case 'fullName':
        if (trimmedVal.length === 0) {
          errorMsg = 'Họ và tên không được để trống.';
        } else if (trimmedVal.length < 8) {
          errorMsg = 'Họ và tên phải có ít nhất 8 ký tự.';
        }
        break;
      
      case 'email':
        if (trimmedVal.length === 0) {
           errorMsg = 'Email không được để trống.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedVal)) {
           errorMsg = 'Email không đúng định dạng.';
        }
        break;

      case 'password':
        if (rawVal.length > 0 && rawVal.length < 8) {
          errorMsg = 'Mật khẩu phải có ít nhất 8 ký tự.';
        }
        break;

      default:
        break;
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'roleName') {
      const roleNameLower = value.toLowerCase().trim();
      setSelectedRoleName(roleNameLower);
      
      setFormData(prev => ({
        ...prev,
        roleName: value,
        career: roleNameLower === 'student' ? prev.career : '',
        profession: roleNameLower === 'lecturer' ? prev.profession : ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    
    const newErrors = {};
    newErrors.fullName = validateField('fullName', formData.fullName);
    newErrors.email = validateField('email', formData.email); 
    if (formData.password) newErrors.password = validateField('password', formData.password);
    
    Object.keys(newErrors).forEach(key => { if (!newErrors[key]) delete newErrors[key]; });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      
      const toNullIfEmpty = (val) => (!val || String(val).trim() === '') ? null : String(val).trim();
      
      
      const payload = {
        fullName: toNullIfEmpty(formData.fullName),
        email: formData.email.trim(), 
        
       
        phones: formData.phone && formData.phone.trim() ? [formData.phone.trim()] : [],

        gender: toNullIfEmpty(formData.gender),
        birthDate: toNullIfEmpty(formData.birthDate),
        role: toNullIfEmpty(formData.roleName), 
        
        
        passwordHash: toNullIfEmpty(formData.password)
      };

      
      if (selectedRoleName === 'student') {
        payload.career = toNullIfEmpty(formData.career);
        payload.profession = null; 
      } else if (selectedRoleName === 'lecturer') {
        payload.profession = toNullIfEmpty(formData.profession);
        payload.career = null; 
      } else {
        
        payload.career = null;
        payload.profession = null;
      }

      console.log('Update Payload (Full):', payload);

      await userAPI.update(user.userID, payload);
      setToast({ message: 'Cập nhật thành công!', type: 'success' });
      onUserUpdated(); 
      setTimeout(onClose, 1500);

    } catch (err) {
      const data = err.response?.data;
      
      let errorList = [];
      if (Array.isArray(data)) {
        errorList = data;
      } else if (data && data.code) {
        errorList = [data];
      }

      const newFieldErrors = {}; 
      const allToastMessages = []; 

      if (errorList.length > 0) {
        errorList.forEach(errItem => {
          const { code, message } = errItem;
          if (message) allToastMessages.push(message);

          switch (code) {
            case 1004: case 1007: case 1015:
              newFieldErrors.email = message;
              break;
            case 1006: case 1008:
              newFieldErrors.fullName = message;
              break;
            case 1005: case 1009:
              newFieldErrors.password = message;
              break;
            case 1025: case 1013:
               newFieldErrors.roleName = message; 
               break;
            default:
              break;
          }
        });
      } else {
        const fallbackMsg = typeof data === 'string' ? data : 'Cập nhật thất bại.';
        allToastMessages.push(fallbackMsg);
      }

      if (Object.keys(newFieldErrors).length > 0) {
        setErrors(newFieldErrors);
      }

      if (allToastMessages.length > 0) {
        setToast({ message: allToastMessages.join('\n'), type: 'error' });
      }

    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="modal-content" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <h2>Cập nhật Người dùng</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="modal-body form-grid" style={{ overflowY: 'auto', padding: '20px' }}>
            
            <div className="form-group">
              <label>Họ và Tên <span style={{color:'red'}}>*</span></label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} className={errors.fullName ? 'input-error' : ''} placeholder="Nhập họ tên" />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>Email <span style={{color:'red'}}>*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={errors.email ? 'input-error' : ''} />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Mật khẩu mới</label>
              <div className="password-input-wrapper" style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} className={errors.password ? 'input-error' : ''} placeholder="Để trống nếu không đổi" style={{ paddingRight: '40px' }} />
                <span onClick={togglePasswordVisibility} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>{showPassword ? "👁️" : "👁️‍🗨️"}</span>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">(Trống - Update Null)</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ngày sinh</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Vai trò</label>
              <select name="roleName" value={formData.roleName} onChange={handleChange} className={errors.roleName ? 'input-error' : ''}>
                <option value="">Chọn vai trò</option>
                {roles
                  .filter(role => role.roleName !== 'Admin') 
                  .map((role) => (
                    <option key={role.roleName} value={role.roleName}>
                      {role.description || role.roleName} 
                    </option>
                  ))
                }
              </select>
              {errors.roleName && <span className="error-text">{errors.roleName}</span>}
            </div>

            {selectedRoleName === 'student' && (
              <div className="form-group" style={{ animation: 'fadeIn 0.3s' }}>
                <label>Ngành học</label>
                <input type="text" name="career" value={formData.career} onChange={handleChange} placeholder="Nhập ngành học" />
              </div>
            )}

            {selectedRoleName === 'lecturer' && (
              <div className="form-group" style={{ animation: 'fadeIn 0.3s' }}>
                <label>Chuyên môn</label>
                <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="Nhập chuyên môn" />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Hủy</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;