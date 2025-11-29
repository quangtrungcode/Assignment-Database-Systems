import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Input, Button, Checkbox, Space } from 'antd'; // Added Space for better layout

const UpdateRoleModal = ({ role, allPermissions, onClose, onRoleUpdated, loading = false }) => {
  const [name, setName] = useState('');
  const [selectedPermissionsSet, setSelectedPermissionsSet] = useState(new Set());

  // Generate unique keys for permissions to handle potential non-unique permission.id from backend
  const processedPermissions = useMemo(() => {
    return allPermissions.map((permission, index) => ({
      ...permission,
      // Create a truly unique identifier for React's key and internal state
      uniqueKey: `${permission.name}-${index}`, 
      originalId: permission.id, // Keep original ID for API submission
      originalName: permission.name // Add originalName for API submission
    }));
  }, [allPermissions]);

  useEffect(() => {
    if (role) {
      setName(role.name || '');
      // Initialize the Set with uniqueKeys from the role's permissions
      const initialPermissionUniqueKeys = role.permissions
        ? role.permissions.map(p => {
            // Find the corresponding uniqueKey from processedPermissions
            const found = processedPermissions.find(pp => String(pp.originalName) === String(p.name)); // Ensure type consistency for comparison
            return found ? found.uniqueKey : String(p.name); // Fallback to originalName string if not found (shouldn't happen)
          })
        : [];
      setSelectedPermissionsSet(new Set(initialPermissionUniqueKeys));
    }
  }, [role, processedPermissions]); // Add processedPermissions to dependencies

  const handlePermissionChange = useCallback((uniqueKey) => {
    setSelectedPermissionsSet(prevSet => {
      const newSet = new Set(prevSet);
      if (newSet.has(uniqueKey)) {
        newSet.delete(uniqueKey);
      } else {
        newSet.add(uniqueKey);
      }
      return newSet;
    });
  }, []);

  const handleSubmit = async () => {
    // Map uniqueKeys back to original permission IDs for API submission
    const permissionsToSubmit = Array.from(selectedPermissionsSet).map(uniqueKey => {
      const found = processedPermissions.find(p => p.uniqueKey === uniqueKey);
      return found ? found.originalName : uniqueKey; // Fallback in case uniqueKey wasn't found (shouldn't happen)
    });

    await onRoleUpdated({
      originalName: role.name,
      newName: name,
      permissions: permissionsToSubmit,
    });
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
      title={`Sửa vai trò: ${role.name}`}
      destroyOnClose={true}
      width={600} // Set a fixed width
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên vai trò</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên vai trò mới"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chọn các quyền</label>
          <div className="permission-list" style={{ border: '1px solid #ddd', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto', overflowX: 'auto' }}>
            {processedPermissions.map((permission) => (
                              <div
                                key={permission.uniqueKey} // Use the guaranteed unique key
                                className="permission-item"
                                style={{
                                  padding: '8px 12px',
                                  borderBottom: '1px solid #eee',
                                  backgroundColor: selectedPermissionsSet.has(permission.uniqueKey) ? '#e6f7ff' : 'transparent',
                                  width: '100%', // Ensure it takes full available width
                                }}
                              >                <Checkbox
                  checked={selectedPermissionsSet.has(permission.uniqueKey)}
                  onChange={() => handlePermissionChange(permission.uniqueKey)} // Pass the uniqueKey
                >
                  <span style={{
                    display: 'block', 
                    whiteSpace: 'normal', 
                    wordBreak: 'break-word'
                  }}>
                    {permission.name}
                  </span>
                </Checkbox>
              </div>
            ))}
          </div>
        </div>
      </Space>
    </Modal>
  );
};

export default UpdateRoleModal;

