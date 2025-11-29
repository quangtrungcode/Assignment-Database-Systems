import React, { useState } from 'react';
import '../styles/Modal.css';
import { permissionAPI } from '../services/apiService';

const CreatePermissionModal = ({ onClose, onPermissionCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
      await permissionAPI.create(formData);
      onPermissionCreated();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Tạo quyền thất bại. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Tạo quyền mới</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p className="modal-error">{error}</p>}
          <div className="form-group">
            <label>Tên quyền (VD: CREATE_USER)</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo quyền'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePermissionModal;