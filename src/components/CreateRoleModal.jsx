// import React, { useState, useEffect } from 'react';
// import '../styles/Modal.css';
// import { roleAPI, permissionAPI } from '../services/apiService';

// const CreateRoleModal = ({ onClose, onRoleCreated, permissions }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     permissions: new Set(),
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePermissionChange = (permissionName) => {
//     setFormData((prev) => {
//       const newPermissions = new Set(prev.permissions);
//       if (newPermissions.has(permissionName)) {
//         newPermissions.delete(permissionName);
//       } else {
//         newPermissions.add(permissionName);
//       }
//       return { ...prev, permissions: newPermissions };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const dataToSend = {
//         ...formData,
//         permissions: Array.from(formData.permissions), // Chuyển Set thành Array
//       };
//       await roleAPI.create(dataToSend);
//       onRoleCreated();
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 'Tạo vai trò thất bại.';
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Tạo vai trò mới</h2>
//           <button onClick={onClose} className="modal-close-btn">&times;</button>
//         </div>
//         <form onSubmit={handleSubmit}>
//           {error && <p className="modal-error">{error}</p>}
//           <div className="form-group">
//             <label>Tên vai trò (VD: student)</label>
//             <input type="text" name="name" value={formData.name} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label>Mô tả</label>
//             <input type="text" name="description" value={formData.description} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label>Quyền</label>
//             <div className="checkbox-group">
//               {permissions.map((p) => (
//                 <label key={p.name} className="checkbox-label">
//                   <input
//                     type="checkbox"
//                     checked={formData.permissions.has(p.name)}
//                     onChange={() => handlePermissionChange(p.name)}
//                   />
//                   {p.name}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="modal-footer">
//             <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
//               Hủy
//             </button>
//             <button type="submit" className="btn-primary" disabled={loading}>
//               {loading ? 'Đang tạo...' : 'Tạo vai trò'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateRoleModal;

// import React, { useState, useCallback } from 'react';
// // Thay thế các import tự định nghĩa bằng Ant Design components
// import { Modal, Input, Button, Checkbox, Space } from 'antd'; 
// // Đảm bảo bạn không cần import '../styles/Modal.css' nếu chuyển sang Ant Design

// // Sử dụng chung logic về permissions cho dễ quản lý
// const processPermissions = (permissions) => {
//     return permissions.map((permission, index) => ({
//       ...permission,
//       // Tạo uniqueKey để đảm bảo React và state hoạt động tốt
//       uniqueKey: `${permission.name}-${index}`, 
//       originalName: permission.name
//     }));
// };


// const CreateRoleModal = ({ onClose, onRoleCreated, permissions: allPermissions, loading: externalLoading = false }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     // Lưu trữ bằng uniqueKey
//     permissions: new Set(), 
//   });
//   const [loading, setLoading] = useState(externalLoading); // Sử dụng state loading nội bộ

//   // Xử lý permissions một lần
//   const processedPermissions = processPermissions(allPermissions);

//   const handlePermissionChange = useCallback((uniqueKey) => {
//     setFormData((prev) => {
//       const newPermissions = new Set(prev.permissions);
//       if (newPermissions.has(uniqueKey)) {
//         newPermissions.delete(uniqueKey);
//       } else {
//         newPermissions.add(uniqueKey);
//       }
//       return { ...prev, permissions: newPermissions };
//     });
//   }, []);

//   const handleSubmit = async () => {
//     setLoading(true);
//     // Ánh xạ uniqueKey trở lại originalName để gửi lên API
//     const permissionsToSubmit = Array.from(formData.permissions).map(uniqueKey => {
//       const found = processedPermissions.find(p => p.uniqueKey === uniqueKey);
//       return found ? found.originalName : uniqueKey;
//     });

//     try {
//       const dataToSend = {
//         name: formData.name,
//         description: formData.description,
//         permissions: permissionsToSubmit,
//       };
      
//       // Giả định roleAPI.create sẽ trả về thành công hoặc ném lỗi
//       await roleAPI.create(dataToSend);
//       onRoleCreated(); // Gọi callback để đóng modal và refresh data
//     } catch (err) {
//       // Xử lý lỗi (Nếu bạn muốn hiển thị Toast hoặc Alert, bạn cần truyền nó từ component cha)
//       console.error("Failed to create role:", err);
//       // Giả lập xử lý lỗi, thường sẽ dùng Toast hoặc Alert
//       alert(`Lỗi: ${err.response?.data?.message || 'Tạo vai trò thất bại.'}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       // Sử dụng các props của Antd Modal để đồng bộ giao diện
//       cancelButtonProps={{ disabled: loading }}
//       cancelText="Hủy"
//       centered
//       okButtonProps={{ loading, disabled: !formData.name }} // Vô hiệu hóa nút OK nếu tên trống
//       okText="Tạo vai trò"
//       onCancel={onClose}
//       onOk={handleSubmit}
//       open={true}
//       title="Tạo vai trò mới"
//       destroyOnClose={true}
//       width={600} // Set cùng chiều rộng
//     >
//       <Space direction="vertical" style={{ width: '100%' }}>
        
//         {/* Trường Tên Vai Trò */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Tên vai trò</label>
//           <Input
//             name="name"
//             value={formData.name}
//             onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
//             placeholder="Nhập tên vai trò (VD: student)"
//           />
//         </div>

//         {/* Trường Mô Tả */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
//           <Input.TextArea // Sử dụng TextArea cho mô tả
//             name="description"
//             value={formData.description}
//             onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//             placeholder="Nhập mô tả vai trò"
//             rows={2}
//           />
//         </div>

//         {/* Danh sách Quyền (Đồng bộ layout với UpdateRoleModal) */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Chọn các quyền</label>
//           <div 
//             className="permission-list" 
//             style={{ 
//               border: '1px solid #ddd', 
//               borderRadius: '4px', 
//               maxHeight: '200px', 
//               overflowY: 'auto', 
//               overflowX: 'auto' 
//             }}
//           >
//             {processedPermissions.map((permission) => (
//               <div
//                 key={permission.uniqueKey}
//                 className="permission-item"
//                 style={{
//                   padding: '8px 12px',
//                   borderBottom: '1px solid #eee',
//                   backgroundColor: formData.permissions.has(permission.uniqueKey) ? '#e6f7ff' : 'transparent',
//                   width: '100%',
//                 }}
//               >
//                 <Checkbox
//                   checked={formData.permissions.has(permission.uniqueKey)}
//                   onChange={() => handlePermissionChange(permission.uniqueKey)}
//                 >
//                   <span style={{
//                     display: 'block',
//                     whiteSpace: 'normal',
//                     wordBreak: 'break-word'
//                   }}>
//                     {permission.name}
//                   </span>
//                 </Checkbox>
//               </div>
//             ))}
//           </div>
//         </div>
//       </Space>
//     </Modal>
//   );
// };

// export default CreateRoleModal;

import React, { useState, useCallback } from 'react';
import { Modal, Input, Checkbox, Space, message, notification } from 'antd';
import { roleAPI } from '../services/apiService';

const processPermissions = (permissions) => {
  if (!permissions) return [];
  return permissions.map((permission, index) => ({
    ...permission,
    uniqueKey: `${permission.name}-${index}`,
    originalName: permission.name
  }));
};

const CreateRoleModal = ({ 
  onClose, 
  onRoleCreated, 
  permissions: allPermissions = [], // Default value để tránh lỗi undefined
  loading: externalLoading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: new Set(),
  });
  
  const [loading, setLoading] = useState(externalLoading);

  // Xử lý danh sách permissions đầu vào
  const processedPermissions = processPermissions(allPermissions);

  const handlePermissionChange = useCallback((uniqueKey) => {
    setFormData((prev) => {
      const newPermissions = new Set(prev.permissions);
      if (newPermissions.has(uniqueKey)) {
        newPermissions.delete(uniqueKey);
      } else {
        newPermissions.add(uniqueKey);
      }
      return { ...prev, permissions: newPermissions };
    });
  }, []);

  const handleSubmit = async () => {
    // Validate cơ bản
    if (!formData.name.trim()) {
      message.error("Tên vai trò không được để trống!");
      return;
    }

    setLoading(true);

    // Ánh xạ uniqueKey trở lại originalName để gửi lên API
    const permissionsToSubmit = Array.from(formData.permissions).map(uniqueKey => {
      const found = processedPermissions.find(p => p.uniqueKey === uniqueKey);
      return found ? found.originalName : uniqueKey;
    });

    const dataToSend = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      system_prompt: "Default system prompt", // Placeholder, as required by backend
      icon: "", // Placeholder, can be empty
      enable_l0_retrieval: true, // Placeholder, as defaulted by backend
      enable_l1_retrieval: true, // Placeholder, as defaulted by backend
      permissions: permissionsToSubmit,
    };
    console.log('Sending role creation request with data:', dataToSend); // Added for debugging

    try {
      // Gọi API
      await roleAPI.create(dataToSend);

      // Thông báo thành công
      message.success('Tạo vai trò mới thành công!');
      
      // Reset form và đóng modal
      onRoleCreated(); 
      onClose();

    } catch (err) {
      console.error('Role creation failed. Error details:', err.response || err); // More detailed error log
      
      // Lấy thông báo lỗi từ response của Backend (nếu có)
      const errorDescription = err.response?.data?.message || err.message || 'Vui lòng thử lại sau.';
      
      // Hiển thị Notification thay vì Alert (Thân thiện hơn)
      notification.error({
        message: 'Tạo vai trò thất bại',
        description: errorDescription,
        placement: 'topRight',
        duration: 4, // Tự động đóng sau 4 giây
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={true}
      title="Tạo vai trò mới"
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Tạo vai trò"
      cancelText="Hủy"
      centered
      destroyOnClose
      width={600}
      // Props cho nút OK và Cancel
      okButtonProps={{ loading, disabled: !formData.name }}
      cancelButtonProps={{ disabled: loading }}
    >
      <Space direction="vertical" style={{ width: '100%', gap: '16px' }}>
        
        {/* Trường Tên Vai Trò */}
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Tên vai trò <span style={{ color: 'red' }}>*</span></label>
          <Input
            name="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Nhập tên vai trò (VD: student)"
            disabled={loading}
          />
        </div>

        {/* Trường Mô Tả */}
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Mô tả</label>
          <Input.TextArea
            name="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Nhập mô tả vai trò"
            rows={3}
            disabled={loading}
          />
        </div>

        {/* Danh sách Quyền */}
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Phân quyền</label>
          <div 
            className="permission-list" 
            style={{ 
              border: '1px solid #d9d9d9', 
              borderRadius: '6px', 
              maxHeight: '250px', 
              overflowY: 'auto',
              padding: '4px'
            }}
          >
            {processedPermissions.length > 0 ? (
              processedPermissions.map((permission) => (
                <div
                  key={permission.uniqueKey}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: formData.permissions.has(permission.uniqueKey) ? '#e6f7ff' : 'transparent',
                    transition: 'background-color 0.3s',
                    borderRadius: '4px',
                    marginBottom: '2px'
                  }}
                >
                  <Checkbox
                    checked={formData.permissions.has(permission.uniqueKey)}
                    onChange={() => handlePermissionChange(permission.uniqueKey)}
                    disabled={loading}
                  >
                    <span style={{ fontWeight: 500 }}>{permission.name}</span>
                  </Checkbox>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                Không có quyền nào để chọn
              </div>
            )}
          </div>
        </div>
      </Space>
    </Modal>
  );
};

export default CreateRoleModal;

