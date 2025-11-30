// import React, { useState, useEffect } from 'react';
// import { courseAPI } from '../services/apiService';
// import CreateCourseModal from '../components/CreateCourseModal'; 

// const CourseManagementPage = () => {
//   const [courses, setCourses] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const fetchCourses = async () => {
//     try {
//       const res = await courseAPI.getAll();
//       setCourses(res.data.result || []);
//     } catch (error) {
//       console.error("Lỗi lấy danh sách khóa học:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   return (
//     <div className="page-container" style={{padding: '20px'}}>
//       <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
//          <h2 style={{color: '#333'}}>Quản Lý Khóa Học</h2>
//          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Tạo khóa học mới</button>
//       </div>

//       <div className="table-container">
//         <table>
//           <thead>
//             <tr>
//               <th>Mã KH</th>
//               <th>Tên Khóa Học</th>
//               <th>Tín chỉ</th>
//               <th>Sĩ số</th>
//               <th>Giảng viên</th>
//               <th>Hành động</th>
//             </tr>
//           </thead>
//           <tbody>
//             {courses.length > 0 ? (
//                 courses.map(course => (
//                   <tr key={course.courseID}>
//                     <td>{course.courseID}</td>
//                     <td style={{fontWeight: 'bold', color: '#0369a1'}}>{course.courseName}</td>
//                     <td>{course.credits}</td>
//                     {/* Hiển thị sĩ số: Hiện tại / Tối đa */}
//                     <td>
//                         <span style={{
//                             color: course.currentEnrollment >= course.maxCapacity ? 'red' : 'green',
//                             fontWeight: 'bold'
//                         }}>
//                             {course.currentEnrollment}
//                         </span> 
//                         / {course.maxCapacity}
//                     </td>
//                     <td>{course.lecturer?.fullName || 'Chưa phân công'}</td>
//                     <td>
//                        <button className="btn-action btn-edit">✏️</button>
//                        <button className="btn-action btn-delete">🗑️</button>
//                     </td>
//                   </tr>
//                 ))
//             ) : (
//                 <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Chưa có khóa học nào</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {isModalOpen && (
//         <CreateCourseModal 
//             onClose={() => setIsModalOpen(false)} 
//             onCourseCreated={fetchCourses} 
//         />
//       )}
//     </div>
//   );
// };

// export default CourseManagementPage;

import React, { useState, useEffect } from 'react';
import { courseAPI } from '../services/apiService';
import CreateCourseModal from '../components/CreateCourseModal'; 
import UpdateCourseModal from '../components/UpdateCourseModal'; // 👈 Import Modal sửa
import ConfirmationModal from '../components/ConfirmationModal'; // 👈 Import Modal xác nhận
import Toast from '../components/Toast'; // Giả sử bạn có Toast

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); 

  // Trạng thái cho việc Cập nhật
  const [courseToEdit, setCourseToEdit] = useState(null); 
  
  // Trạng thái cho việc Xóa
  const [courseToDelete, setCourseToDelete] = useState(null); 
  const [toast, setToast] = useState(null); 

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getAll();
      setCourses(res.data.result || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách khóa học:", error);
      setToast({ message: 'Không thể tải dữ liệu khóa học.', type: 'error' });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // -----------------------------------------------------
  // LOGIC SỬA (Update)
  // -----------------------------------------------------

  const handleUpdateSuccess = () => {
      setCourseToEdit(null); // Đóng modal sửa
      fetchCourses(); // Tải lại danh sách
      setToast({ message: "Cập nhật khóa học thành công!", type: 'success' });
  }

  // -----------------------------------------------------
  // LOGIC XÓA (Delete)
  // -----------------------------------------------------
  
  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;

    try {
        await courseAPI.delete(courseToDelete.courseID);
        setToast({ message: `Đã xóa khóa học ${courseToDelete.courseID} thành công!`, type: 'success' });
        fetchCourses(); // Tải lại danh sách
    } catch (error) {
        const msg = error.response?.data?.message || 'Xóa thất bại! Vui lòng kiểm tra đã xóa hết sinh viên khỏi lớp này chưa.';
        setToast({ message: msg, type: 'error' });
    } finally {
        setCourseToDelete(null); // Đóng modal xác nhận
    }
  };

  return (
    <div className="page-container" style={{padding: '20px'}}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
         <h2 style={{color: '#333'}}>Quản Lý Khóa Học</h2>
         <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>+ Tạo khóa học mới</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã KH</th>
              <th>Tên Khóa Học</th>
              <th>Tín chỉ</th>
              <th>Sĩ số</th>
              <th>Giảng viên</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
                courses.map(course => (
                  <tr key={course.courseID}>
                    <td>{course.courseID}</td>
                    <td style={{fontWeight: 'bold', color: '#0369a1'}}>{course.courseName}</td>
                    <td>{course.credits}</td>
                    <td>
                        <span style={{
                            color: course.currentEnrollment >= course.maxCapacity ? '#e74c3c' : '#27ae60',
                            fontWeight: 'bold'
                        }}>
                            {course.currentEnrollment}
                        </span> 
                        / {course.maxCapacity}
                    </td>
                    <td>{course.lecturer?.fullName || 'Chưa phân công'}</td>
                    <td>
                       {/* Nút EDIT */}
                       <button 
                           className="btn-action btn-edit" 
                           onClick={() => setCourseToEdit(course)}
                       >
                           ✏️
                       </button>
                       {/* Nút DELETE */}
                       <button 
                           className="btn-action btn-delete" 
                           onClick={() => setCourseToDelete(course)}
                       >
                           🗑️
                       </button>
                    </td>
                  </tr>
                ))
            ) : (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Chưa có khóa học nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 1. Modal TẠO MỚI */}
      {isCreateModalOpen && (
        <CreateCourseModal 
            onClose={() => setIsCreateModalOpen(false)} 
            onCourseCreated={fetchCourses} 
        />
      )}
      
      {/* 2. Modal CẬP NHẬT */}
      {courseToEdit && (
          <UpdateCourseModal 
              course={courseToEdit}
              onClose={() => setCourseToEdit(null)} 
              onCourseUpdated={handleUpdateSuccess} 
          />
      )}
      
      {/* 3. Modal XÁC NHẬN XÓA */}
      {courseToDelete && (
          <ConfirmationModal
              isOpen={true}
              onClose={() => setCourseToDelete(null)}
              onConfirm={handleDeleteConfirm}
              title="Xác nhận Xóa Khóa học"
              message={`Bạn có chắc chắn muốn xóa khóa học "${courseToDelete.courseName}" (Mã: ${courseToDelete.courseID})? Hành động này sẽ xóa cả sinh viên đăng ký.`}
          />
      )}
    </div>
  );
};

export default CourseManagementPage;