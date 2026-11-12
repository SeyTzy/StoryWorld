import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storyService } from '../services/storyService';
import { readerService } from '../services/readerService';
import { useAuthStore } from '../stores/authStore';
import { useReaderStore } from '../stores/readerStore';
import { Chapter, Story } from '../types';
import { ReaderControls } from '../components/reader/ReaderControls';
import { ReaderFooter } from '../components/reader/ReaderFooter';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ChapterReader: React.FC = () => {
  const { slug, chapterId } = useParams<{ slug: string; chapterId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { theme, fontSize, lineHeight, contentWidth } = useReaderStore();

  const [chapter, setChapter] = useState<(Chapter & { story: Story; prevChapterId?: string | null; nextChapterId?: string | null }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const lastSavedProgressRef = useRef(0);

  // Fetch Chapter Details
  useEffect(() => {
    if (!chapterId) return;

    const fetchChapter = async () => {
      try {
        setLoading(true);
        const data = await storyService.getChapterById(chapterId);
        setChapter(data);
        setIsBookmarked(data.story.isBookmarked || false);
        window.scrollTo({ top: 0, behavior: 'instant' });
      } catch (err) {
        console.error('Error fetching chapter:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId]);

  // Save progress periodically & on scroll
  const handleProgressUpdate = useCallback(async (currentProgress: number) => {
    if (!isAuthenticated || !chapter) return;

    // Only update backend if progress increased by at least 5% or reached 100%
    if (Math.abs(currentProgress - lastSavedProgressRef.current) >= 5 || currentProgress >= 98) {
      lastSavedProgressRef.current = currentProgress;
      try {
        await readerService.saveProgress({
          storyId: chapter.storyId,
          chapterId: chapter.id,
          progress: currentProgress,
        });
      } catch (err) {
        console.error('Failed to sync reading progress', err);
      }
    }
  }, [isAuthenticated, chapter]);

  // Track window scroll for progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const percent = Math.min(Math.round((scrollY / scrollHeight) * 100), 100);
        setProgressPercent(percent);
        handleProgressUpdate(percent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleProgressUpdate]);

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!chapter) return;

    try {
      if (isBookmarked) {
        await readerService.removeBookmark(chapter.storyId);
        setIsBookmarked(false);
      } else {
        await readerService.addBookmark(chapter.storyId);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const handleNavigateChapter = (targetChapterId: string) => {
    navigate(`/stories/${slug}/chapters/${targetChapterId}`);
  };

  // Content width classes
  const getContentWidthClass = () => {
    switch (contentWidth) {
      case 'narrow':
        return 'max-w-2xl';
      case 'wide':
        return 'max-w-5xl';
      default:
        return 'max-w-3xl';
    }
  };

  // Line height classes
  const getLineHeightClass = () => {
    switch (lineHeight) {
      case 'normal':
        return 'leading-normal';
      case 'loose':
        return 'leading-loose';
      default:
        return 'leading-relaxed';
    }
  };

  // Theme container classes
  const getThemeClass = () => {
    switch (theme) {
      case 'dark':
        return 'reader-theme-dark bg-[#121214] text-[#E4E4E7]';
      case 'sepia':
        return 'reader-theme-sepia bg-[#F4ECD8] text-[#433422]';
      default:
        return 'reader-theme-light bg-white text-[#242424]';
    }
  };

  if (loading) {
    return <LoadingSpinner text="កំពុងរៀបចំទំព័រអាន..." className="py-40" />;
  }

  if (!chapter) {
    return (
      <div className="py-40 text-center">
        <h2 className="text-xl font-bold font-khmerTitle">មិនអាចបើកទំព័រនេះបានទេ</h2>
        <button
          onClick={() => navigate(`/stories/${slug}`)}
          className="mt-4 px-6 py-2 bg-[#6C55D9] text-white rounded-xl text-sm font-medium"
        >
          ត្រឡប់ទៅរឿងវិញ
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${getThemeClass()}`}>
      
      {/* Top sticky controls */}
      <ReaderControls
        storyTitle={chapter.story.title}
        storySlug={chapter.story.slug}
        chapterTitle={chapter.title}
        chapterNumber={chapter.chapterNumber}
        progressPercent={progressPercent}
        prevChapterId={chapter.prevChapterId}
        nextChapterId={chapter.nextChapterId}
        isBookmarked={isBookmarked}
        onBookmarkToggle={handleBookmarkToggle}
        allChapters={chapter.story.chapters || []}
        onSelectChapter={handleNavigateChapter}
      />

      {/* Reader Content Body */}
      <main
        ref={contentRef}
        className={`mx-auto px-4 sm:px-6 pt-10 sm:pt-14 ${getContentWidthClass()}`}
      >
        {/* Chapter Header */}
        <header className="mb-10 text-center pb-8 border-b border-current/10">
          <p className="text-xs uppercase tracking-widest opacity-60 font-medium mb-2 font-mono">
            {chapter.story.title}
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-khmerTitle leading-snug">
            ភាគ {chapter.chapterNumber}៖ {chapter.title}
          </h1>
          <p className="text-xs opacity-60 mt-2 font-khmer">
            អ្នកនិពន្ធ៖ {chapter.story.author}
          </p>
        </header>

        {/* Story Text */}
        <article
          className={`font-khmer whitespace-pre-line tracking-normal select-text ${getLineHeightClass()}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {chapter.content}
        </article>

        {/* Reader Footer Navigation */}
        <ReaderFooter
          prevChapterId={chapter.prevChapterId}
          nextChapterId={chapter.nextChapterId}
          onNavigateChapter={handleNavigateChapter}
          isBookmarked={isBookmarked}
          onBookmarkToggle={handleBookmarkToggle}
        />
      </main>
    </div>
  );
};
