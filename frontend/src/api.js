import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';
export const fetchTasks = () => axios.get(`${API_BASE}/tasks`).then(r => r.data);
export const createTask = (payload) => axios.post(`${API_BASE}/tasks`, payload).then(r => r.data);
export const updateTask = (id, payload) => axios.put(`${API_BASE}/tasks/${id}`, payload).then(r => r.data);
export const deleteTask = (id) => axios.delete(`${API_BASE}/tasks/${id}`);
export const reorderTasks = (orderedIds) => axios.put(`${API_BASE}/tasks/reorder`, { orderedIds }).then(r => r.data);
