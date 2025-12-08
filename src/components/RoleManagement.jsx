// src/components/RoleManagement.jsx
import React, { useState, useEffect } from 'react';
import { roleAPI, permissionAPI } from '../services/apiService';
import UpdateRoleModal from './UpdateRoleModal';
import Toast from './Toast';
import '../styles/Dashboard.css';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const rolesRes = await roleAPI.getAll();
      if (rolesRes.data?.code === 1000) {
        setRoles(rolesRes.data.result);
      } else {
        setRoles([]);
      }

      const permsRes = await permissionAPI.getAll();
      if (permsRes.data?.code === 1000) {
        setAllPermissions(permsRes.data.result);
      }
    } catch (err) {
      setError('Không thể tải dữ liệu.');
      setToast({ message: 'Không thể tải dữ liệu.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (role) => {
    setSelectedRole(role);
    setUpdateModalOpen(true);
  };

  const handleDelete = async (roleId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vai trò này?')) {
      try {
        await roleAPI.delete(roleId);
        setToast({ message: 'Xóa vai trò thành công!', type: 'success' });
        fetchData();
      } catch (err) {
        setToast({ message: 'Lỗi khi xóa vai trò.', type: 'error' });
      }
    }
  };
  
  const handleRoleUpdated = () => {
    fetchData();
    setToast({ message: 'Cập nhật vai trò thành công!', type: 'success' });
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="table-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <table>
        <thead>
          <tr>
            <th>Tên vai trò</th>
            <th>Mô tả</th>
            <th>Level</th> {/*  */}
            <th>Quyền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {roles.length > 0 ? (
            roles.map((role) => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>{role.description}</td>
                <td>{role.level}</td> {/*  */}
                <td>
                  <ul className="permissions-list-inline">
                    {role.permissions?.map(p => <li key={p.id}>{p.name}</li>)}
                  </ul>
                </td>
                <td>
                  <button className="btn-action btn-edit" onClick={() => handleEdit(role)}>Sửa</button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(role.id)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              {/*  */}
              <td colSpan="5">Không có vai trò nào.</td>
            </tr>
          )}
        </tbody>
      </table>
      {isUpdateModalOpen && (
        <UpdateRoleModal
          role={selectedRole}
          allPermissions={allPermissions}
          onClose={() => setUpdateModalOpen(false)}
          onRoleUpdated={handleRoleUpdated}
        />
      )}
    </div>
  );
};

export default RoleManagement;