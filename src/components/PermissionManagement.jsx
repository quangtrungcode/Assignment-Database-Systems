// src/components/PermissionManagement.jsx
import React, { useState, useEffect } from 'react';
import { permissionAPI } from '../services/apiService';
import UpdatePermissionModal from './UpdatePermissionModal';
import Toast from './Toast';
import '../styles/Dashboard.css'; // Sử dụng chung file CSS

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await permissionAPI.getAll();
      if (response.data?.code === 1000) {
        setPermissions(response.data.result);
      } else {
        setPermissions([]);
      }
    } catch (err) {
      setError('Không thể tải danh sách quyền.');
      setToast({ message: 'Không thể tải danh sách quyền.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleEdit = (permission) => {
    setSelectedPermission(permission);
    setUpdateModalOpen(true);
  };

  const handleDelete = async (permissionId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa quyền này?')) {
      try {
        await permissionAPI.delete(permissionId);
        setToast({ message: 'Xóa quyền thành công!', type: 'success' });
        fetchPermissions(); // Tải lại danh sách
      } catch (err) {
        setToast({ message: 'Lỗi khi xóa quyền.', type: 'error' });
      }
    }
  };
  
  const handlePermissionUpdated = () => {
    fetchPermissions();
    setToast({ message: 'Cập nhật quyền thành công!', type: 'success' });
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="table-container">
       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <table>
        <thead>
          <tr>
            <th>Tên quyền</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {permissions.length > 0 ? (
            permissions.map((permission) => (
              <tr key={permission.id}>
                <td>{permission.name}</td>
                <td>{permission.description}</td>
                <td>
                  <button className="btn-action btn-edit" onClick={() => handleEdit(permission)}>Sửa</button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(permission.id)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Không có quyền nào.</td>
            </tr>
          )}
        </tbody>
      </table>
      {isUpdateModalOpen && (
        <UpdatePermissionModal
          permission={selectedPermission}
          onClose={() => setUpdateModalOpen(false)}
          onPermissionUpdated={handlePermissionUpdated}
        />
      )}
    </div>
  );
};

export default PermissionManagement;
