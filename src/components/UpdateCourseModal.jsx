// import React, { useState, useEffect } from 'react';
// import '../styles/Modal.css';
// import { courseAPI, userAPI } from '../services/apiService';
// import Toast from './Toast';

// // Nhận thêm props 'course' (dữ liệu khóa học cần sửa)
// const UpdateCourseModal = ({ course, onClose, onCourseUpdated }) => {
//   const [formData, setFormData] = useState({
//     courseName: '',
//     credits: 0,
//     maxCapacity: 0,
//     lecturerId: '', // ID của giảng viên phụ trách
//   });

//   const [lecturers, setLecturers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null); // Giữ lại Toast cho lỗi

//   // 1. Load dữ liệu khóa học cũ và danh sách giảng viên
//   useEffect(() => {
//     // Hàm tải danh sách giảng viên
//     const fetchLecturers = async () => {
//       try {
//         const res = await userAPI.getAllUsers();
//         const allUsers = res.data?.result || res.data || [];
//         const list = allUsers.filter(u => u.role?.name === 'Lecturer' || u.role?.name === 'lecturers');
//         setLecturers(list);
//       } catch (err) {
//         console.error("Lỗi lấy danh sách GV:", err);
//       }
//     };

//     // Điền dữ liệu khóa học cũ vào form
//     if (course) {
//       setFormData({
//         courseName: course.courseName || '',
//         credits: course.credits || 0,
//         maxCapacity: course.maxCapacity || 0,
//         lecturerId: course.lecturer?.id || '', // Lấy ID giảng viên cũ
//       });
//     }
    
//     fetchLecturers();
//   }, [course]); 

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     // Tắt toast khi người dùng bắt đầu nhập lại
//     if (toast) setToast(null);
    
//     const processedValue = (name === 'credits' || name === 'maxCapacity') 
//                            ? parseInt(value) || ''
//                            : value;
    
//     setFormData(prev => ({ ...prev, [name]: processedValue }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // ⚠️ VALIDATION: Kiểm tra cơ bản (nếu form không dùng HTML5 validation)
//       if (formData.credits <= 0 || formData.maxCapacity <= 0 || !formData.lecturerId) {
//            throw new Error("Vui lòng nhập đủ Tín chỉ, Sĩ số và chọn Giảng viên.");
//       }
      
//       // Gửi toàn bộ dữ liệu form (đã được sửa) lên API PUT
//       await courseAPI.update(course.courseID, formData);
      
//       // 👇 THAY ĐỔI: Đóng Modal NGAY LẬP TỨC và kích hoạt Refresh ở cha
//       if (onCourseUpdated) onCourseUpdated();
//       onClose(); // Đóng liền
      
//     } catch (err) {
//       // Xử lý lỗi (vẫn giữ lại Toast lỗi)
//       const msg = err.response?.data?.message || err.message || 'Cập nhật thất bại.';
//       setToast({ message: msg, type: 'error' });
      
//       // Tự tắt Toast lỗi sau 3s (để user đọc)
//       setTimeout(() => setToast(null), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       {/* Giữ Toast cho việc báo lỗi */}
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
//       <div className="modal-content" style={{ maxWidth: '500px' }}>
//         <div className="modal-header">
//           <h2>Cập nhật Khóa Học ({course?.courseID})</h2>
//           <button onClick={onClose} className="modal-close-btn">&times;</button>
//         </div>
        
//         <form onSubmit={handleSubmit}>
//           <div className="modal-body" style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            
//             <div className="form-group">
//               <label>Tên khóa học</label>
//               <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} required placeholder="VD: Lập trình Java" />
//             </div>

//             <div className="form-group" style={{display: 'flex', gap: '15px'}}>
//                <div style={{flex: 1}}>
//                   <label>Số tín chỉ</label>
//                   <input type="number" name="credits" value={formData.credits} onChange={handleChange} required min="1" />
//                </div>
//                <div style={{flex: 1}}>
//                   <label>Sĩ số tối đa</label>
//                   <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleChange} required min="10" />
//                </div>
//             </div>

//             <div className="form-group">
//               <label>Giảng viên phụ trách</label>
//               <select name="lecturerId" value={formData.lecturerId} onChange={handleChange} required>
//                 <option value="">-- Chọn giảng viên --</option>
//                 {lecturers.map(lect => (
//                   <option key={lect.userID} value={lect.userID}>
//                     {lect.fullName} 
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="modal-footer">
//             <button type="button" onClick={onClose} className="btn-cancel">Hủy</button>
//             <button type="submit" className="btn-primary" disabled={loading}>
//                 {loading ? 'Đang lưu...' : 'Lưu cập nhật'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateCourseModal;

// import React, { useState, useEffect } from 'react';
// import '../styles/Modal.css';
// import { courseAPI } from '../services/apiService';
// import Toast from './Toast';

// const UpdateCourseModal = ({ course, onClose, onCourseUpdated }) => {
//   // State chỉ chứa thông tin metadata của Course
//   const [formData, setFormData] = useState({
//     courseName: '',
//     credits: 0,
//     maxCapacity: 0
//   });

//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);

//   // --- LOAD DỮ LIỆU BAN ĐẦU ---
//   useEffect(() => {
//     if (course) {
//       setFormData({
//         courseName: course.courseName || '',
//         credits: course.credits || 0,
//         maxCapacity: course.maxCapacity || 0
//       });
//     }
//   }, [course]); 

//   // --- XỬ LÝ INPUT ---
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (toast) setToast(null);
    
//     // Chuyển đổi sang số nguyên nếu là credits hoặc maxCapacity
//     const val = (name === 'credits' || name === 'maxCapacity') 
//                 ? parseInt(value) || 0 
//                 : value;
    
//     setFormData(prev => ({ ...prev, [name]: val }));
//   };

//   // --- SUBMIT ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Validation
//       if (formData.credits <= 0 || formData.maxCapacity <= 0) {
//            throw new Error("Số tín chỉ và Sĩ số phải lớn hơn 0.");
//       }

//       // Payload chỉ chứa thông tin cần update
//       // Backend sẽ map vào Entity dựa trên courseId
//       const payload = {
//           ...formData
//       };

//       console.log("Update Payload:", payload);

//       // Gọi API Update (PUT /courses/{id})
//       await courseAPI.update(course.courseId, payload);
      
//       // Thông báo thành công & đóng modal
//       onCourseUpdated(); 
//       onClose(); 
      
//     } catch (err) {
//       const msg = err.response?.data?.message || err.message || 'Cập nhật thất bại.';
//       setToast({ message: msg, type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
//       <div className="modal-content" style={{ maxWidth: '500px' }}>
//         <div className="modal-header">
//           <h2>Cập nhật: {course?.courseName}</h2>
//           <button onClick={onClose} className="modal-close-btn">&times;</button>
//         </div>
        
//         <form onSubmit={handleSubmit}>
//           <div className="modal-body">
            
//             {/* Form nhập liệu đơn giản */}
//             <div className="form-group">
//               <label>Tên khóa học <span style={{color:'red'}}>*</span></label>
//               <input 
//                   type="text" 
//                   name="courseName" 
//                   value={formData.courseName} 
//                   onChange={handleChange} 
//                   required 
//               />
//             </div>

//             <div className="form-group" style={{display: 'flex', gap: '20px'}}>
//                <div style={{flex: 1}}>
//                   <label>Số tín chỉ</label>
//                   <input 
//                       type="number" 
//                       name="credits" 
//                       value={formData.credits} 
//                       onChange={handleChange} 
//                       required min="1" 
//                   />
//                </div>
//                <div style={{flex: 1}}>
//                   <label>Sĩ số tối đa</label>
//                   <input 
//                       type="number" 
//                       name="maxCapacity" 
//                       value={formData.maxCapacity} 
//                       onChange={handleChange} 
//                       required min="10" 
//                   />
//                </div>
//             </div>

//           </div>

//           <div className="modal-footer">
//             <button type="button" onClick={onClose} className="btn-cancel">Hủy</button>
//             <button type="submit" className="btn-primary" disabled={loading}>
//                 {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateCourseModal;

import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';
import { courseAPI } from '../services/apiService';
import Toast from './Toast';

const UpdateCourseModal = ({ course, onClose, onCourseUpdated }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    credits: '',
    maxCapacity: '',
    semester: '' 
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (course) {
      setFormData({
        courseName: course.courseName || '',
        // Nếu backend trả về 0 hoặc null, hiển thị rỗng để user dễ sửa
        credits: (course.credits === 0 || course.credits === null) ? '' : course.credits,
        maxCapacity: (course.maxCapacity === 0 || course.maxCapacity === null) ? '' : course.maxCapacity,
        semester: (course.semester === 0 || course.semester === null) ? '' : course.semester
      });
    }
  }, [course]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (toast) setToast(null);
    
    const val = (name === 'credits' || name === 'maxCapacity' || name === 'semester') 
                ? (value === '' ? '' : parseInt(value)) 
                : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.credits !== '' && formData.credits <= 0) {
           throw new Error("Số tín chỉ phải lớn hơn 0.");
      }
      if (formData.maxCapacity !== '' && formData.maxCapacity < 10) {
           throw new Error("Sĩ số tối đa phải lớn hơn 9.");
      }
      if (formData.semester !== '' && formData.semester <= 0) {
           throw new Error("Học kỳ phải lớn hơn 0.");
      }

      // 2. CHUẨN BỊ PAYLOAD (SỬA Ở ĐÂY)
      const payload = {
          ...formData,
          
          // 👇 THÊM DÒNG NÀY
          courseName: (!formData.courseName || formData.courseName.trim() === '') ? null : formData.courseName.trim(),

          credits: formData.credits === '' ? null : formData.credits,
          maxCapacity: formData.maxCapacity === '' ? null : formData.maxCapacity,
          semester: formData.semester === '' ? null : formData.semester,
      };
      console.log("Update Payload:", payload);

      await courseAPI.update(course.courseId, payload);
      
      onCourseUpdated(); 
      onClose(); 
      
    } catch (err) {
      let errorMsg = 'Cập nhật thất bại.';
      if (err.response && err.response.data) {
          const { message } = err.response.data;
          if (Array.isArray(message)) {
              errorMsg = message.join('\n');
          } else if (message) {
              errorMsg = message;
          }
      } else if (err.message) {
          errorMsg = err.message;
      }
      setToast({ message: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>Cập nhật: {course?.courseName}</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            
            <div className="form-group">
              <label>Tên khóa học</label>
              <input 
                  type="text" 
                  name="courseName" 
                  value={formData.courseName} 
                  onChange={handleChange} 
              />
            </div>

            <div className="form-group" style={{display: 'flex', gap: '20px'}}>
               <div style={{flex: 1}}>
                  <label>Học kỳ</label>
                  <input 
                      type="number" 
                      name="semester" 
                      value={formData.semester} 
                      onChange={handleChange} 
                  />
               </div>
               <div style={{flex: 1}}>
                  <label>Số tín chỉ</label>
                  <input 
                      type="number" 
                      name="credits" 
                      value={formData.credits} 
                      onChange={handleChange} 
                      min="1" 
                  />
               </div>
               <div style={{flex: 1}}>
                  <label>Sĩ số tối đa</label>
                  <input 
                      type="number" 
                      name="maxCapacity" 
                      value={formData.maxCapacity} 
                      onChange={handleChange} 
                      min="10" 
                  />
               </div>
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">Hủy</button>
            <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourseModal;