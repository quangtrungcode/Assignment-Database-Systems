import React, { useState } from 'react';
import Toast from '../components/Toast';
import CreatePermissionModal from '../components/CreatePermissionModal';
import PermissionManagement from '../components/PermissionManagement'; // Import component mới
import '../styles/Dashboard.css';

const PermissionManagementPage = () => {
  const [isPermissionModalOpen, setPermissionModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  // Thêm một state để trigger việc render lại component list
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePermissionCreated = () => {
    setPermissionModalOpen(false);
    setToast({ message: 'Tạo quyền thành công!', type: 'success' });
    // Thay đổi key để component PermissionManagement được render lại
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="dashboard-card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Quản Lý Quyền</h2>
          <button className="btn-primary" onClick={() => setPermissionModalOpen(true)}>+ Tạo quyền mới</button>
        </div>
        {/* Sử dụng component PermissionManagement và truyền key */}
        <PermissionManagement key={refreshKey} />
      </div>
      {isPermissionModalOpen && (
        <CreatePermissionModal
          onClose={() => setPermissionModalOpen(false)}
          onPermissionCreated={handlePermissionCreated}
        />
      )}
    </>
  );
};

export default PermissionManagementPage;

