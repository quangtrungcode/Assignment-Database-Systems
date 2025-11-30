import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/apiService';
import '../styles/Modal.css';
// Không import Toast ở đây nữa, để Dashboard lo

const LecturerProfileModal = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '', 
    phone: '',
    gender: '',
    birthDate: '',
    profession: '', // Giữ lại state này để gửi đi
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setError(null);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (error) setError(null);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        birthDate: formData.birthDate,
        profession: formData.profession, // Gửi lại profession cũ
        role: user.role?.id 
      };

      // Gọi API cập nhật
      await userAPI.updateProfile(user.userID, dataToSend);
      
      // --- XỬ LÝ MƯỢT MÀ ---
      // 1. Gọi hàm refresh dữ liệu cha ngay lập tức
      if (onUserUpdated) onUserUpdated(); 
      
      // 2. Đóng Modal NGAY LẬP TỨC
      onClose();

    } catch (err) {
      // Xử lý lỗi thì hiện chữ đỏ trong form
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
           {/* Hiển thị lỗi text đỏ */}
           {error && <div className="modal-error" style={{color: '#e74c3c', backgroundColor: '#fdecec', padding: '10px', margin: '10px 20px', borderRadius: '5px', textAlign: 'center', border: '1px solid #fadbd8'}}>{error}</div>}

          <div className="modal-body form-grid" style={{ overflowY: 'auto', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            
            <div className="form-group">
              <label>Họ và Tên</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ngày sinh</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
            </div>

            {/* Đã xóa ô nhập Chuyên môn và Email theo yêu cầu */}

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