// // src/components/UpdateRoleModal.jsx
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Modal, Input, Checkbox, Space } from 'antd'; 

// const UpdateRoleModal = ({ role, allPermissions, onClose, onRoleUpdated, loading = false }) => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [level, setLevel] = useState(1);
//   const [selectedPermissionsSet, setSelectedPermissionsSet] = useState(new Set());

//   // Xử lý danh sách quyền để tạo key unique
//   const processedPermissions = useMemo(() => {
//     return allPermissions.map((permission, index) => ({
//       ...permission,
//       uniqueKey: `${permission.name}-${index}`, 
//       originalName: permission.name 
//     }));
//   }, [allPermissions]);

//   useEffect(() => {
//     if (role) {
//       // 👇 SỬA LỖI: Lấy roleName nếu name bị thiếu
//       setName(role.roleName || role.name || '');
//       setDescription(role.description || ''); 
//       setLevel(role.level || 1); 
      
//       const initialPermissionUniqueKeys = role.permissions
//         ? role.permissions.map(p => {
//             // Tìm permission tương ứng trong danh sách gốc
//             const pName = p.name || p.permissionName;
//             const found = processedPermissions.find(pp => String(pp.originalName) === String(pName));
//             return found ? found.uniqueKey : String(pName);
//           })
//         : [];
//       setSelectedPermissionsSet(new Set(initialPermissionUniqueKeys));
//     }
//   }, [role, processedPermissions]);

//   const handlePermissionChange = useCallback((uniqueKey) => {
//     setSelectedPermissionsSet(prevSet => {
//       const newSet = new Set(prevSet);
//       if (newSet.has(uniqueKey)) {
//         newSet.delete(uniqueKey);
//       } else {
//         newSet.add(uniqueKey);
//       }
//       return newSet;
//     });
//   }, []);

//   const handleSubmit = async () => {
//     const permissionsToSubmit = Array.from(selectedPermissionsSet).map(uniqueKey => {
//       const found = processedPermissions.find(p => p.uniqueKey === uniqueKey);
//       return found ? found.originalName : uniqueKey;
//     });

//     await onRoleUpdated({
//       // Gửi lại dữ liệu cập nhật
//       originalName: role.roleName || role.name,
//       newName: name,
//       description: description, 
//       level: parseInt(level, 10),
//       permissions: permissionsToSubmit,
//     });
//   };

//   if (!role) return null;

//   return (
//     <Modal
//       cancelButtonProps={{ disabled: loading }}
//       cancelText="Hủy"
//       centered
//       okButtonProps={{ loading }}
//       okText="Lưu thay đổi"
//       onCancel={onClose}
//       onOk={handleSubmit}
//       open={true}
//       title={`Sửa vai trò: ${role.roleName || role.name}`} // Hiển thị đúng tên trên tiêu đề
//       destroyOnClose={true}
//       width={600}
//     >
//       <Space direction="vertical" style={{ width: '100%' }} size="middle">
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Tên vai trò</label>
//           <Input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Nhập tên vai trò mới"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
//           <Input.TextArea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Nhập mô tả vai trò"
//             rows={2}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Cấp bậc (Level)</label>
//           <Input
//             type="number"
//             min={1}
//             value={level}
//             onChange={(e) => setLevel(e.target.value)}
//             placeholder="Nhập cấp độ"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Chọn các quyền</label>
//           <div className="permission-list" style={{ border: '1px solid #ddd', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto', padding: '5px' }}>
//             {processedPermissions.map((permission) => (
//               <div
//                 key={permission.uniqueKey}
//                 className="permission-item"
//                 style={{
//                   padding: '8px 12px',
//                   borderBottom: '1px solid #eee',
//                   backgroundColor: selectedPermissionsSet.has(permission.uniqueKey) ? '#e6f7ff' : 'transparent',
//                 }}
//               >
//                 <Checkbox
//                   checked={selectedPermissionsSet.has(permission.uniqueKey)}
//                   onChange={() => handlePermissionChange(permission.uniqueKey)}
//                 >
//                   <span style={{ display: 'block', whiteSpace: 'normal', wordBreak: 'break-word' }}>
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

// export default UpdateRoleModal;

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Modal, Input, Checkbox, Space } from 'antd'; 

// const UpdateRoleModal = ({ role, allPermissions, onClose, onRoleUpdated, loading = false }) => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [level, setLevel] = useState(1);
//   const [selectedPermissionsSet, setSelectedPermissionsSet] = useState(new Set());

//   // Xử lý danh sách quyền để tạo key unique
//   // 🛠️ SỬA LỖI: Ưu tiên lấy permissionName
//   const processedPermissions = useMemo(() => {
//     return allPermissions.map((permission, index) => {
//       // Lấy tên quyền chuẩn (ưu tiên permissionName, fallback sang name)
//       const pName = permission.permissionName || permission.name || 'Unnamed';
//       return {
//         ...permission,
//         uniqueKey: `${pName}-${index}`, 
//         originalName: pName,
//         // Lưu tên hiển thị để dùng lúc render
//         displayName: pName 
//       };
//     });
//   }, [allPermissions]);

//   useEffect(() => {
//     if (role) {
//       setName(role.roleName || role.name || '');
//       setDescription(role.description || ''); 
//       setLevel(role.level || 1); 
      
//       const initialPermissionUniqueKeys = role.permissions
//         ? role.permissions.map(p => {
//             // Tìm permission tương ứng trong danh sách gốc
//             // 🛠️ SỬA LỖI: Kiểm tra cả permissionName và name
//             const pName = p.permissionName || p.name;
//             const found = processedPermissions.find(pp => String(pp.originalName) === String(pName));
//             return found ? found.uniqueKey : String(pName);
//           })
//         : [];
//       setSelectedPermissionsSet(new Set(initialPermissionUniqueKeys));
//     }
//   }, [role, processedPermissions]);

//   const handlePermissionChange = useCallback((uniqueKey) => {
//     setSelectedPermissionsSet(prevSet => {
//       const newSet = new Set(prevSet);
//       if (newSet.has(uniqueKey)) {
//         newSet.delete(uniqueKey);
//       } else {
//         newSet.add(uniqueKey);
//       }
//       return newSet;
//     });
//   }, []);

//   const handleSubmit = async () => {
//     const permissionsToSubmit = Array.from(selectedPermissionsSet).map(uniqueKey => {
//       const found = processedPermissions.find(p => p.uniqueKey === uniqueKey);
//       return found ? found.originalName : uniqueKey;
//     });

//     await onRoleUpdated({
//       originalName: role.roleName || role.name,
//       newName: name,
//       description: description, 
//       level: parseInt(level, 10),
//       permissions: permissionsToSubmit,
//     });
//   };

//   if (!role) return null;

//   return (
//     <Modal
//       cancelButtonProps={{ disabled: loading }}
//       cancelText="Hủy"
//       centered
//       okButtonProps={{ loading }}
//       okText="Lưu thay đổi"
//       onCancel={onClose}
//       onOk={handleSubmit}
//       open={true}
//       title={`Sửa vai trò: ${role.roleName || role.name}`}
//       destroyOnClose={true}
//       width={600}
//     >
//       <Space direction="vertical" style={{ width: '100%' }} size="middle">
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Tên vai trò</label>
//           <Input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Nhập tên vai trò mới"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
//           <Input.TextArea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Nhập mô tả vai trò"
//             rows={2}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Cấp bậc (Level)</label>
//           <Input
//             type="number"
//             min={1}
//             value={level}
//             onChange={(e) => setLevel(e.target.value)}
//             placeholder="Nhập cấp độ"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Chọn các quyền</label>
//           <div 
//             className="permission-list" 
//             style={{ 
//               border: '1px solid #d9d9d9', // Màu viền nhẹ nhàng hơn theo style Antd
//               borderRadius: '6px', 
//               maxHeight: '250px', 
//               overflowY: 'auto',
//               padding: '4px',
//               backgroundColor: '#fafafa' // Nền xám nhẹ
//             }}
//           >
//             {processedPermissions.length > 0 ? (
//               processedPermissions.map((permission) => (
//                 <div
//                   key={permission.uniqueKey}
//                   className="permission-item"
//                   style={{
//                     padding: '8px 12px',
//                     borderBottom: '1px solid #f0f0f0',
//                     backgroundColor: selectedPermissionsSet.has(permission.uniqueKey) ? '#e6f7ff' : 'transparent',
//                     marginBottom: '2px',
//                     borderRadius: '4px',
//                     transition: 'background-color 0.3s'
//                   }}
//                 >
//                   <Checkbox
//                     checked={selectedPermissionsSet.has(permission.uniqueKey)}
//                     onChange={() => handlePermissionChange(permission.uniqueKey)}
//                   >
//                     <span style={{ 
//                       display: 'block', 
//                       whiteSpace: 'normal', 
//                       wordBreak: 'break-word',
//                       fontWeight: 500 
//                     }}>
//                       {/* 🛠️ SỬA LỖI: Hiển thị đúng tên quyền (permissionName) */}
//                       {permission.displayName}
//                     </span>
//                   </Checkbox>
//                 </div>
//               ))
//             ) : (
//               <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
//                 Không có dữ liệu quyền hạn.
//               </div>
//             )}
//           </div>
//         </div>
//       </Space>
//     </Modal>
//   );
// };

// export default UpdateRoleModal;

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Modal, Input, Checkbox, Space, message } from 'antd'; 
// import { roleAPI } from '../services/apiService'; // 👇 Import API trực tiếp vào đây

// const UpdateRoleModal = ({ role, allPermissions, onClose, onRoleUpdated }) => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [level, setLevel] = useState(1);
//   const [selectedPermissionsSet, setSelectedPermissionsSet] = useState(new Set());
  
//   // 👇 State lưu dữ liệu gốc để so sánh
//   const [originalData, setOriginalData] = useState({});
//   const [loading, setLoading] = useState(false);

//   // Xử lý danh sách quyền để tạo key unique và hiển thị đúng tên
//   const processedPermissions = useMemo(() => {
//     return allPermissions.map((permission, index) => {
//       // Ưu tiên permissionName
//       const pName = permission.permissionName || permission.name || 'Unnamed';
//       return {
//         ...permission,
//         uniqueKey: `${pName}-${index}`, 
//         originalName: pName,
//         displayName: pName 
//       };
//     });
//   }, [allPermissions]);

//   // Load dữ liệu khi mở Modal
//   useEffect(() => {
//     if (role) {
//       const initialName = role.roleName || role.name || '';
//       const initialDesc = role.description || '';
//       const initialLevel = role.level || 1;
      
//       const initialPermissionUniqueKeys = role.permissions
//         ? role.permissions.map(p => {
//             const pName = p.permissionName || p.name;
//             const found = processedPermissions.find(pp => String(pp.originalName) === String(pName));
//             return found ? found.uniqueKey : String(pName);
//           })
//         : [];
      
//       const initialPermsSet = new Set(initialPermissionUniqueKeys);

//       // Set state hiển thị
//       setName(initialName);
//       setDescription(initialDesc); 
//       setLevel(initialLevel); 
//       setSelectedPermissionsSet(initialPermsSet);

//       // 👇 Lưu bản sao dữ liệu gốc
//       setOriginalData({
//         name: initialName,
//         description: initialDesc,
//         level: initialLevel,
//         permissionsSet: initialPermsSet // Lưu Set để so sánh dễ hơn
//       });
//     }
//   }, [role, processedPermissions]);

//   const handlePermissionChange = useCallback((uniqueKey) => {
//     setSelectedPermissionsSet(prevSet => {
//       const newSet = new Set(prevSet);
//       if (newSet.has(uniqueKey)) {
//         newSet.delete(uniqueKey);
//       } else {
//         newSet.add(uniqueKey);
//       }
//       return newSet;
//     });
//   }, []);

//   // Hàm so sánh 2 Set quyền xem có khác nhau không
//   const arePermissionsChanged = (setA, setB) => {
//     if (setA.size !== setB.size) return true;
//     for (let a of setA) if (!setB.has(a)) return true;
//     return false;
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
    
//     try {
//       // 1. TẠO PAYLOAD CHỈ CHỨA DỮ LIỆU THAY ĐỔI
//       const changes = {};
//       let hasChange = false;

//       // Không check 'name' vì trường này bị disable (không sửa được)

//       if (description !== originalData.description) {
//         changes.description = description;
//         hasChange = true;
//       }

//       if (parseInt(level, 10) !== originalData.level) {
//         changes.level = parseInt(level, 10);
//         hasChange = true;
//       }

//       // Check quyền
//       if (arePermissionsChanged(selectedPermissionsSet, originalData.permissionsSet)) {
//         // Convert Set -> Array tên quyền để gửi đi
//         const permissionsToSubmit = Array.from(selectedPermissionsSet).map(uniqueKey => {
//           const found = processedPermissions.find(p => p.uniqueKey === uniqueKey);
//           return found ? found.originalName : uniqueKey;
//         });
//         changes.permissions = permissionsToSubmit;
//         hasChange = true;
//       }

//       // 2. NẾU KHÔNG CÓ GÌ THAY ĐỔI
//       if (!hasChange) {
//         message.info('Không có thông tin nào thay đổi.');
//         setLoading(false);
//         // onClose(); // Tùy chọn: có thể đóng hoặc giữ nguyên
//         return;
//       }

//       // 3. GỬI API CẬP NHẬT
//       // Backend cần ID để biết update ai, và body chứa các trường thay đổi
//       // Payload cuối cùng sẽ gộp ID và changes
//       const payload = { 
//         id: role.id, // ID bắt buộc
//         ...changes 
//       };

//       console.log('Update Role Payload:', payload);

//       await roleAPI.update(payload);
      
//       message.success('Cập nhật vai trò thành công!');
//       onRoleUpdated(); // Refresh lại danh sách ở component cha
//       onClose(); // Đóng modal

//     } catch (err) {
//       console.error(err);
//       const msg = err.response?.data?.message || 'Cập nhật thất bại.';
//       message.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!role) return null;

//   return (
//     <Modal
//       cancelButtonProps={{ disabled: loading }}
//       cancelText="Hủy"
//       centered
//       okButtonProps={{ loading }}
//       okText="Lưu thay đổi"
//       onCancel={onClose}
//       onOk={handleSubmit}
//       open={true}
//       title={`Sửa vai trò: ${role.roleName || role.name}`}
//       destroyOnClose={true}
//       width={600}
//     >
//       <Space direction="vertical" style={{ width: '100%' }} size="middle">
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Tên vai trò</label>
//           <Input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Nhập tên vai trò mới"
//             disabled={true} // 🔒 CHẶN KHÔNG CHO SỬA TÊN
//             style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed', color: '#888' }}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
//           <Input.TextArea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Nhập mô tả vai trò"
//             rows={2}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Cấp bậc (Level)</label>
//           <Input
//             type="number"
//             min={1}
//             value={level}
//             onChange={(e) => setLevel(e.target.value)}
//             placeholder="Nhập cấp độ"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Chọn các quyền</label>
//           <div 
//             className="permission-list" 
//             style={{ 
//               border: '1px solid #d9d9d9', 
//               borderRadius: '6px', 
//               maxHeight: '250px', 
//               overflowY: 'auto', 
//               padding: '4px',
//               backgroundColor: '#fafafa'
//             }}
//           >
//             {processedPermissions.length > 0 ? (
//               processedPermissions.map((permission) => (
//                 <div
//                   key={permission.uniqueKey}
//                   className="permission-item"
//                   style={{
//                     padding: '8px 12px',
//                     borderBottom: '1px solid #f0f0f0',
//                     backgroundColor: selectedPermissionsSet.has(permission.uniqueKey) ? '#e6f7ff' : 'transparent',
//                     marginBottom: '2px',
//                     borderRadius: '4px',
//                     transition: 'background-color 0.3s'
//                   }}
//                 >
//                   <Checkbox
//                     checked={selectedPermissionsSet.has(permission.uniqueKey)}
//                     onChange={() => handlePermissionChange(permission.uniqueKey)}
//                   >
//                     <span style={{ 
//                       display: 'block', 
//                       whiteSpace: 'normal', 
//                       wordBreak: 'break-word',
//                       fontWeight: 500 
//                     }}>
//                       {permission.displayName}
//                     </span>
//                   </Checkbox>
//                 </div>
//               ))
//             ) : (
//               <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
//                 Không có dữ liệu quyền hạn.
//               </div>
//             )}
//           </div>
//         </div>
//       </Space>
//     </Modal>
//   );
// };

// export default UpdateRoleModal;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Input, Checkbox, Space, message } from 'antd'; 
import { roleAPI } from '../services/apiService'; 

const UpdateRoleModal = ({ role, allPermissions, onClose, onRoleUpdated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState(1);
  const [selectedPermissionsSet, setSelectedPermissionsSet] = useState(new Set());
  
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);

  // Xử lý danh sách quyền
  const processedPermissions = useMemo(() => {
    return allPermissions.map((permission, index) => {
      const pName = permission.permissionName || permission.name || 'Unnamed';
      return {
        ...permission,
        uniqueKey: `${pName}-${index}`, 
        originalName: pName,
        displayName: pName 
      };
    });
  }, [allPermissions]);

  // Load dữ liệu
  useEffect(() => {
    if (role) {
      const initialName = role.roleName || role.name || '';
      const initialDesc = role.description || '';
      const initialLevel = role.level || 1;
      
      const initialPermissionUniqueKeys = role.permissions
        ? role.permissions.map(p => {
            const pName = p.permissionName || p.name;
            const found = processedPermissions.find(pp => String(pp.originalName) === String(pName));
            return found ? found.uniqueKey : String(pName);
          })
        : [];
      
      const initialPermsSet = new Set(initialPermissionUniqueKeys);

      setName(initialName);
      setDescription(initialDesc); 
      setLevel(initialLevel); 
      setSelectedPermissionsSet(initialPermsSet);

      setOriginalData({
        name: initialName,
        description: initialDesc,
        level: initialLevel,
        permissionsSet: initialPermsSet 
      });
    }
  }, [role, processedPermissions]);

  const handlePermissionChange = useCallback((uniqueKey) => {
    setSelectedPermissionsSet(prevSet => {
      const newSet = new Set(prevSet);
      if (newSet.has(uniqueKey)) newSet.delete(uniqueKey);
      else newSet.add(uniqueKey);
      return newSet;
    });
  }, []);

  const arePermissionsChanged = (setA, setB) => {
    if (setA.size !== setB.size) return true;
    for (let a of setA) if (!setB.has(a)) return true;
    return false;
  };

  // const handleSubmit = async () => {
  //   setLoading(true);
    
  //   try {
  //     // Hàm helper: Chuyển rỗng thành null
  //     const processValue = (val) => (!val || String(val).trim() === '') ? null : String(val).trim();

  //     const changes = {};
  //     let hasChange = false; // Cờ kiểm tra xem có trường nào khác thay đổi không

  //     // 1. So sánh Mô tả
  //     if (description !== originalData.description) {
  //       changes.description = processValue(description);
  //       hasChange = true;
  //     }

  //     // 2. So sánh Level
  //     const currentLevel = parseInt(level, 10);
  //     const originalLevel = parseInt(originalData.level, 10);
  //     if (currentLevel !== originalLevel) {
  //       changes.level = currentLevel;
  //       hasChange = true;
  //     }

  //     // 3. So sánh Quyền
  //     if (arePermissionsChanged(selectedPermissionsSet, originalData.permissionsSet)) {
  //       const permissionsToSubmit = Array.from(selectedPermissionsSet).map(uniqueKey => {
  //         const found = processedPermissions.find(p => p.uniqueKey === uniqueKey);
  //         return found ? found.originalName : uniqueKey;
  //       });
  //       changes.permissions = permissionsToSubmit;
  //       hasChange = true;
  //     }

  //     // 4. Nếu không có gì thay đổi (ngoài cái tên luôn giống nhau), thông báo user
  //     if (!hasChange) {
  //       message.info('Không có thông tin nào thay đổi.');
  //       setLoading(false);
  //       return;
  //     }

  //     // 5. TẠO PAYLOAD
  //     const payload = { 
  //       id: role.id,
  //       roleName: name, // 👇 LUÔN GỬI TRƯỜNG NÀY (theo yêu cầu của bạn)
  //       ...changes      // Gộp các trường thay đổi vào
  //     };

  //     console.log('Update Role Payload:', payload);

  //     await roleAPI.update(payload);
      
  //     message.success('Cập nhật vai trò thành công!');
  //     onRoleUpdated(); 

  //   } catch (err) {
  //     console.error(err);
  //     const msg = err.response?.data?.message || 'Cập nhật thất bại.';
  //     message.error(msg);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Hàm helper: Chuyển rỗng thành null
      const processValue = (val) => (!val || String(val).trim() === '') ? null : String(val).trim();

      const changes = {};
      let hasChange = false;

      // 1. So sánh Quyền (Logic này giữ nguyên vì quyền là mảng phức tạp)
      if (arePermissionsChanged(selectedPermissionsSet, originalData.permissionsSet)) {
        const permissionsToSubmit = Array.from(selectedPermissionsSet).map(uniqueKey => {
          const found = processedPermissions.find(p => p.uniqueKey === uniqueKey);
          return found ? found.originalName : uniqueKey;
        });
        changes.permissions = permissionsToSubmit;
        hasChange = true;
      }

      // Kiểm tra xem các trường khác có thay đổi không để bật cờ hasChange
      if (description !== originalData.description || parseInt(level, 10) !== parseInt(originalData.level, 10)) {
          hasChange = true;
      }

      // 2. Nếu không có gì thay đổi
      if (!hasChange) {
        message.info('Không có thông tin nào thay đổi.');
        setLoading(false);
        return;
      }

      // 3. TẠO PAYLOAD
      // ⚠️ SỬA QUAN TRỌNG TẠI ĐÂY:
      // Luôn gửi description và level hiện tại, bất kể có sửa hay không
      const payload = { 
        id: role.id,
        roleName: name, 
        description: processValue(description), // Luôn gửi description hiện tại
        level: parseInt(level, 10) || 1,        // Luôn gửi level hiện tại (nếu NaN thì mặc định 1)
        ...changes // Chỉ chứa permissions nếu có thay đổi
      };

      console.log('Update Role Payload:', payload);

      await roleAPI.update(payload);
      
      message.success('Cập nhật vai trò thành công!');
      onRoleUpdated(); 
      onClose();

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Cập nhật thất bại.';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };
  if (!role) return null;

  return (
    <Modal
      cancelButtonProps={{ disabled: loading }}
      cancelText="Hủy"
      centered
      okButtonProps={{ loading }}
      okText="Lưu thay đổi"
      onCancel={onClose}
      onOk={handleSubmit}
      open={true}
      title={`Sửa vai trò: ${role.roleName || role.name}`}
      destroyOnClose={true}
      width={600}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên vai trò</label>
          <Input
            value={name}
            // Không có onChange vì disabled
            placeholder="Nhập tên vai trò mới"
            disabled={true} 
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed', color: '#595959' }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả vai trò"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cấp bậc (Level)</label>
          <Input
            type="number"
            min={1}
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="Nhập cấp độ"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chọn các quyền</label>
          <div 
            className="permission-list" 
            style={{ 
              border: '1px solid #d9d9d9', 
              borderRadius: '6px', 
              maxHeight: '250px', 
              overflowY: 'auto', 
              padding: '4px',
              backgroundColor: '#fafafa'
            }}
          >
            {processedPermissions.length > 0 ? (
              processedPermissions.map((permission) => (
                <div
                  key={permission.uniqueKey}
                  className="permission-item"
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: selectedPermissionsSet.has(permission.uniqueKey) ? '#e6f7ff' : 'transparent',
                    marginBottom: '2px',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s'
                  }}
                >
                  <Checkbox
                    checked={selectedPermissionsSet.has(permission.uniqueKey)}
                    onChange={() => handlePermissionChange(permission.uniqueKey)}
                  >
                    <span style={{ 
                      display: 'block', 
                      whiteSpace: 'normal', 
                      wordBreak: 'break-word',
                      fontWeight: 500 
                    }}>
                      {permission.displayName}
                    </span>
                  </Checkbox>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                Không có dữ liệu quyền hạn.
              </div>
            )}
          </div>
        </div>
      </Space>
    </Modal>
  );
};

export default UpdateRoleModal;
