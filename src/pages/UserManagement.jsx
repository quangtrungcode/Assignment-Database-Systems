import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
import { userAPI, roleAPI } from '../services/apiService';
import Toast from '../components/Toast';
import CreateUserModal from '../components/CreateUserModal';
import UpdateUserModal from '../components/UpdateUserModal'; // Import
import ConfirmationModal from '../components/ConfirmationModal'; // Import ConfirmationModal
import '../styles/Dashboard.css';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false); // State for update modal
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false); // State for confirm modal
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [allRoles, setAllRoles] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null); // State for user to delete

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const userResponse = await userAPI.getAllUsers();
      if (Array.isArray(userResponse.data)) {
        setUsers(userResponse.data);
      } else {
        throw new Error('Dữ liệu người dùng trả về không hợp lệ.');
      }
      
      const roleResponse = await roleAPI.getAll();
      if (roleResponse.data?.code === 1000 && Array.isArray(roleResponse.data.result)) {
        setAllRoles(roleResponse.data.result);
      } else if (Array.isArray(roleResponse.data)) {
        setAllRoles(roleResponse.data);
      }

    } catch (error) {
      console.error("Failed to fetch data:", error);
      setToast({ message: error.message || 'Lỗi khi tải dữ liệu.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (isUpdateModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open'); // Cleanup on unmount
    };
  }, [isUpdateModalOpen]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleUserCreated = () => {
    setCreateModalOpen(false);
    setToast({ message: 'Tạo người dùng thành công!', type: 'success' });
    fetchAllData();
  };
  
  const handleUserUpdated = () => {
    setUpdateModalOpen(false);
    setToast({ message: 'Cập nhật người dùng thành công!', type: 'success' });
    fetchAllData();
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setUpdateModalOpen(true);
  };

  const handleDelete = async (userId) => {
    setUserToDelete(userId);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
        try {
            await userAPI.delete(userToDelete);
            setToast({ message: 'Xóa người dùng thành công!', type: 'success' });
            fetchAllData();
        } catch (err) {
            setToast({ message: 'Lỗi khi xóa người dùng.', type: 'error' });
        } finally {
            setConfirmModalOpen(false);
            setUserToDelete(null);
        }
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="dashboard-card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Quản Lý Người Dùng</h2>
          <button className="btn-primary" onClick={() => setCreateModalOpen(true)}>+ Tạo người dùng mới</button>
        </div>
        {loading ? (
          <p>Đang tải danh sách người dùng...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Họ Tên</th>
                  <th>Email</th>
                  <th>Vai Trò</th>
                  <th>Số điện thoại</th>
                  <th>Giới tính</th>
                  <th>Ngày sinh</th>
                  <th>Ngày tạo</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.userID}>
                    <td>{u.userID}</td>
                    <td>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td><span className="role-badge">{u.role?.name || 'N/A'}</span></td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>{u.gender || 'N/A'}</td>
                    <td>{formatDate(u.birthDate)}</td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <FaEdit
                          className="btn-action btn-edit"
                          onClick={() => handleEdit(u)}
                          title="Sửa"
                        />
                        <FaTrash
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(u.userID)}
                          title="Xóa"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isCreateModalOpen && (
        <CreateUserModal
          onClose={() => setCreateModalOpen(false)}
          onUserCreated={handleUserCreated}
          roles={allRoles}
        />
      )}
      {isUpdateModalOpen && (
        <UpdateUserModal
          user={selectedUser}
          roles={allRoles}
          onClose={() => setUpdateModalOpen(false)}
          onUserUpdated={handleUserUpdated}
        />
      )}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác."
      />
    </>
  );
};

export default UserManagementPage;
