import api from './api';
import { DashboardStats, Story, Chapter, Category, User, PaginatedResponse } from '../types';

export const adminService = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get('/admin/dashboard');
    return res.data.data;
  },

  // Story CRUD
  getStories: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Story>> => {
    const res = await api.get('/admin/stories', { params });
    return res.data;
  },

  createStory: async (data: FormData | Partial<Story>): Promise<Story> => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const res = await api.post('/admin/stories', data, { headers });
    return res.data.data;
  },

  updateStory: async (id: string, data: FormData | Partial<Story>): Promise<Story> => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const res = await api.put(`/admin/stories/${id}`, data, { headers });
    return res.data.data;
  },

  deleteStory: async (id: string): Promise<void> => {
    await api.delete(`/admin/stories/${id}`);
  },

  // Chapter CRUD
  createChapter: async (data: { storyId: string; chapterNumber: number; title: string; content: string }): Promise<Chapter> => {
    const res = await api.post('/admin/chapters', data);
    return res.data.data;
  },

  updateChapter: async (id: string, data: { chapterNumber?: number; title?: string; content?: string }): Promise<Chapter> => {
    const res = await api.put(`/admin/chapters/${id}`, data);
    return res.data.data;
  },

  deleteChapter: async (id: string): Promise<void> => {
    await api.delete(`/admin/chapters/${id}`);
  },

  // Category CRUD
  getCategories: async (): Promise<Category[]> => {
    const res = await api.get('/admin/categories');
    return res.data.data;
  },

  createCategory: async (data: { name: string; slug?: string; description?: string }): Promise<Category> => {
    const res = await api.post('/admin/categories', data);
    return res.data.data;
  },

  updateCategory: async (id: string, data: { name?: string; slug?: string; description?: string }): Promise<Category> => {
    const res = await api.put(`/admin/categories/${id}`, data);
    return res.data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
  },

  // User management
  getUsers: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<User>> => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  toggleUserStatus: async (userId: string, isActive: boolean): Promise<User> => {
    const res = await api.put(`/admin/users/${userId}/status`, { isActive });
    return res.data.data;
  },

  // Comment moderation
  deleteComment: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },
};
