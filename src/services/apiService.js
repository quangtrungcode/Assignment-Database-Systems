// // // API service - Gọi backend
// // import axios from 'axios'

// // const api = axios.create({
// //   headers: {
// //     'Content-Type': 'application/json'
// //   }
// // })

// // // Interceptor - Gửi token tự động
// // api.interceptors.request.use(
// //   (config) => {
// //     const token = localStorage.getItem('authToken');
// //     const publicUrls = ['/identity/auth/token', '/identity/users'];

// //     if (token && !publicUrls.includes(config.url)) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config
// //   },
// //   (error) => Promise.reject(error)
// // )

// // api.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     if (error.response?.status === 401) {
// //       // Token hết hạn hoặc không hợp lệ
// //       localStorage.removeItem('authToken')
// //       localStorage.removeItem('user')
// //       window.location.href = '/login'
// //     }
// //     return Promise.reject(error)
// //   }
// // )

// // export const authAPI = {
// //   // POST: /identity/users - Tạo người dùng
// //   register: (userData) => {
// //     return api.post('/identity/users', userData)
// //   },
  
// //   // POST: /identity/auth/token - Tạo token (login)
// //   login: (fullName, password) => {
// //     return api.post('/identity/auth/token', { fullName, passwordHash: password })
// //   },
  
// //   logout: () => {
// //     localStorage.removeItem('authToken')
// //     localStorage.removeItem('user')
// //   }
// // }

// // export const userAPI = {
// //   // GET: /identity/users/myInfo - Lấy thông tin người đang đăng nhập
// //   getMyInfo: () => {
// //     return api.get('/identity/users/myInfo')
// //   },
  
// //   updateUser: (userData) => {
// //     return api.put('/identity/users/myInfo', userData)
// //   }
// // }

// // export default api

// // e:\Database Systems\fronend\src\services\apiService.js

// import axios from 'axios';

// // Tạo một instance của axios để dùng chung
// const api = axios.create({
//   baseURL: 'http://localhost:8080', // Base URL của backend
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Đây là phần quan trọng: Interceptor để tự động gắn token vào mỗi request
// // Mỗi khi một request được gửi đi, nó sẽ lấy token từ localStorage và thêm vào header Authorization
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//       console.log('Authorization header set:', config.headers['Authorization']); // Added for debugging
//     } else {
//       console.log('No authToken found in localStorage.'); // Added for debugging
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Thêm interceptor để log response hoặc lỗi
// api.interceptors.response.use(
//   (response) => {
//     console.log('API Response (Success):', response);
//     return response;
//   },
//   (error) => {
//     console.error('API Response (Error):', error.response || error);
//     // Có thể thêm logic xử lý lỗi global ở đây, ví dụ:
//     // if (error.response?.status === 401 && !error.config.url.includes('/auth/token')) {
//     //   // Xử lý token hết hạn, chuyển hướng về trang login
//     //   localStorage.removeItem('authToken');
//     //   window.location.href = '/login';
//     // }
//     return Promise.reject(error);
//   }
// );

// // API cho các chức năng xác thực
// export const authAPI = {
//   login: (fullName, password) => {
//     return api.post('/identity/auth/token', { fullName, passwordHash: password });
//   },
// };

// // API cho các chức năng liên quan đến người dùng
// export const userAPI = {
//   getMyInfo: () => {
//     return api.get('/identity/users/myInfo');
//   },
//   getAllUsers: (params = {}) => {
//     return api.get('/identity/users', { params }); // Endpoint để lấy tất cả người dùng
//   },
//   createUser: (userData) => {
//     return api.post('/identity/users', userData);
//   },
//   update: (userId, userData) => {
//     return api.put(`/identity/users/${userId}`, userData);
//   },
//   delete: (userId) => {
//     return api.delete(`/identity/users/${userId}`);
//   },
//   search: (searchCriteria) => {
//     return api.post('/identity/users/search', searchCriteria);
//   },
// };

// // API cho các chức năng liên quan đến quyền (Permissions)
// export const permissionAPI = {
//   getAll: () => {
//     return api.get('/identity/permissions');
//   },
//   create: (permissionData) => {
//     return api.post('/identity/permissions', permissionData);
//   },
//   update: (id, permissionData) => {
//     return api.put(`/identity/permissions/${id}`, permissionData);
//   },
//   delete: (permissionName) => {
//     return api.delete(`/identity/permissions/${permissionName}`);
//   },
// };

// // API cho các chức năng liên quan đến vai trò (Roles)
// export const roleAPI = {
//   create: (roleData) => {
//     return api.post('/identity/roles', roleData);
//   },
//   getAll: () => {
//     return api.get('/identity/roles'); // Endpoint để lấy tất cả các vai trò
//   },
//   getById: (id) => {
//     return api.get(`/identity/roles/${id}`);
//   },
//   update: (roleData) => {
//     return api.put(`/identity/roles`, roleData);
//   },
//   delete: (id) => {
//     return api.delete(`/identity/roles/${id}`); // Sửa lại: dùng id chính xác
//   },
// };
import axios from 'axios';

// Tạo một instance của axios để dùng chung
const api = axios.create({
  baseURL: 'http://localhost:8080', // Base URL của backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động gắn token vào header Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      // console.log('Authorization header set:', config.headers['Authorization']);
    } else {
      // console.log('No authToken found in localStorage.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor: Log response hoặc xử lý lỗi token
api.interceptors.response.use(
  (response) => {
    // console.log('API Response (Success):', response);
    return response;
  },
  (error) => {
    console.error('API Response (Error):', error.response || error);
    // Logic tự động logout nếu token hết hạn (401)
    if (error.response?.status === 401 && !error.config.url.includes('/auth/token')) {
       localStorage.removeItem('authToken');
       window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API cho các chức năng xác thực
export const authAPI = {
  login: (fullName, password) => {
    return api.post('/identity/auth/token', { fullName, passwordHash: password });
  },
};

// API cho các chức năng liên quan đến người dùng
export const userAPI = {
  getMyInfo: () => {
    return api.get('/identity/users/myInfo');
  },
  getAllUsers: (params = {}) => {
    return api.get('/identity/users', { params }); 
  },
  createUser: (userData) => {
    return api.post('/identity/users', userData);
  },
  // API cập nhật dành cho ADMIN (sửa mọi thứ)
  update: (userId, userData) => {
    return api.put(`/identity/users/${userId}`, userData);
  },
  // 👇 API MỚI: Cập nhật hồ sơ dành cho STUDENT (chỉ sửa thông tin cá nhân)
  updateProfile: (userId, userData) => {
    return api.put(`/identity/users/${userId}/profile`, userData);
  },
  delete: (userId) => {
    return api.delete(`/identity/users/${userId}`);
  },
  search: (searchCriteria) => {
    return api.post('/identity/users/search', searchCriteria);
  },
};

// API cho các chức năng liên quan đến quyền (Permissions)
export const permissionAPI = {
  getAll: () => {
    return api.get('/identity/permissions');
  },
  create: (permissionData) => {
    return api.post('/identity/permissions', permissionData);
  },
  update: (id, permissionData) => {
    return api.put(`/identity/permissions/${id}`, permissionData);
  },
  delete: (permissionName) => {
    return api.delete(`/identity/permissions/${permissionName}`);
  },
};

// API cho các chức năng liên quan đến vai trò (Roles)
export const roleAPI = {
  create: (roleData) => {
    return api.post('/identity/roles', roleData);
  },
  getAll: () => {
    return api.get('/identity/roles'); 
  },
  getById: (id) => {
    return api.get(`/identity/roles/${id}`);
  },
  update: (roleData) => {
    return api.put(`/identity/roles`, roleData);
  },
  delete: (id) => {
    return api.delete(`/identity/roles/${id}`); 
  },
};

export const courseAPI = {
  getAll: () => {
    return api.get('/identity/courses'); 
  },
  create: (courseData) => {
    return api.post('/identity/courses', courseData);
  },
  update: (courseId, courseData) => {
    return api.put(`/identity/courses/${courseId}`, courseData);
  },
  // 👇 THÊM API XÓA
  delete: (courseId) => {
    return api.delete(`/identity/courses/${courseId}`);
  },

  enroll: (courseId) => {
    // API này không cần body vì Student ID được lấy từ token
    return api.post(`/identity/courses/${courseId}/enroll`, {}); 
  },

  unenroll: (courseId) => {
        return api.delete(`/identity/courses/${courseId}/unenroll`);
    },

  getMyEnrollments: () => {
    return api.get('/identity/courses/my-enrollments');
  }
  // Nếu cần xóa/sửa thì thêm sau
};

export default api;