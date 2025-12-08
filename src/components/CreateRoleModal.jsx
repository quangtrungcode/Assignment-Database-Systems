

import React, { useState, useEffect } from 'react';
import { roleAPI } from '../services/apiService';
import '../styles/Modal.css';

const CreateRoleModal = ({ onClose, onRoleCreated, permissions = [] }) => {
  const [formData, setFormData] = useState({
    roleName: '', 
    description: '',
    level: '', 
    permissions: new Set(),
  });
  
  
  const [errors, setErrors] = useState({});
  
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState(null); 

  const processedPermissions = permissions.map((p, index) => ({
    ...p,
    displayName: p.permissionName || p.name || 'Unnamed Permission',
    uniqueValue: p.permissionName || p.name
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    
    if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'roleName') {
        if (!value || !value.trim()) {
            setErrors((prev) => ({ ...prev, roleName: 'Tên vai trò không được để trống' }));
        }
    }
  };

  const handlePermissionChange = (permValue) => {
    setFormData((prev) => {
      const newPermissions = new Set(prev.permissions);
      if (newPermissions.has(permValue)) {
        newPermissions.delete(permValue);
      } else {
        newPermissions.add(permValue);
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError(null);

   
    const rawRoleName = formData.roleName;
    if (!rawRoleName || !rawRoleName.trim()) {
      setErrors({ roleName: 'Tên vai trò không được để trống' });
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        roleName: formData.roleName.trim(),
        description: formData.description && formData.description.trim() !== '' 
            ? formData.description.trim() 
            : null,
        level: formData.level !== '' && formData.level !== null 
            ? parseInt(formData.level, 10) 
            : null,
        permissions: Array.from(formData.permissions) 
      };

      console.log('Payload tạo Role:', dataToSend);

      await roleAPI.create(dataToSend);
      onRoleCreated(); 
    } catch (err) {
      console.error('Role creation failed:', err);
     
      const errorMessage = err.response?.data?.message || 'Tạo vai trò thất bại.';
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '600px', maxWidth: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <h2>Tạo Vai Trò Mới</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <div className="modal-body" style={{ overflowY: 'auto', padding: '20px' }}>
          <form id="create-role-form" onSubmit={handleSubmit}>
            {/* */}
            {generalError && <div className="modal-error" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{generalError}</div>}
            
            {/* */}
            <div className="form-group">
              <label>Tên vai trò <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="roleName"
                value={formData.roleName}
                onChange={handleChange}
               
                onBlur={handleBlur}
                placeholder="Ví dụ: Staff, Manager..."
                disabled={loading}
                
                className={errors.roleName ? 'input-error' : ''}
                style={errors.roleName ? { borderColor: 'red' } : {}}
              />
              {/*  */}
              {errors.roleName && (
                  <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                      {errors.roleName}
                  </div>
              )}
            </div>

            {/* */}
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả chức năng của vai trò này..."
                rows={3}
                disabled={loading}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            {/*  */}
            <div className="form-group">
              <label>Cấp bậc (Level)</label>
              <input
                type="number"
                name="level"
                value={formData.level}
                onChange={handleChange}
                disabled={loading}
                placeholder="Nhập số cấp bậc (VD: 1, 2...)"
              />
            </div>

            {/* */}
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '10px' }}>Phân quyền chức năng:</label>
              <div 
                className="permissions-container" 
                style={{ 
                  border: '1px solid #eee', 
                  borderRadius: '6px', 
                  padding: '15px', 
                  maxHeight: '250px', 
                  overflowY: 'auto',
                  backgroundColor: '#f9f9f9',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '10px'
                }}
              >
                {processedPermissions.length > 0 ? (
                  processedPermissions.map((perm, index) => (
                    <label 
                      key={index} 
                      className="permission-item"
                      style={{ 
                        display: 'flex', alignItems: 'center', cursor: 'pointer',
                        fontSize: '14px', padding: '5px'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.has(perm.uniqueValue)}
                        onChange={() => handlePermissionChange(perm.uniqueValue)}
                        disabled={loading}
                        style={{ marginRight: '8px', width: '16px', height: '16px' }}
                      />
                      {perm.displayName}
                    </label>
                  ))
                ) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999', padding: '20px' }}>
                    Không có dữ liệu quyền hạn.
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
            Hủy
          </button>
          <button type="submit" form="create-role-form" className="btn-primary" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Tạo mới'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleModal;
