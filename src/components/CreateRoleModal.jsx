import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';
import { roleAPI, permissionAPI } from '../services/apiService';

const CreateRoleModal = ({ onClose, onRoleCreated, permissions }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: new Set(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permissionName) => {
    setFormData((prev) => {
      const newPermissions = new Set(prev.permissions);
      if (newPermissions.has(permissionName)) {
        newPermissions.delete(permissionName);
      } else {
        newPermissions.add(permissionName);
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        permissions: Array.from(formData.permissions), // Chuyển Set thành Array
      };
      await roleAPI.create(dataToSend);
      onRoleCreated();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Tạo vai trò thất bại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Tạo vai trò mới</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p className="modal-error">{error}</p>}
          <div className="form-group">
            <label>Tên vai trò (VD: student)</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Quyền</label>
            <div className="checkbox-group">
              {permissions.map((p) => (
                <label key={p.name} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.permissions.has(p.name)}
                    onChange={() => handlePermissionChange(p.name)}
                  />
                  {p.name}
                </label>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo vai trò'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoleModal;