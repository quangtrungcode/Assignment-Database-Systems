

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

      
      const payload = {
          ...formData,
          
         
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