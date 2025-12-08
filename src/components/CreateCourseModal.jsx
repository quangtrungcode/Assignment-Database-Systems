

import React, { useState } from 'react';
import '../styles/Modal.css';
import { courseAPI } from '../services/apiService';
import Toast from './Toast';

const CreateCourseModal = ({ onClose, onCourseCreated }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    credits: '',      
    maxCapacity: '',  
    semester: ''      
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

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

     
      const payload = {
          ...formData, 
          
          
          courseName: (!formData.courseName || formData.courseName.trim() === '') ? null : formData.courseName.trim(),

          
          credits: formData.credits === '' ? null : formData.credits,
          maxCapacity: formData.maxCapacity === '' ? null : formData.maxCapacity,
          semester: formData.semester === '' ? null : formData.semester,
      };

      console.log("Create Payload:", payload); 

      await courseAPI.create(payload);
      
      setToast({ message: 'Tạo khóa học thành công!', type: 'success' });
      
      setTimeout(() => {
        if (onCourseCreated) onCourseCreated();
        onClose();
      }, 1000);
      
    } catch (err) {
      let errorMsg = 'Tạo thất bại.';
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
          <h2>Tạo Khóa Học Mới</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            
            <div className="form-group">
              <label>Tên môn học</label>
              <input 
                  type="text" 
                  name="courseName" 
                  value={formData.courseName} 
                  onChange={handleChange} 
                  placeholder="VD: Cấu trúc dữ liệu" 
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
                      placeholder="VD: 241"
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
                {loading ? 'Đang tạo...' : 'Lưu lại'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseModal;