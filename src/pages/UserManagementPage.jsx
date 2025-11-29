import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { userAPI, roleAPI } from '../services/apiService';
import Toast from '../components/Toast';
import CreateUserModal from '../components/CreateUserModal';
import UpdateUserModal from '../components/UpdateUserModal';
import ConfirmationModal from '../components/ConfirmationModal';
import '../styles/Dashboard.css';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [allRoles, setAllRoles] = useState([]);
  const [filters, setFilters] = useState({
    userID: '',
    email: '',
    fullName: '',
    gender: '',
    phone: '',
    roleId: '',
    birthDateFrom: '',
    birthDateTo: '',
    createdAtFrom: '',
    createdAtTo: '',
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Tạo một bản sao của filters để xử lý
      const processedFilters = { ...filters };

      // Xử lý trường giới tính: chuyển từ tiếng Việt sang tiếng Anh và chuẩn hóa
      if (processedFilters.gender) {
        const genderLower = processedFilters.gender.toLowerCase();
        if (genderLower === 'nam') {
          processedFilters.gender = 'Male';
        } else if (genderLower === 'nữ') {
          processedFilters.gender = 'Female';
        } else if (genderLower === 'khác') {
          processedFilters.gender = 'Other';
        }
        // Nếu người dùng nhập thẳng tiếng Anh, nó sẽ được giữ nguyên
      }

      // Lọc ra các giá trị không rỗng để gửi đi
      const searchCriteria = Object.fromEntries(Object.entries(processedFilters).filter(([_, v]) => v !== ''));
      const response = await userAPI.search(searchCriteria);
      // Kiểm tra cấu trúc response từ API search
      if (response.data?.code === 1000 && Array.isArray(response.data.result)) {
        setUsers(response.data.result); // Lấy dữ liệu từ thuộc tính 'result'
      } else {
        console.error("Dữ liệu tìm kiếm trả về không hợp lệ:", response.data);
        setUsers([]); // Nếu không có kết quả hoặc lỗi, hiển thị bảng rỗng
      }
    } catch (error) {
      setToast({ message: 'Lỗi khi tìm kiếm người dùng.', type: 'error' });
      setUsers([]); // Dọn dẹp danh sách người dùng khi có lỗi
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setUpdateModalOpen(true);
  };

  const handleDelete = (userId) => {
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

  // Hàm tìm tên vai trò dựa trên ID
  const getRoleName = (user) => {
    if (user.role?.name) return user.role.name; // Ưu tiên cấu trúc có sẵn
    const role = allRoles.find(r => r.id === user.roleId);
    return role?.name || 'N/A';
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="dashboard-card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Quản Lý Người Dùng</h2>
          <div>
            <button className="btn-secondary" style={{ marginRight: '10px' }} onClick={() => setIsFilterVisible(!isFilterVisible)}>
              {isFilterVisible ? 'Ẩn Bộ Lọc' : 'Hiện Bộ Lọc'}
            </button>
            <button className="btn-primary" onClick={() => setCreateModalOpen(true)}>+ Tạo người dùng mới</button>
          </div>
        </div>

        {isFilterVisible && (
          <div className="filter-container">
            <div className="filter-grid">
              <input type="text" name="userID" placeholder="User ID" value={filters.userID} onChange={handleFilterChange} className="filter-input" />
              <input type="text" name="fullName" placeholder="Họ Tên" value={filters.fullName} onChange={handleFilterChange} className="filter-input" />
              <input type="email" name="email" placeholder="Email" value={filters.email} onChange={handleFilterChange} className="filter-input" />
              <input type="text" name="phone" placeholder="Số điện thoại" value={filters.phone} onChange={handleFilterChange} className="filter-input" />
              <select name="gender" value={filters.gender} onChange={handleFilterChange} className="filter-input">
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              <select name="roleId" value={filters.roleId} onChange={handleFilterChange} className="filter-input">
                <option value="">Chọn vai trò</option>
                {allRoles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-grid date-range">
              <div className="date-filter">
                <label>Ngày sinh từ:</label>
                <input type="date" name="birthDateFrom" value={filters.birthDateFrom} onChange={handleFilterChange} className="filter-input" />
              </div>
              <div className="date-filter">
                <label>đến:</label>
                <input type="date" name="birthDateTo" value={filters.birthDateTo} onChange={handleFilterChange} className="filter-input" />
              </div>
            </div>
            <div className="filter-grid date-range">
              <div className="date-filter">
                <label>Ngày tạo từ:</label>
                <input type="date" name="createdAtFrom" value={filters.createdAtFrom} onChange={handleFilterChange} className="filter-input" />
              </div>
              <div className="date-filter">
                <label>đến:</label>
                <input type="date" name="createdAtTo" value={filters.createdAtTo} onChange={handleFilterChange} className="filter-input" />
              </div>
            </div>
            <div className="filter-actions">
              <button className="btn-primary" onClick={handleSearch}>Tìm Kiếm</button>
              <button className="btn-secondary" onClick={() => {
                setFilters({
                  userID: '', email: '', fullName: '', gender: '', phone: '', roleId: '',
                  birthDateFrom: '', birthDateTo: '', createdAtFrom: '', createdAtTo: ''
                });
                fetchAllData(); // Tải lại toàn bộ danh sách
              }}>Xóa Bộ Lọc</button>
            </div>
          </div>
        )}

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
                    <td><span className="role-badge">{getRoleName(u)}</span></td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>{u.gender || 'N/A'}</td>
                    <td>{formatDate(u.birthDate)}</td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <FaPencilAlt
                          className="btn-action btn-edit"
                          onClick={() => handleEdit(u)}
                          title="Sửa"
                        />
                        <FaTrashAlt
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