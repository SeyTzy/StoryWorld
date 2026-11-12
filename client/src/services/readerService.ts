import api from './api';
import { Bookmark, ReadingHistoryItem } from '../types';

export const readerService = {
  getBookmarks: async (): Promise<Bookmark[]> => {
    const res = await api.get('/users/bookmarks');
    return res.data.data;
  },

  addBookmark: async (storyId: string): Promise<Bookmark> => {
    const res = await api.post('/users/bookmarks', { storyId });
    return res.data.data;
  },

  removeBookmark: async (storyId: string): Promise<void> => {
    await api.delete(`/users/bookmarks/${storyId}`);
  },

  getHistory: async (): Promise<ReadingHistoryItem[]> => {
    const res = await api.get('/users/history');
    return res.data.data;
  },

  saveProgress: async (data: { storyId: string; chapterId: string; progress: number }): Promise<ReadingHistoryItem> => {
    const res = await api.put('/users/history', data);
    return res.data.data;
  },
};
