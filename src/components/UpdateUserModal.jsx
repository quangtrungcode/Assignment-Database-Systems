// import React, { useState, useEffect } from 'react';
// import { userAPI } from '../services/apiService';
// import '../styles/Modal.css';
// import Toast from './Toast';

// const UpdateUserModal = ({ user, roles, onClose, onUserUpdated }) => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     gender: '',
//     birthDate: '',
//     roleId: '',
//     password: '',
//     career: '', 
//     profession: '',
//   });
//   const [selectedRoleName, setSelectedRoleName] = useState('');
//   const [error, setError] = useState(null);
//   const [toast, setToast] = useState(null);

//   useEffect(() => {
//     // console.log('UpdateUserModal: All roles received:', roles); // <--- Still keep this
//     if (user) {
//       const userRole = roles.find(r => r.id === user.role?.id);
//       // console.log('UpdateUserModal: Initial user object:', user); // <--- Added this for user structure
//       // console.log('UpdateUserModal: Initial user role ID:', user.role?.id);
//       // console.log('UpdateUserModal: Initial user role object from roles.find:', userRole); // <--- Added this
//       setFormData({
//         fullName: user.fullName || '',
//         email: user.email || '',
//         phone: user.phone || '',
//         gender: user.gender || '',
//         birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
//         roleId: user.role?.id || '',
//         password: '',
//         career: user.career || '',
//         profession: user.profession || '',
//       });
//       const initialRoleName = userRole ? userRole.name.toLowerCase() : '';
//       setSelectedRoleName(initialRoleName);
//       // console.log('UpdateUserModal: Initial selectedRoleName set to:', initialRoleName);
//     }
//   }, [user, roles]);

//   // const handleChange = (e) => {
//   //   const { name, value } = e.target;
//   //   setFormData({ ...formData, [name]: value });

//   //   if (name === 'roleId') {
//   //   console.group("DEBUG ROLE CHANGE");
//   //     console.log("1. ID bạn vừa chọn:", value, "(Kiểu dữ liệu:", typeof value, ")");
//   //     console.log("2. Danh sách Roles hiện có:", roles);console.group("DEBUG ROLE CHANGE");
      
//   //     const selectedRole = roles.find(r => String(r.id) === String(value)); // <--- Added String() for robust comparison
//   //     // console.log('UpdateUserModal: Result of roles.find for selected roleId:', selectedRole); // <--- Added this
//   //     const roleName = selectedRole ? selectedRole.name.toLowerCase() : '';
//   //     // console.log('UpdateUserModal: Role changed to ID:', value, 'Name:', roleName);
//   //     setSelectedRoleName(roleName);

//   //     // Clear career or profession if the role changes
//   //     if (roleName !== 'student') {
//   //       setFormData(prev => ({ ...prev, career: '' }));
//   //       // console.log('UpdateUserModal: Cleared career field.');
//   //     }
//   //     if (roleName !== 'lecturer') {
//   //       setFormData(prev => ({ ...prev, profession: '' }));
//   //       // console.log('UpdateUserModal: Cleared profession field.');
//   //     }
//   //     // console.log('UpdateUserModal: selectedRoleName updated to:', roleName);
//   //   }
//   // };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     // 1. Cập nhật state formData như bình thường
//     setFormData(prev => ({ ...prev, [name]: value }));

//     // 2. Xử lý logic ẩn/hiện input Career và Profession
//     if (name === 'roleId') {
//       // Vì ID của bạn là chữ (ví dụ: "student"), nên 'value' chính là cái ta cần kiểm tra
//       // Chuyển về chữ thường để so sánh cho chắc chắn
//       const roleIdString = String(value).toLowerCase().trim(); 
      
//       console.log("Role ID bạn chọn:", roleIdString); // Log kiểm tra

//       setSelectedRoleName(roleIdString);

//       // Logic Reset dữ liệu thừa:
//       // Nếu ID không phải 'student' -> Xóa career
//       // Nếu ID không phải 'lecturer' -> Xóa profession
//       setFormData(prev => ({
//         ...prev,
//         roleId: value,
//         career: roleIdString === 'student' ? prev.career : '',
//         profession: roleIdString === 'lecturer' ? prev.profession : ''
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       const dataToSend = {
//         fullName: formData.fullName,
//         email: formData.email,
//         phone: formData.phone,
//         gender: formData.gender,
//         birthDate: formData.birthDate,
//         role: formData.roleId,
//       };

//       if (selectedRoleName === 'student' && formData.career) {
//         dataToSend.career = formData.career;
//       }

//       if (selectedRoleName === 'lecturer' && formData.profession) {
//         dataToSend.profession = formData.profession;
//       }

//       if (formData.password && formData.password.trim() !== '') {
//         dataToSend.passwordHash = formData.password;
//       }

//       // console.log('UpdateUserModal: Payload sent to API:', dataToSend);

//       await userAPI.update(user.userID, dataToSend);
//       setToast({ message: 'Cập nhật người dùng thành công!', type: 'success' });
//       onUserUpdated();
//       setTimeout(onClose, 1500);
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật người dùng.';
//       setError(errorMsg);
//       setToast({ message: errorMsg, type: 'error' });
//     }
//   };
  
//   if (!user) return null;

//   // console.log('UpdateUserModal: Current selectedRoleName for rendering:', selectedRoleName);

//   return (
//     <div
//       className="modal-overlay"
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 1000
//       }}>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <div 
//         className="modal-content" 
//         style={{ 
//           maxWidth: '600px', 
//           width: '100%', 
//           maxHeight: '90vh',
//           display: 'flex', 
//           flexDirection: 'column' 
//         }}>
//         <div className="modal-header">
//           <h2>Cập nhật Người dùng</h2>
//           <button onClick={onClose} className="modal-close-btn">&times;</button>
//         </div>
//         <div className="modal-body" style={{ overflowY: 'auto', padding: '20px' }}>
//           <form id="update-user-form" onSubmit={handleSubmit} className="modal-form">
//             <div className="form-group">
//               <label>Họ và Tên</label>
//               <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>Email</label>
//               <input type="email" name="email" value={formData.email} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>Số điện thoại</label>
//               <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
//             </div>
//             <div className="form-group">
//               <label>Mật khẩu mới</label>
//               <input type="password" name="password" value={formData.password} onChange={handleChange}  />
//             </div>
//             <div className="form-group">
//               <label>Giới tính</label>
//               <select name="gender" value={formData.gender} onChange={handleChange}>
//                 <option value="">Chọn giới tính</option>
//                 <option value="male">Nam</option>
//                 <option value="female">Nữ</option>
//                 <option value="other">Khác</option>
//               </select>
//             </div>
//             <div className="form-group">
//               <label>Ngày sinh</label>
//               <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
//             </div>
//             <div className="form-group">
//               <label>Vai trò</label>
//               <select name="roleId" value={formData.roleId} onChange={handleChange} required>
//                 <option value="">Chọn vai trò</option>
//                 {roles.map(role => (
//                   <option key={role.id} value={role.id}>{role.name}</option>
//                 ))}
//               </select>
//             </div>
            
//             {selectedRoleName === 'student' && (
//               <div className="form-group">
//                 <label>Ngành học</label>
//                 <input type="text" name="career" value={formData.career} onChange={handleChange} />
//               </div>
//             )}

//             {selectedRoleName === 'lecturer' && (
//               <div className="form-group">
//                 <label>Chuyên môn</label>
//                 <input type="text" name="profession" value={formData.profession} onChange={handleChange} />
//               </div>
//             )}
//           </form>
//         </div>
//         <div className="modal-footer">
//           <div className="form-actions" style={{ justifyContent: 'flex-end', width: '100%' }}>
//             <button type="button" onClick={onClose} className="btn-cancel">Hủy</button>
//             <button type="submit" form="update-user-form" className="btn-primary">Lưu thay đổi</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateUserModal;

import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/apiService';
import '../styles/Modal.css';
import Toast from './Toast';

const UpdateUserModal = ({ user, roles, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    birthDate: '',
    roleId: '',
    password: '', // Mật khẩu mới
    career: '', 
    profession: '',
  });

  const [selectedRoleName, setSelectedRoleName] = useState('');
  
  // State giao diện
  const [showPassword, setShowPassword] = useState(false); // 👁️ Thêm mắt ẩn hiện
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // 1. Load dữ liệu khi mở Modal
  useEffect(() => {
    if (user) {
      // Reset trạng thái giao diện
      setError(null);
      setToast(null);
      setLoading(false);

      const userRole = roles.find(r => r.id === user.role?.id);
      
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
        roleId: user.role?.id || '',
        password: '', // Luôn để trống mật khẩu khi mới mở
        career: user.career || '',
        profession: user.profession || '',
      });

      // Xác định role name ban đầu
      const initialRoleName = userRole ? userRole.name.toLowerCase() : '';
      setSelectedRoleName(initialRoleName);
    }
  }, [user, roles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Tắt lỗi ngay khi nhập liệu
    if (error) setError(null);

    setFormData(prev => ({ ...prev, [name]: value }));

    // Xử lý logic Role
    if (name === 'roleId') {
      // ID của bạn là chuỗi (ví dụ: "student"), nên lấy trực tiếp value để kiểm tra
      const roleIdString = String(value).toLowerCase().trim(); 
      
      setSelectedRoleName(roleIdString);

      // Logic Reset dữ liệu thừa khi đổi vai trò
      setFormData(prev => ({
        ...prev,
        roleId: value,
        career: roleIdString === 'student' ? prev.career : '',
        profession: roleIdString === 'lecturer' ? prev.profession : ''
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        birthDate: formData.birthDate,
        role: formData.roleId,
      };

      // 👇 LOGIC GỬI PAYLOAD ĐÃ ĐƯỢC CẢI TIẾN
      // Chỉ cần đúng Role là gửi, không cần check có dữ liệu hay không (để HTML required lo)
      if (selectedRoleName === 'student') {
        dataToSend.career = formData.career;
      }

      if (selectedRoleName === 'lecturer') {
        dataToSend.profession = formData.profession;
      }

      // Chỉ gửi password nếu người dùng có nhập
      if (formData.password && formData.password.trim() !== '') {
        dataToSend.passwordHash = formData.password;
      }

      console.log('Update Payload:', dataToSend);

      await userAPI.update(user.userID, dataToSend);
      
      setToast({ message: 'Cập nhật người dùng thành công!', type: 'success' });
      onUserUpdated();
      
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      // 👇 LOGIC BẮT LỖI THÔNG MINH (Giống CreateModal)
      const data = err.response?.data;
      let errorMessage = 'Cập nhật thất bại. Vui lòng thử lại.';

      if (Array.isArray(data) && data.length > 0) {
        errorMessage = data.map(item => item.message).join(' - ');
      } 
      else if (data && data.message) {
        errorMessage = data.message;
      } 
      else if (typeof data === 'string') {
        errorMessage = data;
      }

      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
      
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) return null;

  return (
    <div className="modal-overlay">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="modal-content" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <h2>Cập nhật Người dùng</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
           {/* Hiển thị lỗi ngay đầu form */}
           {error && <p className="modal-error" style={{color: '#e74c3c', textAlign: 'center', margin: '10px 0'}}>{error}</p>}

          <div className="modal-body form-grid" style={{ overflowY: 'auto', padding: '20px' }}>
            <div className="form-group">
              <label>Họ và Tên</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            {/* 👇 Ô MẬT KHẨU CÓ MẮT 👁️ */}
            <div className="form-group">
              <label>Mật khẩu mới</label>
              <div className="password-input-wrapper" style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Để trống nếu không đổi"
                  style={{ paddingRight: '40px' }}
                />
                <span 
                  onClick={togglePasswordVisibility}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666', display: 'flex' }}
                >
                   {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ngày sinh</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Vai trò</label>
              <select name="roleId" value={formData.roleId} onChange={handleChange} required>
                <option value="">Chọn vai trò</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
            
            {/* Hiển thị có điều kiện */}
            {selectedRoleName === 'student' && (
              <div className="form-group" style={{animation: 'fadeIn 0.3s'}}>
                <label>Ngành học <span style={{color:'red'}}>*</span></label>
                <input type="text" name="career" value={formData.career} onChange={handleChange} required placeholder="Ví dụ: CNTT..." />
              </div>
            )}

            {selectedRoleName === 'lecturers' && (
              <div className="form-group" style={{animation: 'fadeIn 0.3s'}}>
                <label>Chuyên môn <span style={{color:'red'}}>*</span></label>
                <input type="text" name="profession" value={formData.profession} onChange={handleChange} required placeholder="Ví dụ: Toán học..." />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Hủy</button>
            <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;
