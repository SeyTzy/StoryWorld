import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { StoryDetail } from './pages/StoryDetail';
import { ChapterReader } from './pages/ChapterReader';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MyLibrary } from './pages/MyLibrary';
import { ReadingHistory } from './pages/ReadingHistory';
import { Profile } from './pages/Profile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStories } from './pages/admin/AdminStories';
import { AdminChapters } from './pages/admin/AdminChapters';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminUsers } from './pages/admin/AdminUsers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Main Website Pages */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/stories/:slug" element={<StoryDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-library" element={<MyLibrary />} />
            <Route path="/history" element={<ReadingHistory />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Distraction-Free Reader Route (Stand-alone immersive layout) */}
          <Route path="/stories/:slug/chapters/:chapterId" element={<ChapterReader />} />

          {/* Protected Admin Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="stories" element={<AdminStories />} />
            <Route path="chapters" element={<AdminChapters />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
