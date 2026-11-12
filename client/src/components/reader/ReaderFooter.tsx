import React from 'react';
import { ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';

interface ReaderFooterProps {
  prevChapterId?: string | null;
  nextChapterId?: string | null;
  onNavigateChapter: (chapterId: string) => void;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
}

export const ReaderFooter: React.FC<ReaderFooterProps> = ({
  prevChapterId,
  nextChapterId,
  onNavigateChapter,
  isBookmarked,
  onBookmarkToggle,
}) => {
  return (
    <footer className="mt-16 pt-8 pb-16 border-t border-current/10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous Chapter button */}
        <button
          onClick={() => prevChapterId && onNavigateChapter(prevChapterId)}
          disabled={!prevChapterId}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            prevChapterId
              ? 'bg-[#E9E5FA] text-[#6C55D9] hover:bg-[#6C55D9] hover:text-white shadow-sm'
              : 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>ភាគមុន</span>
        </button>

        {/* Quick Bookmark toggle */}
        <button
          onClick={onBookmarkToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
            isBookmarked
              ? 'text-[#6C55D9] bg-[#E9E5FA]'
              : 'border border-current/20 hover:bg-black/5'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          <span>{isBookmarked ? 'បានចំណាំក្នុងបណ្ណាល័យ' : 'ចំណាំរឿងនេះទុក'}</span>
        </button>

        {/* Next Chapter button */}
        <button
          onClick={() => nextChapterId && onNavigateChapter(nextChapterId)}
          disabled={!nextChapterId}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            nextChapterId
              ? 'bg-[#6C55D9] text-white hover:bg-[#5841C5] shadow-sm'
              : 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
          }`}
        >
          <span>ភាគបន្ទាប់</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};
