// import React, { useState, useEffect } from 'react';
// import { userAPI } from '../services/apiService';
// import '../styles/Modal.css';
// // Không cần import Toast ở đây nữa, vì Toast thành công sẽ hiện ở Dashboard

// const StudentProfileModal = ({ user, onClose, onUserUpdated }) => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '', 
//     phone: '',
//     gender: '',
//     birthDate: '',
//     career: '',
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   // Đã xóa state toast ở đây

//   useEffect(() => {
//     if (user) {
//       setError(null);
//       setFormData({
//         fullName: user.fullName || '',
//         email: user.email || '', 
//         phone: user.phone || '',
//         gender: user.gender || '',
//         birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
//         career: user.career || '', 
//       });
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (error) setError(null);
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const dataToSend = {
//         fullName: formData.fullName,
//         email: formData.email,
//         phone: formData.phone,
//         gender: formData.gender,
//         birthDate: formData.birthDate,
//         career: formData.career,
//         role: user.role?.roleName 
//       };

//       await userAPI.updateProfile(user.userID, dataToSend);
      
//       // --- THAY ĐỔI Ở ĐÂY: MƯỢT HƠN ---
//       // 1. Gọi hàm cập nhật dữ liệu cha ngay lập tức
//       if (onUserUpdated) onUserUpdated(); 
      
//       // 2. Đóng Modal NGAY LẬP TỨC (Không chờ đợi)
//       onClose();

//     } catch (err) {
//       // Xử lý lỗi thì vẫn giữ lại để người dùng biết sai chỗ nào
//       const data = err.response?.data;
//       let errorMessage = 'Cập nhật thất bại.';

//       if (Array.isArray(data) && data.length > 0) {
//         errorMessage = data.map(item => item.message).join(' - ');
//       } else if (data && data.message) {
//         errorMessage = data.message;
//       } else if (typeof data === 'string') {
//         errorMessage = data;
//       }

//       setError(errorMessage); // Hiện chữ đỏ ngay trong form
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
//         <div className="modal-header">
//           <h2>Hồ Sơ Cá Nhân</h2>
//           <button onClick={onClose} className="modal-close-btn">&times;</button>
//         </div>
        
//         <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
//            {/* Hiển thị lỗi text đỏ thay vì Toast lỗi để user dễ sửa */}
//            {error && <div className="modal-error" style={{color: '#e74c3c', backgroundColor: '#fdecec', padding: '10px', margin: '10px 20px', borderRadius: '5px', textAlign: 'center', border: '1px solid #fadbd8'}}>{error}</div>}

//           <div className="modal-body form-grid" style={{ overflowY: 'auto', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            
//             <div className="form-group">
//               <label>Họ và Tên</label>
//               <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
//             </div>

//             <div className="form-group">
//               <label>Số điện thoại</label>
//               <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
//             </div>

//             <div className="form-group">
//               <label>Giới tính</label>
//               <select name="gender" value={formData.gender} onChange={handleChange}>
//                 <option value="">Chọn giới tính</option>
//                 <option value="Nam">Nam</option>
//                 <option value="Nữ">Nữ</option>
//                 <option value="Khác">Khác</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Ngày sinh</label>
//               <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
//             </div>

//           </div>

//           <div className="modal-footer">
//             <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Đóng</button>
//             <button type="submit" className="btn-primary" disabled={loading}>
//                 {loading ? 'Đang lưu...' : 'Lưu hồ sơ'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StudentProfileModal;


import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/apiService';
import '../styles/Modal.css';

const StudentProfileModal = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '', 
    phone: '',
    gender: '',
    birthDate: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (user) {
      setApiError(null);
      setFieldErrors({}); 
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '', 
        phone: user.phone || '',
        gender: user.gender || '',
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
      });
    }
  }, [user]);

  const validateField = (name, value) => {
    let error = "";
    if (name === 'fullName') {
      if (!value || !value.trim()) {
        error = "Họ tên không được để trống";
      } else if (value.trim().length < 8) {
        error = "Ít nhất 8 ký tự";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
       const error = validateField(name, value);
       setFieldErrors(prev => ({...prev, [name]: error}));
    }

    if (apiError) setApiError(null);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors(prev => ({...prev, [name]: error}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);

    const fullNameError = validateField('fullName', formData.fullName);
    
    if (fullNameError) {
      setFieldErrors(prev => ({...prev, fullName: fullNameError}));
      setLoading(false);
      return;
    }

    try {
      // 👇 LOGIC CHUYỂN ĐỔI: Rỗng ("") -> null
      // Backend sẽ nhận được null thay vì chuỗi trống
      const dataToSend = {
        fullName: formData.fullName, // Trường này đã validate không rỗng
        email: formData.email || null,
        phone: formData.phone || null,
        gender: formData.gender || null,
        birthDate: formData.birthDate || null,
        role: user.role?.roleName 
      };

      console.log("Sending data:", dataToSend); // Log để kiểm tra

      await userAPI.updateProfile(user.userID, dataToSend);
      
      if (onUserUpdated) onUserUpdated(); 
      onClose();

    } catch (err) {
      console.log("Error Response:", err.response);
      
      const data = err.response?.data;
      let errorMessage = 'Cập nhật thất bại.';

      if (data) {
          if (data.code === 1013) {
             errorMessage = data.message || "Vai trò người dùng không hợp lệ.";
          } 
          else if (data.message) {
              errorMessage = data.message;
          }
          else if (typeof data === 'string') {
              errorMessage = data;
          }
          else if (Array.isArray(data) && data.length > 0) {
              errorMessage = data.map(item => item.message || item).join(' - ');
          }
      }

      setApiError(errorMessage); 
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <h2>Hồ Sơ Cá Nhân</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
           {apiError && <div className="modal-error" style={{
               color: '#e74c3c', 
               backgroundColor: '#fdecec', 
               padding: '10px', 
               margin: '10px 20px', 
               borderRadius: '5px', 
               textAlign: 'center', 
               border: '1px solid #fadbd8',
               fontWeight: 'bold'
           }}>
               ⚠️ {apiError}
           </div>}

          <div className="modal-body form-grid" style={{ overflowY: 'auto', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            
            <div className="form-group">
              <label>Họ và Tên <span style={{color:'red'}}>*</span></label>
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange}
                onBlur={handleBlur} 
                required 
                placeholder="Nhập tối thiểu 8 ký tự"
                style={fieldErrors.fullName ? { border: '1px solid #e74c3c' } : {}}
              />
              {fieldErrors.fullName && (
                <span style={{ color: '#e74c3c', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  {fieldErrors.fullName}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
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

          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Đóng</button>
            <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu hồ sơ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfileModal;