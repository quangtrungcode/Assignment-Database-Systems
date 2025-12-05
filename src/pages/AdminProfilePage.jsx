// import React, { useState, useEffect } from 'react';
// import { userAPI } from '../services/apiService';
// import Toast from '../components/Toast';
// import '../styles/Modal.css';

// const AdminProfilePage = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     gender: '',
//     birthDate: '',
//     password: '',
//   });

//   const [displayInfo, setDisplayInfo] = useState({
//     userID: '',
//     createdAt: '',
//     roleName: ''
//   });

//   const [originalData, setOriginalData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [toast, setToast] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('vi-VN', {
//         year: 'numeric', month: '2-digit', day: '2-digit',
//         hour: '2-digit', minute: '2-digit'
//     });
//   };

//   useEffect(() => {
//     const fetchMyProfile = async () => {
//       try {
//         const response = await userAPI.getMyInfo(); 
//         const data = response.data?.result || response.data;

//         if (data) {
//           const initialData = {
//             fullName: data.fullName || '',
//             email: data.email || '',
//             phone: (data.phones && data.phones.length > 0) ? data.phones[0] : (data.phone || ''),
//             gender: data.gender || '',
//             birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
//             password: '', 
//           };

//           setFormData(initialData);
//           setOriginalData(initialData);

//           setDisplayInfo({
//             userID: data.userID,
//             createdAt: data.createdAt,
//             roleName: data.role?.roleName || 'Admin'
//           });
//         }
//       } catch (err) {
//         setToast({ message: 'Không thể tải thông tin hồ sơ.', type: 'error' });
//       }
//     };

//     fetchMyProfile();
//   }, []);

//   // --- LOGIC VALIDATE ĐÃ SỬA ĐỔI ---
//   const validateField = (name, value) => {
//     let errorMsg = '';
    
//     // 1. Lấy giá trị thô (Raw) để check Mật khẩu (tính cả dấu cách)
//     const rawVal = value ? String(value) : ''; 
//     // 2. Lấy giá trị Trimmed để check Họ tên (không tính dấu cách thừa)
//     const trimmedVal = rawVal.trim();

//     switch (name) {
//       case 'email':
//         if (trimmedVal.length === 0) {
//           errorMsg = 'Email không được để trống.';
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedVal)) {
//           errorMsg = 'Email không đúng định dạng.';
//         }
//         break;

//       case 'fullName':
//         // SỬA: Luôn kiểm tra độ dài đã trim, kể cả khi rỗng (0 < 8 -> Lỗi)
//         if (trimmedVal.length < 8) {
//           errorMsg = 'Họ và tên phải có ít nhất 8 ký tự.';
//         }
//         break;

//       case 'password':
//         // SỬA: Không dùng trim(), tính cả dấu cách.
//         // Logic: Nếu ô mật khẩu CÓ DỮ LIỆU (length > 0) thì bắt buộc phải >= 8
//         // Lưu ý: Nếu để trống hoàn toàn (length === 0) thì hiểu là "Không đổi mật khẩu"
//         if (rawVal.length > 0 && rawVal.length < 8) {
//              errorMsg = 'Mật khẩu mới phải có ít nhất 8 ký tự (bao gồm cả khoảng trắng).';
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
//     // Xóa lỗi ngay khi nhập lại
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     // Gọi validate khi click ra ngoài
//     const errorMsg = validateField(name, value);
//     setErrors(prev => ({ ...prev, [name]: errorMsg }));
//   };

//   const handleEditClick = () => {
//     setIsEditing(true);
//     setErrors({});
//   };

//   const handleCancelClick = () => {
//     setIsEditing(false);
//     setFormData(originalData);
//     setErrors({});
//     setShowPassword(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const newErrors = {};
    
//     newErrors.email = validateField('email', formData.email);
//     newErrors.fullName = validateField('fullName', formData.fullName);
    
//     // Chỉ validate password nếu người dùng có nhập
//     if (formData.password && formData.password.length > 0) {
//         newErrors.password = validateField('password', formData.password);
//     }

//     Object.keys(newErrors).forEach(k => { if (!newErrors[k]) delete newErrors[k] });

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setLoading(false);
//       return;
//     }

//     try {
//       const storedUserId = localStorage.getItem('userID');
//       const processValue = (val) => (!val || val.toString().trim() === '') ? null : val.toString().trim();

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
      
//       // SỬA: Lấy password thô (không trim)
//       if (formData.password && formData.password !== '') {
//         payload.passwordHash = formData.password; // Gửi nguyên gốc (kể cả dấu cách)
//         hasChange = true;
//       }

//       if (!hasChange) {
//         setToast({ message: 'Cập nhật hồ sơ thành công!', type: 'success' });
//         setFormData(prev => ({ ...prev, password: '' })); 
//         setIsEditing(false);
//         setLoading(false);
//         return; 
//       }

//       payload.role = "Admin"; 

//       await userAPI.update(storedUserId, payload);
      
//       setToast({ message: 'Cập nhật hồ sơ thành công!', type: 'success' });
      
//       setOriginalData({ ...formData, password: '' });
//       setFormData(prev => ({ ...prev, password: '' }));
//       setIsEditing(false);

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
//             default:
//               break;
//           }
//         });
//       } else {
//         const fallbackMsg = typeof data === 'string' ? data : 'Cập nhật thất bại.';
//         allToastMessages.push(fallbackMsg);
//       }

//       if (Object.keys(newFieldErrors).length > 0) setErrors(newFieldErrors);
//       if (allToastMessages.length > 0) setToast({ message: allToastMessages.join('\n'), type: 'error' });

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
//       <div className="card" style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
//             <h2 style={{ color: '#2c3e50', margin: 0 }}>Hồ sơ Admin</h2>
//             <span style={{ padding: '5px 15px', borderRadius: '20px', backgroundColor: '#e74c3c', color: 'white', fontSize: '0.9em', fontWeight: 'bold' }}>
//                 {displayInfo.roleName}
//             </span>
//         </div>

//         <form onSubmit={handleSubmit}>
          
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px' }}>
//              <div className="form-group">
//                 <label style={{ fontWeight: 'bold', fontSize: '0.85em', color: '#7f8c8d' }}>User ID</label>
//                 <div style={{ padding: '8px 0', color: '#2c3e50', fontWeight: 'bold' }}>{displayInfo.userID || '...'}</div>
//              </div>
//              <div className="form-group">
//                 <label style={{ fontWeight: 'bold', fontSize: '0.85em', color: '#7f8c8d' }}>Ngày tạo</label>
//                 <div style={{ padding: '8px 0', color: '#2c3e50' }}>{formatDate(displayInfo.createdAt)}</div>
//              </div>
//           </div>

//           <div className="form-group" style={{ marginBottom: '15px' }}>
//             <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
//                 Họ và Tên <span style={{color: 'red'}}>*</span>
//             </label>
//             <input 
//                 type="text" name="fullName" 
//                 value={formData.fullName} onChange={handleChange} onBlur={handleBlur}
//                 disabled={!isEditing}
//                 className={errors.fullName ? 'input-error' : ''}
//                 style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: isEditing ? '#fff' : '#f9f9f9', cursor: isEditing ? 'text' : 'default' }}
//             />
//             {errors.fullName && <span style={{ color: 'red', fontSize: '0.85em' }}>{errors.fullName}</span>}
//           </div>

//           <div className="form-group" style={{ marginBottom: '15px' }}>
//             <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
//                 Email (Tài khoản) <span style={{color: 'red'}}>*</span>
//             </label>
//             <input 
//                 type="email" name="email" 
//                 value={formData.email} onChange={handleChange} onBlur={handleBlur} 
//                 disabled={!isEditing} 
//                 className={errors.email ? 'input-error' : ''}
//                 style={{ 
//                     width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', 
//                     backgroundColor: isEditing ? '#fff' : '#f9f9f9', 
//                     cursor: isEditing ? 'text' : 'not-allowed',
//                     color: '#333'
//                 }}
//             />
//             {errors.email && <span style={{ color: 'red', fontSize: '0.85em' }}>{errors.email}</span>}
//           </div>

//           <div className="form-group" style={{ marginBottom: '15px' }}>
//             <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Số điện thoại</label>
//             <input 
//                 type="tel" name="phone" 
//                 value={formData.phone} onChange={handleChange} 
//                 disabled={!isEditing} 
//                 style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: isEditing ? '#fff' : '#f9f9f9' }} 
//             />
//           </div>

//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
//             <div className="form-group" style={{ marginBottom: '15px' }}>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Giới tính</label>
//                 <select 
//                     name="gender" value={formData.gender} onChange={handleChange} 
//                     disabled={!isEditing}
//                     style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: isEditing ? '#fff' : '#f9f9f9' }}
//                 >
//                     <option value="">Chọn giới tính</option>
//                     <option value="Nam">Nam</option>
//                     <option value="Nữ">Nữ</option>
//                     <option value="Khác">Khác</option>
//                 </select>
//             </div>

//             <div className="form-group" style={{ marginBottom: '15px' }}>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ngày sinh</label>
//                 <input 
//                     type="date" name="birthDate" 
//                     value={formData.birthDate} onChange={handleChange} 
//                     disabled={!isEditing}
//                     style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: isEditing ? '#fff' : '#f9f9f9' }} 
//                 />
//             </div>
//           </div>

//           {isEditing && (
//             <div className="form-group" style={{ marginBottom: '15px', animation: 'fadeIn 0.3s' }}>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#e67e22' }}>Đổi mật khẩu (Tùy chọn)</label>
//                 <div style={{ position: 'relative' }}>
//                     <input 
//                         type={showPassword ? "text" : "password"} 
//                         name="password" 
//                         value={formData.password} onChange={handleChange} onBlur={handleBlur}
//                         placeholder="Nhập mật khẩu mới nếu muốn đổi"
//                         className={errors.password ? 'input-error' : ''}
//                         style={{ width: '100%', padding: '10px', border: '1px solid #f39c12', borderRadius: '4px', paddingRight: '40px' }}
//                     />
//                     <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
//                     {showPassword ? "👁️" : "👁️‍🗨️"}
//                     </span>
//                 </div>
//                 {errors.password && <span style={{ color: 'red', fontSize: '0.85em' }}>{errors.password}</span>}
//             </div>
//           )}

//           <div className="form-actions" style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
//             {!isEditing ? (
//                 <button 
//                     type="button" onClick={handleEditClick} className="btn-secondary"
//                     style={{ padding: '10px 25px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
//                 >
//                     ✏️ Chỉnh sửa hồ sơ
//                 </button>
//             ) : (
//                 <>
//                     <button 
//                         type="button" onClick={handleCancelClick} className="btn-cancel" disabled={loading}
//                         style={{ padding: '10px 25px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
//                     >
//                         Hủy bỏ
//                     </button>
//                     <button 
//                         type="submit" className="btn-primary" disabled={loading} 
//                         style={{ padding: '10px 25px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
//                     >
//                         {loading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
//                     </button>
//                 </>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminProfilePage;

// import React, { useState, useEffect } from 'react';
// import { userAPI } from '../services/apiService';
// import Toast from '../components/Toast';
// import '../styles/Modal.css';

// const AdminProfilePage = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     gender: '',
//     birthDate: '',
//     password: '',
//   });

//   const [displayInfo, setDisplayInfo] = useState({
//     userID: '',
//     createdAt: '',
//     roleName: ''
//   });

//   const [originalData, setOriginalData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [toast, setToast] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('vi-VN', {
//         year: 'numeric', month: '2-digit', day: '2-digit',
//         hour: '2-digit', minute: '2-digit'
//     });
//   };

//   useEffect(() => {
//     const fetchMyProfile = async () => {
//       try {
//         const response = await userAPI.getMyInfo(); 
//         const data = response.data?.result || response.data;

//         if (data) {
//           const initialData = {
//             fullName: data.fullName || '',
//             email: data.email || '',
//             // Logic lấy phone từ mảng phones[]
//             phone: (data.phones && data.phones.length > 0) ? data.phones[0] : (data.phone || ''),
//             gender: data.gender || '',
//             birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
//             password: '', 
//           };

//           setFormData(initialData);
//           setOriginalData(initialData);

//           setDisplayInfo({
//             userID: data.userID,
//             createdAt: data.createdAt,
//             roleName: data.role?.roleName || 'Admin'
//           });
//         }
//       } catch (err) {
//         setToast({ message: 'Không thể tải thông tin hồ sơ.', type: 'error' });
//       }
//     };

//     fetchMyProfile();
//   }, []);

//   // --- 🛠️ LOGIC VALIDATE ĐÃ SỬA ---
//   const validateField = (name, value) => {
//     let errorMsg = '';
//     const rawVal = value ? String(value) : ''; 
//     const trimmedVal = rawVal.trim();

//     switch (name) {
//       case 'fullName':
//         // Trường hợp 1: Rỗng hoàn toàn -> Báo lỗi để trống
//         if (trimmedVal.length === 0) {
//           errorMsg = 'Họ và tên không được để trống.';
//         } 
//         // Trường hợp 2: Có nhập nhưng ngắn -> Báo lỗi độ dài
//         else if (trimmedVal.length < 8) {
//           errorMsg = 'Họ và tên phải có ít nhất 8 ký tự.';
//         }
//         break;

//       case 'email':
//         if (trimmedVal.length === 0) {
//           errorMsg = 'Email không được để trống.';
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedVal)) {
//           errorMsg = 'Email không đúng định dạng.';
//         }
//         break;

//       case 'password':
//         // Password: Chỉ check nếu có nhập (length > 0)
//         // Nếu nhập toàn dấu cách (raw > 0, trim == 0) -> Báo lỗi
//         if (rawVal.length > 0) {
//              if (trimmedVal.length === 0) {
//                  errorMsg = 'Mật khẩu không được chứa toàn khoảng trắng.';
//              } else if (rawVal.length < 8) {
//                  errorMsg = 'Mật khẩu mới phải có ít nhất 8 ký tự.';
//              }
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
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
//   };

//   const handleEditClick = () => {
//     setIsEditing(true);
//     setErrors({});
//   };

//   const handleCancelClick = () => {
//     setIsEditing(false);
//     setFormData(originalData);
//     setErrors({});
//     setShowPassword(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const newErrors = {};
    
//     newErrors.email = validateField('email', formData.email);
//     newErrors.fullName = validateField('fullName', formData.fullName);
    
//     if (formData.password && formData.password.length > 0) {
//         newErrors.password = validateField('password', formData.password);
//     }

//     Object.keys(newErrors).forEach(k => { if (!newErrors[k]) delete newErrors[k] });

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setLoading(false);
//       return;
//     }

//     try {
//       const storedUserId = localStorage.getItem('userID');
//       const processValue = (val) => (!val || val.toString().trim() === '') ? null : val.toString().trim();

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
      
//       if (formData.password && formData.password !== '') {
//         payload.passwordHash = formData.password; 
//         hasChange = true;
//       }

//       if (!hasChange) {
//         setToast({ message: 'Cập nhật hồ sơ thành công!', type: 'success' });
//         setFormData(prev => ({ ...prev, password: '' })); 
//         setIsEditing(false);
//         setLoading(false);
//         return; 
//       }

//       payload.role = "Admin"; 

//       await userAPI.update(storedUserId, payload);
      
//       setToast({ message: 'Cập nhật hồ sơ thành công!', type: 'success' });
      
//       setOriginalData({ ...formData, password: '' });
//       setFormData(prev => ({ ...prev, password: '' }));
//       setIsEditing(false);

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
//             default:
//               break;
//           }
//         });
//       } else {
//         const fallbackMsg = typeof data === 'string' ? data : 'Cập nhật thất bại.';
//         allToastMessages.push(fallbackMsg);
//       }

//       if (Object.keys(newFieldErrors).length > 0) setErrors(newFieldErrors);
//       if (allToastMessages.length > 0) setToast({ message: allToastMessages.join('\n'), type: 'error' });

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
//       <div className="card" style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
//             <h2 style={{ color: '#2c3e50', margin: 0 }}>Hồ sơ Admin</h2>
//             <span style={{ padding: '5px 15px', borderRadius: '20px', backgroundColor: '#e74c3c', color: 'white', fontSize: '0.9em', fontWeight: 'bold' }}>
//                 {displayInfo.roleName}
//             </span>
//         </div>

//         <form onSubmit={handleSubmit}>
          
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px' }}>
//              <div className="form-group">
//                 <label style={{ fontWeight: 'bold', fontSize: '0.85em', color: '#7f8c8d' }}>User ID</label>
//                 <div style={{ padding: '8px 0', color: '#2c3e50', fontWeight: 'bold' }}>{displayInfo.userID || '...'}</div>
//              </div>
//              <div className="form-group">
//                 <label style={{ fontWeight: 'bold', fontSize: '0.85em', color: '#7f8c8d' }}>Ngày tạo</label>
//                 <div style={{ padding: '8px 0', color: '#2c3e50' }}>{formatDate(displayInfo.createdAt)}</div>
//              </div>
//           </div>

//           <div className="form-group" style={{ marginBottom: '15px' }}>
//             <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
//                 Họ và Tên <span style={{color: 'red'}}>*</span>
//             </label>
//             <input 
//                 type="text" name="fullName" 
//                 value={formData.fullName} onChange={handleChange} onBlur={handleBlur}
//                 disabled={!isEditing}
//                 className={errors.fullName ? 'input-error' : ''}
//                 style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: isEditing ? '#fff' : '#f9f9f9', cursor: isEditing ? 'text' : 'default' }}
//             />
//             {errors.fullName && <span style={{ color: 'red', fontSize: '0.85em' }}>{errors.fullName}</span>}
//           </div>

//           <div className="form-group" style={{ marginBottom: '15px' }}>
//             <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
//                 Email (Tài khoản) <span style={{color: 'red'}}>*</span>
//             </label>
//             <input 
//                 type="email" name="email" 
//                 value={formData.email} onChange={handleChange} onBlur={handleBlur} 
//                 disabled={!isEditing} 
//                 className={errors.email ? 'input-error' : ''}
//                 style={{ 
//                     width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', 
//                     backgroundColor: isEditing ? '#fff' : '#f9f9f9', 
//                     cursor: isEditing ? 'text' : 'not-allowed',
//                     color: '#333'
//                 }}
//             />
//             {errors.email && <span style={{ color: 'red', fontSize: '0.85em' }}>{errors.email}</span>}
//           </div>

//           <div className="form-group" style={{ marginBottom: '15px' }}>
//             <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Số điện thoại</label>
//             <input 
//                 type="tel" name="phone" 
//                 value={formData.phone} onChange={handleChange} 
//                 disabled={!isEditing} 
//                 style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: isEditing ? '#fff' : '#f9f9f9' }} 
//             />
//           </div>

//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
//             <div className="form-group" style={{ marginBottom: '15px' }}>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Giới tính</label>
//                 <select 
//                     name="gender" value={formData.gender} onChange={handleChange} 
//                     disabled={!isEditing}
//                     style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: isEditing ? '#fff' : '#f9f9f9' }}
//                 >
//                     <option value="">Chọn giới tính</option>
//                     <option value="Nam">Nam</option>
//                     <option value="Nữ">Nữ</option>
//                     <option value="Khác">Khác</option>
//                 </select>
//             </div>

//             <div className="form-group" style={{ marginBottom: '15px' }}>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ngày sinh</label>
//                 <input 
//                     type="date" name="birthDate" 
//                     value={formData.birthDate} onChange={handleChange} 
//                     disabled={!isEditing}
//                     style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: isEditing ? '#fff' : '#f9f9f9' }} 
//                 />
//             </div>
//           </div>

//           {isEditing && (
//             <div className="form-group" style={{ marginBottom: '15px', animation: 'fadeIn 0.3s' }}>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#e67e22' }}>Đổi mật khẩu (Tùy chọn)</label>
//                 <div style={{ position: 'relative' }}>
//                     <input 
//                         type={showPassword ? "text" : "password"} 
//                         name="password" 
//                         value={formData.password} onChange={handleChange} onBlur={handleBlur}
//                         placeholder="Nhập mật khẩu mới nếu muốn đổi"
//                         className={errors.password ? 'input-error' : ''}
//                         style={{ width: '100%', padding: '10px', border: '1px solid #f39c12', borderRadius: '4px', paddingRight: '40px' }}
//                     />
//                     <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
//                     {showPassword ? "👁️" : "👁️‍🗨️"}
//                     </span>
//                 </div>
//                 {errors.password && <span style={{ color: 'red', fontSize: '0.85em' }}>{errors.password}</span>}
//             </div>
//           )}

//           <div className="form-actions" style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
//             {!isEditing ? (
//                 <button 
//                     type="button" onClick={handleEditClick} className="btn-secondary"
//                     style={{ padding: '10px 25px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
//                 >
//                     ✏️ Chỉnh sửa hồ sơ
//                 </button>
//             ) : (
//                 <>
//                     <button 
//                         type="button" onClick={handleCancelClick} className="btn-cancel" disabled={loading}
//                         style={{ padding: '10px 25px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
//                     >
//                         Hủy bỏ
//                     </button>
//                     <button 
//                         type="submit" className="btn-primary" disabled={loading} 
//                         style={{ padding: '10px 25px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
//                     >
//                         {loading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
//                     </button>
//                 </>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminProfilePage;

import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/apiService';
import Toast from '../components/Toast';
import '../styles/Modal.css';

const AdminProfilePage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    birthDate: '',
    password: '',
  });

  const [displayInfo, setDisplayInfo] = useState({
    userID: '',
    createdAt: '',
    roleName: ''
  });

  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const response = await userAPI.getMyInfo(); 
        const data = response.data?.result || response.data;

        if (data) {
          const initialData = {
            fullName: data.fullName || '',
            email: data.email || '',
            // Lấy phone từ mảng phones[]
            phone: (data.phones && data.phones.length > 0) ? data.phones[0] : (data.phone || ''),
            gender: data.gender || '',
            birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
            password: '', 
          };

          setFormData(initialData);
          setOriginalData(initialData);

          setDisplayInfo({
            userID: data.userID,
            createdAt: data.createdAt,
            roleName: data.role?.roleName || 'Admin'
          });
        }
      } catch (err) {
        setToast({ message: 'Không thể tải thông tin hồ sơ.', type: 'error' });
      }
    };

    fetchMyProfile();
  }, []);

  // --- LOGIC VALIDATE ---
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
        // Chỉ validate khi có nhập liệu
        if (rawVal.length > 0) {
             if (trimmedVal.length === 0) {
                 errorMsg = 'Mật khẩu không được chứa toàn khoảng trắng.';
             } else if (rawVal.length < 8) {
                 errorMsg = 'Mật khẩu mới phải có ít nhất 8 ký tự.';
             }
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
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setErrors({});
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(originalData);
    setErrors({});
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Validation
    const newErrors = {};
    newErrors.email = validateField('email', formData.email);
    newErrors.fullName = validateField('fullName', formData.fullName);
    
    if (formData.password && formData.password.length > 0) {
        newErrors.password = validateField('password', formData.password);
    }

    Object.keys(newErrors).forEach(k => { if (!newErrors[k]) delete newErrors[k] });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const storedUserId = localStorage.getItem('userID');
      
      // Hàm helper: Chuyển rỗng -> null
      const toNullIfEmpty = (val) => (!val || val.toString().trim() === '') ? null : val.toString().trim();

      // --- 2. TẠO PAYLOAD ĐẦY ĐỦ ---
      // Gửi tất cả các trường, bất kể có thay đổi hay không
      const payload = {
        fullName: toNullIfEmpty(formData.fullName),
        email: formData.email.trim(), // Email bắt buộc
        
        // Xử lý Phone: Rỗng -> Mảng rỗng [], Có -> [sdt]
        phones: formData.phone && formData.phone.trim() ? [formData.phone.trim()] : [],
        
        gender: toNullIfEmpty(formData.gender),
        birthDate: toNullIfEmpty(formData.birthDate),
        
        // Password: Nếu để trống -> Gửi null (Backend giữ nguyên pass cũ)
        passwordHash: toNullIfEmpty(formData.password),
        
        // Role: Luôn luôn là Admin
        role: "Admin"
      };

      console.log('Update Payload (Admin):', payload);

      // Gọi API update
      await userAPI.update(storedUserId, payload);
      
      setToast({ message: 'Cập nhật hồ sơ thành công!', type: 'success' });
      
      // Reset form và trạng thái
      setOriginalData({ ...formData, password: '' });
      setFormData(prev => ({ ...prev, password: '' }));
      setIsEditing(false);

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
            default:
              break;
          }
        });
      } else {
        const fallbackMsg = typeof data === 'string' ? data : 'Cập nhật thất bại.';
        allToastMessages.push(fallbackMsg);
      }

      if (Object.keys(newFieldErrors).length > 0) setErrors(newFieldErrors);
      if (allToastMessages.length > 0) setToast({ message: allToastMessages.join('\n'), type: 'error' });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="card" style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2 style={{ color: '#2c3e50', margin: 0 }}>Hồ sơ Admin</h2>
            <span style={{ padding: '5px 15px', borderRadius: '20px', backgroundColor: '#e74c3c', color: 'white', fontSize: '0.9em', fontWeight: 'bold' }}>
                {displayInfo.roleName}
            </span>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px' }}>
             <div className="form-group">
                <label style={{ fontWeight: 'bold', fontSize: '0.85em', color: '#7f8c8d' }}>User ID</label>
                <div style={{ padding: '8px 0', color: '#2c3e50', fontWeight: 'bold' }}>{displayInfo.userID || '...'}</div>
             </div>
             <div className="form-group">
                <label style={{ fontWeight: 'bold', fontSize: '0.85em', color: '#7f8c8d' }}>Ngày tạo</label>
                <div style={{ padding: '8px 0', color: '#2c3e50' }}>{formatDate(displayInfo.createdAt)}</div>
             </div>
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Họ và Tên <span style={{color: 'red'}}>*</span>
            </label>
            <input 
                type="text" name="fullName" 
                value={formData.fullName} onChange={handleChange} onBlur={handleBlur}
                disabled={!isEditing}
                className={errors.fullName ? 'input-error' : ''}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: isEditing ? '#fff' : '#f9f9f9', cursor: isEditing ? 'text' : 'default' }}
            />
            {errors.fullName && <span style={{ color: 'red', fontSize: '0.85em' }}>{errors.fullName}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email (Tài khoản) <span style={{color: 'red'}}>*</span>
            </label>
            <input 
                type="email" name="email" 
                value={formData.email} onChange={handleChange} onBlur={handleBlur} 
                disabled={!isEditing} 
                className={errors.email ? 'input-error' : ''}
                style={{ 
                    width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', 
                    backgroundColor: isEditing ? '#fff' : '#f9f9f9', 
                    cursor: isEditing ? 'text' : 'default',
                    color: '#333'
                }}
            />
            {errors.email && <span style={{ color: 'red', fontSize: '0.85em' }}>{errors.email}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Số điện thoại</label>
            <input 
                type="tel" name="phone" 
                value={formData.phone} onChange={handleChange} 
                disabled={!isEditing} 
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: isEditing ? '#fff' : '#f9f9f9' }} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Giới tính</label>
                <select 
                    name="gender" value={formData.gender} onChange={handleChange} 
                    disabled={!isEditing}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: isEditing ? '#fff' : '#f9f9f9' }}
                >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                </select>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ngày sinh</label>
                <input 
                    type="date" name="birthDate" 
                    value={formData.birthDate} onChange={handleChange} 
                    disabled={!isEditing}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: isEditing ? '#fff' : '#f9f9f9' }} 
                />
            </div>
          </div>

          {isEditing && (
            <div className="form-group" style={{ marginBottom: '15px', animation: 'fadeIn 0.3s' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#e67e22' }}>Đổi mật khẩu (Tùy chọn)</label>
                <div style={{ position: 'relative' }}>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        value={formData.password} onChange={handleChange} onBlur={handleBlur}
                        placeholder="Nhập mật khẩu mới nếu muốn đổi"
                        className={errors.password ? 'input-error' : ''}
                        style={{ width: '100%', padding: '10px', border: '1px solid #f39c12', borderRadius: '4px', paddingRight: '40px' }}
                    />
                    <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                    </span>
                </div>
                {errors.password && <span style={{ color: 'red', fontSize: '0.85em' }}>{errors.password}</span>}
            </div>
          )}

          <div className="form-actions" style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            {!isEditing ? (
                <button 
                    type="button" onClick={handleEditClick} className="btn-secondary"
                    style={{ padding: '10px 25px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    ✏️ Chỉnh sửa hồ sơ
                </button>
            ) : (
                <>
                    <button 
                        type="button" onClick={handleCancelClick} className="btn-cancel" disabled={loading}
                        style={{ padding: '10px 25px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Hủy bỏ
                    </button>
                    <button 
                        type="submit" className="btn-primary" disabled={loading} 
                        style={{ padding: '10px 25px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {loading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
                    </button>
                </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfilePage;
