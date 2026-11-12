import api from './api';
import { Story, Chapter, StoryFilterParams, PaginatedResponse, Comment, Rating } from '../types';

export const storyService = {
  getStories: async (params?: StoryFilterParams): Promise<PaginatedResponse<Story>> => {
    const res = await api.get('/stories', { params });
    return res.data;
  },

  getFeaturedStories: async (): Promise<Story[]> => {
    const res = await api.get('/stories', { params: { limit: 6, sort: 'popular' } });
    return res.data.data;
  },

  getLatestStories: async (): Promise<Story[]> => {
    const res = await api.get('/stories', { params: { limit: 8, sort: 'latest' } });
    return res.data.data;
  },

  getPopularStories: async (): Promise<Story[]> => {
    const res = await api.get('/stories', { params: { limit: 8, sort: 'popular' } });
    return res.data.data;
  },

  getStoryBySlug: async (slug: string): Promise<Story> => {
    const res = await api.get(`/stories/${slug}`);
    return res.data.data;
  },

  getChapterById: async (chapterId: string): Promise<Chapter & { story: Story; prevChapterId?: string | null; nextChapterId?: string | null }> => {
    const res = await api.get(`/chapters/${chapterId}`);
    return res.data.data;
  },

  getStoryComments: async (storyId: string): Promise<Comment[]> => {
    const res = await api.get(`/stories/${storyId}/comments`);
    return res.data.data;
  },

  addComment: async (storyId: string, content: string): Promise<Comment> => {
    const res = await api.post(`/stories/${storyId}/comments`, { content });
    return res.data.data;
  },

  rateStory: async (storyId: string, rating: number): Promise<Rating> => {
    const res = await api.post(`/stories/${storyId}/ratings`, { rating });
    return res.data.data;
  },
};
