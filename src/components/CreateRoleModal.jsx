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

// import React, { useState, useCallback } from 'react';
// import { Modal, Input, Checkbox, Space, message, notification } from 'antd';
// import { roleAPI } from '../services/apiService';

// const processPermissions = (permissions) => {
//   if (!permissions) return [];
//   return permissions.map((permission, index) => ({
//     ...permission,
//     uniqueKey: `${permission.name}-${index}`,
//     originalName: permission.name
//   }));
// };

// const CreateRoleModal = ({ 
//   onClose, 
//   onRoleCreated, 
//   permissions: allPermissions = [], 
//   loading: externalLoading = false 
// }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     permissions: new Set(),
//   });
  
//   const [loading, setLoading] = useState(externalLoading);

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
//     if (!formData.name.trim()) {
//       message.error("Tên vai trò không được để trống!");
//       return;
//     }

//     setLoading(true);

//     const permissionsToSubmit = Array.from(formData.permissions).map(uniqueKey => {
//       const found = processedPermissions.find(p => p.uniqueKey === uniqueKey);
//       return found ? found.originalName : uniqueKey;
//     });

//     // Dữ liệu gửi đi (Giữ nguyên các trường đặc thù của bạn)
//     const dataToSend = {
//       name: formData.name.trim(),
//       description: formData.description.trim(),
//       system_prompt: "Default system prompt", 
//       icon: "", 
//       enable_l0_retrieval: true, 
//       enable_l1_retrieval: true, 
//       permissions: permissionsToSubmit,
//     };

//     try {
//       await roleAPI.create(dataToSend);
//       message.success('Tạo vai trò mới thành công!');
//       onRoleCreated(); 
//       onClose();

//     } catch (err) {
//       console.error('Role creation failed:', err);
//       const errorDescription = err.response?.data?.message || err.message || 'Vui lòng thử lại sau.';
      
//       notification.error({
//         message: 'Tạo vai trò thất bại',
//         description: errorDescription,
//         placement: 'topRight',
//         duration: 4, 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       open={true}
//       title="Tạo vai trò mới"
//       onCancel={onClose}
//       onOk={handleSubmit}
//       okText="Tạo vai trò"
//       cancelText="Hủy"
//       centered
//       destroyOnClose
//       width={600}
//       okButtonProps={{ loading, disabled: !formData.name }}
//       cancelButtonProps={{ disabled: loading }}
//     >
//       <Space direction="vertical" style={{ width: '100%', gap: '16px' }}>
        
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Tên vai trò <span style={{ color: 'red' }}>*</span></label>
//           <Input
//             name="name"
//             value={formData.name}
//             onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
//             placeholder="Nhập tên vai trò (VD: Student)"
//             disabled={loading}
//           />
//         </div>

//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Mô tả</label>
//           <Input.TextArea
//             name="description"
//             value={formData.description}
//             onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//             placeholder="Nhập mô tả vai trò"
//             rows={3}
//             disabled={loading}
//           />
//         </div>

//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Phân quyền</label>
//           <div 
//             className="permission-list" 
//             style={{ 
//               border: '1px solid #d9d9d9', 
//               borderRadius: '6px', 
//               maxHeight: '250px', 
//               overflowY: 'auto',
//               padding: '4px'
//             }}
//           >
//             {processedPermissions.length > 0 ? (
//               processedPermissions.map((permission) => (
//                 <div
//                   key={permission.uniqueKey}
//                   style={{
//                     padding: '8px 12px',
//                     borderBottom: '1px solid #f0f0f0',
//                     backgroundColor: formData.permissions.has(permission.uniqueKey) ? '#e6f7ff' : 'transparent',
//                     marginBottom: '2px',
//                     borderRadius: '4px'
//                   }}
//                 >
//                   <Checkbox
//                     checked={formData.permissions.has(permission.uniqueKey)}
//                     onChange={() => handlePermissionChange(permission.uniqueKey)}
//                     disabled={loading}
//                   >
//                     <span style={{ fontWeight: 500 }}>{permission.name}</span>
//                   </Checkbox>
//                 </div>
//               ))
//             ) : (
//               <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
//                 Không có quyền nào để chọn
//               </div>
//             )}
//           </div>
//         </div>
//       </Space>
//     </Modal>
//   );
// };

// export default CreateRoleModal;

// import React, { useState, useEffect } from 'react';
// import { roleAPI } from '../services/apiService';
// import '../styles/Modal.css';

// const CreateRoleModal = ({ onClose, onRoleCreated, permissions = [] }) => {
//   const [formData, setFormData] = useState({
//     roleName: '', // Backend thường dùng roleName thay vì name
//     description: '',
//     level: 1, // Mặc định level 1
//     permissions: new Set(), // Lưu danh sách permissionName đã chọn
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Xử lý danh sách quyền để hiển thị an toàn
//   const processedPermissions = permissions.map((p, index) => ({
//     ...p,
//     // Sử dụng permissionName làm định danh chính
//     displayName: p.permissionName || p.name || 'Unnamed Permission',
//     uniqueValue: p.permissionName || p.name
//   }));

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePermissionChange = (permValue) => {
//     setFormData((prev) => {
//       const newPermissions = new Set(prev.permissions);
//       if (newPermissions.has(permValue)) {
//         newPermissions.delete(permValue);
//       } else {
//         newPermissions.add(permValue);
//       }
//       return { ...prev, permissions: newPermissions };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     if (!formData.roleName.trim()) {
//       setError("Tên vai trò không được để trống!");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Chuẩn bị dữ liệu gửi lên Backend
//       const dataToSend = {
//         roleName: formData.roleName.trim(), // Đổi thành roleName cho khớp backend
//         description: formData.description.trim(),
//         level: parseInt(formData.level, 10), // Gửi level dạng số
//         // Chuyển Set thành Array để gửi đi
//         permissions: Array.from(formData.permissions) 
//       };

//       console.log('Payload tạo Role:', dataToSend);

//       await roleAPI.create(dataToSend);
//       onRoleCreated(); // Refresh danh sách bên ngoài
//       // onClose sẽ được gọi từ component cha sau khi alert thành công
//     } catch (err) {
//       console.error('Role creation failed:', err);
//       const errorMessage = err.response?.data?.message || 'Tạo vai trò thất bại.';
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content" style={{ width: '600px', maxWidth: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
//         <div className="modal-header">
//           <h2>Tạo Vai Trò Mới</h2>
//           <button onClick={onClose} className="modal-close-btn">&times;</button>
//         </div>
        
//         <div className="modal-body" style={{ overflowY: 'auto', padding: '20px' }}>
//           <form id="create-role-form" onSubmit={handleSubmit}>
//             {error && <div className="modal-error" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
            
//             {/* Tên vai trò */}
//             <div className="form-group">
//               <label>Tên vai trò <span style={{ color: 'red' }}>*</span></label>
//               <input
//                 type="text"
//                 name="roleName"
//                 value={formData.roleName}
//                 onChange={handleChange}
//                 placeholder="Ví dụ: Staff, Manager..."
//                 required
//                 disabled={loading}
//               />
//             </div>

//             {/* Mô tả */}
//             <div className="form-group">
//               <label>Mô tả</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Mô tả chức năng của vai trò này..."
//                 rows={3}
//                 disabled={loading}
//                 style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
//               />
//             </div>

//             {/* Level (Mới thêm) */}
//             <div className="form-group">
//               <label>Cấp bậc (Level) <span style={{ color: 'red' }}>*</span></label>
//               <input
//                 type="number"
//                 name="level"
//                 value={formData.level}
//                 onChange={handleChange}
//                 min="1"
//                 required
//                 disabled={loading}
//                 placeholder="Nhập số cấp bậc (VD: 1, 2...)"
//               />
//             </div>

//             {/* Danh sách Quyền (Checkbox) */}
//             <div className="form-group">
//               <label style={{ display: 'block', marginBottom: '10px' }}>Phân quyền chức năng:</label>
//               <div 
//                 className="permissions-container" 
//                 style={{ 
//                   border: '1px solid #eee', 
//                   borderRadius: '6px', 
//                   padding: '15px', 
//                   maxHeight: '250px', 
//                   overflowY: 'auto',
//                   backgroundColor: '#f9f9f9',
//                   display: 'grid',
//                   gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', // Chia cột tự động
//                   gap: '10px'
//                 }}
//               >
//                 {processedPermissions.length > 0 ? (
//                   processedPermissions.map((perm, index) => (
//                     <label 
//                       key={index} 
//                       style={{ 
//                         display: 'flex', 
//                         alignItems: 'center', 
//                         cursor: 'pointer',
//                         fontSize: '14px',
//                         padding: '5px',
//                         borderRadius: '4px',
//                         transition: 'background 0.2s'
//                       }}
//                       className="permission-item"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={formData.permissions.has(perm.uniqueValue)}
//                         onChange={() => handlePermissionChange(perm.uniqueValue)}
//                         disabled={loading}
//                         style={{ marginRight: '8px', width: '16px', height: '16px' }}
//                       />
//                       {perm.displayName}
//                     </label>
//                   ))
//                 ) : (
//                   <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999', padding: '20px' }}>
//                     Không có dữ liệu quyền hạn.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </form>
//         </div>

//         <div className="modal-footer">
//           <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
//             Hủy
//           </button>
//           <button type="submit" form="create-role-form" className="btn-primary" disabled={loading}>
//             {loading ? 'Đang lưu...' : 'Tạo mới'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateRoleModal;

// import React, { useState, useEffect } from 'react';
// import { roleAPI } from '../services/apiService';
// import '../styles/Modal.css';

// const CreateRoleModal = ({ onClose, onRoleCreated, permissions = [] }) => {
//   const [formData, setFormData] = useState({
//     roleName: '', 
//     description: '',
//     level: '', // Để mặc định là chuỗi rỗng để người dùng có thể không nhập
//     permissions: new Set(),
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Xử lý danh sách quyền để hiển thị an toàn
//   const processedPermissions = permissions.map((p, index) => ({
//     ...p,
//     displayName: p.permissionName || p.name || 'Unnamed Permission',
//     uniqueValue: p.permissionName || p.name
//   }));

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePermissionChange = (permValue) => {
//     setFormData((prev) => {
//       const newPermissions = new Set(prev.permissions);
//       if (newPermissions.has(permValue)) {
//         newPermissions.delete(permValue);
//       } else {
//         newPermissions.add(permValue);
//       }
//       return { ...prev, permissions: newPermissions };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     // 1. Kiểm tra bắt buộc Tên vai trò
//     if (!formData.roleName || !formData.roleName.trim()) {
//       setError("Tên vai trò không được để trống!");
//       setLoading(false);
//       return;
//     }

//     try {
//       // 2. Xử lý logic chuyển đổi rỗng -> null
//       const dataToSend = {
//         roleName: formData.roleName.trim(),
        
//         // Nếu description rỗng hoặc chỉ có khoảng trắng -> null, ngược lại lấy giá trị
//         description: formData.description && formData.description.trim() !== '' 
//             ? formData.description.trim() 
//             : null,
            
//         // Nếu level rỗng -> null, ngược lại parse sang số
//         level: formData.level !== '' && formData.level !== null 
//             ? parseInt(formData.level, 10) 
//             : null,
            
//         // Permissions luôn là mảng (rỗng hoặc có giá trị)
//         permissions: Array.from(formData.permissions) 
//       };

//       console.log('Payload tạo Role:', dataToSend);

//       await roleAPI.create(dataToSend);
//       onRoleCreated(); 
//     } catch (err) {
//       console.error('Role creation failed:', err);
//       const errorMessage = err.response?.data?.message || 'Tạo vai trò thất bại.';
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content" style={{ width: '600px', maxWidth: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
//         <div className="modal-header">
//           <h2>Tạo Vai Trò Mới</h2>
//           <button onClick={onClose} className="modal-close-btn">&times;</button>
//         </div>
        
//         <div className="modal-body" style={{ overflowY: 'auto', padding: '20px' }}>
//           <form id="create-role-form" onSubmit={handleSubmit}>
//             {error && <div className="modal-error" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
            
//             {/* Tên vai trò - BẮT BUỘC (Có required) */}
//             <div className="form-group">
//               <label>Tên vai trò <span style={{ color: 'red' }}>*</span></label>
//               <input
//                 type="text"
//                 name="roleName"
//                 value={formData.roleName}
//                 onChange={handleChange}
//                 placeholder="Ví dụ: Staff, Manager..."
//                 required 
//                 disabled={loading}
//               />
//             </div>

//             {/* Mô tả - KHÔNG BẮT BUỘC (Đã bỏ required) */}
//             <div className="form-group">
//               <label>Mô tả</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Mô tả chức năng của vai trò này..."
//                 rows={3}
//                 disabled={loading}
//                 style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
//               />
//             </div>

//             {/* Level - KHÔNG BẮT BUỘC (Đã bỏ required và min) */}
//             <div className="form-group">
//               <label>Cấp bậc (Level)</label>
//               <input
//                 type="number"
//                 name="level"
//                 value={formData.level}
//                 onChange={handleChange}
//                 disabled={loading}
//                 placeholder="Nhập số cấp bậc (VD: 1, 2...)"
//               />
//             </div>

//             {/* Danh sách Quyền */}
//             <div className="form-group">
//               <label style={{ display: 'block', marginBottom: '10px' }}>Phân quyền chức năng:</label>
//               <div 
//                 className="permissions-container" 
//                 style={{ 
//                   border: '1px solid #eee', 
//                   borderRadius: '6px', 
//                   padding: '15px', 
//                   maxHeight: '250px', 
//                   overflowY: 'auto',
//                   backgroundColor: '#f9f9f9',
//                   display: 'grid',
//                   gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
//                   gap: '10px'
//                 }}
//               >
//                 {processedPermissions.length > 0 ? (
//                   processedPermissions.map((perm, index) => (
//                     <label 
//                       key={index} 
//                       className="permission-item"
//                       style={{ 
//                         display: 'flex', alignItems: 'center', cursor: 'pointer',
//                         fontSize: '14px', padding: '5px'
//                       }}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={formData.permissions.has(perm.uniqueValue)}
//                         onChange={() => handlePermissionChange(perm.uniqueValue)}
//                         disabled={loading}
//                         style={{ marginRight: '8px', width: '16px', height: '16px' }}
//                       />
//                       {perm.displayName}
//                     </label>
//                   ))
//                 ) : (
//                   <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999', padding: '20px' }}>
//                     Không có dữ liệu quyền hạn.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </form>
//         </div>

//         <div className="modal-footer">
//           <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
//             Hủy
//           </button>
//           <button type="submit" form="create-role-form" className="btn-primary" disabled={loading}>
//             {loading ? 'Đang lưu...' : 'Tạo mới'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateRoleModal;

import React, { useState, useEffect } from 'react';
import { roleAPI } from '../services/apiService';
import '../styles/Modal.css';

const CreateRoleModal = ({ onClose, onRoleCreated, permissions = [] }) => {
  const [formData, setFormData] = useState({
    roleName: '', 
    description: '',
    level: '', 
    permissions: new Set(),
  });
  
  // 1. Thêm state lưu lỗi (Validation)
  const [errors, setErrors] = useState({});
  
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState(null); // Lỗi chung từ backend

  const processedPermissions = permissions.map((p, index) => ({
    ...p,
    displayName: p.permissionName || p.name || 'Unnamed Permission',
    uniqueValue: p.permissionName || p.name
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 2. Xóa lỗi ngay khi người dùng bắt đầu nhập
    if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 3. Hàm xử lý Blur: Kiểm tra ngay khi click ra ngoài
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'roleName') {
        if (!value || !value.trim()) {
            setErrors((prev) => ({ ...prev, roleName: 'Tên vai trò không được để trống' }));
        }
    }
  };

  const handlePermissionChange = (permValue) => {
    setFormData((prev) => {
      const newPermissions = new Set(prev.permissions);
      if (newPermissions.has(permValue)) {
        newPermissions.delete(permValue);
      } else {
        newPermissions.add(permValue);
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError(null);

    // 4. Validation trước khi gửi (Submit)
    const rawRoleName = formData.roleName;
    if (!rawRoleName || !rawRoleName.trim()) {
      setErrors({ roleName: 'Tên vai trò không được để trống' });
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        roleName: formData.roleName.trim(),
        description: formData.description && formData.description.trim() !== '' 
            ? formData.description.trim() 
            : null,
        level: formData.level !== '' && formData.level !== null 
            ? parseInt(formData.level, 10) 
            : null,
        permissions: Array.from(formData.permissions) 
      };

      console.log('Payload tạo Role:', dataToSend);

      await roleAPI.create(dataToSend);
      onRoleCreated(); 
    } catch (err) {
      console.error('Role creation failed:', err);
      // Lỗi từ backend vẫn hiện ở trên cùng (hoặc bạn có thể map vào errors nếu muốn)
      const errorMessage = err.response?.data?.message || 'Tạo vai trò thất bại.';
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '600px', maxWidth: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <h2>Tạo Vai Trò Mới</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <div className="modal-body" style={{ overflowY: 'auto', padding: '20px' }}>
          <form id="create-role-form" onSubmit={handleSubmit}>
            {/* Hiển thị lỗi chung từ Backend (nếu có) */}
            {generalError && <div className="modal-error" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{generalError}</div>}
            
            {/* Tên vai trò */}
            <div className="form-group">
              <label>Tên vai trò <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="roleName"
                value={formData.roleName}
                onChange={handleChange}
                // 5. Thêm sự kiện onBlur và style lỗi
                onBlur={handleBlur}
                placeholder="Ví dụ: Staff, Manager..."
                disabled={loading}
                // Bỏ 'required' của HTML để dùng validation tùy chỉnh
                className={errors.roleName ? 'input-error' : ''}
                style={errors.roleName ? { borderColor: 'red' } : {}}
              />
              {/* Hiển thị dòng lỗi đỏ bên dưới */}
              {errors.roleName && (
                  <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                      {errors.roleName}
                  </div>
              )}
            </div>

            {/* Mô tả */}
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả chức năng của vai trò này..."
                rows={3}
                disabled={loading}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            {/* Level */}
            <div className="form-group">
              <label>Cấp bậc (Level)</label>
              <input
                type="number"
                name="level"
                value={formData.level}
                onChange={handleChange}
                disabled={loading}
                placeholder="Nhập số cấp bậc (VD: 1, 2...)"
              />
            </div>

            {/* Danh sách Quyền */}
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '10px' }}>Phân quyền chức năng:</label>
              <div 
                className="permissions-container" 
                style={{ 
                  border: '1px solid #eee', 
                  borderRadius: '6px', 
                  padding: '15px', 
                  maxHeight: '250px', 
                  overflowY: 'auto',
                  backgroundColor: '#f9f9f9',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '10px'
                }}
              >
                {processedPermissions.length > 0 ? (
                  processedPermissions.map((perm, index) => (
                    <label 
                      key={index} 
                      className="permission-item"
                      style={{ 
                        display: 'flex', alignItems: 'center', cursor: 'pointer',
                        fontSize: '14px', padding: '5px'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.has(perm.uniqueValue)}
                        onChange={() => handlePermissionChange(perm.uniqueValue)}
                        disabled={loading}
                        style={{ marginRight: '8px', width: '16px', height: '16px' }}
                      />
                      {perm.displayName}
                    </label>
                  ))
                ) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999', padding: '20px' }}>
                    Không có dữ liệu quyền hạn.
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
            Hủy
          </button>
          <button type="submit" form="create-role-form" className="btn-primary" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Tạo mới'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleModal;
