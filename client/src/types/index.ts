// User & Auth Types
export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: {
    stories: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Chapter Types
export interface Chapter {
  id: string;
  storyId: string;
  chapterNumber: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChapterSummary {
  id: string;
  chapterNumber: number;
  title: string;
  createdAt: string;
}

// Story Types
export type StoryStatus = 'DRAFT' | 'PUBLISHED';

export interface Story {
  id: string;
  categoryId: string;
  category?: Category;
  title: string;
  slug: string;
  author: string;
  description: string;
  coverImage?: string | null;
  status: StoryStatus;
  views: number;
  chapters?: ChapterSummary[];
  _count?: {
    chapters: number;
    bookmarks: number;
    comments: number;
    ratings: number;
  };
  averageRating?: number;
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Bookmark & History Types
export interface Bookmark {
  id: string;
  userId: string;
  storyId: string;
  story: Story;
  createdAt: string;
}

export interface ReadingHistoryItem {
  id: string;
  userId: string;
  storyId: string;
  chapterId: string;
  progress: number;
  lastReadAt: string;
  story: Story;
  chapter: ChapterSummary;
}

// Comment & Rating Types
export interface Comment {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  storyId: string;
  content: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  userId: string;
  storyId: string;
  rating: number;
  createdAt: string;
}

// Reader Preferences
export type ReaderTheme = 'light' | 'sepia' | 'dark';
export type ReaderContentWidth = 'narrow' | 'medium' | 'wide';
export type ReaderLineHeight = 'normal' | 'relaxed' | 'loose';

export interface ReaderSettings {
  theme: ReaderTheme;
  fontSize: number; // in px, e.g. 18
  lineHeight: ReaderLineHeight;
  contentWidth: ReaderContentWidth;
}

// API Pagination & Filter Params
export interface StoryFilterParams {
  search?: string;
  category?: string;
  sort?: 'latest' | 'oldest' | 'popular' | 'rating';
  page?: number;
  limit?: number;
  status?: StoryStatus;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Admin Dashboard Metrics
export interface DashboardStats {
  totalStories: number;
  totalChapters: number;
  totalUsers: number;
  totalCategories: number;
  totalViews: number;
}
