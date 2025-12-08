// src/components/PermissionManagement.jsx
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; 
import { permissionAPI } from '../services/apiService';
import UpdatePermissionModal from './UpdatePermissionModal';
import ConfirmationModal from './ConfirmationModal'; 
import Toast from './Toast';
import '../styles/Dashboard.css'; 

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); 
  const [permissionToDeleteId, setPermissionToDeleteId] = useState(null); 

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
      let errorMessage = 'Đã xảy ra lỗi không xác định.'; 
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.request) {
        errorMessage = 'Không thể kết nối đến máy chủ để tải danh sách quyền. Vui lòng kiểm tra kết nối mạng của bạn.';
      } else if (err.message) {
        errorMessage = `Lỗi tải quyền: ${err.message}. Vui lòng thử lại.`;
      }
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
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

  const handleDelete = (permissionId) => {
    setPermissionToDeleteId(permissionId);
    setShowConfirmationModal(true);
  };

  const confirmDelete = async () => {
    if (!permissionToDeleteId) return;

    try {
      await permissionAPI.delete(permissionToDeleteId);
      setToast({ message: 'Xóa quyền thành công!', type: 'success' });
      fetchPermissions(); 
    } catch (err) {
      let errorMessage = 'Đã xảy ra lỗi không xác định.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.request) {
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.';
      } else if (err.message) {
        errorMessage = `Lỗi: ${err.message}. Vui lòng thử lại.`;
      }
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setShowConfirmationModal(false);
      setPermissionToDeleteId(null);
    }
  };
  
  const handlePermissionUpdated = () => {
    fetchPermissions();
    setToast({ message: 'Cập nhật quyền thành công!', type: 'success' });
    window.scrollTo(0, 0);
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
                  <button className="btn-action btn-edit" onClick={() => handleEdit(permission)}><FaEdit /></button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(permission.name)}><FaTrash /></button>
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
      {showConfirmationModal && (
        <ConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={confirmDelete}
          title="Xác nhận xóa quyền"
          message={`Bạn có chắc chắn muốn xóa quyền "${permissionToDeleteId}" này không?`}
        />
      )}
    </div>
  );
};

export default PermissionManagement;
