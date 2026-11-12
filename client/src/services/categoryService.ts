import api from './api';
import { Category } from '../types';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const res = await api.get('/categories');
    return res.data.data;
  },
};
