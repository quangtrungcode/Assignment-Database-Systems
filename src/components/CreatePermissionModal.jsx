// import React, { useState } from 'react';
// import { Modal, Input, message, notification } from 'antd';
// import { permissionAPI } from '../services/apiService';

// const CreatePermissionModal = ({ onClose, onPermissionCreated }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.name.trim()) {
//         message.error("Tên quyền không được để trống");
//         return;
//     }

//     setLoading(true);
//     try {
//       await permissionAPI.create({
//           name: formData.name.toUpperCase().trim(), // Tự động viết hoa (VD: USER_READ)
//           description: formData.description.trim()
//       });
      
//       message.success('Tạo quyền mới thành công!');
//       onPermissionCreated();
//       onClose();
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || err.message || 'Tạo quyền thất bại.';
//       notification.error({
//           message: 'Lỗi',
//           description: errorMessage,
//           placement: 'topRight'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       open={true}
//       title="Tạo quyền mới"
//       onCancel={onClose}
//       onOk={handleSubmit}
//       okText="Tạo quyền"
//       cancelText="Hủy"
//       confirmLoading={loading}
//       centered
//     >
//        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//           <div>
//             <label style={{fontWeight: 500}}>Tên quyền <span style={{color: 'red'}}>*</span></label>
//             <Input 
//                 name="name" 
//                 value={formData.name} 
//                 onChange={handleChange} 
//                 placeholder="VD: CREATE_USER" 
//                 style={{marginTop: '5px'}}
//                 disabled={loading}
//             />
//           </div>
//           <div>
//             <label style={{fontWeight: 500}}>Mô tả</label>
//             <Input.TextArea 
//                 name="description" 
//                 value={formData.description} 
//                 onChange={handleChange} 
//                 placeholder="Mô tả chức năng của quyền..." 
//                 rows={3}
//                 style={{marginTop: '5px'}}
//                 disabled={loading}
//             />
//           </div>
//        </div>
//     </Modal>
//   );
// };

// export default CreatePermissionModal;

import React, { useState } from 'react';
import { Modal, Input, notification } from 'antd';
import { permissionAPI } from '../services/apiService';

const CreatePermissionModal = ({ onClose, onPermissionCreated }) => {
  const [formData, setFormData] = useState({
    permissionName: '', 
    description: '',
  });
  
  const [errors, setErrors] = useState({
    permissionName: '',
  });

  const [loading, setLoading] = useState(false);

  // 1. Xử lý khi người dùng nhập liệu (Xóa lỗi nếu có)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Nếu đang có lỗi ở trường này thì xóa đi
    if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 2. MỚI: Xử lý khi người dùng click ra ngoài (Validate ngay lập tức)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (name === 'permissionName') {
        if (!value || value.trim() === '') {
            setErrors((prev) => ({ ...prev, permissionName: 'Tên quyền không được để trống' }));
        }
    }
  };

  const handleSubmit = async () => {
    // Validate lại lần cuối trước khi gửi
    const rawValue = formData.permissionName;
    if (!rawValue || rawValue.trim() === '') {
        setErrors({ permissionName: 'Tên quyền không được để trống' });
        return; 
    }

    setLoading(true);
    try {
      const toNullIfEmpty = (val) => (!val || val.toString().trim() === '') ? null : val.toString().trim();

      const payload = {
          permissionName: formData.permissionName.trim(), 
          description: toNullIfEmpty(formData.description)
      };

      await permissionAPI.create(payload);
      
      // notification.success({
      //   message: 'Thành công',
      //   description: 'Tạo quyền mới thành công!',
      //   placement: 'topRight',
      //   duration: 2
      // });
      
      onPermissionCreated();
      onClose();

    } catch (err) {
      console.error("Lỗi:", err);
      const data = err.response?.data;
      let backendErrorMsg = 'Tạo quyền thất bại.';

      if (data) {
        if (Array.isArray(data)) {
            const messages = data.map(item => item.message).filter(msg => msg);
            if (messages.length > 0) backendErrorMsg = messages.join('\n');
        } else if (typeof data === 'object') {
             backendErrorMsg = data.message || data.error || backendErrorMsg;
        } else if (typeof data === 'string') {
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

  return (
    <Modal
      open={true}
      title="Tạo quyền mới"
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Tạo mới"
      cancelText="Hủy"
      confirmLoading={loading}
      centered
    >
       <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{fontWeight: 500}}>
                Tên quyền (ID) <span style={{color: 'red'}}>*</span>
            </label>
            
            <Input 
                name="permissionName" 
                value={formData.permissionName} 
                onChange={handleChange}
                // Thêm sự kiện onBlur vào đây
                onBlur={handleBlur}
                placeholder="Nhập tên quyền..." 
                style={{marginTop: '5px'}}
                disabled={loading}
                autoFocus
                status={errors.permissionName ? "error" : ""}
            />
            
            {/* Hiển thị lỗi đỏ ngay dưới input */}
            {errors.permissionName && (
                <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '5px' }}>
                    {errors.permissionName}
                </div>
            )}
          </div>

          <div>
            <label style={{fontWeight: 500}}>Mô tả</label>
            <Input.TextArea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Mô tả chức năng..." 
                rows={3}
                style={{marginTop: '5px'}}
                disabled={loading}
            />
          </div>
       </div>
    </Modal>
  );
};

export default CreatePermissionModal;