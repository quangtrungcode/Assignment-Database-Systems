import React, { useState } from 'react';
import '../styles/Modal.css';
import { userAPI } from '../services/apiService';

const CreateUserModal = ({ onClose, onUserCreated, roles }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    gender: 'Male',
    birthDate: '',
    roleType: roles.length > 0 ? roles[0].name : '', // Đặt giá trị mặc định là vai trò đầu tiên hoặc rỗng
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // API yêu cầu `passwordHash`
      const dataToSend = {
        ...formData,
        passwordHash: formData.password, // Thêm passwordHash
      };
      delete dataToSend.password; // Xóa trường password không cần thiết

      await userAPI.createUser(dataToSend);
      onUserCreated(); // Gọi lại hàm để làm mới danh sách và đóng modal
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Tạo người dùng thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      console.error('Create user error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Tạo người dùng mới</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p className="modal-error">{error}</p>}
          <div className="modal-body">
            <div className="form-group">
              <label>Họ Tên</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Ngày sinh</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Giới tính</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>
            <div className="form-group">
              <label>Vai trò</label>
              <select name="roleType" value={formData.roleType} onChange={handleChange} required>
                {roles.length === 0 && <option value="">Đang tải vai trò...</option>}
                {roles.map((role) => (
                  <option key={role.name} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
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