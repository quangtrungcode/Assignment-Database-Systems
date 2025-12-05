// import { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../styles/Auth.css';
// import { authAPI } from '../services/apiService';
// import Toast from './Toast';

// // Updated error map based on backend definitions
// const ERROR_MESSAGES = {
//   9999: "Lỗi không xác định",
//   1002: "Tên đăng nhập đã tồn tại",
//   1004: "Email đã tồn tại",
//   1003: "Người dùng không tồn tại",
//   1005: "Mật khẩu phải có ít nhất 8 ký tự",
//   1006: "Họ và tên phải có ít nhất 8 ký tự",
//   1007: "Email không được để trống",
//   1008: "Họ và tên không được để trống",
//   1009: "Mật khẩu không được để trống",
//   1010: "Chưa xác thực",
//   1011: "Bạn không có quyền truy cập",
//   1012: "Quyền hạn không tồn tại",
//   1013: "Vai trò không tồn tại",
//   1014: "Không thể xóa vì tài nguyên đang được tham chiếu",
// };

// function Register() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     passwordHash: '',
//     confirmPassword: '',
//     fullName: '',
//     gender: '',
//     phone: '',
//     birthDate: '',
//     roleType: 'student',
//     major: '', // New field for student
//     specialization: '', // New field for lecturer
//   });

//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({}); // Track interacted fields for real-time validation
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const isSubmitting = useRef(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     // As user types, clear any existing error for that field
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: null }));
//     }
    
//     // Clear major/specialization if roleType changes
//     if (name === 'roleType') {
//       setFormData(prev => ({
//         ...prev,
//         roleType: value,
//         major: value === 'Student' ? prev.major : '',
//         specialization: value === 'Lecturer' ? prev.specialization : '',
//       }));
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     let error = null;

//     // Perform client-side validation for the specific field that was blurred
//     switch (name) {
//       case 'fullName':
//         if (!value.trim()) error = ERROR_MESSAGES[1008];
//         else if (value.trim().length < 8) error = ERROR_MESSAGES[1006];
//         break;
//       case 'email':
//         if (!value.trim()) error = ERROR_MESSAGES[1007];
//         else if (!/\S+@\S+\.\S+/.test(value)) error = "Địa chỉ email không hợp lệ";
//         break;
//       case 'passwordHash':
//         if (!value) error = ERROR_MESSAGES[1009];
//         else if (value.length < 8) error = ERROR_MESSAGES[1005];
//         break;
//       case 'confirmPassword':
//         if (formData.passwordHash !== value) error = "Mật khẩu xác nhận không khớp";
//         break;
//       case 'major':
//         if (formData.roleType === 'Student' && !value.trim()) error = "Ngành học không được để trống";
//         break;
//       case 'specialization':
//         if (formData.roleType === 'Lecturer' && !value.trim()) error = "Chuyên môn không được để trống";
//         break;
//       default:
//         break;
//     }
//     setErrors(prev => ({ ...prev, [name]: error }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isSubmitting.current) return;
//     isSubmitting.current = true;


//     // 1. Run a final, complete validation check
//     const finalErrors = {};
//     if (!formData.fullName.trim()) finalErrors.fullName = ERROR_MESSAGES[1008];
//     else if (formData.fullName.trim().length < 8) finalErrors.fullName = ERROR_MESSAGES[1006];
//     if (!formData.email.trim()) finalErrors.email = ERROR_MESSAGES[1007];
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) finalErrors.email = "Địa chỉ email không hợp lệ";
//     if (!formData.passwordHash) finalErrors.passwordHash = ERROR_MESSAGES[1009];
//     else if (formData.passwordHash.length < 8) finalErrors.passwordHash = ERROR_MESSAGES[1005];
//     if (formData.passwordHash !== formData.confirmPassword) finalErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    
//     // Add validation for new fields
//     if (formData.roleType === 'Student' && !formData.major.trim()) {
//       finalErrors.major = "Ngành học không được để trống";
//     }
//     if (formData.roleType === 'Lecturer' && !formData.specialization.trim()) {
//       finalErrors.specialization = "Chuyên môn không được để trống";
//     }

//     setErrors(finalErrors);
//     setTouched({ 
//       fullName: true, 
//       email: true, 
//       passwordHash: true, 
//       confirmPassword: true,
//       major: true,
//       specialization: true,
//     });

//     if (Object.keys(finalErrors).length > 0) {
//       setToast({ message: "Vui lòng kiểm tra lại các lỗi trong form.", type: 'error' });
//       isSubmitting.current = false;
//       return;
//     }

//     setLoading(true);
//     setToast(null);

//     try {
//       const payload = {
//         email: formData.email,
//         passwordHash: formData.passwordHash,
//         fullName: formData.fullName,
//         gender: formData.gender || null,
//         phone: formData.phone || null,
//         birthDate: formData.birthDate || null,
//         roleType: formData.roleType,
//       };

//       if (formData.roleType === 'Student') {
//         payload.major = formData.major;
//       } else if (formData.roleType === 'Lecturer') {
//         payload.specialization = formData.specialization;
//       }

//       await authAPI.register(payload);

//       setToast({
//         message: 'Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.',
//         type: 'success',
//       });

//       setTimeout(() => navigate('/login'), 2000);

//     } catch (error) {
//       console.error('Register error:', error);
//       const apiError = error.response?.data;
      
//       const newServerErrors = {};
//       const generalMessages = [];

//       const processError = (err) => {
//         if (typeof err !== 'object' || err === null) return;
//         const message = err.message || ERROR_MESSAGES[err.code];
//         if (!message) return;

//         switch (err.code) {
//           case 1004: case 1007: case 1015:
//             newServerErrors.email = message; 
//             break;
//           case 1002: case 1006: case 1008:
//             newServerErrors.fullName = message; 
//             break;
//           case 1005: case 1009:
//             newServerErrors.passwordHash = message; 
//             break;
//           default: 
//             generalMessages.push(message); 
//             break;
//         }
//       };

//       if (Array.isArray(apiError)) apiError.forEach(processError);
//       else if (typeof apiError === 'object' && apiError !== null) processError(apiError);
//       else generalMessages.push(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');

//       const allMessages = [...Object.values(newServerErrors), ...generalMessages];

//       if (Object.keys(newServerErrors).length > 0) {
//         setErrors(prev => ({ ...prev, ...newServerErrors }));
//       }
//       if (allMessages.length > 0) {
//         setToast({ message: allMessages.join('; '), type: 'error' });
//       }
//     } finally {
//       setLoading(false); // Always release loading state
//       isSubmitting.current = false;
//     }
//   };

//   return (
//     <div className="auth-container">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <div className="auth-card">
//         <h1>Đăng Ký</h1>
//         <form onSubmit={handleSubmit} noValidate>
//           <div className="form-group">
//             <label htmlFor="fullName">Họ và Tên</label>
//             <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} disabled={loading} required minLength="8" placeholder="Ít nhất 8 ký tự" />
//             {errors.fullName && <span className="error-message">{errors.fullName}</span>}
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} disabled={loading} required placeholder="vi_du@email.com" />
//             {errors.email && <span className="error-message">{errors.email}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="passwordHash">Mật Khẩu</label>
//             <div className="password-group">
//               <input type={showPassword ? 'text' : 'password'} id="passwordHash" name="passwordHash" value={formData.passwordHash} onChange={handleChange} onBlur={handleBlur} disabled={loading} required minLength="8" placeholder="Ít nhất 8 ký tự" />
//               <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
//                 {showPassword ? '👁️‍🗨️' : '👁️'}
//               </button>
//             </div>
//             {errors.passwordHash && <span className="error-message">{errors.passwordHash}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</label>
//             <div className="password-group">
//               <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} disabled={loading} required />
//                <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}>
//                 {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
//               </button>
//             </div>
//             {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="gender">Giới Tính</label>
//             <select id="gender" name="gender" value={formData.gender} onChange={handleChange} onBlur={handleBlur} disabled={loading}>
//               <option value="">-- Chọn giới tính --</option>
//               <option value="MALE">Nam</option>
//               <option value="FEMALE">Nữ</option>
//               <option value="OTHER">Khác</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="phone">Số Điện Thoại</label>
//             <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} disabled={loading} />
//           </div>
//           <div className="form-group">
//             <label htmlFor="birthDate">Ngày Sinh</label>
//             <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} onBlur={handleBlur} disabled={loading} />
//           </div>

//           <div className="form-group">
//             <label htmlFor="roleType">Vai Trò</label>
//             <select id="roleType" name="roleType" value={formData.roleType} onChange={handleChange} onBlur={handleBlur} disabled={loading}>
//               <option value="Student">Sinh viên</option>
//               <option value="Lecturer">Giảng viên</option>
//             </select>
//           </div>

//           {formData.roleType === 'Student' && (
//             <div className="form-group">
//               <label htmlFor="major">Ngành Học</label>
//               <input type="text" id="major" name="major" value={formData.major} onChange={handleChange} onBlur={handleBlur} disabled={loading} required placeholder="Ví dụ: Công nghệ thông tin" />
//               {errors.major && <span className="error-message">{errors.major}</span>}
//             </div>
//           )}

//           {formData.roleType === 'Lecturer' && (
//             <div className="form-group">
//               <label htmlFor="specialization">Chuyên Môn</label>
//               <input type="text" id="specialization" name="specialization" value={formData.specialization} onChange={handleChange} onBlur={handleBlur} disabled={loading} required placeholder="Ví dụ: Lập trình Web, Trí tuệ nhân tạo" />
//               {errors.specialization && <span className="error-message">{errors.specialization}</span>}
//             </div>
//           )}

//           <button type="submit" className="btn-submit" disabled={loading}>
//             {loading ? 'Đang xử lý...' : 'Đăng Ký'}
//           </button>
//         </form>
//         <p className="auth-link">
//           Đã có tài khoản?{' '}
//           <Link to="/login" className="btn-switch">
//             Đăng nhập tại đây
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Register;

// import { useState, useRef } from 'react'; // Bỏ useEffect nếu không dùng
// import { Link, useNavigate } from 'react-router-dom';
// import '../styles/Auth.css';
// import { authAPI } from '../services/apiService';
// import Toast from './Toast';

// function Register() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     passwordHash: '',
//     confirmPassword: '',
//     fullName: '',
//     gender: '',
//     phone: '',
//     birthDate: '',
//     roleType: 'Student', // Sửa mặc định khớp với value option (Student/Lecturer)
//     major: '', 
//     specialization: '', 
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const isSubmitting = useRef(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     // Xóa lỗi của trường đang nhập
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

//   // Validation phía Client (Cơ bản)
//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     let error = null;

//     switch (name) {
//       case 'fullName':
//         if (!value.trim()) error = "Họ và tên không được để trống";
//         else if (value.trim().length < 8) error = "Họ và tên phải có ít nhất 8 ký tự";
//         break;
//       case 'email':
//         if (!value.trim()) error = "Email không được để trống";
//         else if (!/\S+@\S+\.\S+/.test(value)) error = "Địa chỉ email không hợp lệ";
//         break;
//       case 'passwordHash':
//         if (!value) error = "Mật khẩu không được để trống";
//         else if (value.length < 8) error = "Mật khẩu phải có ít nhất 8 ký tự";
//         break;
//       case 'confirmPassword':
//         if (formData.passwordHash !== value) error = "Mật khẩu xác nhận không khớp";
//         break;
//       case 'major':
//         if (formData.roleType === 'Student' && !value.trim()) error = "Ngành học không được để trống";
//         break;
//       case 'specialization':
//         if (formData.roleType === 'Lecturer' && !value.trim()) error = "Chuyên môn không được để trống";
//         break;
//       default:
//         break;
//     }
//     setErrors(prev => ({ ...prev, [name]: error }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isSubmitting.current) return;
//     isSubmitting.current = true;

//     // 1. Validation cuối cùng trước khi gửi (Client side)
//     const finalErrors = {};
//     if (!formData.fullName.trim()) finalErrors.fullName = "Họ và tên không được để trống";
//     else if (formData.fullName.trim().length < 8) finalErrors.fullName = "Họ và tên phải có ít nhất 8 ký tự";
    
//     if (!formData.email.trim()) finalErrors.email = "Email không được để trống";
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) finalErrors.email = "Địa chỉ email không hợp lệ";
    
//     if (!formData.passwordHash) finalErrors.passwordHash = "Mật khẩu không được để trống";
//     else if (formData.passwordHash.length < 8) finalErrors.passwordHash = "Mật khẩu phải có ít nhất 8 ký tự";
    
//     if (formData.passwordHash !== formData.confirmPassword) finalErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    
//     if (formData.roleType === 'Student' && !formData.major.trim()) {
//       finalErrors.major = "Ngành học không được để trống";
//     }
//     if (formData.roleType === 'Lecturer' && !formData.specialization.trim()) {
//       finalErrors.specialization = "Chuyên môn không được để trống";
//     }

//     setErrors(finalErrors);

//     if (Object.keys(finalErrors).length > 0) {
//       setToast({ message: "Vui lòng kiểm tra lại thông tin.", type: 'error' });
//       isSubmitting.current = false;
//       return;
//     }

//     setLoading(true);
//     setToast(null);

//     try {
//       const payload = {
//         email: formData.email,
//         passwordHash: formData.passwordHash,
//         fullName: formData.fullName,
//         gender: formData.gender || null,
//         phone: formData.phone || null,
//         birthDate: formData.birthDate || null,
//         roleType: formData.roleType,
//       };

//       if (formData.roleType === 'Student') {
//         payload.major = formData.major;
//       } else if (formData.roleType === 'Lecturer') {
//         payload.specialization = formData.specialization;
//       }

//       await authAPI.register(payload);

//       setToast({
//         message: 'Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.',
//         type: 'success',
//       });

//       setTimeout(() => navigate('/login'), 2000);

//     } catch (error) {
//       console.error('Register error:', error);
//       const apiError = error.response?.data;
      
//       const newServerErrors = {};
//       const generalMessages = [];

//       // 👇 HÀM XỬ LÝ LỖI MỚI: Dùng trực tiếp message từ Backend
//       const processError = (err) => {
//         if (!err || typeof err !== 'object') return;
        
//         // Lấy message trực tiếp từ backend
//         const backendMessage = err.message || "Lỗi không xác định từ hệ thống";
//         const errorCode = err.code;

//         // Dựa vào mã lỗi để biết hiển thị message này ở ô input nào
//         switch (errorCode) {
//           case 1004: // Email tồn tại
//           case 1007: // Email trống
//           case 1015: // Lỗi email khác
//             newServerErrors.email = backendMessage; 
//             break;

//           case 1002: // Tên đăng nhập tồn tại (thường là username/email)
//           case 1006: // Độ dài tên
//           case 1008: // Tên trống
//             newServerErrors.fullName = backendMessage; 
//             break;

//           case 1005: // Độ dài mật khẩu
//           case 1009: // Mật khẩu trống
//             newServerErrors.passwordHash = backendMessage; 
//             break;
            
//           default: 
//             // Các lỗi khác (1010, 1011, 9999...) hiển thị ra Toast
//             generalMessages.push(backendMessage); 
//             break;
//         }
//       };

//       // Xử lý nếu backend trả về mảng lỗi hoặc 1 object lỗi đơn lẻ
//       if (Array.isArray(apiError)) {
//         apiError.forEach(processError);
//       } else if (typeof apiError === 'object' && apiError !== null) {
//         processError(apiError);
//       } else {
//         // Trường hợp backend chết hoặc trả về string thuần
//         generalMessages.push(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
//       }

//       // Cập nhật state lỗi để hiển thị đỏ dưới input
//       if (Object.keys(newServerErrors).length > 0) {
//         setErrors(prev => ({ ...prev, ...newServerErrors }));
//       }
      
//       // Cập nhật Toast nếu có lỗi chung
//       if (generalMessages.length > 0) {
//         setToast({ message: generalMessages.join('; '), type: 'error' });
//       }

//     } finally {
//       setLoading(false); 
//       isSubmitting.current = false;
//     }
//   };

//   return (
//     <div className="auth-container">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <div className="auth-card">
//         <h1>Đăng Ký</h1>
//         <form onSubmit={handleSubmit} noValidate>
//           <div className="form-group">
//             <label htmlFor="fullName">Họ và Tên</label>
//             <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} disabled={loading} required placeholder="Ít nhất 8 ký tự" />
//             {errors.fullName && <span className="error-message">{errors.fullName}</span>}
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} disabled={loading} required placeholder="vi_du@email.com" />
//             {errors.email && <span className="error-message">{errors.email}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="passwordHash">Mật Khẩu</label>
//             <div className="password-group">
//               <input type={showPassword ? 'text' : 'password'} id="passwordHash" name="passwordHash" value={formData.passwordHash} onChange={handleChange} onBlur={handleBlur} disabled={loading} required placeholder="Ít nhất 8 ký tự" />
//               <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
//                 {showPassword ? '👁️‍🗨️' : '👁️'}
//               </button>
//             </div>
//             {errors.passwordHash && <span className="error-message">{errors.passwordHash}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</label>
//             <div className="password-group">
//               <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} disabled={loading} required />
//                <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}>
//                 {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
//               </button>
//             </div>
//             {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="gender">Giới Tính</label>
//             <select id="gender" name="gender" value={formData.gender} onChange={handleChange} onBlur={handleBlur} disabled={loading}>
//               <option value="">-- Chọn giới tính --</option>
//               <option value="MALE">Nam</option>
//               <option value="FEMALE">Nữ</option>
//               <option value="OTHER">Khác</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="phone">Số Điện Thoại</label>
//             <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} disabled={loading} />
//           </div>
//           <div className="form-group">
//             <label htmlFor="birthDate">Ngày Sinh</label>
//             <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} onBlur={handleBlur} disabled={loading} />
//           </div>

//           <div className="form-group">
//             <label htmlFor="roleType">Vai Trò</label>
//             <select id="roleType" name="roleType" value={formData.roleType} onChange={handleChange} onBlur={handleBlur} disabled={loading}>
//               <option value="Student">Sinh viên</option>
//               <option value="Lecturer">Giảng viên</option>
//             </select>
//           </div>

//           {formData.roleType === 'Student' && (
//             <div className="form-group">
//               <label htmlFor="major">Ngành Học</label>
//               <input type="text" id="major" name="major" value={formData.major} onChange={handleChange} onBlur={handleBlur} disabled={loading} required placeholder="Ví dụ: Công nghệ thông tin" />
//               {errors.major && <span className="error-message">{errors.major}</span>}
//             </div>
//           )}

//           {formData.roleType === 'Lecturer' && (
//             <div className="form-group">
//               <label htmlFor="specialization">Chuyên Môn</label>
//               <input type="text" id="specialization" name="specialization" value={formData.specialization} onChange={handleChange} onBlur={handleBlur} disabled={loading} required placeholder="Ví dụ: Lập trình Web, Trí tuệ nhân tạo" />
//               {errors.specialization && <span className="error-message">{errors.specialization}</span>}
//             </div>
//           )}

//           <button type="submit" className="btn-submit" disabled={loading}>
//             {loading ? 'Đang xử lý...' : 'Đăng Ký'}
//           </button>
//         </form>
//         <p className="auth-link">
//           Đã có tài khoản?{' '}
//           <Link to="/login" className="btn-switch">
//             Đăng nhập tại đây
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Register;


import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { authAPI } from '../services/apiService';
import Toast from './Toast';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    passwordHash: '',
    confirmPassword: '',
    fullName: '',
    roleType: 'Student',
    gender: '',      // Không bắt buộc
    phone: '',       // Không bắt buộc
    birthDate: '',   // Không bắt buộc
    major: '',       
    specialization: '', 
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isSubmitting = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Xóa lỗi ngay khi người dùng nhập lại
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

  // --- VALIDATION FRONTEND (UX) ---
  // Chỉ kiểm tra những lỗi cơ bản để phản hồi nhanh cho người dùng
  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = null;

    switch (name) {
      case 'fullName':
        if (!value.trim()) error = "Họ tên không được để trống";
        else if (value.trim().length < 8) error = "Họ tên phải có ít nhất 8 ký tự";
        break;
      case 'email':
        // Dù Backend comment @NotBlank, nhưng đăng ký thường bắt buộc phải có Email
        if (!value.trim()) error = "Email không được để trống";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email không hợp lệ";
        break;
      case 'passwordHash':
        if (!value) error = "Mật khẩu không được để trống";
        else if (value.length < 8) error = "Mật khẩu phải có ít nhất 8 ký tự";
        break;
      case 'confirmPassword':
        if (formData.passwordHash !== value) error = "Mật khẩu xác nhận không khớp";
        break;
      case 'major':
        // Chỉ bắt lỗi nếu đang chọn Role là Student VÀ ô này bị trống
        if ( !value.trim()) {
            error = "Vui lòng nhập ngành học";
        }
        break;
      case 'specialization':
        // Chỉ bắt lỗi nếu đang chọn Role là Lecturer VÀ ô này bị trống
        if ( !value.trim()) {
            error = "Vui lòng nhập chuyên môn";
        }
        break;
      default:
         break; 
      // Các trường Optional (Phone, Gender...) không cần validate ở đây
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting.current) return;
    isSubmitting.current = true;

    // 1. CHỐT CHẶN FRONTEND: Kiểm tra các trường BẮT BUỘC trước khi gửi
    const finalErrors = {};
    if (!formData.fullName.trim()) finalErrors.fullName = "Bắt buộc nhập";
    else if (formData.fullName.length < 8) finalErrors.fullName = "Tối thiểu 8 ký tự";

    if (!formData.email.trim()) finalErrors.email = "Bắt buộc nhập";
    
    if (!formData.passwordHash) finalErrors.passwordHash = "Bắt buộc nhập";
    else if (formData.passwordHash.length < 8) finalErrors.passwordHash = "Tối thiểu 8 ký tự";
    
    if (formData.passwordHash !== formData.confirmPassword) finalErrors.confirmPassword = "Mật khẩu không khớp";
    
    // Logic nghiệp vụ (Ngành/Chuyên môn) - Tùy bạn quyết định có bắt buộc không
    // Ở đây tôi để bắt buộc vì UX tốt hơn
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
      // 2. CHUẨN BỊ PAYLOAD (Xử lý dữ liệu Optional)
      const payload = {
        email: formData.email,
        passwordHash: formData.passwordHash,
        fullName: formData.fullName,
        roleType: formData.roleType,
        // Nếu rỗng thì gửi null để Backend không bị lỗi format Date
        gender: formData.gender || null, 
        birthDate: formData.birthDate || null,
        // Backend là Set<String> phones -> Gửi mảng
        phones: formData.phone ? [formData.phone] : [], 
      };

      if (formData.roleType === 'Student') payload.career = formData.major;
      else if (formData.roleType === 'Lecturer') payload.profession = formData.specialization;

      // 3. GỌI API
      await authAPI.register(payload);

      setToast({ message: 'Đăng ký thành công! Đang chuyển hướng...', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);

    } catch (error) {
      console.error('Register error:', error);
      const apiError = error.response?.data;
      
      const newServerErrors = {};
      const generalMessages = []; // Danh sách thông báo sẽ hiện lên Toast

      const processError = (err) => {
        if (!err || typeof err !== 'object') return;
        
        const backendMessage = err.message; 
        const code = err.code; 

        // 👇 THAY ĐỔI Ở ĐÂY: 
        // Luôn luôn đẩy tin nhắn lỗi vào danh sách hiển thị Toast
        if (backendMessage) {
            generalMessages.push(backendMessage);
        }

        // Map mã lỗi vào ô Input tương ứng
        switch (code) {
          case 1004: // Email tồn tại
          case 1007: // Email trống
          case 1015: // Email sai format
            newServerErrors.email = backendMessage; 
            break;

          case 1002: // Username tồn tại
          case 1006: // Tên ngắn
          case 1008: // Tên trống
            newServerErrors.fullName = backendMessage; 
            break;

          case 1005: // Pass ngắn
          case 1009: // Pass trống
            newServerErrors.passwordHash = backendMessage; 
            break;
            
          default: 
            generalMessages.push(backendMessage); 
            break;
        }
      };

      if (Array.isArray(apiError)) apiError.forEach(processError);
      else if (typeof apiError === 'object' && apiError !== null) processError(apiError);
      else generalMessages.push(error.message || 'Lỗi kết nối server.');

      if (Object.keys(newServerErrors).length > 0) setErrors(prev => ({ ...prev, ...newServerErrors }));
      if (generalMessages.length > 0) setToast({ message: generalMessages.join('; '), type: 'error' });

    } finally {
      setLoading(false); 
      isSubmitting.current = false;
    }
  };

  return (
    <div className="auth-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="auth-card">
        <h1>Đăng Ký</h1>
        <form onSubmit={handleSubmit} noValidate>
          {/* --- BẮT BUỘC --- */}
          <div className="form-group">
            <label>Họ và Tên <span className="required">*</span></label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} disabled={loading} placeholder="Ít nhất 8 ký tự" />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <label>Email <span className="required">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} disabled={loading} />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Mật Khẩu <span className="required">*</span></label>
            <div className="password-group">
              <input type={showPassword ? 'text' : 'password'} name="passwordHash" value={formData.passwordHash} onChange={handleChange} onBlur={handleBlur} disabled={loading} placeholder="Ít nhất 8 ký tự" />
              <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            {errors.passwordHash && <span className="error-message">{errors.passwordHash}</span>}
          </div>

          <div className="form-group">
            <label>Xác Nhận Mật Khẩu <span className="required">*</span></label>
            <div className="password-group">
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} disabled={loading} />
               <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}>
                {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          
          {/* --- TÙY CHỌN (OPTIONAL) - KHÔNG CẦN REQUIRED --- */}
          <div className="form-group">
            <label>Giới Tính</label>
            <select name="gender" value={formData.gender} onChange={handleChange} disabled={loading}>
              <option value="">-- Chọn --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label>Số Điện Thoại</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={loading} />
          </div>

          <div className="form-group">
            <label>Ngày Sinh</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} disabled={loading} />
          </div>

          {/* --- Vai trò --- */}
          <div className="form-group">
            <label>Vai Trò</label>
            <select name="roleType" value={formData.roleType} onChange={handleChange} disabled={loading}>
              <option value="">-- Chọn --</option>
              <option value="Student">Sinh viên</option>
              <option value="Lecturer">Giảng viên</option>
            </select>
          </div>

          {formData.roleType === 'Student' && (
            <div className="form-group">
              <label>Ngành Học <span className="required">*</span></label>
              <input type="text" name="major" value={formData.major} onChange={handleChange} onBlur={handleBlur}  disabled={loading} required/>
              {errors.major && <span className="error-message">{errors.major}</span>}
            </div>
          )}

          {formData.roleType === 'Lecturer' && (
            <div className="form-group">
              <label>Chuyên Môn <span className="required">*</span></label>
              <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} onBlur={handleBlur} disabled={loading} />
              {errors.specialization && <span className="error-message">{errors.specialization}</span>}
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </form>
        <p className="auth-link">
          Đã có tài khoản?{' '}
          <Link to="/login" className="btn-switch">Đăng nhập tại đây</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
