import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Axios Instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// ─── Request Interceptor (attach token) ──────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor (auto refresh) ─────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const newToken = data.data.accessToken;

        localStorage.setItem('accessToken', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (_) {
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data: Record<string, unknown>) => api.post('/auth/register', data),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.put(`/auth/reset-password/${token}`, { password }),
  updatePassword: (data: Record<string, unknown>) => api.put('/auth/update-password', data),
};

// ─── Course API ───────────────────────────────────────────────────────────────
export const courseAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/courses', { params }),
  getOne: (id: string) => api.get(`/courses/${id}`),
  create: (data: FormData) => api.post('/courses', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData | Record<string, unknown>) => api.put(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
  enroll: (id: string) => api.post(`/courses/${id}/enroll`),
  approve: (id: string) => api.patch(`/courses/${id}/approve`),
  getStudents: (id: string) => api.get(`/courses/${id}/students`),
};

// ─── Assignment API ───────────────────────────────────────────────────────────
export const assignmentAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/assignments', { params }),
  create: (data: FormData) => api.post('/assignments', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: Record<string, unknown>) => api.put(`/assignments/${id}`, data),
  delete: (id: string) => api.delete(`/assignments/${id}`),
  submit: (id: string, data: FormData) => api.post(`/assignments/${id}/submit`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getSubmissions: (id: string) => api.get(`/assignments/${id}/submissions`),
  grade: (submissionId: string, data: Record<string, unknown>) => api.put(`/assignments/submissions/${submissionId}/grade`, data),
};

// ─── Quiz API ─────────────────────────────────────────────────────────────────
export const quizAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/quizzes', { params }),
  getOne: (id: string) => api.get(`/quizzes/${id}`),
  create: (data: Record<string, unknown>) => api.post('/quizzes', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/quizzes/${id}`, data),
  submit: (id: string, data: Record<string, unknown>) => api.post(`/quizzes/${id}/submit`, data),
  getResults: (id: string) => api.get(`/quizzes/${id}/results`),
};

// ─── Attendance API ───────────────────────────────────────────────────────────
export const attendanceAPI = {
  mark: (data: Record<string, unknown>) => api.post('/attendance', data),
  getAll: (params?: Record<string, unknown>) => api.get('/attendance', { params }),
  getMine: (params?: Record<string, unknown>) => api.get('/attendance/my-attendance', { params }),
  update: (id: string, data: Record<string, unknown>) => api.put(`/attendance/${id}`, data),
};

// ─── AI API ───────────────────────────────────────────────────────────────────
export const aiAPI = {
  chat: (message: string, history: unknown[], context?: Record<string, unknown>) =>
    api.post('/ai/chat', { message, history, context }),
  generateQuiz: (data: Record<string, unknown>) => api.post('/ai/generate-quiz', data),
  summarize: (text: string, length?: string) => api.post('/ai/summarize', { text, length }),
};

// ─── Notification API ─────────────────────────────────────────────────────────
export const notificationAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/notifications', { params }),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
  delete: (id: string) => api.delete(`/notifications/${id}`),
};

// ─── Discussion API ───────────────────────────────────────────────────────────
export const discussionAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/discussions', { params }),
  getOne: (id: string) => api.get(`/discussions/${id}`),
  create: (data: Record<string, unknown>) => api.post('/discussions', data),
  addComment: (postId: string, content: string, parentComment?: string) =>
    api.post(`/discussions/${postId}/comments`, { content, parentComment }),
  like: (id: string) => api.patch(`/discussions/${id}/like`),
  resolve: (id: string) => api.patch(`/discussions/${id}/resolve`),
};

// ─── Result API ───────────────────────────────────────────────────────────────
export const resultAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/results', { params }),
  create: (data: Record<string, unknown>) => api.post('/results', data),
  publish: (id: string) => api.patch(`/results/${id}/publish`),
};

// ─── Certificate API ──────────────────────────────────────────────────────────
export const certificateAPI = {
  getAll: () => api.get('/certificates'),
  create: (data: Record<string, unknown>) => api.post('/certificates', data),
  verify: (id: string) => api.get(`/certificates/verify/${id}`),
};

// ─── Admin API ────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: Record<string, unknown>) => api.get('/admin/users', { params }),
  updateUser: (id: string, data: Record<string, unknown>) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (data: Record<string, unknown>) => api.post('/admin/departments', data),
  updateDepartment: (id: string, data: Record<string, unknown>) => api.put(`/admin/departments/${id}`, data),
  sendNotification: (data: Record<string, unknown>) => api.post('/admin/notify', data),
};

// ─── User API ─────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: FormData) => api.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getLeaderboard: (params?: Record<string, unknown>) => api.get('/users/leaderboard', { params }),
  search: (q: string, role?: string) => api.get('/users/search', { params: { q, role } }),
};

// ─── HOD API ──────────────────────────────────────────────────────────────────
export const hodAPI = {
  getStats: () => api.get('/hod/stats'),
  getFaculty: () => api.get('/hod/faculty'),
  getStudents: (params?: Record<string, unknown>) => api.get('/hod/students', { params }),
};

// ─── Announcement API ─────────────────────────────────────────────────────────
export const announcementAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/announcements', { params }),
  create: (data: Record<string, unknown>) => api.post('/announcements', data),
  delete: (id: string) => api.delete(`/announcements/${id}`),
};

// ─── Module API ───────────────────────────────────────────────────────────────
export const moduleAPI = {
  getAll: (courseId: string) => api.get('/modules', { params: { course: courseId } }),
  create: (data: Record<string, unknown>) => api.post('/modules', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/modules/${id}`, data),
  createVideoLesson: (data: FormData) => api.post('/modules/lessons/video', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  createDocumentLesson: (data: FormData) => api.post('/modules/lessons/document', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  completeLesson: (id: string) => api.patch(`/modules/lessons/${id}/complete`),
};

export default api;
