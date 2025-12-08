


import React, { useState, useEffect } from 'react';
import { Modal, Input, message, notification } from 'antd';
import { permissionAPI } from '../services/apiService';

const UpdatePermissionModal = ({ permission, onClose, onPermissionUpdated }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (permission) {
      setDescription(permission.description || '');
    }
  }, [permission]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      
      const permissionNameID = permission.permissionName || permission.name;
      
      if (!permissionNameID) {
         throw new Error("Không tìm thấy tên quyền để cập nhật");
      }

      
      const toNullIfEmpty = (val) => (!val || val.toString().trim() === '') ? null : val.toString().trim();

      
      const payload = {
        
        permissionName: permissionNameID, 
        description: toNullIfEmpty(description)
      };

      console.log('Update Payload:', payload);

      
      await permissionAPI.update(permissionNameID, payload);
      
      message.success('Cập nhật quyền thành công!');
      onPermissionUpdated();
      onClose();

    } catch (err) {
      console.error("Update Error:", err);
      const data = err.response?.data;
      
      
      let backendErrorMsg = 'Cập nhật thất bại.';

      if (data) {
       
        if (Array.isArray(data)) {
            const messages = data.map(item => item.message).filter(msg => msg);
            if (messages.length > 0) backendErrorMsg = messages.join('\n');
        } 
        
        else if (typeof data === 'object') {
             backendErrorMsg = data.message || data.error || backendErrorMsg;
        } 
       
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