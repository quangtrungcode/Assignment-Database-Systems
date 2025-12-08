

import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/apiService';
import '../styles/Modal.css';

const LecturerProfileModal = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '', 
    phone: '',
    gender: '',
    birthDate: '',
    profession: '', 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (user) {
      setError(null);
      setFieldErrors({});
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '', 
        phone: user.phone || '',
        gender: user.gender || '',
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
        profession: user.profession || '', 
      });
    }
  }, [user]);

 
  const handleBlur = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...fieldErrors };

    if (name === 'fullName') {
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            newErrors.fullName = "Họ và tên không được để trống";
        } else if (trimmedValue.length < 8) {
            newErrors.fullName = "Ít nhất 8 ký tự";
        } else {
            delete newErrors.fullName;
        }
    }

    setFieldErrors(newErrors);
  };

  const validateForm = () => {
    const errors = {};
    const name = formData.fullName ? formData.fullName.trim() : '';

    if (!name) {
        errors.fullName = "Họ và tên không được để trống";
    } else if (name.length < 8) {
        errors.fullName = "Ít nhất 8 ký tự";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (error) setError(null);
    
    if (fieldErrors[name]) {
        const newErrors = { ...fieldErrors };
        delete newErrors[name]; 
        setFieldErrors(newErrors);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return; 
    }

    setLoading(true);
    setError(null);

    try {
      
      const dataToSend = {
        fullName: formData.fullName, 
        email: formData.email || null,
        phone: formData.phone || null,
        gender: formData.gender || null,
        birthDate: formData.birthDate || null,
        profession: formData.profession || null,
        role: user.role?.roleName 
      };

      console.log("Dữ liệu gửi đi:", dataToSend); 

      await userAPI.updateProfile(user.userID, dataToSend);
      
      if (onUserUpdated) onUserUpdated(); 
      onClose();

    } catch (err) {
      const data = err.response?.data;
      let errorMessage = 'Cập nhật thất bại.';

      if (Array.isArray(data) && data.length > 0) {
        errorMessage = data.map(item => item.message).join(' - ');
      } else if (data && data.message) {
        errorMessage = data.message;
      } else if (typeof data === 'string') {
        errorMessage = data;
      }

      setError(errorMessage); 
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <h2>Hồ Sơ Giảng Viên</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
           {error && <div className="modal-error" style={{color: '#e74c3c', backgroundColor: '#fdecec', padding: '10px', margin: '10px 20px', borderRadius: '5px', textAlign: 'center', border: '1px solid #fadbd8'}}>{error}</div>}

          <div className="modal-body form-grid" style={{ overflowY: 'auto', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            
            <div className="form-group">
              <label>Họ và Tên <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange}
                onBlur={handleBlur} 
                required 
                style={fieldErrors.fullName ? { border: '1px solid #e74c3c' } : {}}
              />
              {fieldErrors.fullName && (
                <small style={{ color: '#e74c3c', marginTop: '5px', display: 'block', fontSize: '12px' }}>
                    {fieldErrors.fullName}
                </small>
              )}
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ngày sinh</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Đóng</button>
            <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu hồ sơ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LecturerProfileModal;