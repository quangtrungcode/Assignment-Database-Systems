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
import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';
import { userAPI } from '../services/apiService';
import Toast from './Toast'; // Đảm bảo bạn đã có component Toast

const CreateUserModal = ({ onClose, onUserCreated, roles }) => {
  // State quản lý dữ liệu Form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    gender: 'Nam',
    birthDate: '',
    // Tự động chọn role đầu tiên nếu có, hoặc để trống
    roleType: roles.length > 0 ? roles.find(r => r.name === 'student')?.name || roles[0].name : '', 
    major: '', 
    specialization: '', 
  });

  // Các State quản lý giao diện
  const [showPassword, setShowPassword] = useState(false); // Ẩn/Hiện mật khẩu
  const [loading, setLoading] = useState(false);           // Trạng thái loading nút bấm
  const [error, setError] = useState(null);                // Lỗi hiển thị trong form
  const [toast, setToast] = useState(null);                // Thông báo popup (Toast)

  // 1. Reset lỗi mỗi khi Modal được mở lên
  useEffect(() => {
    setError(null);
    setToast(null);
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 2. Tự động tắt thông báo lỗi đỏ ngay khi người dùng bắt đầu sửa lại
    if (error) setError(null);

    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      
      // Reset trường riêng nếu đổi Role
      if (name === 'roleType') {
        newState.major = value === 'student' ? '' : prev.major;
        newState.specialization = value === 'lecturers' ? '' : prev.specialization;
      }
      return newState;
    });
  };

  // Hàm bật tắt xem mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation phía Client
    const errors = {};
    if (!formData.fullName) errors.fullName = 'Họ Tên không được để trống.';
    if (!formData.email) errors.email = 'Email không được để trống.';
    if (!formData.password) errors.password = 'Mật khẩu không được để trống.';
    if (!formData.birthDate) errors.birthDate = 'Ngày sinh không được để trống.';
    if (!formData.roleType) errors.roleType = 'Vai trò không được để trống.';
    if (!formData.phone) errors.phone = 'Số điện thoại không được để trống.';

    if (formData.roleType === 'student' && !formData.major) {
      errors.major = 'Ngành học không được để trống.';
    }
    if (formData.roleType === 'lecturers' && !formData.specialization) {
      errors.specialization = 'Chuyên môn không được để trống.';
    }

    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]); 
      setLoading(false);
      return;
    }

    try {
      // Chuẩn bị dữ liệu gửi đi
      const dataToSend = {
        fullName: formData.fullName,
        email: formData.email,
        passwordHash: formData.password, 
        phone: formData.phone,
        gender: formData.gender,
        birthDate: formData.birthDate,
        roleType: formData.roleType,
      };
      
      if (formData.roleType === 'student') {
        dataToSend.career = formData.major;
      } else if (formData.roleType === 'lecturers') {
        dataToSend.profession = formData.specialization;
      }

      // Gọi API
      await userAPI.createUser(dataToSend);
      
      // 3. Xử lý thành công
      setToast({ message: 'Tạo người dùng thành công!', type: 'success' });
      onUserCreated(); 
      
      // Đợi 1.5 giây để người dùng đọc thông báo rồi mới đóng Modal
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      // 4. Xử lý lỗi (Logic thông minh bắt cả Array và Object)
      const data = err.response?.data;
      let errorMessage = 'Tạo người dùng thất bại. Vui lòng thử lại.';

      // Trường hợp trả về mảng lỗi: [{message: "Lỗi A"}, {message: "Lỗi B"}]
      if (Array.isArray(data) && data.length > 0) {
        errorMessage = data.map(item => item.message).join(' - ');
      } 
      // Trường hợp trả về object: {message: "Lỗi A"}
      else if (data && data.message) {
        errorMessage = data.message;
      }
      // Trường hợp trả về chuỗi
      else if (typeof data === 'string') {
        errorMessage = data;
      }

      setError(errorMessage); // Hiện chữ đỏ
      setToast({ message: errorMessage, type: 'error' }); // Hiện Toast popup
      
      // Tự tắt Toast sau 3 giây
      setTimeout(() => setToast(null), 3000);
      
      console.error('Create user error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      {/* Hiển thị Toast thông báo */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="modal-content">
        <div className="modal-header">
          <h2>Tạo người dùng mới</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Hiển thị lỗi chung ngay đầu form */}
          {error && <p className="modal-error" style={{color: '#e74c3c', textAlign: 'center', marginBottom: '15px'}}>{error}</p>}
          
          <div className="modal-body form-grid">
            <div className="form-group">
              <label>Họ Tên</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            {/* --- INPUT MẬT KHẨU CÓ ICON MẮT --- */}
            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="password-input-wrapper" style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  style={{ paddingRight: '40px' }} 
                />
                <span 
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center'
                  }}
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    // Icon Mắt Mở (SVG)
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    // Icon Mắt Đóng (SVG)
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </span>
              </div>
            </div>
            {/* --- KẾT THÚC INPUT MẬT KHẨU --- */}

            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required /> 
            </div>
            
            <div className="form-group">
              <label>Ngày sinh</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Giới tính</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            
            <div className="form-group form-group-span-2">
              <label>Vai trò</label>
              <select name="roleType" value={formData.roleType} onChange={handleChange} required>
                {roles.length === 0 && <option value="">Đang tải vai trò...</option>}
                {roles.map((role) => (
                  <option key={role.name} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hiển thị có điều kiện */}
            {formData.roleType === 'student' && (
              <div className="form-group form-group-span-2" style={{animation: 'fadeIn 0.3s'}}>
                <label>Ngành Học <span style={{color:'red'}}>*</span></label>
                <input type="text" name="major" value={formData.major} onChange={handleChange} required placeholder="Ví dụ: Công nghệ thông tin..." />
              </div>
            )}

            {formData.roleType === 'lecturers' && (
              <div className="form-group form-group-span-2" style={{animation: 'fadeIn 0.3s'}}>
                <label>Chuyên Môn <span style={{color:'red'}}>*</span></label>
                <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required placeholder="Ví dụ: Tiến sĩ Toán học..." />
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