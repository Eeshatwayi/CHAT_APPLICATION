import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- AUTH ------------------
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

// ---------------- PRIVATE ROOMS ------------------
export const roomAPI = {
  // Create private room
  createPrivateRoom: (roomData) => api.post('/rooms/create', roomData),

  // Join private room
  joinPrivateRoom: (code) => api.post('/rooms/join', { code }),

  // Get user's private rooms
  getMyPrivateRooms: () => api.get('/rooms/my-rooms'),

  // Leave private room
  leavePrivateRoom: (roomId) => api.post(`/rooms/leave/${roomId}`),

  // Delete private room
  deletePrivateRoom: (roomId) => api.delete(`/rooms/delete/${roomId}`),

  // Get members
  getRoomMembers: (roomId) => api.get(`/rooms/members/${roomId}`)
};

// ---------------- PUBLIC ROOMS ------------------
export const publicRoomAPI = {
  createPublicRoom: async (name) => {
    const res = await api.post('/rooms/public/create', { name });
    return res.data;   // returns { message, room }
  },

  getPublicRooms: async () => {
    const res = await api.get('/rooms/public/list');
    return res.data;   // returns { rooms: [...] }
  },

  joinPublicRoom: async (roomId) => {
    const res = await api.post('/rooms/public/join', { roomId });
    return res.data;   // returns { message, room }
  }
};

// ---------------- FILE UPLOAD ------------------
export const uploadAPI = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default api;
