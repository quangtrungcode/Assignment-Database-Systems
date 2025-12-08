


import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrashAlt, FaFilter, FaRedo, FaChevronUp, FaChevronDown } from 'react-icons/fa'; // Thêm icon
import { permissionAPI } from '../services/apiService';
import Toast from '../components/Toast';
import CreatePermissionModal from '../components/CreatePermissionModal';
import UpdatePermissionModal from '../components/UpdatePermissionModal';
import ConfirmationModal from '../components/ConfirmationModal';
import '../styles/Dashboard.css';

const PermissionManagementPage = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  
  const [showFilter, setShowFilter] = useState(false); 
  const [filters, setFilters] = useState({
    name: '',
    description: ''
  });

  
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [permissionToDelete, setPermissionToDelete] = useState(null);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await permissionAPI.getAll();
      if (response.data?.code === 1000 && Array.isArray(response.data.result)) {
        setPermissions(response.data.result);
      } else if (Array.isArray(response.data)) {
        setPermissions(response.data);
      } else if (Array.isArray(response.data?.result)) {
        setPermissions(response.data.result);
      } else {
        setPermissions([]); 
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      setToast({ message: 'Lỗi khi tải dữ liệu.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({ name: '', description: '' });
  };

  
  const filteredPermissions = permissions.filter(p => {
    
    const pName = (p.permissionName || p.name || '').toLowerCase();
    const pDesc = (p.description || '').toLowerCase();

    
    const filterName = filters.name.toLowerCase();
    const filterDesc = filters.description.toLowerCase();

    
    return pName.includes(filterName) && 
           pDesc.includes(filterDesc);
  });

  const handlePermissionCreated = () => {
    setCreateModalOpen(false);
    setToast({ message: 'Tạo quyền thành công!', type: 'success' });
    fetchPermissions();
  };

  const handlePermissionUpdated = () => {
    setUpdateModalOpen(false);
    setToast({ message: 'Cập nhật quyền thành công!', type: 'success' });
    fetchPermissions();
  };

  const handleDelete = (permissionObj) => {
    const nameToDelete = permissionObj.permissionName || permissionObj.name;
    setPermissionToDelete(nameToDelete);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (permissionToDelete) {
      try {
        await permissionAPI.delete(permissionToDelete);
        setToast({ message: 'Xóa quyền thành công!', type: 'success' });
        fetchPermissions();
      } catch (err) {
        setToast({ message: err.response?.data?.message || 'Lỗi khi xóa quyền.', type: 'error' });
      } finally {
        setConfirmModalOpen(false);
        setPermissionToDelete(null);
      }
    }
  };

  const openEditModal = (perm) => {
    setSelectedPermission(perm);
    setUpdateModalOpen(true);
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="dashboard-card">
        
        {/*  */}
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Quản Lý Quyền</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
                className="btn-secondary"
                onClick={() => setShowFilter(!showFilter)}
                style={{ 
                    display: 'flex', alignItems: 'center', gap: '5px', 
                    border: '1px solid #ddd', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' 
                }}
            >
                <FaFilter /> {showFilter ? 'Ẩn bộ lọc' : 'Lọc danh sách'} {showFilter ? <FaChevronUp/> : <FaChevronDown/>}
            </button>
            <button className="btn-primary" onClick={() => setCreateModalOpen(true)}>+ Tạo quyền mới</button>
          </div>
        </div>

        {/*  */}
        {showFilter && (
            <div className="filter-bar" style={{ 
                marginTop: '20px', 
                padding: '20px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '15px',
                alignItems: 'flex-end',
                animation: 'fadeIn 0.3s'
            }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Lọc Tên Quyền</label>
                    <input 
                        type="text" 
                        className="filter-input" 
                        placeholder="Tìm tên (VD: create...)" 
                        value={filters.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                        style={{ width: '100%', marginTop: '5px' }}
                    />
                </div>
                
                <div style={{ flex: 1.5, minWidth: '250px' }}>
                    <label style={{fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Lọc Mô tả</label>
                    <input 
                        type="text" 
                        className="filter-input" 
                        placeholder="Tìm mô tả..." 
                        value={filters.description}
                        onChange={(e) => handleFilterChange('description', e.target.value)}
                        style={{ width: '100%', marginTop: '5px' }}
                    />
                </div>

                <button 
                        onClick={resetFilters}
                        className="btn-secondary"
                        style={{ height: '38px', padding: '0 15px', display: 'flex', alignItems: 'center', gap: '5px' }}
                        title="Xóa bộ lọc"
                >
                    <FaRedo /> Reset
                </button>
            </div>
        )}

        {loading ? <p>Đang tải...</p> : (
          <div className="table-container" style={{ marginTop: '15px' }}>
            <table>
              <thead>
                <tr>
                  <th>Tên Quyền</th>
                  <th>Mô Tả</th>
                  <th style={{ width: '120px' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredPermissions.length > 0 ? (
                  filteredPermissions.map((perm, index) => {
                    const displayName = perm.permissionName || perm.name || 'N/A';
                    return (
                      <tr key={`${displayName}-${index}`}>
                        <td style={{ fontWeight: 'bold', color: '#2c3e50' }}>{displayName}</td>
                        <td>{perm.description}</td>
                        <td>
                          <div className="action-buttons">
                            <FaPencilAlt className="btn-action btn-edit" onClick={() => openEditModal(perm)} title="Sửa" />
                            <FaTrashAlt className="btn-action btn-delete" onClick={() => handleDelete(perm)} title="Xóa" />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" style={{textAlign: 'center', padding: '30px', color: '#888'}}>
                        Không tìm thấy kết quả phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreatePermissionModal
          onClose={() => setCreateModalOpen(false)}
          onPermissionCreated={handlePermissionCreated}
        />
      )}

      {isUpdateModalOpen && (
        <UpdatePermissionModal
          permission={selectedPermission}
          onClose={() => setUpdateModalOpen(false)}
          onPermissionUpdated={handlePermissionUpdated}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa quyền này? Hành động này sẽ ảnh hưởng đến các vai trò đang sử dụng nó."
      />
    </>
  );
};

export default PermissionManagementPage;