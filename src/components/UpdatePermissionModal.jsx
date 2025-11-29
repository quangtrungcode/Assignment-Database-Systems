// src/components/UpdatePermissionModal.jsx
import React, { useState, useEffect } from 'react';
import { permissionAPI } from '../services/apiService';
import '../styles/Modal.css';
import Toast from './Toast';

const UpdatePermissionModal = ({ permission, onClose, onPermissionUpdated }) => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (permission) {
      setDescription(permission.description);
    }
  }, [permission]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const updatedPermission = { description }; // Only send description
      await permissionAPI.update(permission.name, updatedPermission); 
      setToast({ message: 'Cập nhật quyền thành công!', type: 'success' });
      onPermissionUpdated();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật quyền.';
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  if (!permission) return null;

  return (
    <div className="modal-overlay">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="modal-content">
        <div className="modal-header">
          <h2>Cập nhật quyền</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="permissionDescription">Mô tả</label>
            <textarea
              id="permissionDescription"
              className="modal-textarea" // Added class for styling
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
