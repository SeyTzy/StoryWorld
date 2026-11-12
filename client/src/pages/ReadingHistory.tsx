import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Play } from 'lucide-react';
import { readerService } from '../services/readerService';
import { useAuthStore } from '../stores/authStore';
import { ReadingHistoryItem } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';

export const ReadingHistory: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const navigate = useNavigate();

  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isAuthenticated) {
      readerService.getHistory()
        .then(setHistory)
        .catch((err) => console.error('Failed to load reading history', err))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || loading) {
    return <LoadingSpinner text="កំពុងទាញយកប្រវត្តិអានរបស់អ្នក..." className="py-32" />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#242424] font-khmerTitle">
          ប្រវត្តិអានសៀវភៅ
        </h1>
        <p className="text-sm text-[#777777] mt-1 font-khmer">
          មើលរឿង និងភាគដែលអ្នកបានអានកន្លងមក ហើយអាចបន្តការអានភ្លាមៗ
        </p>
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon={<Clock className="w-8 h-8" />}
          title="មិនទាន់មានប្រវត្តិអាននៅឡើយទេ"
          description="រាល់ពេលដែលអ្នកអានរឿងណាមួយ ប្រព័ន្ធនឹងកត់ត្រាទុកនៅទីនេះដោយស្វ័យប្រវត្តិ។"
          actionText="ចាប់ផ្តើមអានរឿង"
          actionHref="/explore"
        />
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#6C55D9] transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                <Link
                  to={`/stories/${item.story.slug}/chapters/${item.chapterId}`}
                  className="w-16 h-20 rounded-xl overflow-hidden shrink-0 bg-[#F7F5F1] shadow-sm"
                >
                  <img
                    src={item.story.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200'}
                    alt={item.story.title}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="min-w-0">
                  <Link to={`/stories/${item.story.slug}`}>
                    <h3 className="font-bold text-base text-[#242424] font-khmerTitle truncate hover:text-[#6C55D9]">
                      {item.story.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#777777] font-khmer mt-0.5">
                    ភាគ {item.chapter?.chapterNumber || 1}៖ {item.chapter?.title || 'ភាគ'}
                  </p>

                  {/* Progress Indicator */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-32 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-[#6C55D9] rounded-full"
                        style={{ width: `${Math.min(Math.max(item.progress, 0), 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#6C55D9]">
                      {Math.round(item.progress)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons & date */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                <span className="text-xs text-[#777777] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(item.lastReadAt).toLocaleDateString('km-KH', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>

                <Link
                  to={`/stories/${item.story.slug}/chapters/${item.chapterId}`}
                  className="px-4 py-2 rounded-xl bg-[#6C55D9] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#5841C5] shadow-sm transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>បន្តការអាន</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
