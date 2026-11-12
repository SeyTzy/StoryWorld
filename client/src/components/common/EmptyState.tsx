import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-3xl border border-[#EAEAEA] shadow-soft max-w-md mx-auto my-12">
      <div className="w-16 h-16 rounded-2xl bg-[#E9E5FA] text-[#6C55D9] flex items-center justify-center mb-4">
        {icon || <BookOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-[#242424] font-khmerTitle mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#777777] mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && actionHref && (
        <Link
          to={actionHref}
          className="px-6 py-2.5 bg-[#6C55D9] text-white text-sm font-medium rounded-xl hover:bg-[#5841C5] transition-all shadow-sm"
        >
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionHref && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-[#6C55D9] text-white text-sm font-medium rounded-xl hover:bg-[#5841C5] transition-all shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
