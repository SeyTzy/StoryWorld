import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, BookOpen, Star, Bookmark as BookmarkIcon, User } from 'lucide-react';
import { Story } from '../../types';
import { readerService } from '../../services/readerService';
import { useAuthStore } from '../../stores/authStore';

interface StoryCardProps {
  story: Story;
  onBookmarkChange?: (storyId: string, isBookmarked: boolean) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onBookmarkChange }) => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(story.isBookmarked || false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isBookmarking) return;

    try {
      setIsBookmarking(true);
      if (isBookmarked) {
        await readerService.removeBookmark(story.id);
        setIsBookmarked(false);
        onBookmarkChange?.(story.id, false);
      } else {
        await readerService.addBookmark(story.id);
        setIsBookmarked(true);
        onBookmarkChange?.(story.id, true);
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    } finally {
      setIsBookmarking(false);
    }
  };

  // Determine cover image URL (relative or absolute)
  const coverUrl = story.coverImage
    ? story.coverImage.startsWith('http')
      ? story.coverImage
      : `/${story.coverImage.replace(/^\//, '')}`
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop';

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-[#EAEAEA] shadow-soft hover:shadow-card-hover hover:border-[#D4CCF7] transition-all duration-300 overflow-hidden">
      
      {/* Cover Image Container */}
      <Link to={`/stories/${story.slug}`} className="relative aspect-[3/4] overflow-hidden bg-[#F7F5F1] block">
        <img
          src={coverUrl}
          alt={story.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            // fallback placeholder if image broken
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop';
          }}
        />

        {/* Gradient Overlay for visual depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Badge */}
        {story.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full bg-white/90 backdrop-blur-md text-[#6C55D9] shadow-sm font-khmer">
            {story.category.name}
          </span>
        )}

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkToggle}
          title={isBookmarked ? 'ដកការចំណាំ' : 'ចំណាំទុកអាន'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isBookmarked
              ? 'bg-[#6C55D9] text-white'
              : 'bg-white/80 text-[#242424] hover:bg-white hover:text-[#6C55D9]'
          }`}
        >
          <BookmarkIcon className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Rating overlay badge */}
        {story.averageRating && story.averageRating > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm text-amber-300 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{story.averageRating.toFixed(1)}</span>
          </div>
        )}
      </Link>

      {/* Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <Link to={`/stories/${story.slug}`}>
            <h3 className="font-bold text-[#242424] text-base font-khmerTitle line-clamp-1 group-hover:text-[#6C55D9] transition-colors">
              {story.title}
            </h3>
          </Link>
          <p className="flex items-center gap-1.5 text-xs text-[#777777] mt-1 line-clamp-1">
            <User className="w-3.5 h-3.5 text-[#6C55D9]" />
            <span>{story.author}</span>
          </p>
        </div>

        {/* Bottom meta stats */}
        <div className="flex items-center justify-between text-xs text-[#777777] pt-2 border-t border-[#F7F5F1]">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{story._count?.chapters ?? (story.chapters ? story.chapters.length : 0)} ភាគ</span>
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{story.views.toLocaleString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
