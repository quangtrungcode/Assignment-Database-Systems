// // src/components/UpdateRoleModal.jsx



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

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      
      const toNullIfEmpty = (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'string' && value.trim() === '') return null;
        return value;
      };

      const finalLevel = toNullIfEmpty(level) !== null ? parseInt(level, 10) : 1;
      const finalDescription = toNullIfEmpty(description);

      
      const permissionsToSubmit = Array.from(selectedPermissionsSet).map(uniqueKey => {
        const found = processedPermissions.find(p => p.uniqueKey === uniqueKey);
        
        return found ? found.originalName : uniqueKey;
      });

     
      const payload = { 
        
        id: role.id || null, 
        
        roleName: name, 
        description: finalDescription, 
        level: finalLevel,
        permissions: permissionsToSubmit 
      };

      console.log('Update Role Payload:', payload);

     
      await roleAPI.update(name, payload);
      
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


// src/components/UpdateRoleModal.jsx

