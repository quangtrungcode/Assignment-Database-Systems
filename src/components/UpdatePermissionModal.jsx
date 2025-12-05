// import React, { useState, useEffect } from 'react';
// import { Modal, Input, message, notification } from 'antd';
// import { permissionAPI } from '../services/apiService';

// const UpdatePermissionModal = ({ permission, onClose, onPermissionUpdated }) => {
//   const [description, setDescription] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (permission) {
//       setDescription(permission.description || '');
//     }
//   }, [permission]);

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       // 🛠️ Tìm tên quyền chính xác để gửi lên API
//       const permissionName = permission.name || permission.permissionName;
      
//       if (!permissionName) {
//          throw new Error("Không tìm thấy tên quyền để cập nhật");
//       }

//       const updatedData = { description }; 
      
//       // API thường là: PUT /permissions/{name} body: { description: ... }
//       await permissionAPI.update(permissionName, updatedData);
      
//       message.success('Cập nhật quyền thành công!');
//       onPermissionUpdated();
//       onClose();
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra.';
//       notification.error({
//         message: 'Cập nhật thất bại',
//         description: errorMessage,
//         placement: 'topRight'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!permission) return null;

//   // Tên hiển thị (không cho sửa)
//   const displayName = permission.name || permission.permissionName;

//   return (
//     <Modal
//       open={true}
//       title={`Cập nhật quyền: ${displayName}`}
//       onCancel={onClose}
//       onOk={handleSubmit}
//       okText="Lưu thay đổi"
//       cancelText="Hủy"
//       confirmLoading={loading}
//       centered
//     >
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//         <div>
//           <label style={{fontWeight: 500}}>Tên quyền (Không thể sửa)</label>
//           <Input value={displayName} disabled style={{marginTop: '5px', backgroundColor: '#f5f5f5'}} />
//         </div>
        
//         <div>
//           <label style={{fontWeight: 500}}>Mô tả</label>
//           <Input.TextArea 
//             rows={4}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Nhập mô tả mới..."
//             style={{marginTop: '5px'}}
//           />
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default UpdatePermissionModal;


import React, { useState, useEffect } from 'react';
import { Modal, Input, message, notification } from 'antd';
import { permissionAPI } from '../services/apiService';

const UpdatePermissionModal = ({ permission, onClose, onPermissionUpdated }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Load dữ liệu ban đầu
  useEffect(() => {
    if (permission) {
      setDescription(permission.description || '');
    }
  }, [permission]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Xác định ID (permissionName)
      const permissionNameID = permission.permissionName || permission.name;
      
      if (!permissionNameID) {
         throw new Error("Không tìm thấy tên quyền để cập nhật");
      }

      // 2. Helper chuyển rỗng -> null
      const toNullIfEmpty = (val) => (!val || val.toString().trim() === '') ? null : val.toString().trim();

      // 3. Tạo Payload (Gửi tất cả các trường, chuyển rỗng thành null)
      const payload = {
        // Backend thường cần ID trong URL, nhưng nếu DTO yêu cầu cả trong body thì gửi luôn
        permissionName: permissionNameID, 
        description: toNullIfEmpty(description)
      };

      console.log('Update Payload:', payload);

      // Gọi API: update(id, payload)
      await permissionAPI.update(permissionNameID, payload);
      
      message.success('Cập nhật quyền thành công!');
      onPermissionUpdated();
      onClose();

    } catch (err) {
      console.error("Update Error:", err);
      const data = err.response?.data;
      
      // 4. XỬ LÝ LỖI TỪ BACKEND (Giống logic Create)
      let backendErrorMsg = 'Cập nhật thất bại.';

      if (data) {
        // Trường hợp 1: List lỗi
        if (Array.isArray(data)) {
            const messages = data.map(item => item.message).filter(msg => msg);
            if (messages.length > 0) backendErrorMsg = messages.join('\n');
        } 
        // Trường hợp 2: Object lỗi
        else if (typeof data === 'object') {
             backendErrorMsg = data.message || data.error || backendErrorMsg;
        } 
        // Trường hợp 3: String lỗi
        else if (typeof data === 'string') {
            backendErrorMsg = data;
        }
      }

      notification.error({
        message: 'Lỗi',
        description: <div style={{ whiteSpace: 'pre-wrap' }}>{backendErrorMsg}</div>,
        placement: 'topRight'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!permission) return null;

  // Tên hiển thị (Ưu tiên permissionName)
  const displayName = permission.permissionName || permission.name;

  return (
    <Modal
      open={true}
      title={`Cập nhật quyền: ${displayName}`}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      confirmLoading={loading}
      centered
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{fontWeight: 500}}>
            Tên quyền (Không thể sửa) <span style={{color: 'red'}}>*</span>
          </label>
          <Input 
            value={displayName} 
            disabled 
            style={{marginTop: '5px', backgroundColor: '#f5f5f5', color: '#555', cursor: 'not-allowed'}} 
          />
        </div>
        
        <div>
          <label style={{fontWeight: 500}}>Mô tả</label>
          <Input.TextArea 
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả mới (để trống sẽ chuyển thành null)..."
            style={{marginTop: '5px'}}
            disabled={loading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdatePermissionModal;