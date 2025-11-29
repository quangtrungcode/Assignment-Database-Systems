import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { roleAPI, permissionAPI } from '../services/apiService';
import Toast from '../components/Toast';
import CreateRoleModal from '../components/CreateRoleModal';
import UpdateRoleModal from '../components/UpdateRoleModal';
import ConfirmationModal from '../components/ConfirmationModal';
import '../styles/Dashboard.css';

const RoleManagementPage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRoleModalOpen, setRoleModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [allPermissions, setAllPermissions] = useState([]);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('');

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        roleAPI.getAll(),
        permissionAPI.getAll()
      ]);

      if (rolesRes.data?.code === 1000 && Array.isArray(rolesRes.data.result)) {
        setRoles(rolesRes.data.result);
      } else {
        setToast({ message: 'Không thể tải danh sách vai trò.', type: 'error' });
      }

      if (permissionsRes.data?.code === 1000 && Array.isArray(permissionsRes.data.result)) {
        setAllPermissions(permissionsRes.data.result);
      } else {
        setToast({ message: 'Không thể tải danh sách quyền.', type: 'error' });
      }

    } catch (error) {
      console.error("Failed to fetch data:", error);
      setToast({ message: 'Lỗi khi tải dữ liệu.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const filteredRoles = roles.filter(role =>
    (role.name && role.name.toLowerCase().includes(filter.toLowerCase())) ||
    (role.description && role.description.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleRoleCreated = () => {
    setRoleModalOpen(false);
    setToast({ message: 'Tạo vai trò thành công!', type: 'success' });
    fetchAllData();
  };

  const handleRoleUpdated = async (updatedData) => {
    setUpdateModalOpen(false); // Đóng modal ngay lập tức để tránh re-render không mong muốn
    try {
      // Backend chỉ nhận tên vai trò và danh sách quyền
      await roleAPI.update(updatedData.originalName, {
        name: updatedData.newName,
        permissions: updatedData.permissions,
      });
      fetchAllData(); // Tải lại danh sách vai trò sau khi cập nhật
      setToast({ message: 'Cập nhật vai trò thành công!', type: 'success' });
    } catch (error) {
      console.error("Failed to update role:", error);
      setToast({ message: 'Lỗi khi cập nhật vai trò.', type: 'error' });
    }
  };

  const handleEdit = (role) => {
    // Tạo một bản sao sâu để selectedRole không bị ảnh hưởng bởi các lần render lại của danh sách roles
    setSelectedRole(JSON.parse(JSON.stringify(role)));
    setUpdateModalOpen(true);
  };

  const handleDelete = (roleId) => {
    setRoleToDelete(roleId);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (roleToDelete) {
      try {
        await roleAPI.delete(roleToDelete);
        setToast({ message: 'Xóa vai trò thành công!', type: 'success' });
        fetchAllData();
      } catch (err) {
        setToast({ message: 'Lỗi khi xóa vai trò.', type: 'error' });
      } finally {
        setConfirmModalOpen(false);
        setRoleToDelete(null);
      }
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="dashboard-card">
        <div className="card-header">
          <h2>Quản Lý Vai Trò</h2>
          <button className="btn-primary" onClick={() => setRoleModalOpen(true)}>+ Tạo vai trò mới</button>
        </div>

        <div className="filter-container" style={{ marginTop: '20px' }}>
          <input type="text" placeholder="Lọc theo tên hoặc mô tả vai trò..." value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-input" />
        </div>

        {loading ? <p>Đang tải...</p> : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Tên Vai Trò</th>
                  <th style={{ width: '35%' }}>Mô Tả</th>
                  <th style={{ width: '35%' }}>Quyền</th>
                  <th style={{ width: '120px' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role) => (
                  <tr key={role.name}>
                    <td>{role.name}</td>
                    <td>{role.description}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {(role.permissions && role.permissions.length > 0)
                        ? role.permissions.map(p => p.name).join(', ')
                        : <span style={{ color: '#888' }}>Chưa có quyền</span>}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <FaPencilAlt className="btn-action btn-edit" onClick={() => handleEdit(role)} title="Sửa" />
                        <FaTrashAlt className="btn-action btn-delete" onClick={() => handleDelete(role.id)} title="Xóa" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isRoleModalOpen && (
        <CreateRoleModal onClose={() => setRoleModalOpen(false)} onRoleCreated={handleRoleCreated} permissions={allPermissions} />
      )}
      {isUpdateModalOpen && (
        <UpdateRoleModal
          role={selectedRole}
          allPermissions={allPermissions}
          onClose={() => setUpdateModalOpen(false)}
          onRoleUpdated={handleRoleUpdated}
        />
      )}
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={confirmDelete} title="Xác nhận xóa" message="Bạn có chắc chắn muốn xóa vai trò này?" />
    </>
  );
};

export default RoleManagementPage;
