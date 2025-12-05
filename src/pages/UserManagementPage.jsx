// import React, { useState, useEffect } from 'react';
// import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
// import { userAPI, roleAPI } from '../services/apiService';
// import Toast from '../components/Toast';
// import CreateUserModal from '../components/CreateUserModal';
// import UpdateUserModal from '../components/UpdateUserModal';
// import ConfirmationModal from '../components/ConfirmationModal';
// import '../styles/Dashboard.css';

// const UserManagementPage = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState(null);
//   const [isCreateModalOpen, setCreateModalOpen] = useState(false);
//   const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null); // State for selected user
//   const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [allRoles, setAllRoles] = useState([]);
//   const [filters, setFilters] = useState({
//     userID: '',
//     email: '',
//     fullName: '',
//     gender: '',
//     phone: '',
//     roleId: '',
//     birthDateFrom: '',
//     birthDateTo: '',
//     createdAtFrom: '',
//     createdAtTo: '',
//   });
//   const [isFilterVisible, setIsFilterVisible] = useState(false);
//   const [userToDelete, setUserToDelete] = useState(null);

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const userResponse = await userAPI.getAllUsers();
//       if (Array.isArray(userResponse.data)) {
//         setUsers(userResponse.data);
//       } else {
//         throw new Error('Dữ liệu người dùng trả về không hợp lệ.');
//       }
      
//       const roleResponse = await roleAPI.getAll();
//       if (roleResponse.data?.code === 1000 && Array.isArray(roleResponse.data.result)) {
//         setAllRoles(roleResponse.data.result);
//       } else if (Array.isArray(roleResponse.data)) {
//         setAllRoles(roleResponse.data);
//       }

//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       setToast({ message: error.message || 'Lỗi khi tải dữ liệu.', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('vi-VN');
//   };

//   const handleUserCreated = () => {
//     setCreateModalOpen(false);
//     setToast({ message: 'Tạo người dùng thành công!', type: 'success' });
//     fetchAllData();
//   };
  
//   const handleUserUpdated = () => {
//     setUpdateModalOpen(false);
//     setToast({ message: 'Cập nhật người dùng thành công!', type: 'success' });
//     fetchAllData();
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSearch = async () => {
//     setLoading(true);
//     try {
//       // Tạo một bản sao của filters để xử lý
//       const processedFilters = { ...filters };

//       // Xử lý trường giới tính: chuyển từ tiếng Việt sang tiếng Anh và chuẩn hóa
//       if (processedFilters.gender) {
//         const genderLower = processedFilters.gender.toLowerCase();
//         if (genderLower === 'nam') {
//           processedFilters.gender = 'Male';
//         } else if (genderLower === 'nữ') {
//           processedFilters.gender = 'Female';
//         } else if (genderLower === 'khác') {
//           processedFilters.gender = 'Other';
//         }
//         // Nếu người dùng nhập thẳng tiếng Anh, nó sẽ được giữ nguyên
//       }

//       // Lọc ra các giá trị không rỗng để gửi đi
//       const searchCriteria = Object.fromEntries(Object.entries(processedFilters).filter(([_, v]) => v !== ''));
//       const response = await userAPI.search(searchCriteria);
//       // Kiểm tra cấu trúc response từ API search
//       if (response.data?.code === 1000 && Array.isArray(response.data.result)) {
//         setUsers(response.data.result); // Lấy dữ liệu từ thuộc tính 'result'
//       } else {
//         console.error("Dữ liệu tìm kiếm trả về không hợp lệ:", response.data);
//         setUsers([]); // Nếu không có kết quả hoặc lỗi, hiển thị bảng rỗng
//       }
//     } catch (error) {
//       setToast({ message: 'Lỗi khi tìm kiếm người dùng.', type: 'error' });
//       setUsers([]); // Dọn dẹp danh sách người dùng khi có lỗi
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (user) => {
//     setSelectedUser(user);
//     setUpdateModalOpen(true);
//   };

//   const handleDelete = (userId) => {
//     setUserToDelete(userId);
//     setConfirmModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (userToDelete) {
//       try {
//         await userAPI.delete(userToDelete);
//         setToast({ message: 'Xóa người dùng thành công!', type: 'success' });
//         fetchAllData();
//       } catch (err) {
//         setToast({ message: 'Lỗi khi xóa người dùng.', type: 'error' });
//       } finally {
//         setConfirmModalOpen(false);
//         setUserToDelete(null);
//       }
//     }
//   };

//   // Hàm tìm tên vai trò dựa trên ID
//   const getRoleName = (user) => {
//     if (user.role?.name) return user.role.name; // Ưu tiên cấu trúc có sẵn
//     const role = allRoles.find(r => r.id === user.roleId);
//     return role?.name || 'N/A';
//   };

//   return (
//     <>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <div className="dashboard-card">
//         <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <h2>Quản Lý Người Dùng</h2>
//           <div>
//             <button className="btn-secondary" style={{ marginRight: '10px' }} onClick={() => setIsFilterVisible(!isFilterVisible)}>
//               {isFilterVisible ? 'Ẩn Bộ Lọc' : 'Hiện Bộ Lọc'}
//             </button>
//             <button className="btn-primary" onClick={() => setCreateModalOpen(true)}>+ Tạo người dùng mới</button>
//           </div>
//         </div>

//         {isFilterVisible && (
//           <div className="filter-container">
//             <div className="filter-grid">
//               <input type="text" name="userID" placeholder="User ID" value={filters.userID} onChange={handleFilterChange} className="filter-input" />
//               <input type="text" name="fullName" placeholder="Họ Tên" value={filters.fullName} onChange={handleFilterChange} className="filter-input" />
//               <input type="email" name="email" placeholder="Email" value={filters.email} onChange={handleFilterChange} className="filter-input" />
//               <input type="text" name="phone" placeholder="Số điện thoại" value={filters.phone} onChange={handleFilterChange} className="filter-input" />

//               <select name="gender" value={filters.gender} onChange={handleFilterChange} className="filter-input">
//                 <option value="">Chọn giới tính</option>
//                 <option value="Nam">Nam</option>
//                 <option value="Nữ">Nữ</option>
//                 <option value="Khác">Khác</option>
//               </select>
//               <select name="roleId" value={filters.roleId} onChange={handleFilterChange} className="filter-input">
//                 <option value="">Chọn vai trò</option>
//                 {allRoles.map(role => (
//                   <option key={role.id} value={role.id}>{role.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="filter-grid date-range">
//               <div className="date-filter">
//                 <label>Ngày sinh từ:</label>
//                 <input type="date" name="birthDateFrom" value={filters.birthDateFrom} onChange={handleFilterChange} className="filter-input" />
//               </div>
//               <div className="date-filter">
//                 <label>đến:</label>
//                 <input type="date" name="birthDateTo" value={filters.birthDateTo} onChange={handleFilterChange} className="filter-input" />
//               </div>
//             </div>
//             <div className="filter-grid date-range">
//               <div className="date-filter">
//                 <label>Ngày tạo từ:</label>
//                 <input type="date" name="createdAtFrom" value={filters.createdAtFrom} onChange={handleFilterChange} className="filter-input" />
//               </div>
//               <div className="date-filter">
//                 <label>đến:</label>
//                 <input type="date" name="createdAtTo" value={filters.createdAtTo} onChange={handleFilterChange} className="filter-input" />
//               </div>
//             </div>
//             <div className="filter-actions">
//               <button className="btn-primary" onClick={handleSearch}>Tìm Kiếm</button>
//               <button className="btn-secondary" onClick={() => {
//                 setFilters({
//                   userID: '', email: '', fullName: '', gender: '', phone: '', roleId: '',
//                   birthDateFrom: '', birthDateTo: '', createdAtFrom: '', createdAtTo: ''
//                 });
//                 fetchAllData(); // Tải lại toàn bộ danh sách
//               }}>Xóa Bộ Lọc</button>
//             </div>
//           </div>
//         )}

//         {loading ? (
//           <p>Đang tải danh sách người dùng...</p>
//         ) : (
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th>User ID</th>
//                   <th>Họ Tên</th>
//                   <th>Email</th>
//                   <th>Vai Trò</th>
//                   <th className="col-phone">Số điện thoại</th>

//                   <th>Giới tính</th>
//                   <th>Ngày sinh</th>
//                   <th>Ngày tạo</th>
//                   <th>Hành Động</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((u) => (
//                   <tr key={u.userID}>
//                     <td>{u.userID}</td>
//                     <td>{u.fullName}</td>
//                     <td>{u.email}</td>
//                     <td><span className="role-badge">{getRoleName(u)}</span></td>
//                     <td className="col-phone">
//                       {u.phone || 'N/A'}
//                     </td>

//                     <td>{u.gender || 'N/A'}</td>
//                     <td>{formatDate(u.birthDate)}</td>
//                     <td>{formatDate(u.createdAt)}</td>
//                     <td>
//                       <div className="action-buttons">
//                         <FaPencilAlt
//                           className="btn-action btn-edit"
//                           onClick={() => handleEdit(u)}
//                           title="Sửa"
//                         />
//                         <FaTrashAlt
//                           className="btn-action btn-delete"
//                           onClick={() => handleDelete(u.userID)}
//                           title="Xóa"
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
//       {isCreateModalOpen && (
//         <CreateUserModal
//           onClose={() => setCreateModalOpen(false)}
//           onUserCreated={handleUserCreated}
//           roles={allRoles}
//         />
//       )}
//       {isUpdateModalOpen && (
//         <UpdateUserModal
//           user={selectedUser}
//           roles={allRoles}
//           onClose={() => setUpdateModalOpen(false)}
//           onUserUpdated={handleUserUpdated}
//         />
//       )}
//       <ConfirmationModal
//         isOpen={isConfirmModalOpen}
//         onClose={() => setConfirmModalOpen(false)}
//         onConfirm={confirmDelete}
//         title="Xác nhận xóa"
//         message="Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác."
//       />
//     </>
//   );
// };

// export default UserManagementPage;

// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
// import { userAPI, roleAPI } from '../services/apiService';
// import Toast from '../components/Toast';
// import CreateUserModal from '../components/CreateUserModal';
// import UpdateUserModal from '../components/UpdateUserModal'; 
// import ConfirmationModal from '../components/ConfirmationModal'; 
// import '../styles/Dashboard.css';

// const UserManagementPage = ({ onRefresh }) => { 
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState(null);
//   const [isCreateModalOpen, setCreateModalOpen] = useState(false);
//   const [isUpdateModalOpen, setUpdateModalOpen] = useState(false); 
//   const [isConfirmModalOpen, setConfirmModalOpen] = useState(false); 
//   const [selectedUser, setSelectedUser] = useState(null); 
//   const [allRoles, setAllRoles] = useState([]);
//   const [userToDelete, setUserToDelete] = useState(null); 

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const userResponse = await userAPI.getAllUsers();
//       if (Array.isArray(userResponse.data)) {
//         setUsers(userResponse.data);
//       } else {
//         throw new Error('Dữ liệu người dùng trả về không hợp lệ.');
//       }
      
//       const roleResponse = await roleAPI.getAll();
//       if (roleResponse.data?.code === 1000 && Array.isArray(roleResponse.data.result)) {
//         setAllRoles(roleResponse.data.result);
//       } else if (Array.isArray(roleResponse.data)) {
//         setAllRoles(roleResponse.data);
//       }

//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       setToast({ message: error.message || 'Lỗi khi tải dữ liệu.', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   useEffect(() => {
//     if (isUpdateModalOpen) {
//       document.body.classList.add('modal-open');
//     } else {
//       document.body.classList.remove('modal-open');
//     }
//     return () => {
//       document.body.classList.remove('modal-open'); 
//     };
//   }, [isUpdateModalOpen]);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('vi-VN');
//   };

//   const handleUserCreated = () => {
//     setCreateModalOpen(false);
//     setToast({ message: 'Tạo người dùng thành công!', type: 'success' });
//     fetchAllData();
//   };
  
//   const handleUserUpdated = (updatedUserId) => {
//     setUpdateModalOpen(false);
//     setToast({ message: 'Cập nhật người dùng thành công!', type: 'success' });
//     fetchAllData(); 
    
//     // Refresh lại App nếu người dùng tự sửa chính mình
//     if (onRefresh && selectedUser?.userID === updatedUserId) {
//       onRefresh(); 
//     }
//   };

//   const handleEdit = (user) => {
//     setSelectedUser(user);
//     setUpdateModalOpen(true);
//   };

//   const handleDelete = async (userId) => {
//     setUserToDelete(userId);
//     setConfirmModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (userToDelete) {
//         try {
//             await userAPI.delete(userToDelete);
//             setToast({ message: 'Xóa người dùng thành công!', type: 'success' });
//             fetchAllData();
//         } catch (err) {
//             setToast({ message: 'Lỗi khi xóa người dùng.', type: 'error' });
//         } finally {
//             setConfirmModalOpen(false);
//             setUserToDelete(null);
//         }
//     }
//   };

//   return (
//     <>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <div className="dashboard-card">
//         <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <h2>Quản Lý Người Dùng</h2>
//           <button className="btn-primary" onClick={() => setCreateModalOpen(true)}>+ Tạo người dùng mới</button>
//         </div>
//         {loading ? (
//           <p>Đang tải danh sách người dùng...</p>
//         ) : (
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th>User ID</th>
//                   <th>Họ Tên</th>
//                   <th>Email</th>
//                   <th>Vai Trò</th>
//                   <th>Giới tính</th>
//                   <th>Ngày sinh</th>
//                   <th>Ngày tạo</th>
//                   <th>Hành Động</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((u) => (
//                   <tr key={u.userID}>
//                     <td>{u.userID}</td>
//                     <td>{u.fullName}</td>
//                     <td>{u.email}</td>
                    
//                     {/* 👇 ĐÃ SỬA: Dùng u.role?.roleName thay vì u.role?.name */}
//                     <td>
//                         <span className="role-badge">
//                             {u.role?.roleName || 'N/A'}
//                         </span>
//                     </td>

//                     <td>{u.gender || 'N/A'}</td>
//                     <td>{formatDate(u.birthDate)}</td>
//                     <td>{formatDate(u.createdAt)}</td>
//                     <td>
//                       <div className="action-buttons">
//                         <FaEdit
//                           className="btn-action btn-edit"
//                           onClick={() => handleEdit(u)}
//                           title="Sửa"
//                         />
//                         <FaTrash
//                           className="btn-action btn-delete"
//                           onClick={() => handleDelete(u.userID)}
//                           title="Xóa"
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
//       {isCreateModalOpen && (
//         <CreateUserModal
//           onClose={() => setCreateModalOpen(false)}
//           onUserCreated={handleUserCreated}
//           roles={allRoles}
//         />
//       )}
//       {isUpdateModalOpen && (
//         <UpdateUserModal
//           user={selectedUser}
//           roles={allRoles}
//           onClose={() => setUpdateModalOpen(false)}
//           onUserUpdated={() => handleUserUpdated(selectedUser?.userID)}
//         />
//       )}
//       <ConfirmationModal
//         isOpen={isConfirmModalOpen}
//         onClose={() => setConfirmModalOpen(false)}
//         onConfirm={confirmDelete}
//         title="Xác nhận xóa"
//         message="Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác."
//       />
//     </>
//   );
// };

// export default UserManagementPage;

// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaTrash } from 'react-icons/fa'; 
// import { userAPI, roleAPI } from '../services/apiService';
// import Toast from '../components/Toast';
// import CreateUserModal from '../components/CreateUserModal';
// import UpdateUserModal from '../components/UpdateUserModal'; 
// import ConfirmationModal from '../components/ConfirmationModal'; 
// import '../styles/Dashboard.css';

// const UserManagementPage = ({ onRefresh, currentUserId }) => { 
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState(null);
//   const [isCreateModalOpen, setCreateModalOpen] = useState(false);
//   const [isUpdateModalOpen, setUpdateModalOpen] = useState(false); 
//   const [isConfirmModalOpen, setConfirmModalOpen] = useState(false); 
//   const [selectedUser, setSelectedUser] = useState(null); 
//   const [allRoles, setAllRoles] = useState([]);
//   const [userToDelete, setUserToDelete] = useState(null); 

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const userResponse = await userAPI.getAllUsers();
      
//       if (Array.isArray(userResponse.data)) {
//         const allUsers = userResponse.data;
        
//         // --- 🟢 THAY ĐỔI 1: LỌC BỎ ADMIN KHỎI DANH SÁCH ---
//         // Chỉ hiển thị những user có role KHÔNG PHẢI là "Admin"
//         const filteredUsers = allUsers.filter(u => {
//             const roleName = u.role?.roleName || u.role?.name || '';
//             return roleName.toLowerCase() !== 'admin';
//         });

//         setUsers(filteredUsers);
//       } else {
//         throw new Error('Dữ liệu người dùng trả về không hợp lệ.');
//       }
      
//       const roleResponse = await roleAPI.getAll();
//       if (roleResponse.data?.code === 1000 && Array.isArray(roleResponse.data.result)) {
//         setAllRoles(roleResponse.data.result);
//       } else if (Array.isArray(roleResponse.data)) {
//         setAllRoles(roleResponse.data);
//       }

//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       setToast({ message: error.message || 'Lỗi khi tải dữ liệu.', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // Xử lý class modal-open để tránh scroll body khi mở modal
//   useEffect(() => {
//     if (isUpdateModalOpen || isCreateModalOpen || isConfirmModalOpen) {
//       document.body.classList.add('modal-open');
//     } else {
//       document.body.classList.remove('modal-open');
//     }
//     return () => {
//       document.body.classList.remove('modal-open'); 
//     };
//   }, [isUpdateModalOpen, isCreateModalOpen, isConfirmModalOpen]);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('vi-VN');
//   };

//   const handleUserCreated = () => {
//     setCreateModalOpen(false);
//     setToast({ message: 'Tạo người dùng thành công!', type: 'success' });
//     fetchAllData();
//   };
  
//   const handleUserUpdated = (updatedUserId) => {
//     setUpdateModalOpen(false);
//     setToast({ message: 'Cập nhật người dùng thành công!', type: 'success' });
//     fetchAllData(); 
    
//     if (onRefresh && selectedUser?.userID === updatedUserId) {
//       onRefresh(); 
//     }
//   };

//   const handleEdit = (user) => {
//     setSelectedUser(user);
//     setUpdateModalOpen(true);
//   };

//   const handleDelete = async (userId) => {
//     setUserToDelete(userId);
//     setConfirmModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (userToDelete) {
//         try {
//             await userAPI.delete(userToDelete);
//             setToast({ message: 'Xóa người dùng thành công!', type: 'success' });
//             fetchAllData();
//         } catch (err) {
//             // --- 🟢 THAY ĐỔI 2: XỬ LÝ LỖI XÓA TỪ BACKEND ---
//             const data = err.response?.data;
//             let msg = 'Lỗi khi xóa người dùng.';

//             // Nếu backend trả về code 1014 (CANNOT_DELETE)
//             if (data?.code === 1014) {
//                 msg = data.message || "Không thể xóa vì tài khoản đang được sử dụng.";
//             } else if (data?.message) {
//                 msg = data.message;
//             }

//             setToast({ message: msg, type: 'error' });
//         } finally {
//             setConfirmModalOpen(false);
//             setUserToDelete(null);
//         }
//     }
//   };

//   return (
//     <>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <div className="dashboard-card">
//         <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <h2>Quản Lý Người Dùng</h2>
//           <button className="btn-primary" onClick={() => setCreateModalOpen(true)}>+ Tạo người dùng mới</button>
//         </div>
//         {loading ? (
//           <p>Đang tải danh sách người dùng...</p>
//         ) : (
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th>User ID</th>
//                   <th>Họ Tên</th>
//                   <th>Email</th>
//                   <th>Vai Trò</th>
//                   <th>Giới tính</th>
//                   <th>Ngày sinh</th>
//                   <th>Ngày tạo</th>
//                   <th>Hành Động</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.length > 0 ? (
//                     users.map((u) => (
//                     <tr key={u.userID}>
//                         <td>{u.userID}</td>
//                         <td>{u.fullName}</td>
//                         <td>{u.email}</td>
                        
//                         {/* Hiển thị tên Role */}
//                         <td>
//                             <span className="role-badge">
//                                 {u.role?.roleName || u.role?.name || 'N/A'}
//                             </span>
//                         </td>

//                         <td>{u.gender || 'N/A'}</td>
//                         <td>{formatDate(u.birthDate)}</td>
//                         <td>{formatDate(u.createdAt)}</td>
//                         <td>
//                         <div className="action-buttons">
//                             <FaEdit
//                             className="btn-action btn-edit"
//                             onClick={() => handleEdit(u)}
//                             title="Sửa"
//                             />
//                             <FaTrash
//                             className="btn-action btn-delete"
//                             onClick={() => handleDelete(u.userID)}
//                             title="Xóa"
//                             />
//                         </div>
//                         </td>
//                     </tr>
//                     ))
//                 ) : (
//                     <tr>
//                         <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>Không có người dùng nào.</td>
//                     </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       {isCreateModalOpen && (
//         <CreateUserModal
//           onClose={() => setCreateModalOpen(false)}
//           onUserCreated={handleUserCreated}
//           roles={allRoles}
//         />
//       )}
//       {isUpdateModalOpen && (
//         <UpdateUserModal
//           user={selectedUser}
//           roles={allRoles}
//           onClose={() => setUpdateModalOpen(false)}
//           onUserUpdated={() => handleUserUpdated(selectedUser?.userID)}
//         />
//       )}
//       <ConfirmationModal
//         isOpen={isConfirmModalOpen}
//         onClose={() => setConfirmModalOpen(false)}
//         onConfirm={confirmDelete}
//         title="Xác nhận xóa"
//         message="Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác."
//       />
//     </>
//   );
// };

// export default UserManagementPage;


// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaTrash } from 'react-icons/fa'; 
// import { userAPI, roleAPI } from '../services/apiService';
// import Toast from '../components/Toast';
// import CreateUserModal from '../components/CreateUserModal';
// import UpdateUserModal from '../components/UpdateUserModal'; 
// import ConfirmationModal from '../components/ConfirmationModal'; 
// import '../styles/Dashboard.css';

// const UserManagementPage = ({ onRefresh, currentUserId }) => { 
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState(null);
//   const [isCreateModalOpen, setCreateModalOpen] = useState(false);
//   const [isUpdateModalOpen, setUpdateModalOpen] = useState(false); 
//   const [isConfirmModalOpen, setConfirmModalOpen] = useState(false); 
//   const [selectedUser, setSelectedUser] = useState(null); 
//   const [allRoles, setAllRoles] = useState([]);
//   const [userToDelete, setUserToDelete] = useState(null); 

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const userResponse = await userAPI.getAllUsers();
      
//       if (Array.isArray(userResponse.data)) {
//         const allUsers = userResponse.data;
        
//         // LỌC BỎ ADMIN KHỎI DANH SÁCH
//         const filteredUsers = allUsers.filter(u => {
//             const roleName = u.role?.roleName || u.role?.name || '';
//             return roleName.toLowerCase() !== 'admin';
//         });

//         setUsers(filteredUsers);
//       } else {
//         throw new Error('Dữ liệu người dùng trả về không hợp lệ.');
//       }
      
//       const roleResponse = await roleAPI.getAll();
//       if (roleResponse.data?.code === 1000 && Array.isArray(roleResponse.data.result)) {
//         setAllRoles(roleResponse.data.result);
//       } else if (Array.isArray(roleResponse.data)) {
//         setAllRoles(roleResponse.data);
//       }

//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       setToast({ message: error.message || 'Lỗi khi tải dữ liệu.', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   useEffect(() => {
//     if (isUpdateModalOpen || isCreateModalOpen || isConfirmModalOpen) {
//       document.body.classList.add('modal-open');
//     } else {
//       document.body.classList.remove('modal-open');
//     }
//     return () => {
//       document.body.classList.remove('modal-open'); 
//     };
//   }, [isUpdateModalOpen, isCreateModalOpen, isConfirmModalOpen]);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('vi-VN');
//   };

//   const handleUserCreated = () => {
//     setCreateModalOpen(false);
//     setToast({ message: 'Tạo người dùng thành công!', type: 'success' });
//     fetchAllData();
//   };
  
//   const handleUserUpdated = (updatedUserId) => {
//     setUpdateModalOpen(false);
//     setToast({ message: 'Cập nhật người dùng thành công!', type: 'success' });
//     fetchAllData(); 
    
//     if (onRefresh && selectedUser?.userID === updatedUserId) {
//       onRefresh(); 
//     }
//   };

//   const handleEdit = (user) => {
//     setSelectedUser(user);
//     setUpdateModalOpen(true);
//   };

//   const handleDelete = async (userId) => {
//     setUserToDelete(userId);
//     setConfirmModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (userToDelete) {
//         try {
//             await userAPI.delete(userToDelete);
//             setToast({ message: 'Xóa người dùng thành công!', type: 'success' });
//             fetchAllData();
//         } catch (err) {
//             const data = err.response?.data;
//             let msg = 'Lỗi khi xóa người dùng.';

//             if (data?.code === 1014) {
//                 msg = data.message || "Không thể xóa vì tài khoản đang được sử dụng.";
//             } else if (data?.message) {
//                 msg = data.message;
//             }

//             setToast({ message: msg, type: 'error' });
//         } finally {
//             setConfirmModalOpen(false);
//             setUserToDelete(null);
//         }
//     }
//   };
// const getRoleBadgeClass = (roleName) => {
//     if (!roleName) return 'badge-default';
    
//     // Chuyển về chữ thường để so sánh cho chính xác
//     const lowerRole = roleName.toLowerCase(); 

//     if (lowerRole === 'student') return 'badge-student';
//     if (lowerRole === 'lecturer') return 'badge-lecturer';
//     if (lowerRole === 'admin') return 'badge-admin';
    
//     return 'badge-default'; // Các role khác (Staff, User...)
// };
//   return (
//     <>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <div className="dashboard-card">
//         <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <h2>Quản Lý Người Dùng</h2>
//           <button className="btn-primary" onClick={() => setCreateModalOpen(true)}>+ Tạo người dùng mới</button>
//         </div>
//         {loading ? (
//           <p>Đang tải danh sách người dùng...</p>
//         ) : (
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th>User ID</th>
//                   <th>Họ Tên</th>
//                   <th>Email</th>
//                   {/* 👇 THÊM CỘT SỐ ĐIỆN THOẠI */}
//                   <th>Số điện thoại</th> 
//                   <th>Vai Trò</th>
//                   <th>Giới tính</th>
//                   <th>Ngày sinh</th>
//                   <th>Ngày tạo</th>
//                   <th>Hành Động</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.length > 0 ? (
//                     users.map((u) => (
//                     <tr key={u.userID}>
//                         <td>{u.userID}</td>
//                         <td>{u.fullName}</td>
//                         <td>{u.email}</td>
                        
//                         {/* 👇 HIỂN THỊ SỐ ĐIỆN THOẠI */}
//                         <td>
//                             {/* Xử lý logic: ưu tiên lấy từ mảng phones, nếu không có thì lấy phone, nếu không có nữa thì N/A */}
//                             {(u.phones && u.phones.length > 0) ? u.phones[0] : (u.phone || "")}
//                         </td>

//                         <td>
//     {(u.role?.roleName || u.role?.name) && (
//         <span 
//             className={`role-badge ${getRoleBadgeClass(u.role?.roleName || u.role?.name)}`}
//         >
//             {u.role?.roleName || u.role?.name}
//         </span>
//     )}
// </td>

//                         <td>{u.gender || ""}</td>
//                         <td>{u.birthDate ? formatDate(u.birthDate) : ""}</td>
//                         <td>{u.createdAt ? formatDate(u.createdAt) : ""}</td>
//                         <td>
//                         <div className="action-buttons">
//                             <FaEdit
//                             className="btn-action btn-edit"
//                             onClick={() => handleEdit(u)}
//                             title="Sửa"
//                             />
//                             <FaTrash
//                             className="btn-action btn-delete"
//                             onClick={() => handleDelete(u.userID)}
//                             title="Xóa"
//                             />
//                         </div>
//                         </td>
//                     </tr>
//                     ))
//                 ) : (
//                     <tr>
//                         <td colSpan="9" style={{textAlign: 'center', padding: '20px'}}>Không có người dùng nào.</td>
//                     </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       {isCreateModalOpen && (
//         <CreateUserModal
//           onClose={() => setCreateModalOpen(false)}
//           onUserCreated={handleUserCreated}
//           roles={allRoles}
//         />
//       )}
//       {isUpdateModalOpen && (
//         <UpdateUserModal
//           user={selectedUser}
//           roles={allRoles}
//           onClose={() => setUpdateModalOpen(false)}
//           onUserUpdated={() => handleUserUpdated(selectedUser?.userID)}
//         />
//       )}
//       <ConfirmationModal
//         isOpen={isConfirmModalOpen}
//         onClose={() => setConfirmModalOpen(false)}
//         onConfirm={confirmDelete}
//         title="Xác nhận xóa"
//         message="Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác."
//       />
//     </>
//   );
// };

// export default UserManagementPage;

// import React, { useState, useEffect, useCallback } from 'react';
// import { FaEdit, FaTrash, FaFilter, FaSearch, FaRedo, FaChevronUp, FaChevronDown, FaCalendarAlt } from 'react-icons/fa'; 
// import { userAPI, roleAPI } from '../services/apiService';
// import Toast from '../components/Toast';
// import CreateUserModal from '../components/CreateUserModal';
// import UpdateUserModal from '../components/UpdateUserModal'; 
// import ConfirmationModal from '../components/ConfirmationModal'; 
// import '../styles/Dashboard.css';

// const UserManagementPage = ({ onRefresh, currentUserId }) => { 
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState(null);
  
//   // Modal states
//   const [isCreateModalOpen, setCreateModalOpen] = useState(false);
//   const [isUpdateModalOpen, setUpdateModalOpen] = useState(false); 
//   const [isConfirmModalOpen, setConfirmModalOpen] = useState(false); 
  
//   const [selectedUser, setSelectedUser] = useState(null); 
//   const [allRoles, setAllRoles] = useState([]);
//   const [userToDelete, setUserToDelete] = useState(null); 

//   // --- 1. STATE BỘ LỌC (Thêm createdAt) ---
//   const [isFilterVisible, setIsFilterVisible] = useState(false);
//   const [filters, setFilters] = useState({
//     userID: '',
//     fullName: '',
//     email: '',
//     phone: '',
//     gender: '',
//     roleName: '', 
//     birthDateFrom: '',
//     birthDateTo: '',
//     createdAtFrom: '', // Mới
//     createdAtTo: '',   // Mới
//   });

//   const getRoleBadgeClass = (roleName) => {
//     if (!roleName) return 'badge-default';
//     const lowerRole = roleName.toLowerCase(); 
//     if (lowerRole === 'student') return 'badge-student';
//     if (lowerRole === 'lecturer') return 'badge-lecturer';
//     if (lowerRole === 'admin') return 'badge-admin';
//     return 'badge-default';
//   };

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const roleResponse = await roleAPI.getAll();
//       if (roleResponse.data?.code === 1000 && Array.isArray(roleResponse.data.result)) {
//         setAllRoles(roleResponse.data.result);
//       } else if (Array.isArray(roleResponse.data)) {
//         setAllRoles(roleResponse.data);
//       }

//       const userResponse = await userAPI.getAllUsers();
//       if (Array.isArray(userResponse.data)) {
//         const filteredUsers = userResponse.data.filter(u => {
//             const roleName = u.role?.roleName || u.role?.name || '';
//             return roleName.toLowerCase() !== 'admin';
//         });
//         setUsers(filteredUsers);
//       }

//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       setToast({ message: error.message || 'Lỗi khi tải dữ liệu.', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSearch = async () => {
//     setLoading(true);
//     try {
//       const searchCriteria = { ...filters };

//       Object.keys(searchCriteria).forEach(key => {
//         if (searchCriteria[key] === '' || searchCriteria[key] === null) {
//           delete searchCriteria[key];
//         }
//       });

//       console.log("Search Payload:", searchCriteria);

//       const response = await userAPI.search(searchCriteria);
      
//       let resultUsers = [];
//       if (response.data?.code === 1000 && Array.isArray(response.data.result)) {
//         resultUsers = response.data.result;
//       } else if (Array.isArray(response.data)) {
//         resultUsers = response.data;
//       }

//       const filteredResult = resultUsers.filter(u => {
//         const roleName = u.role?.roleName || u.role?.name || '';
//         return roleName.toLowerCase() !== 'admin';
//       });

//       setUsers(filteredResult);
      
//       if (filteredResult.length === 0) {
//         setToast({ message: 'Không tìm thấy kết quả nào.', type: 'info' });
//       }

//     } catch (error) {
//       console.error("Search error:", error);
//       setToast({ message: 'Lỗi khi tìm kiếm.', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResetFilter = () => {
//     setFilters({
//         userID: '', fullName: '', email: '', phone: '',
//         gender: '', roleName: '', 
//         birthDateFrom: '', birthDateTo: '',
//         createdAtFrom: '', createdAtTo: ''
//     });
//     fetchAllData(); 
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('vi-VN');
//   };

//   const handleUserCreated = () => {
//     setCreateModalOpen(false);
//     setToast({ message: 'Tạo người dùng thành công!', type: 'success' });
//     fetchAllData();
//   };
  
//   const handleUserUpdated = useCallback((updatedUserId) => {
//     setUpdateModalOpen(false);
//     setToast({ message: 'Cập nhật người dùng thành công!', type: 'success' });
//     fetchAllData(); 
//     if (onRefresh && updatedUserId === currentUserId) onRefresh(); 
//   }, [onRefresh, currentUserId]);

//   const handleEdit = (user) => {
//     setSelectedUser(user);
//     setUpdateModalOpen(true);
//   };

//   const handleDelete = async (userId) => {
//     setUserToDelete(userId);
//     setConfirmModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (userToDelete) {
//         try {
//             await userAPI.delete(userToDelete);
//             setToast({ message: 'Xóa người dùng thành công!', type: 'success' });
//             fetchAllData();
//         } catch (err) {
//             const data = err.response?.data;
//             let msg = 'Lỗi khi xóa người dùng.';
//             if (data?.code === 1014) {
//                 msg = data.message || "Không thể xóa vì tài khoản đang được sử dụng.";
//             } else if (data?.message) {
//                 msg = data.message;
//             }
//             setToast({ message: msg, type: 'error' });
//         } finally {
//             setConfirmModalOpen(false);
//             setUserToDelete(null);
//         }
//     }
//   };

//   return (
//     <>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <div className="dashboard-card">
//         <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <h2>Quản Lý Người Dùng</h2>
          
//           <div style={{ display: 'flex', gap: '10px' }}>
//             <button 
//                 className="btn-secondary"
//                 onClick={() => setIsFilterVisible(!isFilterVisible)}
//                 style={{ display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #ddd' }}
//             >
//                 <FaFilter /> {isFilterVisible ? 'Ẩn bộ lọc' : 'Bộ lọc nâng cao'} {isFilterVisible ? <FaChevronUp/> : <FaChevronDown/>}
//             </button>

//             <button className="btn-primary" onClick={() => setCreateModalOpen(true)}>+ Tạo người dùng mới</button>
//           </div>
//         </div>

//         {/* --- KHUNG BỘ LỌC ĐẸP HƠN --- */}
// {isFilterVisible && (
//   <div className="filter-container" style={{ 
//       marginTop: '15px', padding: '15px', backgroundColor: '#f9fafb', 
//       borderRadius: '8px', border: '1px solid #e5e7eb', animation: 'fadeIn 0.3s'
//   }}>
//       {/* --- HÀNG 1: CÁC TRƯỜNG NHẬP LIỆU (Grid 6 cột) --- */}
//       <div style={{ 
//         display: 'grid', 
//         gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
//         gap: '10px', 
//         marginBottom: '15px' 
//       }}>
//           <input type="text" name="userID" placeholder="ID..." value={filters.userID} onChange={handleFilterChange} className="filter-input" style={{ width: '100%' }} />
//           <input type="text" name="fullName" placeholder="Họ Tên..." value={filters.fullName} onChange={handleFilterChange} className="filter-input" style={{ width: '100%' }} />
//           <input type="text" name="email" placeholder="Email..." value={filters.email} onChange={handleFilterChange} className="filter-input" style={{ width: '100%' }} />
//           <input type="text" name="phone" placeholder="SĐT..." value={filters.phone} onChange={handleFilterChange} className="filter-input" style={{ width: '100%' }} />
          
//           <select name="gender" value={filters.gender} onChange={handleFilterChange} className="filter-input" style={{ width: '100%' }}>
//               <option value="">-- Giới tính --</option>
//               <option value="Nam">Nam</option>
//               <option value="Nữ">Nữ</option>
//               <option value="Khác">Khác</option>
//           </select>

//           <select name="roleName" value={filters.roleName} onChange={handleFilterChange} className="filter-input" style={{ width: '100%' }}>
//               <option value="">-- Vai Trò --</option>
//               {allRoles
//                   .filter(r => (r.roleName || r.name) !== 'Admin')
//                   .map(role => {
//                       const rName = role.roleName || role.name;
//                       return <option key={role.id || rName} value={rName}>{rName}</option>;
//                   })}
//           </select>
//       </div>

//       {/* --- HÀNG 2: NGÀY THÁNG & NÚT BẤM (Flexbox) --- */}
//       <div style={{ 
//         display: 'flex', 
//         flexWrap: 'wrap', 
//         justifyContent: 'space-between', 
//         alignItems: 'center', 
//         gap: '15px' 
//       }}>
          
//           {/* Cụm Ngày tháng (Căn trái) */}
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
//               {/* Ngày sinh */}
//               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <label style={{ fontSize: '13px', fontWeight: '600', color: '#555', whiteSpace: 'nowrap' }}>
//                       <FaCalendarAlt /> Sinh:
//                   </label>
//                   <input type="date" name="birthDateFrom" value={filters.birthDateFrom} onChange={handleFilterChange} className="filter-input" style={{ maxWidth: '130px', padding: '5px' }} />
//                   <span style={{ color: '#888' }}>-</span>
//                   <input type="date" name="birthDateTo" value={filters.birthDateTo} onChange={handleFilterChange} className="filter-input" style={{ maxWidth: '130px', padding: '5px' }} />
//               </div>

//               {/* Ngày tạo */}
//               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <label style={{ fontSize: '13px', fontWeight: '600', color: '#555', whiteSpace: 'nowrap' }}>
//                       <FaCalendarAlt /> Tạo:
//                   </label>
//                   <input type="date" name="createdAtFrom" value={filters.createdAtFrom} onChange={handleFilterChange} className="filter-input" style={{ maxWidth: '130px', padding: '5px' }} />
//                   <span style={{ color: '#888' }}>-</span>
//                   <input type="date" name="createdAtTo" value={filters.createdAtTo} onChange={handleFilterChange} className="filter-input" style={{ maxWidth: '130px', padding: '5px' }} />
//               </div>
//           </div>

//           {/* Cụm Nút bấm (Căn phải) */}
//           <div style={{ display: 'flex', gap: '10px' }}>
//               <button className="btn-secondary" onClick={handleResetFilter} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px' }}>
//                   <FaRedo /> Làm mới
//               </button>
//               <button className="btn-primary" onClick={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px' }}>
//                   <FaSearch /> Tìm kiếm
//               </button>
//           </div>
//       </div>
//   </div>
// )}

//         {loading ? (
//           <p style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>Đang tải dữ liệu...</p>
//         ) : (
//           <div className="table-container" style={{ marginTop: isFilterVisible ? '20px' : '20px' }}>
//             <table>
//               <thead>
//                 <tr>
//                   <th>User ID</th>
//                   <th>Họ Tên</th>
//                   <th>Email</th>
//                   <th>Số điện thoại</th> 
//                   <th>Vai Trò</th>
//                   <th>Giới tính</th>
//                   <th>Ngày sinh</th>
//                   <th>Ngày tạo</th>
//                   <th>Hành Động</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.length > 0 ? (
//                     users.map((u) => (
//                     <tr key={u.userID}>
//                         <td>{u.userID}</td>
//                         <td>{u.fullName}</td>
//                         <td>{u.email}</td>
                        
//                         <td>{(u.phones && u.phones.length > 0) ? u.phones[0] : (u.phone || "")}</td>

//                         <td>
//                             {(u.role?.roleName || u.role?.name) && (
//                                 <span 
//                                     className={`role-badge ${getRoleBadgeClass(u.role?.roleName || u.role?.name)}`}
//                                 >
//                                     {u.role?.roleName || u.role?.name}
//                                 </span>
//                             )}
//                         </td>

//                         <td>{u.gender || ""}</td>
//                         <td>{u.birthDate ? formatDate(u.birthDate) : ""}</td>
//                         <td>{u.createdAt ? formatDate(u.createdAt) : ""}</td>
//                         <td>
//                         <div className="action-buttons">
//                             <FaEdit
//                             className="btn-action btn-edit"
//                             onClick={() => handleEdit(u)}
//                             title="Sửa"
//                             />
//                             <FaTrash
//                             className="btn-action btn-delete"
//                             onClick={() => handleDelete(u.userID)}
//                             title="Xóa"
//                             />
//                         </div>
//                         </td>
//                     </tr>
//                     ))
//                 ) : (
//                     <tr>
//                         <td colSpan="9" style={{textAlign: 'center', padding: '30px', color: '#888'}}>
//                             Không tìm thấy người dùng phù hợp.
//                         </td>
//                     </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
      
//       {isCreateModalOpen && (
//         <CreateUserModal
//           onClose={() => setCreateModalOpen(false)}
//           onUserCreated={handleUserCreated}
//           roles={allRoles}
//         />
//       )}
      
//       {isUpdateModalOpen && (
//         <UpdateUserModal
//           user={selectedUser}
//           roles={allRoles}
//           onClose={() => setUpdateModalOpen(false)}
//           onUserUpdated={() => handleUserUpdated(selectedUser?.userID)}
//         />
//       )}
      
//       <ConfirmationModal
//         isOpen={isConfirmModalOpen}
//         onClose={() => setConfirmModalOpen(false)}
//         onConfirm={confirmDelete}
//         title="Xác nhận xóa"
//         message="Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác."
//       />
//     </>
//   );
// };

// export default UserManagementPage;

import React, { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaTrash, FaFilter, FaSearch, FaRedo, FaChevronUp, FaChevronDown, FaCalendarAlt } from 'react-icons/fa'; 
import { userAPI, roleAPI } from '../services/apiService';
import Toast from '../components/Toast';
import CreateUserModal from '../components/CreateUserModal';
import UpdateUserModal from '../components/UpdateUserModal'; 
import ConfirmationModal from '../components/ConfirmationModal'; 
import { io } from 'socket.io-client'; // Import socket client
import '../styles/Dashboard.css';

const UserManagementPage = ({ onRefresh, currentUserId }) => { 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Modal states
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false); 
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false); 
  
  const [selectedUser, setSelectedUser] = useState(null); 
  const [allRoles, setAllRoles] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null); 

  // --- STATE BỘ LỌC ---
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
        // Lọc bỏ Admin khỏi danh sách hiển thị
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

  // --- 👇 SỬA LẠI PHẦN SOCKET ĐỂ KHỚP VỚI BACKEND 👇 ---
  useEffect(() => {
    // 1. Kết nối đến server socket port 8085
    const socket = io('http://localhost:8085', {
        transports: ['websocket']
    });

    // 2. Lắng nghe sự kiện 'UPDATE_STUDENT_SUCCESS'
    socket.on('UPDATE_USER_SUCCESS', (updatedUser) => {
        console.log('Socket received update:', updatedUser);
        
        // 3. Cập nhật State users ngay lập tức
        setUsers((prevUsers) => {
            const exists = prevUsers.some(u => u.userID === updatedUser.userID);
            
            if (exists) {
                // Nếu user đang hiển thị trong bảng, cập nhật thông tin mới
                return prevUsers.map(u => 
                    u.userID === updatedUser.userID ? updatedUser : u
                );
            } 
            return prevUsers;
        });
    });

    // Cleanup khi component unmount
    return () => {
        socket.disconnect();
    };
  }, []);
  // -----------------------------------------------------

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