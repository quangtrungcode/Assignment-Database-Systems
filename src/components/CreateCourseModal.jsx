import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';
import { courseAPI, userAPI } from '../services/apiService';
import Toast from './Toast';

const CreateCourseModal = ({ onClose, onCourseCreated }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    credits: 3,
    maxCapacity: 60,
    lecturerId: '', 
  });

  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Load danh sách giảng viên khi mở modal
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const res = await userAPI.getAllUsers();
        // Lọc lấy những người có role là 'lecturer' hoặc 'lecturers'
        const allUsers = res.data?.result || res.data || [];
        const list = allUsers.filter(u => u.role?.name === 'Lecturer' || u.role?.name === 'Lecturers');
        setLecturers(list);
        
        // Chọn mặc định người đầu tiên nếu có
        if (list.length > 0) {
            setFormData(prev => ({ ...prev, lecturerId: list[0].userID }));
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách GV:", err);
      }
    };
    fetchLecturers();
  }, []);

  // 👇 Sửa lại hàm handleChange để xử lý đúng kiểu dữ liệu số và xóa toast
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 1. Xóa Toast nếu người dùng bắt đầu gõ
    if (toast) setToast(null);

    // 2. Chuyển đổi giá trị thành số nguyên (Integer) nếu trường đó là số
    const processedValue = (name === 'credits' || name === 'maxCapacity') 
                           ? parseInt(value) || '' // Dùng parseInt, nếu không phải số thì để rỗng để tránh lỗi NaN
                           : value;
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ⚠️ VALIDATION: Kiểm tra trường số phải lớn hơn 0 trước khi gửi
      if (formData.credits <= 0 || formData.maxCapacity <= 0) {
           throw new Error("Số tín chỉ và Sĩ số tối đa phải lớn hơn 0.");
      }
      
      await courseAPI.create(formData);
      
      setToast({ message: 'Tạo khóa học thành công!', type: 'success' });
      
      setTimeout(() => {
        if (onCourseCreated) onCourseCreated();
        onClose();
      }, 1500);
      
    } catch (err) {
      // Bắt lỗi từ backend (hoặc lỗi validation tự tạo)
      const msg = err.response?.data?.message || err.message || 'Tạo thất bại. Vui lòng thử lại.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>Tạo Khóa Học Mới</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <div className="form-group">
              <label>Tên khóa học</label>
              <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} required placeholder="VD: Lập trình Java" />
            </div>

            <div className="form-group" style={{display: 'flex', gap: '15px'}}>
               <div style={{flex: 1}}>
                  <label>Số tín chỉ</label>
                  <input type="number" name="credits" value={formData.credits} onChange={handleChange} required min="1" />
               </div>
               <div style={{flex: 1}}>
                  <label>Sĩ số tối đa</label>
                  <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleChange} required min="10" />
               </div>
            </div>

            <div className="form-group">
              <label>Giảng viên phụ trách</label>
              <select name="lecturerId" value={formData.lecturerId} onChange={handleChange} required>
                <option value="">-- Chọn giảng viên --</option>
                {lecturers.map(lect => (
                  <option key={lect.userID} value={lect.userID}>
                    {lect.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">Hủy</button>
            <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang tạo...' : 'Tạo khóa học'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseModal;