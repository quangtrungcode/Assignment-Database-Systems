// import React, { useState } from 'react';
// import '../styles/Modal.css';
// import { userAPI } from '../services/apiService';

// const CreateUserModal = ({ onClose, onUserCreated, roles }) => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     phone: '', // Re-added phone to formData
//     gender: 'Male',
//     birthDate: '',
//     roleType: roles.length > 0 ? roles.find(r => r.name === 'student')?.name || roles[0].name : '', 
//     major: '', 
//     specialization: '', 
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => {
//       const newState = { ...prev, [name]: value };
      
//       if (name === 'roleType') {
//         newState.major = value === 'student' ? '' : prev.major; // Clear major if not student
//         newState.specialization = value === 'lecturers' ? '' : prev.specialization; // Clear specialization if not lecturers
//       }
//       return newState;
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const errors = {};
//     if (!formData.fullName) errors.fullName = 'Họ Tên không được để trống.';
//     if (!formData.email) errors.email = 'Email không được để trống.';
//     if (!formData.password) errors.password = 'Mật khẩu không được để trống.';
//     if (!formData.birthDate) errors.birthDate = 'Ngày sinh không được để trống.';
//     if (!formData.roleType) errors.roleType = 'Vai trò không được để trống.';
//     if (!formData.phone) errors.phone = 'Số điện thoại không được để trống.'; // Re-added phone validation


//     if (formData.roleType === 'student' && !formData.major) {
//       errors.major = 'Ngành học không được để trống.';
//     }
//     if (formData.roleType === 'lecturers' && !formData.specialization) {
//       errors.specialization = 'Chuyên môn không được để trống.';
//     }

//     if (Object.keys(errors).length > 0) {
//       setError(Object.values(errors)[0]); 
//       setLoading(false);
//       return;
//     }

//     try {
//       const dataToSend = {
//         fullName: formData.fullName,
//         email: formData.email,
//         passwordHash: formData.password, 
//         phone: formData.phone, // Re-added phone to dataToSend
//         gender: formData.gender,
//         birthDate: formData.birthDate,
//         roleType: formData.roleType,
//       };
      
//       if (formData.roleType === 'student') {
//         dataToSend.career = formData.major; // Map major to career
//       } else if (formData.roleType === 'lecturers') {
//         dataToSend.profession = formData.specialization; // Map specialization to profession
//       }

//       await userAPI.createUser(dataToSend);
//       onUserCreated(); 
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 'Tạo người dùng thất bại. Vui lòng thử lại.';
//       setError(errorMessage);
//       console.error('Create user error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Tạo người dùng mới</h2>
//           <button onClick={onClose} className="modal-close-btn">&times;</button>
//         </div>
//         <form onSubmit={handleSubmit}>
//           {error && <p className="modal-error">{error}</p>}
//           <div className="modal-body form-grid">
//             <div className="form-group">
//               <label>Họ Tên</label>
//               <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>Email</label>
//               <input type="email" name="email" value={formData.email} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>Mật khẩu</label>
//               <input type="password" name="password" value={formData.password} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>Số điện thoại</label>
//               <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required /> 
//             </div>
//             <div className="form-group">
//               <label>Ngày sinh</label>
//               <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>Giới tính</label>
//               <select name="gender" value={formData.gender} onChange={handleChange}>
//                 <option value="Male">Nam</option>
//                 <option value="Female">Nữ</option>
//                 <option value="Other">Khác</option>
//               </select>
//             </div>
//             <div className="form-group form-group-span-2">
//               <label>Vai trò</label>
//               <select name="roleType" value={formData.roleType} onChange={handleChange} required>
//                 {roles.length === 0 && <option value="">Đang tải vai trò...</option>}
//                 {roles.map((role) => (
//                   <option key={role.name} value={role.name}>
//                     {role.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {formData.roleType === 'student' && (
//               <div className="form-group form-group-span-2">
//                 <label>Ngành Học</label>
//                 <input type="text" name="major" value={formData.major} onChange={handleChange} required />
//               </div>
//             )}

//             {formData.roleType === 'lecturers' && (
//               <div className="form-group form-group-span-2">
//                 <label>Chuyên Môn</label>
//                 <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required />
//               </div>
//             )}
//           </div>
//           <div className="modal-footer">
//             <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
//               Hủy
//             </button>
//             <button type="submit" className="btn-primary" disabled={loading}>
//               {loading ? 'Đang tạo...' : 'Tạo người dùng'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateUserModal;
// import React, { useState, useEffect } from 'react';
// import '../styles/Modal.css';
// import { userAPI } from '../services/apiService';
// import Toast from './Toast'; 

// const CreateUserModal = ({ onClose, onUserCreated, roles }) => {
//   // State quản lý dữ liệu Form
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     phone: '',
//     gender: 'Nam',
//     birthDate: '',
//     // 🛠️ FIX LỖI: Dùng roleName thay vì name để lấy giá trị mặc định
//     roleType: '', 
//     major: '', 
//     specialization: '', 
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [toast, setToast] = useState(null);

//   // 1. Reset lỗi và thiết lập role mặc định khi mở Modal
//   useEffect(() => {
//     setError(null);
//     setToast(null);
//     setLoading(false);

//     // 🛠️ FIX LỖI: Logic chọn role mặc định (Ưu tiên roleName)
//     if (roles && roles.length > 0) {
//         // Tìm role Student để set mặc định, nếu không có lấy role đầu tiên
//         const defaultRole = roles.find(r => (r.roleName || r.name) === 'Student');
//         const initialRoleName = defaultRole ? (defaultRole.roleName || defaultRole.name) : (roles[0].roleName || roles[0].name);
        
//         setFormData(prev => ({ ...prev, roleType: initialRoleName }));
//     }
//   }, [roles]); // Chạy lại khi danh sách roles thay đổi

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     if (error) setError(null);

//     setFormData((prev) => {
//       const newState = { ...prev, [name]: value };
      
//       // Reset trường riêng nếu đổi Role
//       if (name === 'roleType') {
//         // 🛠️ Chuẩn hóa so sánh (Student/Lecturer)
//         newState.major = value === 'Student' ? '' : prev.major;
//         newState.specialization = value === 'Lecturer' ? '' : prev.specialization;
//       }
//       return newState;
//     });
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     // Validation
//     const errors = {};
//     if (!formData.fullName) errors.fullName = 'Họ Tên không được để trống.';
//     if (!formData.email) errors.email = 'Email không được để trống.';
//     if (!formData.password) errors.password = 'Mật khẩu không được để trống.';
//     if (!formData.birthDate) errors.birthDate = 'Ngày sinh không được để trống.';
//     if (!formData.roleType) errors.roleType = 'Vai trò không được để trống.';
//     if (!formData.phone) errors.phone = 'Số điện thoại không được để trống.';

//     if (formData.roleType === 'Student' && !formData.major) {
//       errors.major = 'Ngành học không được để trống.';
//     }
//     if (formData.roleType === 'Lecturer' && !formData.specialization) {
//       errors.specialization = 'Chuyên môn không được để trống.';
//     }

//     if (Object.keys(errors).length > 0) {
//       setError(Object.values(errors)[0]); 
//       setLoading(false);
//       return;
//     }

//     try {
//       const dataToSend = {
//         fullName: formData.fullName,
//         email: formData.email,
//         passwordHash: formData.password, 
//         phone: formData.phone,
//         gender: formData.gender,
//         birthDate: formData.birthDate,
//         roleType: formData.roleType,
//       };
      
//       if (formData.roleType === 'Student') {
//         dataToSend.career = formData.major;
//       } else if (formData.roleType === 'Lecturer') {
//         dataToSend.profession = formData.specialization;
//       }

//       await userAPI.createUser(dataToSend);
      
//       setToast({ message: 'Tạo người dùng thành công!', type: 'success' });
//       onUserCreated(); 
      
//       setTimeout(() => {
//         onClose();
//       }, 1500);

//     } catch (err) {
//       const data = err.response?.data;
//       let errorMessage = 'Tạo người dùng thất bại. Vui lòng thử lại.';

//       if (Array.isArray(data) && data.length > 0) {
//         errorMessage = data.map(item => item.message).join(' - ');
//       } 
//       else if (data && data.message) {
//         errorMessage = data.message;
//       }
//       else if (typeof data === 'string') {
//         errorMessage = data;
//       }

//       setError(errorMessage);
//       setToast({ message: errorMessage, type: 'error' });
      
//       setTimeout(() => setToast(null), 3000);
//       console.error('Create user error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Tạo người dùng mới</h2>
//           <button onClick={onClose} className="modal-close-btn">&times;</button>
//         </div>
        
//         <form onSubmit={handleSubmit}>
//           {error && <p className="modal-error" style={{color: '#e74c3c', textAlign: 'center', marginBottom: '15px'}}>{error}</p>}
          
//           <div className="modal-body form-grid">
//             <div className="form-group">
//               <label>Họ Tên</label>
//               <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
//             </div>
            
//             <div className="form-group">
//               <label>Email</label>
//               <input type="email" name="email" value={formData.email} onChange={handleChange} required />
//             </div>

//             <div className="form-group">
//               <label>Mật khẩu</label>
//               <div className="password-input-wrapper" style={{ position: 'relative' }}>
//                 <input 
//                   type={showPassword ? "text" : "password"} 
//                   name="password" 
//                   value={formData.password} 
//                   onChange={handleChange} 
//                   required 
//                   style={{ paddingRight: '40px' }} 
//                 />
//                 <span 
//                   onClick={togglePasswordVisibility}
//                   style={{
//                     position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
//                     cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center'
//                   }}
//                 >
//                   {showPassword ? (
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
//                   ) : (
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
//                   )}
//                 </span>
//               </div>
//             </div>

//             <div className="form-group">
//               <label>Số điện thoại</label>
//               <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required /> 
//             </div>
            
//             <div className="form-group">
//               <label>Ngày sinh</label>
//               <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
//             </div>
            
//             <div className="form-group">
//               <label>Giới tính</label>
//               <select name="gender" value={formData.gender} onChange={handleChange}>
//                 <option value="Nam">Nam</option>
//                 <option value="Nữ">Nữ</option>
//                 <option value="Khác">Khác</option>
//               </select>
//             </div>
            
//             <div className="form-group form-group-span-2">
//               <label>Vai trò</label>
//               <select name="roleType" value={formData.roleType} onChange={handleChange} required>
//                 {(!roles || roles.length === 0) && <option value="">Đang tải vai trò...</option>}
                
//                 {/* 🛠️ FIX LỖI Ở ĐÂY: Dùng role.roleName */}
//                 {roles && roles.map((role) => {
//                     const rName = role.roleName || role.name || '';
//                     return (
//                         <option key={role.id || rName} value={rName}>
//                             {rName}
//                         </option>
//                     );
//                 })}
//               </select>
//             </div>

//             {formData.roleType === 'Student' && (
//               <div className="form-group form-group-span-2" style={{animation: 'fadeIn 0.3s'}}>
//                 <label>Ngành Học <span style={{color:'red'}}>*</span></label>
//                 <input type="text" name="major" value={formData.major} onChange={handleChange} required placeholder="Ví dụ: Công nghệ thông tin..." />
//               </div>
//             )}

//             {formData.roleType === 'Lecturer' && (
//               <div className="form-group form-group-span-2" style={{animation: 'fadeIn 0.3s'}}>
//                 <label>Chuyên Môn <span style={{color:'red'}}>*</span></label>
//                 <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required placeholder="Ví dụ: Tiến sĩ Toán học..." />
//               </div>
//             )}
//           </div>

//           <div className="modal-footer">
//             <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
//               Hủy
//             </button>
//             <button type="submit" className="btn-primary" disabled={loading}>
//               {loading ? 'Đang tạo...' : 'Tạo người dùng'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateUserModal;

// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import '../styles/Modal.css';
// import { userAPI } from '../services/apiService';
// import Toast from './Toast';

// const CreateUserModal = ({ onClose, onUserCreated, roles }) => {
//   // 1. Lọc bỏ vai trò Admin khỏi danh sách
//   const filteredRoles = useMemo(() => {
//     return roles ? roles.filter(r => {
//       const rName = r.roleName || r.name || '';
//       return rName.toLowerCase() !== 'admin'; 
//     }) : [];
//   }, [roles]);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     phone: '',
//     gender: '',
//     birthDate: '',
//     roleType: '', 
//     major: '', 
//     specialization: '', 
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
  
//   // Dùng ref để ngăn submit kép
//   const isSubmitting = useRef(false);

//   // Thiết lập role mặc định khi mở modal
//   useEffect(() => {
//     setErrors({});
//     setToast(null);
//     setLoading(false);

//     if (filteredRoles.length > 0) {
//       // Ưu tiên chọn Student làm mặc định
//       const defaultRole = filteredRoles.find(r => (r.roleName || r.name) === 'Student');
//       const initialRoleName = defaultRole ? (defaultRole.roleName || defaultRole.name) : (filteredRoles[0].roleName || filteredRoles[0].name);
//       setFormData(prev => ({ ...prev, roleType: initialRoleName }));
//     }
//   }, [filteredRoles]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     // Xóa lỗi ngay khi người dùng nhập lại (UX giống Register)
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: null }));
//     }
    
//     // Reset trường riêng khi đổi vai trò
//     if (name === 'roleType') {
//       setFormData(prev => ({
//         ...prev,
//         roleType: value,
//         major: value === 'Student' ? prev.major : '',
//         specialization: value === 'Lecturer' ? prev.specialization : '',
//       }));
//     }
//   };

//   // --- VALIDATION FRONTEND (UX) - Giống Register.jsx ---
//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     let error = null;

//     switch (name) {
//       case 'fullName':
//         if (!value.trim()) error = "Họ tên không được để trống";
//         else if (value.trim().length < 8) error = "Họ tên phải có ít nhất 8 ký tự";
//         break;
//       case 'email':
//         if (!value.trim()) error = "Email không được để trống";
//         else if (!/\S+@\S+\.\S+/.test(value)) error = "Email không hợp lệ";
//         break;
//       case 'password':
//         if (!value) error = "Mật khẩu không được để trống";
//         else if (value.length < 8) error = "Mật khẩu phải có ít nhất 8 ký tự";
//         break;
//       case 'major':
//         if (formData.roleType === 'Student' && !value.trim()) {
//             error = "Vui lòng nhập ngành học";
//         }
//         break;
//       case 'specialization':
//         if (formData.roleType === 'Lecturer' && !value.trim()) {
//             error = "Vui lòng nhập chuyên môn";
//         }
//         break;
//       default:
//          break; 
//     }
//     setErrors(prev => ({ ...prev, [name]: error }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isSubmitting.current) return;
//     isSubmitting.current = true;

//     // 1. CHỐT CHẶN FRONTEND: Kiểm tra kỹ trước khi gửi
//     const finalErrors = {};
//     if (!formData.fullName.trim()) finalErrors.fullName = "Bắt buộc nhập";
//     else if (formData.fullName.length < 8) finalErrors.fullName = "Tối thiểu 8 ký tự";

//     if (!formData.email.trim()) finalErrors.email = "Bắt buộc nhập";
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) finalErrors.email = "Email không hợp lệ";
    
//     if (!formData.password) finalErrors.password = "Bắt buộc nhập";
//     else if (formData.password.length < 8) finalErrors.password = "Tối thiểu 8 ký tự";

//     if (!formData.roleType) finalErrors.roleType = "Vui lòng chọn vai trò";

//     if (formData.roleType === 'Student' && !formData.major.trim()) finalErrors.major = "Vui lòng nhập ngành học";
//     if (formData.roleType === 'Lecturer' && !formData.specialization.trim()) finalErrors.specialization = "Vui lòng nhập chuyên môn";

//     setErrors(finalErrors);

//     if (Object.keys(finalErrors).length > 0) {
//       setToast({ message: "Vui lòng kiểm tra lại thông tin.", type: 'error' });
//       isSubmitting.current = false;
//       return;
//     }

//     setLoading(true);
//     setToast(null);

//     try {
//       // 2. CHUẨN BỊ PAYLOAD
//       const dataToSend = {
//         fullName: formData.fullName,
//         email: formData.email,
//         passwordHash: formData.password, // Backend thường nhận passwordHash hoặc password tùy API
//         roleType: formData.roleType,
//         gender: formData.gender || null,
//         birthDate: formData.birthDate || null,
//         phones: formData.phone ? [formData.phone] : [],
//       };
      
//       if (formData.roleType === 'Student') {
//         dataToSend.career = formData.major;
//       } else if (formData.roleType === 'Lecturer') {
//         dataToSend.profession = formData.specialization;
//       }

//       // 3. GỌI API
//       await userAPI.createUser(dataToSend);
      
//       setToast({ message: 'Tạo người dùng thành công!', type: 'success' });
//       onUserCreated(); 
      
//       // Đóng modal sau khi thành công
//       setTimeout(() => {
//         onClose();
//       }, 1500);

//     } catch (error) {
//       console.error('Create User error:', error);
//       const apiError = error.response?.data;
      
//       const newServerErrors = {};
//       const toastMessages = []; // Tạo mảng chứa TẤT CẢ thông báo lỗi để hiện Toast

//       const processError = (err) => {
//         if (!err || typeof err !== 'object') return;
        
//         // Lấy message từ backend
//         const backendMessage = err.message || "Lỗi hệ thống chưa xác định";
//         const code = err.code; 

//         // 1. LUÔN LUÔN đẩy message vào danh sách hiển thị Toast (Theo yêu cầu của bạn)
//         toastMessages.push(backendMessage);

//         // 2. Vẫn map lỗi vào ô input để hiện viền đỏ
//         switch (code) {
//           case 1004: // Email tồn tại
//           case 1007: // Email trống
//           case 1015: // Email sai format
//             newServerErrors.email = backendMessage; 
//             break;

//           case 1002: // Username tồn tại
//           case 1006: // Tên ngắn
//           case 1008: // Tên trống
//             newServerErrors.fullName = backendMessage; 
//             break;

//           case 1005: // Pass ngắn
//           case 1009: // Pass trống
//             newServerErrors.password = backendMessage; 
//             break;
            
//           default: 
//             break;
//         }
//       };

//       // Xử lý dữ liệu trả về (Mảng hoặc Object)
//       if (Array.isArray(apiError)) {
//         apiError.forEach(processError);
//       } else if (typeof apiError === 'object' && apiError !== null) {
//         processError(apiError);
//       } else {
//         // Trường hợp lỗi string thuần hoặc server chết
//         toastMessages.push(error.message || 'Lỗi kết nối server.');
//       }

//       // Cập nhật lỗi đỏ ở input
//       if (Object.keys(newServerErrors).length > 0) {
//         setErrors(prev => ({ ...prev, ...newServerErrors }));
//       }
      
//       // 👇 SỬA ĐỔI QUAN TRỌNG: Hiển thị message thật từ backend ra Toast
//       if (toastMessages.length > 0) {
//         // Join các lỗi lại bằng xuống dòng để dễ đọc nếu có nhiều lỗi
//         setToast({ message: toastMessages.join('\n'), type: 'error' });
//       }

//     } finally {
//       setLoading(false);
//       isSubmitting.current = false;
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Tạo người dùng mới</h2>
//           <button onClick={onClose} className="modal-close-btn">&times;</button>
//         </div>
        
//         <form onSubmit={handleSubmit} noValidate>
//           <div className="modal-body form-grid">
            
//             <div className="form-group">
//               <label>Họ Tên <span className="required">*</span></label>
//               <input 
//                 type="text" 
//                 name="fullName" 
//                 value={formData.fullName} 
//                 onChange={handleChange} 
//                 onBlur={handleBlur}
//                 disabled={loading}
//                 required 
//                 className={errors.fullName ? 'input-error' : ''}
//                 placeholder="Ít nhất 8 ký tự"
//               />
//               {errors.fullName && <span className="error-message">{errors.fullName}</span>}
//             </div>
            
//             <div className="form-group">
//               <label>Email <span className="required">*</span></label>
//               <input 
//                 type="email" 
//                 name="email" 
//                 value={formData.email} 
//                 onChange={handleChange} 
//                 onBlur={handleBlur}
//                 disabled={loading}
//                 required 
//                 className={errors.email ? 'input-error' : ''}
//               />
//               {errors.email && <span className="error-message">{errors.email}</span>}
//             </div>

//             <div className="form-group">
//               <label>Mật khẩu <span className="required">*</span></label>
//               <div className="password-input-wrapper" style={{ position: 'relative' }}>
//                 <input 
//                   type={showPassword ? "text" : "password"} 
//                   name="password" 
//                   value={formData.password} 
//                   onChange={handleChange} 
//                   onBlur={handleBlur}
//                   disabled={loading}
//                   required 
//                   style={{ paddingRight: '40px' }} 
//                   className={errors.password ? 'input-error' : ''}
//                   placeholder="Ít nhất 8 ký tự"
//                 />
//                 <span 
//                   onClick={() => setShowPassword(!showPassword)}
//                   style={{
//                     position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
//                     cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center'
//                   }}
//                 >
//                   {showPassword ? (
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
//                   ) : (
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
//                   )}
//                 </span>
//               </div>
//               {errors.password && <span className="error-message">{errors.password}</span>}
//             </div>

//             <div className="form-group">
//               <label>Số điện thoại</label>
//               <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={loading} /> 
//             </div>
            
//             <div className="form-group">
//               <label>Ngày sinh</label>
//               <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} disabled={loading} />
//             </div>
            
//             <div className="form-group">
//               <label>Giới tính</label>
//               <select name="gender" value={formData.gender} onChange={handleChange} disabled={loading}>
//                 <option value="">-- Chọn --</option>
//                 <option value="Nam">Nam</option>
//                 <option value="Nữ">Nữ</option>
//                 <option value="Khác">Khác</option>
//               </select>
//             </div>
            
//             <div className="form-group form-group-span-2">
//               <label>Vai trò <span className="required">*</span></label>
//               <select 
//                 name="roleType" 
//                 value={formData.roleType} 
//                 onChange={handleChange} 
//                 onBlur={handleBlur}
//                 disabled={loading}
//                 required
//                 className={errors.roleType ? 'input-error' : ''}
//               >
//                 {(!filteredRoles || filteredRoles.length === 0) && <option value="">Đang tải vai trò...</option>}
//                 {filteredRoles && filteredRoles.map((role) => {
//                     const rName = role.roleName || role.name || '';
//                     return (
//                         <option key={role.id || rName} value={rName}>
//                             {rName}
//                         </option>
//                     );
//                 })}
//               </select>
//               {errors.roleType && <span className="error-message">{errors.roleType}</span>}
//             </div>

//             {formData.roleType === 'Student' && (
//               <div className="form-group form-group-span-2" style={{animation: 'fadeIn 0.3s'}}>
//                 <label>Ngành Học <span className="required">*</span></label>
//                 <input 
//                     type="text" 
//                     name="major" 
//                     value={formData.major} 
//                     onChange={handleChange} 
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     required 
//                     placeholder="Ví dụ: Công nghệ thông tin..." 
//                     className={errors.major ? 'input-error' : ''}
//                 />
//                 {errors.major && <span className="error-message">{errors.major}</span>}
//               </div>
//             )}

//             {formData.roleType === 'Lecturer' && (
//               <div className="form-group form-group-span-2" style={{animation: 'fadeIn 0.3s'}}>
//                 <label>Chuyên Môn <span className="required">*</span></label>
//                 <input 
//                     type="text" 
//                     name="specialization" 
//                     value={formData.specialization} 
//                     onChange={handleChange} 
//                     onBlur={handleBlur}
//                     disabled={loading}
//                     required 
//                     placeholder="Ví dụ: Tiến sĩ Toán học..." 
//                     className={errors.specialization ? 'input-error' : ''}
//                 />
//                 {errors.specialization && <span className="error-message">{errors.specialization}</span>}
//               </div>
//             )}
//           </div>

//           <div className="modal-footer">
//             <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
//               Hủy
//             </button>
//             <button type="submit" className="btn-primary" disabled={loading}>
//               {loading ? 'Đang tạo...' : 'Tạo người dùng'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateUserModal;


import React, { useState, useEffect, useMemo, useRef } from 'react';
import '../styles/Modal.css';
import { userAPI } from '../services/apiService';
import Toast from './Toast';

const CreateUserModal = ({ onClose, onUserCreated, roles }) => {
  const filteredRoles = useMemo(() => {
    return roles ? roles.filter(r => {
      const rName = r.roleName || r.name || '';
      return rName.toLowerCase() !== 'admin'; 
    }) : [];
  }, [roles]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    birthDate: '',
    roleType: '', 
    major: '', 
    specialization: '', 
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const isSubmitting = useRef(false);

  useEffect(() => {
    setErrors({});
    setToast(null);
    setLoading(false);
  }, [filteredRoles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    if (name === 'roleType') {
      setFormData(prev => ({
        ...prev,
        roleType: value,
        major: value === 'Student' ? prev.major : '',
        specialization: value === 'Lecturer' ? prev.specialization : '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = null;

    switch (name) {
      case 'fullName':
        if (!value.trim()) error = "Họ tên không được để trống";
        else if (value.trim().length < 8) error = "Họ tên phải có ít nhất 8 ký tự";
        break;
      case 'email':
        if (!value.trim()) error = "Email không được để trống";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email không hợp lệ";
        break;
      case 'password':
        if (!value) error = "Mật khẩu không được để trống";
        else if (value.length < 8) error = "Mật khẩu phải có ít nhất 8 ký tự";
        break;
      // ĐÃ XÓA check validate cho roleType ở đây
      case 'major':
        if (formData.roleType === 'Student' && !value.trim()) {
            error = "Vui lòng nhập ngành học";
        }
        break;
      case 'specialization':
        if (formData.roleType === 'Lecturer' && !value.trim()) {
            error = "Vui lòng nhập chuyên môn";
        }
        break;
      default:
         break; 
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting.current) return;
    isSubmitting.current = true;

    const finalErrors = {};
    if (!formData.fullName.trim()) finalErrors.fullName = "Bắt buộc nhập";
    else if (formData.fullName.length < 8) finalErrors.fullName = "Tối thiểu 8 ký tự";

    if (!formData.email.trim()) finalErrors.email = "Bắt buộc nhập";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) finalErrors.email = "Email không hợp lệ";
    
    if (!formData.password) finalErrors.password = "Bắt buộc nhập";
    else if (formData.password.length < 8) finalErrors.password = "Tối thiểu 8 ký tự";

    // --- ĐÃ XÓA ĐOẠN KIỂM TRA ROLE TYPE BẮT BUỘC ---
    // if (!formData.roleType) finalErrors.roleType = "Vui lòng chọn vai trò";

    // Chỉ validate Major/Specialization NẾU ĐÃ CHỌN role tương ứng
    if (formData.roleType === 'Student' && !formData.major.trim()) finalErrors.major = "Vui lòng nhập ngành học";
    if (formData.roleType === 'Lecturer' && !formData.specialization.trim()) finalErrors.specialization = "Vui lòng nhập chuyên môn";

    setErrors(finalErrors);

    if (Object.keys(finalErrors).length > 0) {
      setToast({ message: "Vui lòng kiểm tra lại thông tin.", type: 'error' });
      isSubmitting.current = false;
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      const dataToSend = {
        fullName: formData.fullName,
        email: formData.email,
        passwordHash: formData.password,
        // Nếu không chọn role (chuỗi rỗng) thì gửi null
        roleType: formData.roleType || null, 
        gender: formData.gender || null,
        birthDate: formData.birthDate || null,
        phones: formData.phone ? [formData.phone] : [],
      };
      
      if (formData.roleType === 'Student') {
        dataToSend.career = formData.major;
      } else if (formData.roleType === 'Lecturer') {
        dataToSend.profession = formData.specialization;
      }

      await userAPI.createUser(dataToSend);
      
      setToast({ message: 'Tạo người dùng thành công!', type: 'success' });
      onUserCreated(); 
      
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Create User error:', error);
      const apiError = error.response?.data;
      
      const newServerErrors = {};
      const toastMessages = []; 

      const processError = (err) => {
        if (!err || typeof err !== 'object') return;
        
        const backendMessage = err.message || "Lỗi hệ thống chưa xác định";
        const code = err.code; 

        toastMessages.push(backendMessage);

        switch (code) {
          case 1004: 
          case 1007: 
          case 1015: 
            newServerErrors.email = backendMessage; 
            break;

          case 1002: 
          case 1006: 
          case 1008: 
            newServerErrors.fullName = backendMessage; 
            break;

          case 1005: 
          case 1009: 
            newServerErrors.password = backendMessage; 
            break;
            
          default: 
            break;
        }
      };

      if (Array.isArray(apiError)) {
        apiError.forEach(processError);
      } else if (typeof apiError === 'object' && apiError !== null) {
        processError(apiError);
      } else {
        toastMessages.push(error.message || 'Lỗi kết nối server.');
      }

      if (Object.keys(newServerErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...newServerErrors }));
      }
      
      if (toastMessages.length > 0) {
        setToast({ message: toastMessages.join('\n'), type: 'error' });
      }

    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <div className="modal-overlay">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="modal-content">
        <div className="modal-header">
          <h2>Tạo người dùng mới</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body form-grid">
            
            <div className="form-group">
              <label>Họ Tên <span className="required">*</span></label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} disabled={loading} required className={errors.fullName ? 'input-error' : ''} placeholder="Ít nhất 8 ký tự" />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>
            
            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} disabled={loading} required className={errors.email ? 'input-error' : ''} />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Mật khẩu <span className="required">*</span></label>
              <div className="password-input-wrapper" style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} disabled={loading} required style={{ paddingRight: '40px' }} className={errors.password ? 'input-error' : ''} placeholder="Ít nhất 8 ký tự" />
                <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center' }}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </span>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={loading} /> 
            </div>
            
            <div className="form-group">
              <label>Ngày sinh</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} disabled={loading} />
            </div>
            
            <div className="form-group">
              <label>Giới tính</label>
              <select name="gender" value={formData.gender} onChange={handleChange} disabled={loading}>
                <option value="">-- Chọn --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            
            {/* --- CẬP NHẬT: Không còn required và dấu * --- */}
            <div className="form-group form-group-span-2">
              <label>Vai trò</label>
              <select 
                name="roleType" 
                value={formData.roleType} 
                onChange={handleChange} 
                onBlur={handleBlur}
                disabled={loading}
                // ĐÃ XÓA required
                className={errors.roleType ? 'input-error' : ''}
              >
                <option value="">-- Chọn vai trò (Không bắt buộc) --</option>
                
                {(!filteredRoles || filteredRoles.length === 0) ? (
                   null 
                ) : (
                  filteredRoles.map((role) => {
                      const rName = role.roleName || role.name || '';
                      return (
                          <option key={role.id || rName} value={rName}>
                              {rName}
                          </option>
                      );
                  })
                )}
              </select>
              {/* Vẫn giữ hiển thị lỗi nếu có lỗi từ server trả về */}
              {errors.roleType && <span className="error-message">{errors.roleType}</span>}
            </div>

            {formData.roleType === 'Student' && (
              <div className="form-group form-group-span-2" style={{animation: 'fadeIn 0.3s'}}>
                <label>Ngành Học <span className="required">*</span></label>
                <input type="text" name="major" value={formData.major} onChange={handleChange} onBlur={handleBlur} disabled={loading} required placeholder="Ví dụ: Công nghệ thông tin..." className={errors.major ? 'input-error' : ''} />
                {errors.major && <span className="error-message">{errors.major}</span>}
              </div>
            )}

            {formData.roleType === 'Lecturer' && (
              <div className="form-group form-group-span-2" style={{animation: 'fadeIn 0.3s'}}>
                <label>Chuyên Môn <span className="required">*</span></label>
                <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} onBlur={handleBlur} disabled={loading} required placeholder="Ví dụ: Tiến sĩ Toán học..." className={errors.specialization ? 'input-error' : ''} />
                {errors.specialization && <span className="error-message">{errors.specialization}</span>}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo người dùng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;