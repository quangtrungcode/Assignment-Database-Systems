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
//     roleName: '', 
//     password: '',
//     career: '',
//     profession: '',
//   });

//   const [selectedRoleName, setSelectedRoleName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);

//   // 1. Load dữ liệu
//   useEffect(() => {
//     if (user) {
//       setErrors({});
//       setToast(null);

//       const backendRoleName = user.role?.roleName || user.role?.name || '';
      
//       setFormData({
//         fullName: user.fullName || '',
//         email: user.email || '',
//         phone: (user.phones && user.phones.length > 0) ? user.phones[0] : (user.phone || ''),
//         gender: user.gender || '',
//         birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
//         roleName: backendRoleName,
//         password: '',
//         career: user.career || '',
//         profession: user.profession || '',
//       });

//       if (backendRoleName) {
//         setSelectedRoleName(backendRoleName.toLowerCase().trim());
//       }
//     }
//   }, [user, roles]);

//   // 2. Validate Frontend
//   const validateField = (name, value) => {
//     let errorMsg = '';
//     const val = value ? String(value).trim() : '';
//     if (val.length > 0) {
//       if (name === 'fullName' && val.length < 8) errorMsg = 'Họ và tên phải có ít nhất 8 ký tự.';
//       if (name === 'password' && val.length < 8) errorMsg = 'Mật khẩu phải có ít nhất 8 ký tự.';
//     }
//     return errorMsg;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

//     if (name === 'roleName') {
//       const roleNameLower = value.toLowerCase().trim();
//       setSelectedRoleName(roleNameLower);
//       setFormData(prev => ({
//         ...prev,
//         roleName: value,
//         career: roleNameLower === 'student' ? prev.career : '',
//         profession: roleNameLower === 'lecturer' ? prev.profession : ''
//       }));
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
//   };

//   const togglePasswordVisibility = () => setShowPassword(!showPassword);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const newErrors = {};
//     newErrors.fullName = validateField('fullName', formData.fullName);
//     newErrors.password = validateField('password', formData.password);
//     Object.keys(newErrors).forEach(key => { if (!newErrors[key]) delete newErrors[key]; });

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setLoading(false);
//       return;
//     }

//     try {
//       // Hàm xử lý: Rỗng -> Null
//       const processValue = (val) => (!val || val.toString().trim() === '') ? null : val.toString().trim();
      
//       const processedPhones = formData.phone && formData.phone.trim() !== '' ? [formData.phone.trim()] : [];

//       const dataToSend = {
//         fullName: processValue(formData.fullName),
//         email: processValue(formData.email),
//         phones: processedPhones,
//         gender: processValue(formData.gender),
//         birthDate: processValue(formData.birthDate),
//         // --- SỬA LỖI ROLE: Áp dụng processValue để gửi null nếu rỗng ---
//         role: processValue(formData.roleName), 
//       };

//       if (selectedRoleName === 'student') {
//         dataToSend.career = processValue(formData.career);
//         dataToSend.profession = null;
//       } else if (selectedRoleName === 'lecturer') {
//         dataToSend.profession = processValue(formData.profession);
//         dataToSend.career = null;
//       } else {
//         dataToSend.career = null;
//         dataToSend.profession = null;
//       }

//       if (formData.password && formData.password.trim() !== '') {
//         dataToSend.passwordHash = formData.password.trim();
//       }

//       console.log('Final Payload:', dataToSend);
//       await userAPI.update(user.userID, dataToSend);
//       setToast({ message: 'Cập nhật thành công!', type: 'success' });
//       onUserUpdated();
//       setTimeout(onClose, 1500);

//     } catch (err) {
//       const data = err.response?.data;
      
//       let errorList = [];
//       if (Array.isArray(data)) {
//         errorList = data;
//       } else if (data && data.code) {
//         errorList = [data];
//       }

//       const newFieldErrors = {}; 
//       // Tạo một mảng chứa TẤT CẢ thông báo lỗi để hiển thị lên Toast
//       const allToastMessages = []; 

//       if (errorList.length > 0) {
//         errorList.forEach(errItem => {
//           const { code, message } = errItem;

//           // Luôn thêm message vào danh sách hiển thị Toast
//           // (Trừ khi message bị rỗng hoặc trùng lặp nếu bạn muốn lọc kỹ hơn)
//           if (message) allToastMessages.push(message);

//           switch (code) {
//             case 1004: case 1007: case 1015:
//               newFieldErrors.email = message;
//               break;
//             case 1006: case 1008:
//               newFieldErrors.fullName = message;
//               break;
//             case 1005: case 1009:
//               newFieldErrors.password = message;
//               break;
//             case 1025: case 1013:
//                newFieldErrors.roleName = message; 
//                break;
//             default:
//               break;
//           }
//         });
//       } else {
//         // Fallback nếu không bắt được lỗi
//         const fallbackMsg = typeof data === 'string' ? data : 'Có lỗi xảy ra.';
//         allToastMessages.push(fallbackMsg);
//       }

//       // 1. Hiển thị lỗi đỏ dưới input (UX)
//       if (Object.keys(newFieldErrors).length > 0) {
//         setErrors(newFieldErrors);
//       }

//       // 2. Hiển thị Toast (Message thực tế từ Backend)
//       // Nối các lỗi lại bằng xuống dòng
//       if (allToastMessages.length > 0) {
//         setToast({ message: allToastMessages.join('\n'), type: 'error' });
//       }

//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) return null;

//   return (
//     <div className="modal-overlay">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="modal-content" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
//         <div className="modal-header">
//           <h2>Cập nhật Người dùng</h2>
//           <button onClick={onClose} className="modal-close-btn">&times;</button>
//         </div>

//         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//           <div className="modal-body form-grid" style={{ overflowY: 'auto', padding: '20px' }}>
            
//             <div className="form-group">
//               <label>Họ và Tên</label>
//               <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} className={errors.fullName ? 'input-error' : ''} placeholder="Để trống sẽ cập nhật thành null" />
//               {errors.fullName && <span className="error-text">{errors.fullName}</span>}
//             </div>

//             <div className="form-group">
//               <label>Email</label>
//               <input type="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'input-error' : ''} />
//               {errors.email && <span className="error-text">{errors.email}</span>}
//             </div>

//             <div className="form-group">
//               <label>Số điện thoại</label>
//               <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
//             </div>

//             <div className="form-group">
//               <label>Mật khẩu mới</label>
//               <div className="password-input-wrapper" style={{ position: 'relative' }}>
//                 <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} className={errors.password ? 'input-error' : ''} placeholder="Để trống nếu không đổi" style={{ paddingRight: '40px' }} />
//                 <span onClick={togglePasswordVisibility} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>{showPassword ? "👁️" : "👁️‍🗨️"}</span>
//               </div>
//               {errors.password && <span className="error-text">{errors.password}</span>}
//             </div>

//             <div className="form-group">
//               <label>Giới tính</label>
//               <select name="gender" value={formData.gender} onChange={handleChange}>
//                 <option value="">(Trống - Update Null)</option>
//                 <option value="Nam">Nam</option>
//                 <option value="Nữ">Nữ</option>
//                 <option value="Khác">Khác</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Ngày sinh</label>
//               <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
//             </div>

//             <div className="form-group">
//               <label>Vai trò</label>
//               <select name="roleName" value={formData.roleName} onChange={handleChange} className={errors.roleName ? 'input-error' : ''}>
//                 <option value="">Chọn vai trò</option>
//                 {roles
//                   .filter(role => role.roleName !== 'Admin') 
//                   .map((role) => (
//                     <option key={role.roleName} value={role.roleName}>
//                       {role.description || role.roleName} 
//                     </option>
//                   ))
//                 }
//               </select>
//               {errors.roleName && <span className="error-text">{errors.roleName}</span>}
//             </div>

//             {selectedRoleName === 'student' && (
//               <div className="form-group" style={{ animation: 'fadeIn 0.3s' }}>
//                 <label>Ngành học</label>
//                 <input type="text" name="career" value={formData.career} onChange={handleChange} placeholder="Nhập ngành học" />
//               </div>
//             )}

//             {selectedRoleName === 'lecturer' && (
//               <div className="form-group" style={{ animation: 'fadeIn 0.3s' }}>
//                 <label>Chuyên môn</label>
//                 <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="Nhập chuyên môn" />
//               </div>
//             )}
//           </div>

//           <div className="modal-footer">
//             <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Hủy</button>
//             <button type="submit" className="btn-primary" disabled={loading}>
//               {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateUserModal;


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
//     roleName: '', 
//     password: '',
//     career: '',
//     profession: '',
//   });

//   // State lưu dữ liệu gốc để so sánh
//   const [originalData, setOriginalData] = useState({});

//   const [selectedRoleName, setSelectedRoleName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);

//   // 1. Load dữ liệu khi mở Modal
//   useEffect(() => {
//     if (user) {
//       setErrors({});
//       setToast(null);
//       setLoading(false);

//       const backendRoleName = user.role?.roleName || user.role?.name || '';
      
//       // Tạo object dữ liệu ban đầu (Map null -> chuỗi rỗng để hiển thị trên form)
//       const initialData = {
//         fullName: user.fullName || '',
//         email: user.email || '',
//         phone: (user.phones && user.phones.length > 0) ? user.phones[0] : (user.phone || ''),
//         gender: user.gender || '',
//         birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
//         roleName: backendRoleName,
//         password: '', // Mật khẩu luôn rỗng ban đầu
//         career: user.career || '',
//         profession: user.profession || '',
//       };

//       setFormData(initialData);
//       setOriginalData(initialData); // Lưu bản sao gốc

//       if (backendRoleName) {
//         setSelectedRoleName(backendRoleName.toLowerCase().trim());
//       }
//     }
//   }, [user, roles]);

//   // 2. Validate Frontend
//   const validateField = (name, value) => {
//     let errorMsg = '';
    
//     const rawVal = value ? String(value) : ''; 
//     const trimmedVal = rawVal.trim();

//     switch (name) {
//       case 'fullName':
//         if (trimmedVal.length === 0) {
//           errorMsg = 'Họ và tên không được để trống.';
//         } else if (trimmedVal.length < 8) {
//           errorMsg = 'Họ và tên phải có ít nhất 8 ký tự.';
//         }
//         break;
      
//       case 'password':
//         // Chỉ validate nếu có nhập liệu
//         if (rawVal.length > 0 && rawVal.length < 8) {
//           errorMsg = 'Mật khẩu phải có ít nhất 8 ký tự.';
//         }
//         break;

//       case 'email':
//         if (trimmedVal.length === 0) {
//            // Nếu email bắt buộc
//            errorMsg = 'Email không được để trống.';
//         }
//         break;

//       default:
//         break;
//     }
//     return errorMsg;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

//     if (name === 'roleName') {
//       const roleNameLower = value.toLowerCase().trim();
//       setSelectedRoleName(roleNameLower);
      
//       // Khi đổi role, ta cập nhật lại formData để hiển thị đúng input
//       setFormData(prev => ({
//         ...prev,
//         roleName: value,
//         career: roleNameLower === 'student' ? prev.career : '',
//         profession: roleNameLower === 'lecturer' ? prev.profession : ''
//       }));
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
//   };

//   const togglePasswordVisibility = () => setShowPassword(!showPassword);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // 1. Validate các trường quan trọng
//     const newErrors = {};
//     newErrors.fullName = validateField('fullName', formData.fullName);
//     if (formData.password) newErrors.password = validateField('password', formData.password);
    
//     Object.keys(newErrors).forEach(key => { if (!newErrors[key]) delete newErrors[key]; });

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setLoading(false);
//       return;
//     }

//     try {
//       // Hàm xử lý: Rỗng -> Null (cho payload)
//       const processValue = (val) => (!val || val.toString().trim() === '') ? null : val.toString().trim();
      
//       // 2. SO SÁNH & TẠO PAYLOAD (Chỉ lấy trường thay đổi)
//       const payload = {};
//       let hasChange = false;

//       // So sánh từng trường với originalData
//       if (formData.fullName !== originalData.fullName) {
//         payload.fullName = processValue(formData.fullName);
//         hasChange = true;
//       }

//       if (formData.email !== originalData.email) {
//         payload.email = processValue(formData.email);
//         hasChange = true;
//       }

//       if (formData.phone !== originalData.phone) {
//         payload.phones = formData.phone && formData.phone.trim() ? [formData.phone.trim()] : [];
//         hasChange = true;
//       }

//       if (formData.gender !== originalData.gender) {
//         payload.gender = processValue(formData.gender);
//         hasChange = true;
//       }

//       if (formData.birthDate !== originalData.birthDate) {
//         payload.birthDate = processValue(formData.birthDate);
//         hasChange = true;
//       }

//       // Role: Nếu thay đổi role thì gửi role mới
//       if (formData.roleName !== originalData.roleName) {
//         payload.role = formData.roleName; // Gửi tên Role
//         hasChange = true;
//       }

//       // Xử lý các trường phụ thuộc Role (Career / Profession)
//       // Logic: Nếu role thay đổi HOẶC nội dung trường đó thay đổi
//       if (selectedRoleName === 'student') {
//         if (formData.career !== originalData.career || formData.roleName !== originalData.roleName) {
//             payload.career = processValue(formData.career);
//             hasChange = true;
//         }
//         // Nếu chuyển sang student từ role khác -> Cần xóa profession cũ (gửi null)
//         if (formData.roleName !== originalData.roleName) {
//             payload.profession = null; 
//         }
//       } else if (selectedRoleName === 'lecturer') {
//         if (formData.profession !== originalData.profession || formData.roleName !== originalData.roleName) {
//             payload.profession = processValue(formData.profession);
//             hasChange = true;
//         }
//         // Nếu chuyển sang lecturer từ role khác -> Cần xóa career cũ
//         if (formData.roleName !== originalData.roleName) {
//             payload.career = null;
//         }
//       } else {
//         // Nếu chuyển sang role khác (Admin/User...), xóa cả 2
//         if (formData.roleName !== originalData.roleName) {
//             payload.career = null;
//             payload.profession = null;
//             hasChange = true; // Chắc chắn có thay đổi vì role đổi
//         }
//       }

//       // Password: Luôn gửi nếu có nhập (vì originalData.password luôn rỗng)
//       if (formData.password && formData.password !== '') {
//         payload.passwordHash = formData.password; // Giữ nguyên, không trim nếu muốn cho phép dấu cách
//         hasChange = true;
//       }

//       // 3. KIỂM TRA THAY ĐỔI
//       if (!hasChange) {
//         setToast({ message: 'Không có thông tin nào thay đổi.', type: 'info' });
//         setLoading(false);
//         // Có thể đóng modal luôn hoặc giữ nguyên tùy ý
//         // onClose(); 
//         return;
//       }

//       console.log('Update Payload (Changes Only):', payload);

//       await userAPI.update(user.userID, payload);
//       setToast({ message: 'Cập nhật thành công!', type: 'success' });
//       onUserUpdated(); // Refresh list bên ngoài
//       setTimeout(onClose, 1500);

//     } catch (err) {
//       const data = err.response?.data;
      
//       let errorList = [];
//       if (Array.isArray(data)) {
//         errorList = data;
//       } else if (data && data.code) {
//         errorList = [data];
//       }

//       const newFieldErrors = {}; 
//       const allToastMessages = []; 

//       if (errorList.length > 0) {
//         errorList.forEach(errItem => {
//           const { code, message } = errItem;
//           if (message) allToastMessages.push(message);

//           switch (code) {
//             case 1004: case 1007: case 1015:
//               newFieldErrors.email = message;
//               break;
//             case 1006: case 1008:
//               newFieldErrors.fullName = message;
//               break;
//             case 1005: case 1009:
//               newFieldErrors.password = message;
//               break;
//             case 1025: case 1013:
//                newFieldErrors.roleName = message; 
//                break;
//             default:
//               break;
//           }
//         });
//       } else {
//         const fallbackMsg = typeof data === 'string' ? data : 'Cập nhật thất bại.';
//         allToastMessages.push(fallbackMsg);
//       }

//       if (Object.keys(newFieldErrors).length > 0) {
//         setErrors(newFieldErrors);
//       }

//       if (allToastMessages.length > 0) {
//         setToast({ message: allToastMessages.join('\n'), type: 'error' });
//       }

//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) return null;

//   return (
//     <div className="modal-overlay">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="modal-content" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
//         <div className="modal-header">
//           <h2>Cập nhật Người dùng</h2>
//           <button onClick={onClose} className="modal-close-btn">&times;</button>
//         </div>

//         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//           <div className="modal-body form-grid" style={{ overflowY: 'auto', padding: '20px' }}>
            
//             <div className="form-group">
//               <label>Họ và Tên <span style={{color:'red'}}>*</span></label>
//               <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} className={errors.fullName ? 'input-error' : ''} placeholder="Nhập họ tên" />
//               {errors.fullName && <span className="error-text">{errors.fullName}</span>}
//             </div>

//             <div className="form-group">
//               <label>Email <span style={{color:'red'}}>*</span></label>
//               <input type="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'input-error' : ''} />
//               {errors.email && <span className="error-text">{errors.email}</span>}
//             </div>

//             <div className="form-group">
//               <label>Số điện thoại</label>
//               <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
//             </div>

//             <div className="form-group">
//               <label>Mật khẩu mới</label>
//               <div className="password-input-wrapper" style={{ position: 'relative' }}>
//                 <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} className={errors.password ? 'input-error' : ''} placeholder="Để trống nếu không đổi" style={{ paddingRight: '40px' }} />
//                 <span onClick={togglePasswordVisibility} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>{showPassword ? "👁️" : "👁️‍🗨️"}</span>
//               </div>
//               {errors.password && <span className="error-text">{errors.password}</span>}
//             </div>

//             <div className="form-group">
//               <label>Giới tính</label>
//               <select name="gender" value={formData.gender} onChange={handleChange}>
//                 <option value="">(Trống - Update Null)</option>
//                 <option value="Nam">Nam</option>
//                 <option value="Nữ">Nữ</option>
//                 <option value="Khác">Khác</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Ngày sinh</label>
//               <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
//             </div>

//             <div className="form-group">
//               <label>Vai trò</label>
//               <select name="roleName" value={formData.roleName} onChange={handleChange} className={errors.roleName ? 'input-error' : ''}>
//                 <option value="">Chọn vai trò</option>
//                 {roles
//                   .filter(role => role.roleName !== 'Admin') 
//                   .map((role) => (
//                     <option key={role.roleName} value={role.roleName}>
//                       {role.description || role.roleName} 
//                     </option>
//                   ))
//                 }
//               </select>
//               {errors.roleName && <span className="error-text">{errors.roleName}</span>}
//             </div>

//             {selectedRoleName === 'student' && (
//               <div className="form-group" style={{ animation: 'fadeIn 0.3s' }}>
//                 <label>Ngành học</label>
//                 <input type="text" name="career" value={formData.career} onChange={handleChange} placeholder="Nhập ngành học" />
//               </div>
//             )}

//             {selectedRoleName === 'lecturer' && (
//               <div className="form-group" style={{ animation: 'fadeIn 0.3s' }}>
//                 <label>Chuyên môn</label>
//                 <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="Nhập chuyên môn" />
//               </div>
//             )}
//           </div>

//           <div className="modal-footer">
//             <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Hủy</button>
//             <button type="submit" className="btn-primary" disabled={loading}>
//               {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateUserModal;


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
//     roleName: '', 
//     password: '',
//     career: '',
//     profession: '',
//   });

//   // State lưu dữ liệu gốc để so sánh (Dirty Checking)
//   const [originalData, setOriginalData] = useState({});

//   const [selectedRoleName, setSelectedRoleName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);

//   // 1. Load dữ liệu khi mở Modal
//   useEffect(() => {
//     if (user) {
//       setErrors({});
//       setToast(null);
//       setLoading(false);

//       const backendRoleName = user.role?.roleName || user.role?.name || '';
      
//       // 🛠️ FIX LỖI PHONE: Lấy từ mảng phones nếu có (giống logic hiển thị ngoài bảng)
//       const phoneValue = (user.phones && user.phones.length > 0) ? user.phones[0] : (user.phone || '');

//       const initialData = {
//         fullName: user.fullName || '',
//         email: user.email || '',
//         phone: phoneValue, // Đã sửa
//         gender: user.gender || '',
//         birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
//         roleName: backendRoleName,
//         password: '',
//         career: user.career || '',
//         profession: user.profession || '',
//       };

//       setFormData(initialData);
//       setOriginalData(initialData); 

//       if (backendRoleName) {
//         setSelectedRoleName(backendRoleName.toLowerCase().trim());
//       }
//     }
//   }, [user, roles]);

//   // 2. Validate Frontend
//   const validateField = (name, value) => {
//     let errorMsg = '';
    
//     // Lấy giá trị thô và giá trị đã trim
//     const rawVal = value ? String(value) : ''; 
//     const trimmedVal = rawVal.trim();

//     switch (name) {
//       case 'fullName':
//         // 🛠️ FIX LOGIC FULLNAME:
//         // Luôn kiểm tra độ dài < 8. Nếu rỗng (độ dài 0) thì 0 < 8 => Báo lỗi này.
//         if (trimmedVal.length < 8) {
//           errorMsg = 'Họ và tên phải có ít nhất 8 ký tự.';
//         }
//         break;
      
//       case 'email':
//         // 🛠️ FIX LOGIC EMAIL:
//         // 1. Kiểm tra rỗng
//         if (trimmedVal.length === 0) {
//            errorMsg = 'Email không được để trống.';
//         } 
//         // 2. Kiểm tra định dạng (Regex)
//         else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedVal)) {
//            errorMsg = 'Email không đúng định dạng.';
//         }
//         break;

//       case 'password':
//         // Chỉ validate nếu có nhập liệu
//         if (rawVal.length > 0 && rawVal.length < 8) {
//           errorMsg = 'Mật khẩu phải có ít nhất 8 ký tự.';
//         }
//         break;

//       default:
//         break;
//     }
//     return errorMsg;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

//     if (name === 'roleName') {
//       const roleNameLower = value.toLowerCase().trim();
//       setSelectedRoleName(roleNameLower);
      
//       setFormData(prev => ({
//         ...prev,
//         roleName: value,
//         career: roleNameLower === 'student' ? prev.career : '',
//         profession: roleNameLower === 'lecturer' ? prev.profession : ''
//       }));
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
//   };

//   const togglePasswordVisibility = () => setShowPassword(!showPassword);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // 1. Validate các trường quan trọng trước khi xử lý
//     const newErrors = {};
//     newErrors.fullName = validateField('fullName', formData.fullName);
//     newErrors.email = validateField('email', formData.email); // Validate Email
//     if (formData.password) newErrors.password = validateField('password', formData.password);
    
//     Object.keys(newErrors).forEach(key => { if (!newErrors[key]) delete newErrors[key]; });

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setLoading(false);
//       return;
//     }

//     try {
//       const processValue = (val) => (!val || val.toString().trim() === '') ? null : val.toString().trim();
      
//       // 2. TẠO PAYLOAD (Chỉ lấy trường thay đổi)
//       const payload = {};
//       let hasChange = false;

//       if (formData.fullName !== originalData.fullName) {
//         payload.fullName = processValue(formData.fullName);
//         hasChange = true;
//       }

//       // Email: Luôn gửi giá trị trim, không null (vì đã validate required)
//       if (formData.email !== originalData.email) {
//         payload.email = formData.email.trim();
//         hasChange = true;
//       }

//       if (formData.phone !== originalData.phone) {
//         payload.phones = formData.phone && formData.phone.trim() ? [formData.phone.trim()] : [];
//         hasChange = true;
//       }

//       if (formData.gender !== originalData.gender) {
//         payload.gender = processValue(formData.gender);
//         hasChange = true;
//       }

//       if (formData.birthDate !== originalData.birthDate) {
//         payload.birthDate = processValue(formData.birthDate);
//         hasChange = true;
//       }

//       if (formData.roleName !== originalData.roleName) {
//         payload.role = formData.roleName;
//         hasChange = true;
//       }

//       if (selectedRoleName === 'student') {
//         if (formData.career !== originalData.career || formData.roleName !== originalData.roleName) {
//             payload.career = processValue(formData.career);
//             hasChange = true;
//         }
//         if (formData.roleName !== originalData.roleName) {
//             payload.profession = null; 
//         }
//       } else if (selectedRoleName === 'lecturer') {
//         if (formData.profession !== originalData.profession || formData.roleName !== originalData.roleName) {
//             payload.profession = processValue(formData.profession);
//             hasChange = true;
//         }
//         if (formData.roleName !== originalData.roleName) {
//             payload.career = null;
//         }
//       } else {
//         if (formData.roleName !== originalData.roleName) {
//             payload.career = null;
//             payload.profession = null;
//             hasChange = true;
//         }
//       }

//       if (formData.password && formData.password !== '') {
//         payload.passwordHash = formData.password; 
//         hasChange = true;
//       }

//       if (!hasChange) {
//         setToast({ message: 'Cập nhật người dùng thành công!', type: 'success' });
//         setLoading(false);
//         // onClose(); // Tùy chọn đóng modal
//         return;
//       }

//       console.log('Update Payload (User):', payload);

//       await userAPI.update(user.userID, payload);
//       setToast({ message: 'Cập nhật thành công!', type: 'success' });
//       onUserUpdated(); 
//       setTimeout(onClose, 1500);

//     } catch (err) {
//       const data = err.response?.data;
      
//       let errorList = [];
//       if (Array.isArray(data)) {
//         errorList = data;
//       } else if (data && data.code) {
//         errorList = [data];
//       }

//       const newFieldErrors = {}; 
//       const allToastMessages = []; 

//       if (errorList.length > 0) {
//         errorList.forEach(errItem => {
//           const { code, message } = errItem;
//           if (message) allToastMessages.push(message);

//           switch (code) {
//             case 1004: case 1007: case 1015:
//               newFieldErrors.email = message;
//               break;
//             case 1006: case 1008:
//               newFieldErrors.fullName = message;
//               break;
//             case 1005: case 1009:
//               newFieldErrors.password = message;
//               break;
//             case 1025: case 1013:
//                newFieldErrors.roleName = message; 
//                break;
//             default:
//               break;
//           }
//         });
//       } else {
//         const fallbackMsg = typeof data === 'string' ? data : 'Cập nhật thất bại.';
//         allToastMessages.push(fallbackMsg);
//       }

//       if (Object.keys(newFieldErrors).length > 0) {
//         setErrors(newFieldErrors);
//       }

//       if (allToastMessages.length > 0) {
//         setToast({ message: allToastMessages.join('\n'), type: 'error' });
//       }

//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) return null;

//   return (
//     <div className="modal-overlay">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="modal-content" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
//         <div className="modal-header">
//           <h2>Cập nhật Người dùng</h2>
//           <button onClick={onClose} className="modal-close-btn">&times;</button>
//         </div>

//         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//           <div className="modal-body form-grid" style={{ overflowY: 'auto', padding: '20px' }}>
            
//             <div className="form-group">
//               <label>Họ và Tên <span style={{color:'red'}}>*</span></label>
//               <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} className={errors.fullName ? 'input-error' : ''} placeholder="Nhập họ tên" />
//               {errors.fullName && <span className="error-text">{errors.fullName}</span>}
//             </div>

//             <div className="form-group">
//               <label>Email <span style={{color:'red'}}>*</span></label>
//               <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={errors.email ? 'input-error' : ''} />
//               {errors.email && <span className="error-text">{errors.email}</span>}
//             </div>

//             <div className="form-group">
//               <label>Số điện thoại</label>
//               <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
//             </div>

//             <div className="form-group">
//               <label>Mật khẩu mới</label>
//               <div className="password-input-wrapper" style={{ position: 'relative' }}>
//                 <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} className={errors.password ? 'input-error' : ''} placeholder="Để trống nếu không đổi" style={{ paddingRight: '40px' }} />
//                 <span onClick={togglePasswordVisibility} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>{showPassword ? "👁️" : "👁️‍🗨️"}</span>
//               </div>
//               {errors.password && <span className="error-text">{errors.password}</span>}
//             </div>

//             <div className="form-group">
//               <label>Giới tính</label>
//               <select name="gender" value={formData.gender} onChange={handleChange}>
//                 <option value="">(Trống - Update Null)</option>
//                 <option value="Nam">Nam</option>
//                 <option value="Nữ">Nữ</option>
//                 <option value="Khác">Khác</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Ngày sinh</label>
//               <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
//             </div>

//             <div className="form-group">
//               <label>Vai trò</label>
//               <select name="roleName" value={formData.roleName} onChange={handleChange} className={errors.roleName ? 'input-error' : ''}>
//                 <option value="">Chọn vai trò</option>
//                 {roles
//                   .filter(role => role.roleName !== 'Admin') 
//                   .map((role) => (
//                     <option key={role.roleName} value={role.roleName}>
//                       {role.description || role.roleName} 
//                     </option>
//                   ))
//                 }
//               </select>
//               {errors.roleName && <span className="error-text">{errors.roleName}</span>}
//             </div>

//             {selectedRoleName === 'student' && (
//               <div className="form-group" style={{ animation: 'fadeIn 0.3s' }}>
//                 <label>Ngành học</label>
//                 <input type="text" name="career" value={formData.career} onChange={handleChange} placeholder="Nhập ngành học" />
//               </div>
//             )}

//             {selectedRoleName === 'lecturer' && (
//               <div className="form-group" style={{ animation: 'fadeIn 0.3s' }}>
//                 <label>Chuyên môn</label>
//                 <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="Nhập chuyên môn" />
//               </div>
//             )}
//           </div>

//           <div className="modal-footer">
//             <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Hủy</button>
//             <button type="submit" className="btn-primary" disabled={loading}>
//               {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateUserModal;


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
//     roleName: '', 
//     password: '',
//     career: '',
//     profession: '',
//   });

//   // State lưu dữ liệu gốc để so sánh (Dirty Checking)
//   const [originalData, setOriginalData] = useState({});

//   const [selectedRoleName, setSelectedRoleName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);

//   // 1. Load dữ liệu khi mở Modal
//   useEffect(() => {
//     if (user) {
//       setErrors({});
//       setToast(null);
//       setLoading(false);

//       const backendRoleName = user.role?.roleName || user.role?.name || '';
      
//       // Lấy phone từ mảng phones nếu có
//       const phoneValue = (user.phones && user.phones.length > 0) ? user.phones[0] : (user.phone || '');

//       const initialData = {
//         fullName: user.fullName || '',
//         email: user.email || '',
//         phone: phoneValue, 
//         gender: user.gender || '',
//         birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
//         roleName: backendRoleName,
//         password: '',
//         career: user.career || '',
//         profession: user.profession || '',
//       };

//       setFormData(initialData);
//       setOriginalData(initialData); 

//       if (backendRoleName) {
//         setSelectedRoleName(backendRoleName.toLowerCase().trim());
//       }
//     }
//   }, [user, roles]);

//   // 2. Validate Frontend
//   const validateField = (name, value) => {
//     let errorMsg = '';
    
//     // Lấy giá trị thô và giá trị đã trim
//     const rawVal = value ? String(value) : ''; 
//     const trimmedVal = rawVal.trim();

//     switch (name) {
//       case 'fullName':
//         // 🛠️ LOGIC ĐÃ SỬA: Phân biệt Rỗng và Ngắn
//         if (trimmedVal.length === 0) {
//           errorMsg = 'Họ và tên không được để trống.';
//         } else if (trimmedVal.length < 8) {
//           errorMsg = 'Họ và tên phải có ít nhất 8 ký tự.';
//         }
//         break;
      
//       case 'email':
//         // Logic email: Bắt buộc & Format
//         if (trimmedVal.length === 0) {
//            errorMsg = 'Email không được để trống.';
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedVal)) {
//            errorMsg = 'Email không đúng định dạng.';
//         }
//         break;

//       case 'password':
//         // Logic password: Chỉ check nếu có nhập liệu (dùng rawVal để tính dấu cách)
//         if (rawVal.length > 0 && rawVal.length < 8) {
//           errorMsg = 'Mật khẩu phải có ít nhất 8 ký tự.';
//         }
//         break;

//       default:
//         break;
//     }
//     return errorMsg;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

//     if (name === 'roleName') {
//       const roleNameLower = value.toLowerCase().trim();
//       setSelectedRoleName(roleNameLower);
      
//       setFormData(prev => ({
//         ...prev,
//         roleName: value,
//         career: roleNameLower === 'student' ? prev.career : '',
//         profession: roleNameLower === 'lecturer' ? prev.profession : ''
//       }));
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
//   };

//   const togglePasswordVisibility = () => setShowPassword(!showPassword);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // 1. Validate các trường quan trọng trước khi xử lý
//     const newErrors = {};
//     newErrors.fullName = validateField('fullName', formData.fullName);
//     newErrors.email = validateField('email', formData.email); 
//     if (formData.password) newErrors.password = validateField('password', formData.password);
    
//     Object.keys(newErrors).forEach(key => { if (!newErrors[key]) delete newErrors[key]; });

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setLoading(false);
//       return;
//     }

//     try {
//       const processValue = (val) => (!val || val.toString().trim() === '') ? null : val.toString().trim();
      
//       // 2. TẠO PAYLOAD (Chỉ lấy trường thay đổi)
//       const payload = {};
//       let hasChange = false;

//       if (formData.fullName !== originalData.fullName) {
//         payload.fullName = processValue(formData.fullName);
//         hasChange = true;
//       }

//       if (formData.email !== originalData.email) {
//         payload.email = formData.email.trim();
//         hasChange = true;
//       }

//       if (formData.phone !== originalData.phone) {
//         payload.phones = formData.phone && formData.phone.trim() ? [formData.phone.trim()] : [];
//         hasChange = true;
//       }

//       if (formData.gender !== originalData.gender) {
//         payload.gender = processValue(formData.gender);
//         hasChange = true;
//       }

//       if (formData.birthDate !== originalData.birthDate) {
//         payload.birthDate = processValue(formData.birthDate);
//         hasChange = true;
//       }

//       if (formData.roleName !== originalData.roleName) {
//         payload.role = formData.roleName;
//         hasChange = true;
//       }

//       if (selectedRoleName === 'student') {
//         if (formData.career !== originalData.career || formData.roleName !== originalData.roleName) {
//             payload.career = processValue(formData.career);
//             hasChange = true;
//         }
//         if (formData.roleName !== originalData.roleName) {
//             payload.profession = null; 
//         }
//       } else if (selectedRoleName === 'lecturer') {
//         if (formData.profession !== originalData.profession || formData.roleName !== originalData.roleName) {
//             payload.profession = processValue(formData.profession);
//             hasChange = true;
//         }
//         if (formData.roleName !== originalData.roleName) {
//             payload.career = null;
//         }
//       } else {
//         if (formData.roleName !== originalData.roleName) {
//             payload.career = null;
//             payload.profession = null;
//             hasChange = true;
//         }
//       }

//       if (formData.password && formData.password !== '') {
//         payload.passwordHash = formData.password; 
//         hasChange = true;
//       }

//       if (!hasChange) {
//         setToast({ message: 'Cập nhật người dùng thành công!', type: 'success' });
//         setLoading(false);
//         return;
//       }

//       console.log('Update Payload (User):', payload);

//       await userAPI.update(user.userID, payload);
//       setToast({ message: 'Cập nhật thành công!', type: 'success' });
//       onUserUpdated(); 
//       setTimeout(onClose, 1500);

//     } catch (err) {
//       const data = err.response?.data;
      
//       let errorList = [];
//       if (Array.isArray(data)) {
//         errorList = data;
//       } else if (data && data.code) {
//         errorList = [data];
//       }

//       const newFieldErrors = {}; 
//       const allToastMessages = []; 

//       if (errorList.length > 0) {
//         errorList.forEach(errItem => {
//           const { code, message } = errItem;
//           if (message) allToastMessages.push(message);

//           switch (code) {
//             case 1004: case 1007: case 1015:
//               newFieldErrors.email = message;
//               break;
//             case 1006: case 1008:
//               newFieldErrors.fullName = message;
//               break;
//             case 1005: case 1009:
//               newFieldErrors.password = message;
//               break;
//             case 1025: case 1013:
//                newFieldErrors.roleName = message; 
//                break;
//             default:
//               break;
//           }
//         });
//       } else {
//         const fallbackMsg = typeof data === 'string' ? data : 'Cập nhật thất bại.';
//         allToastMessages.push(fallbackMsg);
//       }

//       if (Object.keys(newFieldErrors).length > 0) {
//         setErrors(newFieldErrors);
//       }

//       if (allToastMessages.length > 0) {
//         setToast({ message: allToastMessages.join('\n'), type: 'error' });
//       }

//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) return null;

//   return (
//     <div className="modal-overlay">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="modal-content" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
//         <div className="modal-header">
//           <h2>Cập nhật Người dùng</h2>
//           <button onClick={onClose} className="modal-close-btn">&times;</button>
//         </div>

//         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//           <div className="modal-body form-grid" style={{ overflowY: 'auto', padding: '20px' }}>
            
//             <div className="form-group">
//               <label>Họ và Tên <span style={{color:'red'}}>*</span></label>
//               <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} className={errors.fullName ? 'input-error' : ''} placeholder="Nhập họ tên" />
//               {errors.fullName && <span className="error-text">{errors.fullName}</span>}
//             </div>

//             <div className="form-group">
//               <label>Email <span style={{color:'red'}}>*</span></label>
//               <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={errors.email ? 'input-error' : ''} />
//               {errors.email && <span className="error-text">{errors.email}</span>}
//             </div>

//             <div className="form-group">
//               <label>Số điện thoại</label>
//               <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
//             </div>

//             <div className="form-group">
//               <label>Mật khẩu mới</label>
//               <div className="password-input-wrapper" style={{ position: 'relative' }}>
//                 <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} className={errors.password ? 'input-error' : ''} placeholder="Để trống nếu không đổi" style={{ paddingRight: '40px' }} />
//                 <span onClick={togglePasswordVisibility} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>{showPassword ? "👁️" : "👁️‍🗨️"}</span>
//               </div>
//               {errors.password && <span className="error-text">{errors.password}</span>}
//             </div>

//             <div className="form-group">
//               <label>Giới tính</label>
//               <select name="gender" value={formData.gender} onChange={handleChange}>
//                 <option value="">(Trống - Update Null)</option>
//                 <option value="Nam">Nam</option>
//                 <option value="Nữ">Nữ</option>
//                 <option value="Khác">Khác</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Ngày sinh</label>
//               <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
//             </div>

//             <div className="form-group">
//               <label>Vai trò</label>
//               <select name="roleName" value={formData.roleName} onChange={handleChange} className={errors.roleName ? 'input-error' : ''}>
//                 <option value="">Chọn vai trò</option>
//                 {roles
//                   .filter(role => role.roleName !== 'Admin') 
//                   .map((role) => (
//                     <option key={role.roleName} value={role.roleName}>
//                       {role.description || role.roleName} 
//                     </option>
//                   ))
//                 }
//               </select>
//               {errors.roleName && <span className="error-text">{errors.roleName}</span>}
//             </div>

//             {selectedRoleName === 'student' && (
//               <div className="form-group" style={{ animation: 'fadeIn 0.3s' }}>
//                 <label>Ngành học</label>
//                 <input type="text" name="career" value={formData.career} onChange={handleChange} placeholder="Nhập ngành học" />
//               </div>
//             )}

//             {selectedRoleName === 'lecturer' && (
//               <div className="form-group" style={{ animation: 'fadeIn 0.3s' }}>
//                 <label>Chuyên môn</label>
//                 <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="Nhập chuyên môn" />
//               </div>
//             )}
//           </div>

//           <div className="modal-footer">
//             <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Hủy</button>
//             <button type="submit" className="btn-primary" disabled={loading}>
//               {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
//             </button>
//           </div>
//         </form>
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
    roleName: '', 
    password: '',
    career: '',
    profession: '',
  });

  const [selectedRoleName, setSelectedRoleName] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // 1. Load dữ liệu khi mở Modal
  useEffect(() => {
    if (user) {
      setErrors({});
      setToast(null);
      setLoading(false);

      const backendRoleName = user.role?.roleName || user.role?.name || '';
      
      // Lấy phone từ mảng phones nếu có
      const phoneValue = (user.phones && user.phones.length > 0) ? user.phones[0] : (user.phone || '');

      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: phoneValue, 
        gender: user.gender || '',
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
        roleName: backendRoleName,
        password: '', // Mật khẩu để trống
        career: user.career || '',
        profession: user.profession || '',
      });

      if (backendRoleName) {
        setSelectedRoleName(backendRoleName.toLowerCase().trim());
      }
    }
  }, [user, roles]);

  // 2. Validate Frontend
  const validateField = (name, value) => {
    let errorMsg = '';
    const rawVal = value ? String(value) : ''; 
    const trimmedVal = rawVal.trim();

    switch (name) {
      case 'fullName':
        if (trimmedVal.length === 0) {
          errorMsg = 'Họ và tên không được để trống.';
        } else if (trimmedVal.length < 8) {
          errorMsg = 'Họ và tên phải có ít nhất 8 ký tự.';
        }
        break;
      
      case 'email':
        if (trimmedVal.length === 0) {
           errorMsg = 'Email không được để trống.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedVal)) {
           errorMsg = 'Email không đúng định dạng.';
        }
        break;

      case 'password':
        if (rawVal.length > 0 && rawVal.length < 8) {
          errorMsg = 'Mật khẩu phải có ít nhất 8 ký tự.';
        }
        break;

      default:
        break;
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'roleName') {
      const roleNameLower = value.toLowerCase().trim();
      setSelectedRoleName(roleNameLower);
      
      setFormData(prev => ({
        ...prev,
        roleName: value,
        career: roleNameLower === 'student' ? prev.career : '',
        profession: roleNameLower === 'lecturer' ? prev.profession : ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Validate
    const newErrors = {};
    newErrors.fullName = validateField('fullName', formData.fullName);
    newErrors.email = validateField('email', formData.email); 
    if (formData.password) newErrors.password = validateField('password', formData.password);
    
    Object.keys(newErrors).forEach(key => { if (!newErrors[key]) delete newErrors[key]; });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // --- Helper chuyển đổi: Rỗng -> Null ---
      const toNullIfEmpty = (val) => (!val || String(val).trim() === '') ? null : String(val).trim();
      
      // --- 2. TẠO PAYLOAD ĐẦY ĐỦ (Gửi tất cả các trường) ---
      const payload = {
        fullName: toNullIfEmpty(formData.fullName),
        email: formData.email.trim(), // Email bắt buộc nên chắc chắn có, trim cho sạch
        
        // Xử lý PHONE: Nếu rỗng -> mảng rỗng [], Nếu có -> mảng [sđt]
        phones: formData.phone && formData.phone.trim() ? [formData.phone.trim()] : [],

        gender: toNullIfEmpty(formData.gender),
        birthDate: toNullIfEmpty(formData.birthDate),
        role: toNullIfEmpty(formData.roleName), // Gửi roleName sang backend
        
        // Mật khẩu: Nếu người dùng nhập thì gửi, nếu để trống thì gửi null 
        // (Backend cần xử lý: nếu null thì không đổi pass)
        passwordHash: toNullIfEmpty(formData.password)
      };

      // Logic riêng cho Career và Profession dựa trên Role
      if (selectedRoleName === 'student') {
        payload.career = toNullIfEmpty(formData.career);
        payload.profession = null; // Role là SV thì profession phải null
      } else if (selectedRoleName === 'lecturer') {
        payload.profession = toNullIfEmpty(formData.profession);
        payload.career = null; // Role là GV thì career phải null
      } else {
        // Các role khác thì cả 2 đều null
        payload.career = null;
        payload.profession = null;
      }

      console.log('Update Payload (Full):', payload);

      await userAPI.update(user.userID, payload);
      setToast({ message: 'Cập nhật thành công!', type: 'success' });
      onUserUpdated(); 
      setTimeout(onClose, 1500);

    } catch (err) {
      const data = err.response?.data;
      
      let errorList = [];
      if (Array.isArray(data)) {
        errorList = data;
      } else if (data && data.code) {
        errorList = [data];
      }

      const newFieldErrors = {}; 
      const allToastMessages = []; 

      if (errorList.length > 0) {
        errorList.forEach(errItem => {
          const { code, message } = errItem;
          if (message) allToastMessages.push(message);

          switch (code) {
            case 1004: case 1007: case 1015:
              newFieldErrors.email = message;
              break;
            case 1006: case 1008:
              newFieldErrors.fullName = message;
              break;
            case 1005: case 1009:
              newFieldErrors.password = message;
              break;
            case 1025: case 1013:
               newFieldErrors.roleName = message; 
               break;
            default:
              break;
          }
        });
      } else {
        const fallbackMsg = typeof data === 'string' ? data : 'Cập nhật thất bại.';
        allToastMessages.push(fallbackMsg);
      }

      if (Object.keys(newFieldErrors).length > 0) {
        setErrors(newFieldErrors);
      }

      if (allToastMessages.length > 0) {
        setToast({ message: allToastMessages.join('\n'), type: 'error' });
      }

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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="modal-body form-grid" style={{ overflowY: 'auto', padding: '20px' }}>
            
            <div className="form-group">
              <label>Họ và Tên <span style={{color:'red'}}>*</span></label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} className={errors.fullName ? 'input-error' : ''} placeholder="Nhập họ tên" />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>Email <span style={{color:'red'}}>*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={errors.email ? 'input-error' : ''} />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Mật khẩu mới</label>
              <div className="password-input-wrapper" style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} className={errors.password ? 'input-error' : ''} placeholder="Để trống nếu không đổi" style={{ paddingRight: '40px' }} />
                <span onClick={togglePasswordVisibility} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>{showPassword ? "👁️" : "👁️‍🗨️"}</span>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">(Trống - Update Null)</option>
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
              <select name="roleName" value={formData.roleName} onChange={handleChange} className={errors.roleName ? 'input-error' : ''}>
                <option value="">Chọn vai trò</option>
                {roles
                  .filter(role => role.roleName !== 'Admin') 
                  .map((role) => (
                    <option key={role.roleName} value={role.roleName}>
                      {role.description || role.roleName} 
                    </option>
                  ))
                }
              </select>
              {errors.roleName && <span className="error-text">{errors.roleName}</span>}
            </div>

            {selectedRoleName === 'student' && (
              <div className="form-group" style={{ animation: 'fadeIn 0.3s' }}>
                <label>Ngành học</label>
                <input type="text" name="career" value={formData.career} onChange={handleChange} placeholder="Nhập ngành học" />
              </div>
            )}

            {selectedRoleName === 'lecturer' && (
              <div className="form-group" style={{ animation: 'fadeIn 0.3s' }}>
                <label>Chuyên môn</label>
                <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="Nhập chuyên môn" />
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