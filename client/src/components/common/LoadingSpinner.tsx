import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'កំពុងដំណើរការ...', 
  className = 'py-16' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className="w-8 h-8 text-[#6C55D9] animate-spin" />
      {text && <p className="text-sm text-[#777777] font-khmer">{text}</p>}
    </div>
  );
};
