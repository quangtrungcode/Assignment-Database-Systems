

import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrashAlt, FaFilter, FaRedo, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { courseAPI } from '../services/apiService';
import CreateCourseModal from '../components/CreateCourseModal'; 
import UpdateCourseModal from '../components/UpdateCourseModal'; 
import ConfirmationModal from '../components/ConfirmationModal'; 
import Toast from '../components/Toast'; 


import { io } from 'socket.io-client';

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
 
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    keyword: '',       
    semester: '',      
    credits: '',       
    maxCapacity: '',   
    lecturerName: ''   
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); 
  const [courseToEdit, setCourseToEdit] = useState(null); 
  const [courseToDelete, setCourseToDelete] = useState(null); 
  const [toast, setToast] = useState(null); 

  const fetchCourses = async () => {
    
    try {
      const res = await courseAPI.getAll();
      setCourses(res.data.result || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách khóa học:", error);
      
      if(loading) setToast({ message: 'Lỗi tải dữ liệu', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  
  useEffect(() => {
   
    const socket = io('http://localhost:8085');

    
    socket.on('STUDENT_CANCEL_COURSE', (data) => {
        console.log('Real-time: Có sinh viên hủy môn. UserID:', data);
        fetchCourses(); 
        setToast({ message: 'Dữ liệu vừa được cập nhật (Có sinh viên hủy môn)', type: 'info' });
    });

   
    socket.on('STUDENT_REGISTER_COURSE', (data) => {
        console.log('Real-time: Có sinh viên đăng ký môn. UserID:', data);
        fetchCourses(); 
        setToast({ message: 'Dữ liệu vừa được cập nhật (Có sinh viên đăng ký mới)', type: 'info' });
    });

    socket.on('CANCEL_TEACHING', (data) => {
        console.log('Real-time: Có giảng viên hủy môn. UserID:', data);
        fetchCourses(); 
        setToast({ message: 'Dữ liệu vừa được cập nhật (Có giảng viên hủy môn)', type: 'info' });
    });

    
    socket.on('REGISTER_TEACHING', (data) => {
        console.log('Real-time: Có giảng viên đăng ký môn. UserID:', data);
        fetchCourses(); 
        setToast({ message: 'Dữ liệu vừa được cập nhật (Có giảng viên đăng ký mới)', type: 'info' });
    });

   
    return () => {
        socket.disconnect();
    };
  }, []); 

  
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({ 
        keyword: '', 
        semester: '', 
        credits: '', 
        maxCapacity: '', 
        lecturerName: '' 
    });
  };

  
  const filteredCourses = courses.filter(course => {
    const cName = (course.courseName || '').toLowerCase();
    const cId = (course.courseId || '').toLowerCase();
    const cSem = (course.semester || '').toString();
    const cCred = (course.credits || '').toString();
    const cCap = (course.maxCapacity || '').toString(); 
    const cLect = (course.lecturerName || '').toLowerCase(); 

    const filterKeyword = filters.keyword.toLowerCase();
    const filterSem = filters.semester.toString();
    const filterCred = filters.credits.toString();
    const filterCap = filters.maxCapacity.toString(); 
    const filterLect = filters.lecturerName.toLowerCase(); 

    const matchKeyword = cName.includes(filterKeyword) || cId.includes(filterKeyword);
    const matchSemester = filterSem === '' || cSem.includes(filterSem);
    const matchCredits = filterCred === '' || cCred.includes(filterCred);
    const matchCapacity = filterCap === '' || cCap.includes(filterCap); 
    const matchLecturer = filterLect === '' || cLect.includes(filterLect); 

    return matchKeyword && matchSemester && matchCredits && matchCapacity && matchLecturer;
  });

  
  const handleUpdateSuccess = () => {
      setCourseToEdit(null);
      fetchCourses();
      setToast({ message: "Cập nhật khóa học thành công!", type: 'success' });
  }

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    try {
        await courseAPI.delete(courseToDelete.courseId);
        setToast({ message: `Đã xóa khóa học ${courseToDelete.courseId} thành công!`, type: 'success' });
        fetchCourses();
    } catch (error) {
        let msg = 'Xóa thất bại! Vui lòng kiểm tra lại.';
        if (error.response?.data?.message) {
             const m = error.response.data.message;
             msg = Array.isArray(m) ? m.join('\n') : m;
        }
        setToast({ message: msg, type: 'error' });
    } finally {
        setCourseToDelete(null);
    }
  };

  return (
    <div className="page-container" style={{padding: '20px'}}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
         <h2 style={{color: '#333'}}>Quản Lý Khóa Học</h2>
         <div style={{ display: 'flex', gap: '10px' }}>
            <button 
                className="btn-secondary" 
                onClick={() => setShowFilter(!showFilter)}
                style={{ 
                    display: 'flex', alignItems: 'center', gap: '5px', 
                    border: '1px solid #ddd', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer',
                    backgroundColor: '#fff', color: '#555'
                }}
            >
                <FaFilter /> {showFilter ? 'Ẩn bộ lọc' : 'Lọc danh sách'} {showFilter ? <FaChevronUp/> : <FaChevronDown/>}
            </button>
            <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>+ Tạo khóa học mới</button>
         </div>
      </div>

      {/*  */}
      {showFilter && (
        <div className="filter-bar" style={{ 
            marginBottom: '20px', 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            alignItems: 'flex-end',
            animation: 'fadeIn 0.3s'
        }}>
            {/*  */}
            <div style={{ flex: 2, minWidth: '200px' }}>
                <label style={{fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Tìm kiếm chung</label>
                <input 
                    type="text" 
                    placeholder="Mã hoặc Tên môn..." 
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    style={{ width: '100%', marginTop: '5px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            
            <div style={{ flex: 1, minWidth: '100px' }}>
                <label style={{fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Học kỳ</label>
                <input 
                    type="number" 
                    placeholder="VD: 241" 
                    value={filters.semester}
                    onChange={(e) => handleFilterChange('semester', e.target.value)}
                    style={{ width: '100%', marginTop: '5px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>

            <div style={{ flex: 1, minWidth: '80px' }}>
                <label style={{fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Tín chỉ</label>
                <input 
                    type="number" 
                    placeholder="VD: 3" 
                    value={filters.credits}
                    onChange={(e) => handleFilterChange('credits', e.target.value)}
                    style={{ width: '100%', marginTop: '5px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>

            <div style={{ flex: 1, minWidth: '80px' }}>
                <label style={{fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Sĩ số</label>
                <input 
                    type="number" 
                    placeholder="VD: 60" 
                    value={filters.maxCapacity}
                    onChange={(e) => handleFilterChange('maxCapacity', e.target.value)}
                    style={{ width: '100%', marginTop: '5px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>

            <div style={{ flex: 2, minWidth: '150px' }}>
                <label style={{fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Giảng viên</label>
                <input 
                    type="text" 
                    placeholder="Tìm tên giảng viên..." 
                    value={filters.lecturerName}
                    onChange={(e) => handleFilterChange('lecturerName', e.target.value)}
                    style={{ width: '100%', marginTop: '5px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>

            <button 
                onClick={resetFilters}
                style={{ 
                    height: '35px', padding: '0 15px', display: 'flex', alignItems: 'center', gap: '5px',
                    border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff'
                }}
                title="Xóa bộ lọc"
            >
                <FaRedo /> Reset
            </button>
        </div>
      )}

      {loading ? <p>Đang tải dữ liệu...</p> : (
        <div className="table-container">
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{padding: '12px'}}>Mã KH</th>
                <th>Tên Khóa Học</th>
                <th>Học kỳ</th>
                <th>Tín chỉ</th>
                <th>Sĩ số</th>
                <th>Giảng viên</th>
                <th style={{textAlign: 'center'}}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                  filteredCourses.map(course => (
                    <tr key={course.courseId} className="hover-row">
                      <td style={{padding: '12px'}}>{course.courseId}</td>
                      
                      <td style={{fontWeight: 'bold', color: '#0369a1'}}>
                          {course.courseName}
                      </td>

                      <td style={{textAlign: 'center'}}>
                          {(course.semester && course.semester > 0) ? course.semester : '-'}
                      </td>
                      
                      <td style={{textAlign: 'center'}}>{course.credits}</td>
                      
                      <td>
                          <span style={{
                              color: (course.currentEnrollment || 0) >= course.maxCapacity ? '#e74c3c' : '#27ae60',
                              fontWeight: 'bold'
                          }}>
                              {course.currentEnrollment || 0}
                          </span> 
                          / {course.maxCapacity}
                      </td>
                      
                      <td>
                          {course.lecturerName || 'Chưa phân công'}
                      </td>
                      
                      <td style={{textAlign: 'center'}}>
                         <div style={{display: 'flex', justifyContent: 'center', gap: '8px'}}>
                             <button 
                                 className="btn-action btn-edit" 
                                 onClick={() => setCourseToEdit(course)}
                                 title="Sửa"
                             >
                                 <FaPencilAlt />
                             </button>
                             <button 
                                 className="btn-action btn-delete" 
                                 onClick={() => setCourseToDelete(course)}
                                 title="Xóa"
                             >
                                 <FaTrashAlt />
                             </button>
                         </div>
                      </td>
                    </tr>
                  ))
              ) : (
                  <tr>
                      <td colSpan="7" style={{textAlign: 'center', padding: '30px', color: '#888'}}>
                          {courses.length === 0 ? 'Chưa có khóa học nào.' : 'Không tìm thấy kết quả phù hợp.'}
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/*  */}
      {isCreateModalOpen && (
        <CreateCourseModal 
            onClose={() => setIsCreateModalOpen(false)} 
            onCourseCreated={fetchCourses} 
        />
      )}
      
      {courseToEdit && (
          <UpdateCourseModal 
              course={courseToEdit}
              onClose={() => setCourseToEdit(null)} 
              onCourseUpdated={handleUpdateSuccess} 
          />
      )}
      
      {courseToDelete && (
          <ConfirmationModal
              isOpen={true}
              onClose={() => setCourseToDelete(null)}
              onConfirm={handleDeleteConfirm}
              title="Xác nhận Xóa"
              message={`Bạn có chắc chắn muốn xóa khóa học "${courseToDelete.courseName}"?`}
          />
      )}
    </div>
  );
};

export default CourseManagementPage;

