// src/components/UpdatePermissionModal.jsx
import React, { useState, useEffect } from 'react';
import { permissionAPI } from '../services/apiService';
import '../styles/Modal.css';
import Toast from './Toast';

const UpdatePermissionModal = ({ permission, onClose, onPermissionUpdated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (permission) {
      setName(permission.name);
      setDescription(permission.description);
    }
  }, [permission]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const updatedPermission = { name, description };
      await permissionAPI.update(permission.id, updatedPermission); // Giả sử có hàm update
      setToast({ message: 'Cập nhật quyền thành công!', type: 'success' });
      onPermissionUpdated();
      setTimeout(onClose, 1500); // Đóng modal sau khi thông báo toast hiển thị
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật quyền.');
      setToast({ message: error, type: 'error' });
    }
  };

  if (!permission) return null;

  return (
    <div className="modal-backdrop">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="modal-content">
        <div className="modal-header">
          <h2>Cập nhật quyền</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="permissionName">Tên quyền</label>
            <input
              id="permissionName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="permissionDescription">Mô tả</label>
            <textarea
              id="permissionDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Hủy</button>
            <button type="submit" className="btn-primary">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePermissionModal;
