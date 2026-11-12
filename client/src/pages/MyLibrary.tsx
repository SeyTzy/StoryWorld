import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, BookOpen, Clock, Play } from 'lucide-react';
import { readerService } from '../services/readerService';
import { useAuthStore } from '../stores/authStore';
import { Bookmark as BookmarkType, ReadingHistoryItem } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';

export const MyLibrary: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'bookmarks' | 'reading'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [bms, hist] = await Promise.all([
            readerService.getBookmarks(),
            readerService.getHistory(),
          ]);
          setBookmarks(bms);
          setHistory(hist);
        } catch (err) {
          console.error('Failed to load library data', err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleRemoveBookmark = async (storyId: string) => {
    try {
      await readerService.removeBookmark(storyId);
      setBookmarks(bookmarks.filter((b) => b.storyId !== storyId));
    } catch (err) {
      console.error('Failed to remove bookmark', err);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner text="កំពុងផ្ទុកបណ្ណាល័យរបស់អ្នក..." className="py-32" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#242424] font-khmerTitle">
          បណ្ណាល័យរបស់ខ្ញុំ
        </h1>
        <p className="text-sm text-[#777777] mt-1 font-khmer">
          គ្រប់គ្រងរឿងដែលអ្នកបានចំណាំ និងតាមដានដំណើរការអានរបស់អ្នក
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#EAEAEA] gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-all ${
            activeTab === 'bookmarks'
              ? 'border-[#6C55D9] text-[#6C55D9] font-bold'
              : 'border-transparent text-[#777777] hover:text-[#242424]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>រឿងបានចំណាំ ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reading')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-all ${
            activeTab === 'reading'
              ? 'border-[#6C55D9] text-[#6C55D9] font-bold'
              : 'border-transparent text-[#777777] hover:text-[#242424]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>កំពុងអាន & ដំណើរការ ({history.length})</span>
        </button>
      </div>

      {/* Bookmarks Tab Content */}
      {activeTab === 'bookmarks' && (
        <div>
          {bookmarks.length === 0 ? (
            <EmptyState
              icon={<Bookmark className="w-8 h-8" />}
              title="មិនទាន់មានរឿងបានចំណាំទេ"
              description="អ្នកអាចចុចរូបសញ្ញាចំណាំលើរឿងណាមួយ ដើម្បីរក្សាទុកក្នុងបណ្ណាល័យនេះ។"
              actionText="ស្វែងរករឿងអានឥឡូវនេះ"
              actionHref="/explore"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="bg-white rounded-2xl border border-[#EAEAEA] shadow-soft p-4 flex gap-4 hover:shadow-card-hover transition-all group"
                >
                  <Link
                    to={`/stories/${bm.story.slug}`}
                    className="w-24 aspect-[3/4] rounded-xl overflow-hidden shrink-0 bg-[#F7F5F1]"
                  >
                    <img
                      src={bm.story.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300'}
                      alt={bm.story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </Link>
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      {bm.story.category && (
                        <span className="text-[11px] font-semibold text-[#6C55D9] bg-[#E9E5FA] px-2 py-0.5 rounded-full inline-block mb-1">
                          {bm.story.category.name}
                        </span>
                      )}
                      <Link to={`/stories/${bm.story.slug}`}>
                        <h3 className="font-bold text-sm text-[#242424] font-khmerTitle truncate group-hover:text-[#6C55D9]">
                          {bm.story.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#777777] mt-0.5 truncate">{bm.story.author}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                      <Link
                        to={`/stories/${bm.story.slug}`}
                        className="text-xs font-semibold text-[#6C55D9] hover:underline flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>អានរឿង</span>
                      </Link>
                      <button
                        onClick={() => handleRemoveBookmark(bm.story.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        លុបចេញ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Currently Reading Tab Content */}
      {activeTab === 'reading' && (
        <div>
          {history.length === 0 ? (
            <EmptyState
              icon={<Clock className="w-8 h-8" />}
              title="មិនទាន់មានប្រវត្តិអាននៅឡើយទេ"
              description="ចាប់ផ្តើមអានរឿងណាមួយ ហើយប្រព័ន្ធនឹងចងចាំភាគដែលអ្នកបានអានស្វ័យប្រវត្តិ។"
              actionText="ស្វែងរករឿងដើម្បីអាន"
              actionHref="/explore"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#EAEAEA] shadow-soft p-4 flex gap-4 items-center"
                >
                  <Link
                    to={`/stories/${item.story.slug}/chapters/${item.chapterId}`}
                    className="w-20 aspect-[3/4] rounded-xl overflow-hidden shrink-0 bg-[#F7F5F1]"
                  >
                    <img
                      src={item.story.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300'}
                      alt={item.story.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <h3 className="font-bold text-sm text-[#242424] font-khmerTitle truncate">
                        {item.story.title}
                      </h3>
                      <p className="text-xs text-[#777777] font-khmer truncate">
                        ភាគ {item.chapter?.chapterNumber || 1}៖ {item.chapter?.title || 'ភាគ'}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-[#777777]">
                        <span>ដំណើរការអាន</span>
                        <span className="font-bold text-[#6C55D9]">{Math.round(item.progress)}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full bg-[#6C55D9] rounded-full transition-all"
                          style={{ width: `${Math.min(Math.max(item.progress, 0), 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-[#777777]">
                        {new Date(item.lastReadAt).toLocaleDateString('km-KH')}
                      </span>
                      <Link
                        to={`/stories/${item.story.slug}/chapters/${item.chapterId}`}
                        className="px-3 py-1.5 rounded-xl bg-[#6C55D9] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#5841C5] transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>បន្តការអាន</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
