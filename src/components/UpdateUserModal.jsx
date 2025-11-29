// src/components/UpdateUserModal.jsx
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
    roleId: '',
    password: '', // Thêm trường mật khẩu
  });
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
        roleId: user.role?.id || '',
        password: '', // Reset trường mật khẩu mỗi khi mở modal
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Tạo một bản sao của dữ liệu để gửi đi
      const dataToSend = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        birthDate: formData.birthDate,
        role: formData.roleId,
      };

      // Nếu mật khẩu rỗng, loại bỏ nó khỏi đối tượng gửi đi
      if (formData.password && formData.password.trim() !== '') {
        dataToSend.passwordHash = formData.password;
      }

      await userAPI.update(user.userID, dataToSend);
      setToast({ message: 'Cập nhật người dùng thành công!', type: 'success' });
      onUserUpdated();
      setTimeout(onClose, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật người dùng.';
      setError(errorMsg);
      setToast({ message: errorMsg, type: 'error' });
    }
  };
  
  if (!user) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '600px', 
          width: '100%', 
          maxHeight: '90vh', // Giới hạn chiều cao
          display: 'flex', 
          flexDirection: 'column' 
        }}>
        <div className="modal-header">
          <h2>Cập nhật Người dùng</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        {/* Phần body của modal sẽ cuộn được */}
        <div className="modal-body" style={{ overflowY: 'auto', padding: '20px' }}>
          <form id="update-user-form" onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Họ và Tên</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Mật khẩu mới</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange}  />
            </div>
            <div className="form-group">
              <label>Giới tính</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ngày sinh</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Vai trò</label>
              <select name="roleId" value={formData.roleId} onChange={handleChange} required>
                <option value="">Chọn vai trò</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <div className="form-actions" style={{ justifyContent: 'flex-end', width: '100%' }}>
            <button type="button" onClick={onClose} className="btn-cancel">Hủy</button>
            <button type="submit" form="update-user-form" className="btn-primary">Lưu thay đổi</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserModal;
