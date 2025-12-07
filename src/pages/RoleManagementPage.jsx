// import React, { useState, useEffect } from 'react';
// import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
// import { roleAPI, permissionAPI } from '../services/apiService';
// import Toast from '../components/Toast';
// import CreateRoleModal from '../components/CreateRoleModal';
// import UpdateRoleModal from '../components/UpdateRoleModal';
// import ConfirmationModal from '../components/ConfirmationModal';
// import '../styles/Dashboard.css';

// const RoleManagementPage = () => {
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isRoleModalOpen, setRoleModalOpen] = useState(false);
//   const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
//   const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [roleToDelete, setRoleToDelete] = useState(null);
//   const [allPermissions, setAllPermissions] = useState([]);
//   const [toast, setToast] = useState(null);
//   const [filter, setFilter] = useState('');

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const [rolesRes, permissionsRes] = await Promise.all([
//         roleAPI.getAll(),
//         permissionAPI.getAll()
//       ]);

//       if (rolesRes.data?.code === 1000 && Array.isArray(rolesRes.data.result)) {
//         setRoles(rolesRes.data.result);
//       } else {
//         setToast({ message: 'Không thể tải danh sách vai trò.', type: 'error' });
//       }

//       if (permissionsRes.data?.code === 1000 && Array.isArray(permissionsRes.data.result)) {
//         setAllPermissions(permissionsRes.data.result);
//       } else {
//         setToast({ message: 'Không thể tải danh sách quyền.', type: 'error' );
//       }

//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       setToast({ message: 'Lỗi khi tải dữ liệu.', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const filteredRoles = roles.filter(role =>
//     (role.name && role.name.toLowerCase().includes(filter.toLowerCase())) ||
//     (role.description && role.description.toLowerCase().includes(filter.toLowerCase()))
//   );

//   const handleRoleCreated = () => {
//     setRoleModalOpen(false);
//     setToast({ message: 'Tạo vai trò thành công!', type: 'success' });
//     fetchAllData();
//   };

//   const handleUpdateRoleSubmit = async (updatedData) => {
//     setLoading(true);
//     try {
//       const payload = {
//         id: selectedRole.id, // Add the role ID
//         name: updatedData.newName,
//         permissions: updatedData.permissions,
//       };
//       await roleAPI.update(payload);
//       setToast({ message: 'Cập nhật vai trò thành công!', type: 'success' });
//       setUpdateModalOpen(false);
//       setSelectedRole(null);
//       fetchAllData();
//     } catch (error) {
//       console.error("Failed to update role:", error);
//       setToast({ message: 'Lỗi khi cập nhật vai trò.', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (role) => {
//     // Tạo một bản sao sâu để selectedRole không bị ảnh hưởng bởi các lần render lại của danh sách roles
//     setSelectedRole(JSON.parse(JSON.stringify(role)));
//     setUpdateModalOpen(true);
//   };

//   const handleDelete = (roleId) => {
//     setRoleToDelete(roleId);
//     setConfirmModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (roleToDelete) {
//       try {
//         await roleAPI.delete(roleToDelete);
//         setToast({ message: 'Xóa vai trò thành công!', type: 'success' });
//         fetchAllData();
//       } catch (err) {
//         setToast({ message: 'Lỗi khi xóa vai trò.', type: 'error' });
//       } finally {
//         setConfirmModalOpen(false);
//         setRoleToDelete(null);
//       }
//     }
//   };

//   return (
//     <>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <div className="dashboard-card">
//         <div className="card-header">
//           <h2>Quản Lý Vai Trò</h2>
//           <button className="btn-primary" onClick={() => setRoleModalOpen(true)}>+ Tạo vai trò mới</button>
//         </div>

//         <div className="filter-container" style={{ marginTop: '20px' }}>
//           <input type="text" placeholder="Lọc theo tên hoặc mô tả vai trò..." value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-input" />
//         </div>

//         {loading ? <p>Đang tải...</p> : (
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th style={{ width: '20%' }}>Tên Vai Trò</th>
//                   <th style={{ width: '35%' }}>Mô Tả</th>
//                   <th style={{ width: '35%' }}>Quyền</th>
//                   <th style={{ width: '120px' }}>Hành Động</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredRoles.map((role) => (
//                   <tr key={role.name}>
//                     <td>{role.name}</td>
//                     <td>{role.description}</td>
//                     <td style={{ whiteSpace: 'nowrap' }}>
//                       {(role.permissions && role.permissions.length > 0)
//                         ? role.permissions.map(p => p.name).join(', ')
//                         : <span style={{ color: '#888' }}>Chưa có quyền</span>}
//                     </td>
//                     <td>
//                       <div className="action-buttons">
//                         <FaPencilAlt className="btn-action btn-edit" onClick={() => handleEdit(role)} title="Sửa" />
//                         <FaTrashAlt className="btn-action btn-delete" onClick={() => handleDelete(role.id)} title="Xóa" />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       {isRoleModalOpen && (
//         <CreateRoleModal onClose={() => setRoleModalOpen(false)} onRoleCreated={handleRoleCreated} permissions={allPermissions} />
//       )}
//       {isUpdateModalOpen && (
//         <UpdateRoleModal
//           role={selectedRole}
//           allPermissions={allPermissions}
//           onClose={() => setUpdateModalOpen(false)}
//           onRoleUpdated={handleUpdateRoleSubmit}
//         />
//       )}
//       <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={confirmDelete} title="Xác nhận xóa" message="Bạn có chắc chắn muốn xóa vai trò này?" />
//     </>
//   );
// };

// export default RoleManagementPage;


// import React, { useState, useEffect } from 'react';
// import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
// import { roleAPI, permissionAPI } from '../services/apiService';
// import Toast from '../components/Toast';
// import CreateRoleModal from '../components/CreateRoleModal';
// import UpdateRoleModal from '../components/UpdateRoleModal';
// import ConfirmationModal from '../components/ConfirmationModal';
// import '../styles/Dashboard.css';

// const RoleManagementPage = () => {
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isRoleModalOpen, setRoleModalOpen] = useState(false);
//   const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
//   const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [roleToDelete, setRoleToDelete] = useState(null);
//   const [allPermissions, setAllPermissions] = useState([]);
//   const [toast, setToast] = useState(null);
//   const [filter, setFilter] = useState('');

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const [rolesRes, permissionsRes] = await Promise.all([
//         roleAPI.getAll(),
//         permissionAPI.getAll()
//       ]);

//       if (rolesRes.data?.code === 1000 && Array.isArray(rolesRes.data.result)) {
//         setRoles(rolesRes.data.result);
//       } else if (Array.isArray(rolesRes.data)) {
//         setRoles(rolesRes.data);
//       } else {
//         setToast({ message: 'Không thể tải danh sách vai trò.', type: 'error' });
//       }

//       if (permissionsRes.data?.code === 1000 && Array.isArray(permissionsRes.data.result)) {
//         setAllPermissions(permissionsRes.data.result);
//       } else if (Array.isArray(permissionsRes.data)) {
//         setAllPermissions(permissionsRes.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       setToast({ message: 'Lỗi khi tải dữ liệu.', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // 👇 SỬA LỖI: Lọc theo roleName
//   const filteredRoles = roles.filter(role => {
//     const nameToCheck = role.roleName || role.name || '';
//     const descToCheck = role.description || '';
//     return nameToCheck.toLowerCase().includes(filter.toLowerCase()) ||
//            descToCheck.toLowerCase().includes(filter.toLowerCase());
//   });

//   const handleRoleCreated = () => {
//     setRoleModalOpen(false);
//     setToast({ message: 'Tạo vai trò thành công!', type: 'success' }); // Thêm thông báo
//     fetchAllData();
//   };

//   const handleUpdateRoleSubmit = async (updatedData) => {
//     setLoading(true);
//     try {
//       const payload = {
//         id: selectedRole.id, 
//         name: updatedData.newName, // API update thường vẫn dùng key 'name'
//         description: updatedData.description,
//         permissions: updatedData.permissions,
//         level: updatedData.level,
//       };
//       await roleAPI.update(payload);
//       setToast({ message: 'Cập nhật vai trò thành công!', type: 'success' });
//       setUpdateModalOpen(false);
//       setSelectedRole(null);
//       fetchAllData();
//     } catch (error) {
//       console.error("Failed to update role:", error);
//       setToast({ message: 'Lỗi khi cập nhật vai trò.', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (role) => {
//     setSelectedRole(JSON.parse(JSON.stringify(role)));
//     setUpdateModalOpen(true);
//   };

//   const handleDelete = (roleId) => {
//     setRoleToDelete(roleId);
//     setConfirmModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (roleToDelete) {
//       try {
//         await roleAPI.delete(roleToDelete);
//         setToast({ message: 'Xóa vai trò thành công!', type: 'success' });
//         fetchAllData();
//       } catch (err) {
//         setToast({ message: err.response?.data?.message || 'Lỗi khi xóa vai trò.', type: 'error' });
//       } finally {
//         setConfirmModalOpen(false);
//         setRoleToDelete(null);
//       }
//     }
//   };

//   return (
//     <>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <div className="dashboard-card">
//         <div className="card-header">
//           <h2>Quản Lý Vai Trò</h2>
//           <button className="btn-primary" onClick={() => setRoleModalOpen(true)}>+ Tạo vai trò mới</button>
//         </div>

//         <div className="filter-container" style={{ marginTop: '20px' }}>
//           <input type="text" placeholder="Lọc theo tên hoặc mô tả vai trò..." value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-input" />
//         </div>

//         {loading ? <p>Đang tải...</p> : (
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th style={{ width: '20%' }}>Tên Vai Trò</th>
//                   <th style={{ width: '25%' }}>Mô Tả</th>
//                   <th style={{ width: '35%' }}>Quyền</th>
//                   <th style={{ width: '10%' }}>Cấp bậc</th>
//                   <th style={{ width: '10%' }}>Hành Động</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredRoles.map((role, index) => (
//                   // 👇 SỬA LỖI KEY: Dùng id hoặc roleName, thêm index để chắc chắn unique
//                   <tr key={role.id || role.roleName || index}>
//                     {/* 👇 SỬA LỖI HIỂN THỊ: Ưu tiên roleName */}
//                     <td style={{ fontWeight: 'bold' }}>
//                       {role.roleName || role.name || 'N/A'}
//                     </td>
//                     <td>{role.description}</td>
                    
//                     <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}> 
//                       {(role.permissions && role.permissions.length > 0)
//                         ? role.permissions.map(p => p.name || p.permissionName).join(', ')
//                         : <span style={{ color: '#888' }}>Chưa có quyền</span>}
//                     </td>

//                     <td style={{ textAlign: 'center' }}>{role.level}</td> 

//                     <td>
//                       <div className="action-buttons">
//                         <FaPencilAlt className="btn-action btn-edit" onClick={() => handleEdit(role)} title="Sửa" />
//                         <FaTrashAlt className="btn-action btn-delete" onClick={() => handleDelete(role.id)} title="Xóa" />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       {isRoleModalOpen && (
//         <CreateRoleModal onClose={() => setRoleModalOpen(false)} onRoleCreated={handleRoleCreated} permissions={allPermissions} />
//       )}
//       {isUpdateModalOpen && (
//         <UpdateRoleModal
//           role={selectedRole}
//           allPermissions={allPermissions}
//           onClose={() => setUpdateModalOpen(false)}
//           onRoleUpdated={handleUpdateRoleSubmit}
//         />
//       )}
//       <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={confirmDelete} title="Xác nhận xóa" message="Bạn có chắc chắn muốn xóa vai trò này?" />
//     </>
//   );
// };

// export default RoleManagementPage;

// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaTrash } from 'react-icons/fa'; // Đổi icon cho thống nhất
// import { roleAPI, permissionAPI } from '../services/apiService';
// import Toast from '../components/Toast';
// import CreateRoleModal from '../components/CreateRoleModal';
// import UpdateRoleModal from '../components/UpdateRoleModal';
// import ConfirmationModal from '../components/ConfirmationModal';
// import '../styles/Dashboard.css';

// const RoleManagementPage = () => {
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isRoleModalOpen, setRoleModalOpen] = useState(false);
//   const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
//   const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [roleToDelete, setRoleToDelete] = useState(null);
//   const [allPermissions, setAllPermissions] = useState([]);
//   const [toast, setToast] = useState(null);
//   const [filter, setFilter] = useState('');

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const [rolesRes, permissionsRes] = await Promise.all([
//         roleAPI.getAll(),
//         permissionAPI.getAll()
//       ]);

//       if (rolesRes.data?.code === 1000 && Array.isArray(rolesRes.data.result)) {
//         setRoles(rolesRes.data.result);
//       } else if (Array.isArray(rolesRes.data)) {
//         setRoles(rolesRes.data);
//       } else {
//         setToast({ message: 'Không thể tải danh sách vai trò.', type: 'error' });
//       }

//       if (permissionsRes.data?.code === 1000 && Array.isArray(permissionsRes.data.result)) {
//         setAllPermissions(permissionsRes.data.result);
//       } else if (Array.isArray(permissionsRes.data)) {
//         setAllPermissions(permissionsRes.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       setToast({ message: 'Lỗi khi tải dữ liệu.', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // Lọc danh sách (Hỗ trợ cả roleName và name)
//   const filteredRoles = roles.filter(role => {
//     const nameToCheck = role.roleName || role.name || '';
//     const descToCheck = role.description || '';
//     return nameToCheck.toLowerCase().includes(filter.toLowerCase()) ||
//            descToCheck.toLowerCase().includes(filter.toLowerCase());
//   });

//   // Xử lý sau khi tạo thành công
//   const handleRoleCreated = () => {
//     setRoleModalOpen(false);
//     setToast({ message: 'Tạo vai trò thành công!', type: 'success' });
//     fetchAllData();
//   };

//   // 🛠️ CẬP NHẬT: Hàm này chỉ cần refresh lại data, không gọi API update nữa
//   const handleRoleUpdated = () => {
//     setUpdateModalOpen(false);
//     setSelectedRole(null);
//     fetchAllData(); // Tải lại danh sách để thấy thay đổi mới nhất
//     // Toast thành công đã được hiển thị bên trong Modal
//   };

//   const handleEdit = (role) => {
//     // Clone object để tránh tham chiếu
//     setSelectedRole(JSON.parse(JSON.stringify(role)));
//     setUpdateModalOpen(true);
//   };

//   const handleDelete = (roleId) => {
//     setRoleToDelete(roleId);
//     setConfirmModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (roleToDelete) {
//       try {
//         await roleAPI.delete(roleToDelete);
//         setToast({ message: 'Xóa vai trò thành công!', type: 'success' });
//         fetchAllData();
//       } catch (err) {
//         setToast({ message: err.response?.data?.message || 'Lỗi khi xóa vai trò.', type: 'error' });
//       } finally {
//         setConfirmModalOpen(false);
//         setRoleToDelete(null);
//       }
//     }
//   };

//   return (
//     <>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <div className="dashboard-card">
//         <div className="card-header">
//           <h2>Quản Lý Vai Trò</h2>
//           <button className="btn-primary" onClick={() => setRoleModalOpen(true)}>+ Tạo vai trò mới</button>
//         </div>

//         <div className="filter-container" style={{ marginTop: '20px' }}>
//           <input 
//             type="text" 
//             placeholder="Lọc theo tên hoặc mô tả vai trò..." 
//             value={filter} 
//             onChange={(e) => setFilter(e.target.value)} 
//             className="filter-input" 
//           />
//         </div>

//         {loading ? <p>Đang tải...</p> : (
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th style={{ width: '20%' }}>Tên Vai Trò</th>
//                   <th style={{ width: '25%' }}>Mô Tả</th>
//                   <th style={{ width: '35%' }}>Quyền</th>
//                   <th style={{ width: '10%' }}>Cấp bậc</th>
//                   <th style={{ width: '10%' }}>Hành Động</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredRoles.map((role, index) => (
//                   <tr key={role.id || index}>
//                     <td style={{ fontWeight: 'bold' }}>
//                       {role.roleName || role.name || 'N/A'}
//                     </td>
//                     <td>{role.description}</td>
                    
//                     {/* 🛠️ CẬP NHẬT: Hiển thị danh sách quyền dùng permissionName */}
//                     <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', fontSize: '0.9em' }}> 
//                       {(role.permissions && role.permissions.length > 0)
//                         ? role.permissions.map(p => p.permissionName || p.name).join(', ')
//                         : <span style={{ color: '#999', fontStyle: 'italic' }}>Chưa có quyền</span>}
//                     </td>

//                     <td style={{ textAlign: 'center' }}>
//                         <span className="badge" style={{ backgroundColor: '#e0e0e0', color: '#333' }}>
//                             {role.level}
//                         </span>
//                     </td> 

//                     <td>
//                       <div className="action-buttons">
//                         <FaEdit 
//                             className="btn-action btn-edit" 
//                             onClick={() => handleEdit(role)} 
//                             title="Sửa" 
//                         />
//                         <FaTrash 
//                             className="btn-action btn-delete" 
//                             onClick={() => handleDelete(role.roleName)} 
//                             title="Xóa" 
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {isRoleModalOpen && (
//         <CreateRoleModal 
//             onClose={() => setRoleModalOpen(false)} 
//             onRoleCreated={handleRoleCreated} 
//             permissions={allPermissions} 
//         />
//       )}

//       {isUpdateModalOpen && (
//         <UpdateRoleModal
//           role={selectedRole}
//           allPermissions={allPermissions}
//           onClose={() => setUpdateModalOpen(false)}
//           onRoleUpdated={handleRoleUpdated} // Truyền hàm refresh vào đây
//         />
//       )}

//       <ConfirmationModal 
//         isOpen={isConfirmModalOpen} 
//         onClose={() => setConfirmModalOpen(false)} 
//         onConfirm={confirmDelete} 
//         title="Xác nhận xóa" 
//         message="Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác." 
//       />
//     </>
//   );
// };

// export default RoleManagementPage;

// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaTrash } from 'react-icons/fa'; 
// import { roleAPI, permissionAPI } from '../services/apiService';
// import Toast from '../components/Toast';
// import CreateRoleModal from '../components/CreateRoleModal';
// import UpdateRoleModal from '../components/UpdateRoleModal';
// import ConfirmationModal from '../components/ConfirmationModal';
// import '../styles/Dashboard.css';

// const RoleManagementPage = () => {
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isRoleModalOpen, setRoleModalOpen] = useState(false);
//   const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
//   const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [roleToDelete, setRoleToDelete] = useState(null);
//   const [allPermissions, setAllPermissions] = useState([]);
//   const [toast, setToast] = useState(null);
//   const [filter, setFilter] = useState('');

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const [rolesRes, permissionsRes] = await Promise.all([
//         roleAPI.getAll(),
//         permissionAPI.getAll()
//       ]);

//       if (rolesRes.data?.code === 1000 && Array.isArray(rolesRes.data.result)) {
//         setRoles(rolesRes.data.result);
//       } else if (Array.isArray(rolesRes.data)) {
//         setRoles(rolesRes.data);
//       } else {
//         setToast({ message: 'Không thể tải danh sách vai trò.', type: 'error' });
//       }

//       if (permissionsRes.data?.code === 1000 && Array.isArray(permissionsRes.data.result)) {
//         setAllPermissions(permissionsRes.data.result);
//       } else if (Array.isArray(permissionsRes.data)) {
//         setAllPermissions(permissionsRes.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       setToast({ message: 'Lỗi khi tải dữ liệu.', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const filteredRoles = roles.filter(role => {
//     const nameToCheck = role.roleName || role.name || '';
//     const descToCheck = role.description || '';
//     return nameToCheck.toLowerCase().includes(filter.toLowerCase()) ||
//            descToCheck.toLowerCase().includes(filter.toLowerCase());
//   });

//   const handleRoleCreated = () => {
//     setRoleModalOpen(false);
//     setToast({ message: 'Tạo vai trò thành công!', type: 'success' });
//     fetchAllData();
//   };

//   const handleRoleUpdated = () => {
//     setUpdateModalOpen(false);
//     setSelectedRole(null);
//     fetchAllData(); 
//   };

//   const handleEdit = (role) => {
//     setSelectedRole(JSON.parse(JSON.stringify(role)));
//     setUpdateModalOpen(true);
//   };

//   const handleDelete = (roleId) => {
//     setRoleToDelete(roleId);
//     setConfirmModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (roleToDelete) {
//       try {
//         await roleAPI.delete(roleToDelete);
//         setToast({ message: 'Xóa vai trò thành công!', type: 'success' });
//         fetchAllData();
//       } catch (err) {
//         setToast({ message: err.response?.data?.message || 'Lỗi khi xóa vai trò.', type: 'error' });
//       } finally {
//         setConfirmModalOpen(false);
//         setRoleToDelete(null);
//       }
//     }
//   };

//   return (
//     <>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <div className="dashboard-card">
//         <div className="card-header">
//           <h2>Quản Lý Vai Trò</h2>
//           <button className="btn-primary" onClick={() => setRoleModalOpen(true)}>+ Tạo vai trò mới</button>
//         </div>

//         <div className="filter-container" style={{ marginTop: '20px' }}>
//           <input 
//             type="text" 
//             placeholder="Lọc theo tên hoặc mô tả vai trò..." 
//             value={filter} 
//             onChange={(e) => setFilter(e.target.value)} 
//             className="filter-input" 
//           />
//         </div>

//         {loading ? <p>Đang tải...</p> : (
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th style={{ width: '20%' }}>Tên Vai Trò</th>
//                   <th style={{ width: '25%' }}>Mô Tả</th>
//                   <th style={{ width: '35%' }}>Quyền</th>
//                   <th style={{ width: '10%' }}>Cấp bậc</th>
//                   <th style={{ width: '10%' }}>Hành Động</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredRoles.map((role, index) => (
//                   <tr key={role.id || index}>
//                     <td style={{ fontWeight: 'bold' }}>
//                       {role.roleName || role.name || 'N/A'}
//                     </td>
//                     <td>{role.description}</td>
                    
//                     <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', fontSize: '0.9em' }}> 
//                       {(role.permissions && role.permissions.length > 0)
//                         ? role.permissions.map(p => p.permissionName || p.name).join(', ')
//                         : <span style={{ color: '#999', fontStyle: 'italic' }}>Chưa có quyền</span>}
//                     </td>

//                     {/* 🛠️ ĐÃ SỬA: Bỏ nền xám, làm đậm số Level */}
//                     <td style={{ textAlign: 'center' }}>
//                         <span style={{ fontWeight: 'bold', fontSize: '1.1em', color: '#2c3e50' }}>
//                             {role.level}
//                         </span>
//                     </td> 

//                     <td>
//                       <div className="action-buttons">
//                         <FaEdit 
//                             className="btn-action btn-edit" 
//                             onClick={() => handleEdit(role)} 
//                             title="Sửa" 
//                         />
//                         <FaTrash 
//                             className="btn-action btn-delete" 
//                             onClick={() => handleDelete(role.roleName)} 
//                             title="Xóa" 
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {isRoleModalOpen && (
//         <CreateRoleModal 
//             onClose={() => setRoleModalOpen(false)} 
//             onRoleCreated={handleRoleCreated} 
//             permissions={allPermissions} 
//         />
//       )}

//       {isUpdateModalOpen && (
//         <UpdateRoleModal
//           role={selectedRole}
//           allPermissions={allPermissions}
//           onClose={() => setUpdateModalOpen(false)}
//           onRoleUpdated={handleRoleUpdated} 
//         />
//       )}

//       <ConfirmationModal 
//         isOpen={isConfirmModalOpen} 
//         onClose={() => setConfirmModalOpen(false)} 
//         onConfirm={confirmDelete} 
//         title="Xác nhận xóa" 
//         message="Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác." 
//       />
//     </>
//   );
// };

// export default RoleManagementPage;

// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaTrash, FaFilter, FaRedo, FaChevronUp, FaChevronDown } from 'react-icons/fa'; 
// import { roleAPI, permissionAPI } from '../services/apiService';
// import Toast from '../components/Toast';
// import CreateRoleModal from '../components/CreateRoleModal';
// import UpdateRoleModal from '../components/UpdateRoleModal';
// import ConfirmationModal from '../components/ConfirmationModal';
// import '../styles/Dashboard.css';

// const RoleManagementPage = () => {
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // Modal states
//   const [isRoleModalOpen, setRoleModalOpen] = useState(false);
//   const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
//   const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [roleToDelete, setRoleToDelete] = useState(null);
//   const [allPermissions, setAllPermissions] = useState([]);
//   const [toast, setToast] = useState(null);

//   // --- 1. STATE MỚI: BẬT/TẮT BỘ LỌC ---
//   const [showFilter, setShowFilter] = useState(false); // Mặc định là tắt

//   // State bộ lọc
//   const [filters, setFilters] = useState({
//     name: '',
//     description: '',
//     permission: '',
//     level: ''
//   });

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const [rolesRes, permissionsRes] = await Promise.all([
//         roleAPI.getAll(),
//         permissionAPI.getAll()
//       ]);

//       if (rolesRes.data?.code === 1000 && Array.isArray(rolesRes.data.result)) {
//         setRoles(rolesRes.data.result);
//       } else if (Array.isArray(rolesRes.data)) {
//         setRoles(rolesRes.data);
//       } else {
//         setToast({ message: 'Không thể tải danh sách vai trò.', type: 'error' });
//       }

//       if (permissionsRes.data?.code === 1000 && Array.isArray(permissionsRes.data.result)) {
//         setAllPermissions(permissionsRes.data.result);
//       } else if (Array.isArray(permissionsRes.data)) {
//         setAllPermissions(permissionsRes.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       setToast({ message: 'Lỗi khi tải dữ liệu.', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const handleFilterChange = (field, value) => {
//     setFilters(prev => ({ ...prev, [field]: value }));
//   };

//   const resetFilters = () => {
//     setFilters({ name: '', description: '', permission: '', level: '' });
//   };

//   const filteredRoles = roles.filter(role => {
//     // Nếu bộ lọc đang TẮT, có thể chọn return true luôn để hiện tất cả
//     // Hoặc vẫn lọc ngầm (tùy ý bạn). Ở đây mình vẫn để lọc ngầm kể cả khi ẩn.
    
//     const roleName = (role.roleName || role.name || '').toLowerCase();
//     const roleDesc = (role.description || '').toLowerCase();
//     const roleLevel = (role.level !== null && role.level !== undefined) ? String(role.level) : '';
    
//     const rolePerms = (role.permissions || [])
//         .map(p => (p.permissionName || p.name || '').toLowerCase())
//         .join(' ');

//     const filterName = filters.name.toLowerCase();
//     const filterDesc = filters.description.toLowerCase();
//     const filterLevel = filters.level; 
//     const filterPerm = filters.permission.toLowerCase();

//     return roleName.includes(filterName) &&
//            roleDesc.includes(filterDesc) &&
//            roleLevel.includes(filterLevel) &&
//            rolePerms.includes(filterPerm);
//   });

//   // ... (Giữ nguyên các hàm handleRoleCreated, handleRoleUpdated, handleEdit, handleDelete, confirmDelete)
//   const handleRoleCreated = () => {
//     setRoleModalOpen(false);
//     setToast({ message: 'Tạo vai trò thành công!', type: 'success' });
//     fetchAllData();
//   };
//   const handleRoleUpdated = () => {
//     setUpdateModalOpen(false);
//     setSelectedRole(null);
//     fetchAllData(); 
//   };
//   const handleEdit = (role) => {
//     setSelectedRole(JSON.parse(JSON.stringify(role)));
//     setUpdateModalOpen(true);
//   };
//   const handleDelete = (roleId) => {
//     setRoleToDelete(roleId);
//     setConfirmModalOpen(true);
//   };
//   const confirmDelete = async () => {
//     if (roleToDelete) {
//       try {
//         await roleAPI.delete(roleToDelete);
//         setToast({ message: 'Xóa vai trò thành công!', type: 'success' });
//         fetchAllData();
//       } catch (err) {
//         setToast({ message: err.response?.data?.message || 'Lỗi khi xóa vai trò.', type: 'error' });
//       } finally {
//         setConfirmModalOpen(false);
//         setRoleToDelete(null);
//       }
//     }
//   };
//   // ... (Kết thúc các hàm logic cũ)

//   return (
//     <>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <div className="dashboard-card">
        
//         {/* --- 2. HEADER: THÊM NÚT BẬT/TẮT --- */}
//         <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <h2>Quản Lý Vai Trò</h2>
//           <div style={{ display: 'flex', gap: '10px' }}>
//             {/* Nút Bật/Tắt Bộ Lọc */}
//             <button 
//                 className="btn-secondary"
//                 onClick={() => setShowFilter(!showFilter)}
//                 style={{ 
//                     display: 'flex', alignItems: 'center', gap: '5px', 
//                     border: '1px solid #ddd', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' 
//                 }}
//             >
//                 <FaFilter /> {showFilter ? 'Ẩn bộ lọc' : 'Lọc danh sách'} {showFilter ? <FaChevronUp/> : <FaChevronDown/>}
//             </button>

//             <button className="btn-primary" onClick={() => setRoleModalOpen(true)}>
//                 + Tạo vai trò mới
//             </button>
//           </div>
//         </div>

//         {/* --- 3. ĐIỀU KIỆN HIỂN THỊ (&&) --- */}
//         {showFilter && (
//             <div className="filter-bar" style={{ 
//                 marginTop: '20px', 
//                 padding: '20px', 
//                 backgroundColor: '#f8f9fa', 
//                 borderRadius: '8px',
//                 border: '1px solid #e9ecef',
//                 display: 'flex',
//                 flexWrap: 'wrap',
//                 gap: '15px',
//                 alignItems: 'flex-end',
//                 animation: 'fadeIn 0.3s' // Hiệu ứng hiện ra nhẹ nhàng
//             }}>
//                 <div style={{ flex: 1, minWidth: '150px' }}>
//                     <label style={{fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Lọc Tên</label>
//                     <input 
//                         type="text" className="filter-input" placeholder="Tìm tên..." 
//                         value={filters.name}
//                         onChange={(e) => handleFilterChange('name', e.target.value)}
//                         style={{ width: '100%', marginTop: '5px' }}
//                     />
//                 </div>
                
//                 <div style={{ flex: 1.5, minWidth: '200px' }}>
//                     <label style={{fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Lọc Mô tả</label>
//                     <input 
//                         type="text" className="filter-input" placeholder="Tìm mô tả..." 
//                         value={filters.description}
//                         onChange={(e) => handleFilterChange('description', e.target.value)}
//                         style={{ width: '100%', marginTop: '5px' }}
//                     />
//                 </div>

//                 <div style={{ flex: 1.5, minWidth: '200px' }}>
//                     <label style={{fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Lọc Quyền</label>
//                     <input 
//                         type="text" className="filter-input" placeholder="Tìm quyền..." 
//                         value={filters.permission}
//                         onChange={(e) => handleFilterChange('permission', e.target.value)}
//                         style={{ width: '100%', marginTop: '5px' }}
//                     />
//                 </div>

//                 <div style={{ flex: 0.5, minWidth: '80px' }}>
//                     <label style={{fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Cấp độ</label>
//                     <input 
//                         type="text" className="filter-input" placeholder="Số..." 
//                         value={filters.level}
//                         onChange={(e) => handleFilterChange('level', e.target.value)}
//                         style={{ width: '100%', marginTop: '5px' }}
//                     />
//                 </div>

//                 <button 
//                         onClick={resetFilters}
//                         className="btn-secondary"
//                         style={{ height: '38px', padding: '0 15px', display: 'flex', alignItems: 'center', gap: '5px' }}
//                         title="Xóa bộ lọc"
//                 >
//                     <FaRedo /> Reset
//                 </button>
//             </div>
//         )}

//         {/* --- 4. BẢNG DỮ LIỆU (Giữ nguyên) --- */}
//         {loading ? <p>Đang tải...</p> : (
//           <div className="table-container" style={{ marginTop: '15px' }}>
//             <table>
//               <thead>
//                 <tr>
//                   <th style={{ width: '20%' }}>Tên Vai Trò</th>
//                   <th style={{ width: '25%' }}>Mô Tả</th>
//                   <th style={{ width: '35%' }}>Quyền</th>
//                   <th style={{ width: '10%' }}>Cấp bậc</th>
//                   <th style={{ width: '10%' }}>Hành Động</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredRoles.length > 0 ? (
//                     filteredRoles.map((role, index) => (
//                     <tr key={role.id || index}>
//                         <td style={{ fontWeight: 'bold' }}>
//                         {role.roleName || role.name || 'N/A'}
//                         </td>
//                         <td>{role.description}</td>
                        
//                         <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', fontSize: '0.9em' }}> 
//                         {(role.permissions && role.permissions.length > 0)
//                             ? role.permissions.map(p => p.permissionName || p.name).join(', ')
//                             : <span style={{ color: '#999', fontStyle: 'italic' }}>Chưa có quyền</span>}
//                         </td>

//                         <td style={{ textAlign: 'center' }}>
//                             <span style={{ fontWeight: 'bold', fontSize: '1.1em', color: '#2c3e50' }}>
//                                 {role.level}
//                             </span>
//                         </td> 

//                         <td>
//                         <div className="action-buttons">
//                             <FaEdit className="btn-action btn-edit" onClick={() => handleEdit(role)} title="Sửa" />
//                             <FaTrash className="btn-action btn-delete" onClick={() => handleDelete(role.roleName)} title="Xóa" />
//                         </div>
//                         </td>
//                     </tr>
//                     ))
//                 ) : (
//                     <tr>
//                         <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
//                             <div>Không tìm thấy vai trò nào khớp với bộ lọc.</div>
//                         </td>
//                     </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {isRoleModalOpen && (
//         <CreateRoleModal onClose={() => setRoleModalOpen(false)} onRoleCreated={handleRoleCreated} permissions={allPermissions} />
//       )}
//       {isUpdateModalOpen && (
//         <UpdateRoleModal role={selectedRole} allPermissions={allPermissions} onClose={() => setUpdateModalOpen(false)} onRoleUpdated={handleRoleUpdated} />
//       )}
//       <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={confirmDelete} title="Xác nhận xóa" message="Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác." />
//     </>
//   );
// };

// export default RoleManagementPage;


import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaFilter, FaRedo, FaChevronUp, FaChevronDown } from 'react-icons/fa'; 
import { roleAPI, permissionAPI } from '../services/apiService';
import Toast from '../components/Toast';
import CreateRoleModal from '../components/CreateRoleModal';
import UpdateRoleModal from '../components/UpdateRoleModal';
import ConfirmationModal from '../components/ConfirmationModal';
import '../styles/Dashboard.css';

const RoleManagementPage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isRoleModalOpen, setRoleModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [allPermissions, setAllPermissions] = useState([]);
  const [toast, setToast] = useState(null);

  // State bộ lọc
  const [showFilter, setShowFilter] = useState(false); 
  const [filters, setFilters] = useState({
    name: '',
    description: '',
    permission: '',
    level: ''
  });

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        roleAPI.getAll(),
        permissionAPI.getAll()
      ]);

      if (rolesRes.data?.code === 1000 && Array.isArray(rolesRes.data.result)) {
        setRoles(rolesRes.data.result);
      } else if (Array.isArray(rolesRes.data)) {
        setRoles(rolesRes.data);
      } else {
        setToast({ message: 'Không thể tải danh sách vai trò.', type: 'error' });
      }

      if (permissionsRes.data?.code === 1000 && Array.isArray(permissionsRes.data.result)) {
        setAllPermissions(permissionsRes.data.result);
      } else if (Array.isArray(permissionsRes.data)) {
        setAllPermissions(permissionsRes.data);
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

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({ name: '', description: '', permission: '', level: '' });
  };

  const filteredRoles = roles.filter(role => {
    const roleName = (role.roleName || role.name || '').toLowerCase();
    const roleDesc = (role.description || '').toLowerCase();
    const roleLevel = (role.level !== null && role.level !== undefined) ? String(role.level) : '';
    
    const rolePerms = (role.permissions || [])
        .map(p => (p.permissionName || p.name || '').toLowerCase())
        .join(' ');

    const filterName = filters.name.toLowerCase();
    const filterDesc = filters.description.toLowerCase();
    const filterLevel = filters.level; 
    const filterPerm = filters.permission.toLowerCase();

    return roleName.includes(filterName) &&
           roleDesc.includes(filterDesc) &&
           roleLevel.includes(filterLevel) &&
           rolePerms.includes(filterPerm);
  });

  const handleRoleCreated = () => {
    setRoleModalOpen(false);
    setToast({ message: 'Tạo vai trò thành công!', type: 'success' });
    fetchAllData();
  };
  const handleRoleUpdated = () => {
    setUpdateModalOpen(false);
    setSelectedRole(null);
    fetchAllData(); 
  };
  const handleEdit = (role) => {
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
        setToast({ message: err.response?.data?.message || 'Lỗi khi xóa vai trò.', type: 'error' });
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
        
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Quản Lý Vai Trò</h2>
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

            <button className="btn-primary" onClick={() => setRoleModalOpen(true)}>
                + Tạo vai trò mới
            </button>
          </div>
        </div>

        {showFilter && (
            <div className="filter-bar" style={{ 
                marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', 
                borderRadius: '8px', border: '1px solid #e9ecef', display: 'flex',
                flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end', animation: 'fadeIn 0.3s'
            }}>
                <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={{fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Lọc Tên</label>
                    <input type="text" className="filter-input" placeholder="Tìm tên..." value={filters.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)} style={{ width: '100%', marginTop: '5px' }} />
                </div>
                <div style={{ flex: 1.5, minWidth: '200px' }}>
                    <label style={{fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Lọc Mô tả</label>
                    <input type="text" className="filter-input" placeholder="Tìm mô tả..." value={filters.description}
                        onChange={(e) => handleFilterChange('description', e.target.value)} style={{ width: '100%', marginTop: '5px' }} />
                </div>
                <div style={{ flex: 1.5, minWidth: '200px' }}>
                    <label style={{fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Lọc Quyền</label>
                    <input type="text" className="filter-input" placeholder="Tìm quyền..." value={filters.permission}
                        onChange={(e) => handleFilterChange('permission', e.target.value)} style={{ width: '100%', marginTop: '5px' }} />
                </div>
                <div style={{ flex: 0.5, minWidth: '80px' }}>
                    <label style={{fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Cấp độ</label>
                    <input type="text" className="filter-input" placeholder="Số..." value={filters.level}
                        onChange={(e) => handleFilterChange('level', e.target.value)} style={{ width: '100%', marginTop: '5px' }} />
                </div>
                <button onClick={resetFilters} className="btn-secondary" style={{ height: '38px', padding: '0 15px', display: 'flex', alignItems: 'center', gap: '5px' }} title="Xóa bộ lọc">
                    <FaRedo /> Reset
                </button>
            </div>
        )}

        {loading ? <p>Đang tải...</p> : (
          <div className="table-container" style={{ marginTop: '15px' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Tên Vai Trò</th>
                  <th style={{ width: '25%' }}>Mô Tả</th>
                  <th style={{ width: '35%' }}>Quyền</th>
                  <th style={{ width: '10%' }}>Cấp bậc</th>
                  <th style={{ width: '10%' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.length > 0 ? (
                    filteredRoles.map((role, index) => {
                    // 👇 1. KIỂM TRA ROLE ADMIN (để ẩn nút xóa)
                    const roleName = role.roleName || role.name || '';
                    const isAdmin = roleName.toUpperCase() === 'ADMIN';

                    return (
                        <tr key={role.id || index}>
                            <td style={{ fontWeight: 'bold' }}>
                            {roleName || 'N/A'}
                            </td>
                            <td>{role.description}</td>
                            
                            <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', fontSize: '0.9em' }}> 
                            {(role.permissions && role.permissions.length > 0)
                                ? role.permissions.map(p => p.permissionName || p.name).join(', ')
                                : <span style={{ color: '#999', fontStyle: 'italic' }}>Chưa có quyền</span>}
                            </td>

                            <td style={{ textAlign: 'center' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1em', color: '#2c3e50' }}>
                                    {role.level}
                                </span>
                            </td> 

                            <td>
                            <div className="action-buttons">
                                <FaEdit className="btn-action btn-edit" onClick={() => handleEdit(role)} title="Sửa" />
                                
                                {/* 👇 2. CHỈ HIỂN THỊ NÚT XÓA NẾU KHÔNG PHẢI ADMIN */}
                                {!isAdmin && (
                                    <FaTrash className="btn-action btn-delete" onClick={() => handleDelete(roleName)} title="Xóa" />
                                )}
                            </div>
                            </td>
                        </tr>
                    );
                    })
                ) : (
                    <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                            <div>Không tìm thấy vai trò nào khớp với bộ lọc.</div>
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isRoleModalOpen && (
        <CreateRoleModal onClose={() => setRoleModalOpen(false)} onRoleCreated={handleRoleCreated} permissions={allPermissions} />
      )}
      {isUpdateModalOpen && (
        <UpdateRoleModal role={selectedRole} allPermissions={allPermissions} onClose={() => setUpdateModalOpen(false)} onRoleUpdated={handleRoleUpdated} />
      )}
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={confirmDelete} title="Xác nhận xóa" message="Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác." />
    </>
  );
};

export default RoleManagementPage;