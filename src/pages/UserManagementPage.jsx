

import React, { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaTrash, FaFilter, FaSearch, FaRedo, FaChevronUp, FaChevronDown, FaCalendarAlt } from 'react-icons/fa'; 
import { userAPI, roleAPI } from '../services/apiService';
import Toast from '../components/Toast';
import CreateUserModal from '../components/CreateUserModal';
import UpdateUserModal from '../components/UpdateUserModal'; 
import ConfirmationModal from '../components/ConfirmationModal'; 
import { io } from 'socket.io-client'; 
import '../styles/Dashboard.css';

const UserManagementPage = ({ onRefresh, currentUserId }) => { 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false); 
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false); 
  
  const [selectedUser, setSelectedUser] = useState(null); 
  const [allRoles, setAllRoles] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null); 

 
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    userID: '',
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    roleName: '', 
    birthDateFrom: '',
    birthDateTo: '',
    createdAtFrom: '',
    createdAtTo: '',
  });

  const getRoleBadgeClass = (roleName) => {
    if (!roleName) return 'badge-default';
    const lowerRole = roleName.toLowerCase(); 
    if (lowerRole === 'student') return 'badge-student';
    if (lowerRole === 'lecturer') return 'badge-lecturer';
    if (lowerRole === 'admin') return 'badge-admin';
    return 'badge-default';
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const roleResponse = await roleAPI.getAll();
      if (roleResponse.data?.code === 1000 && Array.isArray(roleResponse.data.result)) {
        setAllRoles(roleResponse.data.result);
      } else if (Array.isArray(roleResponse.data)) {
        setAllRoles(roleResponse.data);
      }

      const userResponse = await userAPI.getAllUsers();
      if (Array.isArray(userResponse.data)) {
        
        const filteredUsers = userResponse.data.filter(u => {
            const roleName = u.role?.roleName || u.role?.name || '';
            return roleName.toLowerCase() !== 'admin';
        });
        setUsers(filteredUsers);
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
   
    const socket = io('http://localhost:8085', {
        transports: ['websocket']
    });

    
    socket.on('UPDATE_USER_SUCCESS', (updatedUser) => {
        console.log('Socket received update:', updatedUser);
        
        
        setUsers((prevUsers) => {
            const exists = prevUsers.some(u => u.userID === updatedUser.userID);
            
            if (exists) {
                
                return prevUsers.map(u => 
                    u.userID === updatedUser.userID ? updatedUser : u
                );
            } 
            return prevUsers;
        });
    });

    
    return () => {
        socket.disconnect();
    };
  }, []);
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchCriteria = { ...filters };
      Object.keys(searchCriteria).forEach(key => {
        if (searchCriteria[key] === '' || searchCriteria[key] === null) {
          delete searchCriteria[key];
        }
      });

      const response = await userAPI.search(searchCriteria);
      
      let resultUsers = [];
      if (response.data?.code === 1000 && Array.isArray(response.data.result)) {
        resultUsers = response.data.result;
      } else if (Array.isArray(response.data)) {
        resultUsers = response.data;
      }

      const filteredResult = resultUsers.filter(u => {
        const roleName = u.role?.roleName || u.role?.name || '';
        return roleName.toLowerCase() !== 'admin';
      });

      setUsers(filteredResult);
      
      if (filteredResult.length === 0) {
        setToast({ message: 'Không tìm thấy kết quả nào.', type: 'info' });
      }
    } catch (error) {
      console.error("Search error:", error);
      setToast({ message: 'Lỗi khi tìm kiếm.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilter = () => {
    setFilters({
        userID: '', fullName: '', email: '', phone: '',
        gender: '', roleName: '', 
        birthDateFrom: '', birthDateTo: '',
        createdAtFrom: '', createdAtTo: ''
    });
    fetchAllData(); 
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleUserCreated = () => {
    setCreateModalOpen(false);
    setToast({ message: 'Tạo người dùng thành công!', type: 'success' });
    fetchAllData();
  };
  
  const handleUserUpdated = useCallback((updatedUserId) => {
    setUpdateModalOpen(false);
    setToast({ message: 'Cập nhật người dùng thành công!', type: 'success' });
    fetchAllData(); 
    if (onRefresh && updatedUserId === currentUserId) onRefresh(); 
  }, [onRefresh, currentUserId]);

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
            const data = err.response?.data;
            let msg = 'Lỗi khi xóa người dùng.';
            if (data?.code === 1014) {
                msg = data.message || "Không thể xóa vì tài khoản đang được sử dụng.";
            } else if (data?.message) {
                msg = data.message;
            }
            setToast({ message: msg, type: 'error' });
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
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
                className="btn-secondary"
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #ddd' }}
            >
                <FaFilter /> {isFilterVisible ? 'Ẩn bộ lọc' : 'Bộ lọc nâng cao'} {isFilterVisible ? <FaChevronUp/> : <FaChevronDown/>}
            </button>

            <button className="btn-primary" onClick={() => setCreateModalOpen(true)}>+ Tạo người dùng mới</button>
          </div>
        </div>

        {isFilterVisible && (
          <div className="filter-container" style={{ 
              marginTop: '15px', padding: '15px', backgroundColor: '#f9fafb', 
              borderRadius: '8px', border: '1px solid #e5e7eb', animation: 'fadeIn 0.3s'
          }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' }}>
                  <input type="text" name="userID" placeholder="ID..." value={filters.userID} onChange={handleFilterChange} className="filter-input" style={{ width: '100%' }} />
                  <input type="text" name="fullName" placeholder="Họ Tên..." value={filters.fullName} onChange={handleFilterChange} className="filter-input" style={{ width: '100%' }} />
                  <input type="text" name="email" placeholder="Email..." value={filters.email} onChange={handleFilterChange} className="filter-input" style={{ width: '100%' }} />
                  <input type="text" name="phone" placeholder="SĐT..." value={filters.phone} onChange={handleFilterChange} className="filter-input" style={{ width: '100%' }} />
                  
                  <select name="gender" value={filters.gender} onChange={handleFilterChange} className="filter-input" style={{ width: '100%' }}>
                      <option value="">-- Giới tính --</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                  </select>

                  <select name="roleName" value={filters.roleName} onChange={handleFilterChange} className="filter-input" style={{ width: '100%' }}>
                      <option value="">-- Vai Trò --</option>
                      {allRoles
                          .filter(r => (r.roleName || r.name) !== 'Admin')
                          .map(role => {
                              const rName = role.roleName || role.name;
                              return <option key={role.id || rName} value={rName}>{rName}</option>;
                          })}
                  </select>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label style={{ fontSize: '13px', fontWeight: '600', color: '#555', whiteSpace: 'nowrap' }}><FaCalendarAlt /> Sinh:</label>
                          <input type="date" name="birthDateFrom" value={filters.birthDateFrom} onChange={handleFilterChange} className="filter-input" style={{ maxWidth: '130px', padding: '5px' }} />
                          <span style={{ color: '#888' }}>-</span>
                          <input type="date" name="birthDateTo" value={filters.birthDateTo} onChange={handleFilterChange} className="filter-input" style={{ maxWidth: '130px', padding: '5px' }} />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label style={{ fontSize: '13px', fontWeight: '600', color: '#555', whiteSpace: 'nowrap' }}><FaCalendarAlt /> Tạo:</label>
                          <input type="date" name="createdAtFrom" value={filters.createdAtFrom} onChange={handleFilterChange} className="filter-input" style={{ maxWidth: '130px', padding: '5px' }} />
                          <span style={{ color: '#888' }}>-</span>
                          <input type="date" name="createdAtTo" value={filters.createdAtTo} onChange={handleFilterChange} className="filter-input" style={{ maxWidth: '130px', padding: '5px' }} />
                      </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn-secondary" onClick={handleResetFilter} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px' }}>
                          <FaRedo /> Làm mới
                      </button>
                      <button className="btn-primary" onClick={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px' }}>
                          <FaSearch /> Tìm kiếm
                      </button>
                  </div>
              </div>
          </div>
        )}

        {loading ? (
          <p style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>Đang tải dữ liệu...</p>
        ) : (
          <div className="table-container" style={{ marginTop: isFilterVisible ? '20px' : '20px' }}>
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Họ Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th> 
                  <th>Vai Trò</th>
                  <th>Giới tính</th>
                  <th>Ngày sinh</th>
                  <th>Ngày tạo</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                    users.map((u) => (
                    <tr key={u.userID}>
                        <td>{u.userID}</td>
                        <td>{u.fullName}</td>
                        <td>{u.email}</td>
                        <td>{(u.phones && u.phones.length > 0) ? u.phones[0] : (u.phone || "")}</td>
                        <td>
                            {(u.role?.roleName || u.role?.name) && (
                                <span className={`role-badge ${getRoleBadgeClass(u.role?.roleName || u.role?.name)}`}>
                                    {u.role?.roleName || u.role?.name}
                                </span>
                            )}
                        </td>
                        <td>{u.gender || ""}</td>
                        <td>{u.birthDate ? formatDate(u.birthDate) : ""}</td>
                        <td>{u.createdAt ? formatDate(u.createdAt) : ""}</td>
                        <td>
                        <div className="action-buttons">
                            <FaEdit className="btn-action btn-edit" onClick={() => handleEdit(u)} title="Sửa" />
                            <FaTrash className="btn-action btn-delete" onClick={() => handleDelete(u.userID)} title="Xóa" />
                        </div>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9" style={{textAlign: 'center', padding: '30px', color: '#888'}}>
                            Không tìm thấy người dùng phù hợp.
                        </td>
                    </tr>
                )}
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
          onUserUpdated={() => handleUserUpdated(selectedUser?.userID)}
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