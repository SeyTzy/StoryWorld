import React from 'react';
import { Story } from '../../types';
import { StoryCard } from './StoryCard';
import { EmptyState } from '../common/EmptyState';

interface StoryGridProps {
  stories: Story[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onBookmarkChange?: (storyId: string, isBookmarked: boolean) => void;
}

export const StoryGrid: React.FC<StoryGridProps> = ({
  stories,
  isLoading = false,
  emptyTitle = 'មិនមានរឿងត្រូវបានរកឃើញទេ',
  emptyDescription = 'សូមព្យាយាមស្វែងរកជាមួយពាក្យគន្លឹះផ្សេងទៀត ឬជ្រើសរើសប្រភេទរឿងថ្មី។',
  onBookmarkChange,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col bg-white rounded-2xl border border-[#EAEAEA] overflow-hidden animate-pulse"
          >
            <div className="aspect-[3/4] bg-slate-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="pt-2 border-t border-slate-100 flex justify-between">
                <div className="h-3 bg-slate-200 rounded w-1/4" />
                <div className="h-3 bg-slate-200 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText="មើលរឿងទាំងអស់"
        actionHref="/explore"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          onBookmarkChange={onBookmarkChange}
        />
      ))}
    </div>
  );
};
