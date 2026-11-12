import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  Bookmark, 
  Sun, 
  Moon, 
  Coffee, 
  Minus, 
  Plus,
  BookOpen
} from 'lucide-react';
import { useReaderStore } from '../../stores/readerStore';
import { ReaderContentWidth, ReaderLineHeight } from '../../types';

interface ReaderControlsProps {
  storyTitle: string;
  storySlug: string;
  chapterTitle: string;
  chapterNumber: number;
  totalChapters?: number;
  progressPercent: number;
  prevChapterId?: string | null;
  nextChapterId?: string | null;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  allChapters?: { id: string; chapterNumber: number; title: string }[];
  onSelectChapter?: (chapterId: string) => void;
}

export const ReaderControls: React.FC<ReaderControlsProps> = ({
  storyTitle,
  storySlug,
  chapterTitle,
  chapterNumber,
  progressPercent,
  isBookmarked,
  onBookmarkToggle,
  allChapters = [],
  onSelectChapter,
}) => {
  const {
    theme,
    fontSize,
    lineHeight,
    contentWidth,
    setTheme,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    setLineHeight,
    setContentWidth,
  } = useReaderStore();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chaptersDrawerOpen, setChaptersDrawerOpen] = useState(false);

  // Theme styling for the reader navbar
  const getNavThemeClass = () => {
    switch (theme) {
      case 'dark':
        return 'bg-[#18181B]/95 text-[#E4E4E7] border-b border-[#27272A]';
      case 'sepia':
        return 'bg-[#F4ECD8]/95 text-[#433422] border-b border-[#EAE0C8]';
      default:
        return 'bg-white/95 text-[#242424] border-b border-[#EAEAEA]';
    }
  };

  return (
    <>
      {/* Top sticky reader control bar */}
      <header className={`sticky top-0 z-40 backdrop-blur-md transition-colors ${getNavThemeClass()}`}>
        {/* Reading progress bar */}
        <div className="w-full h-1 bg-black/5 dark:bg-white/10">
          <div
            className="h-full bg-[#6C55D9] transition-all duration-150"
            style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
          
          {/* Back & Story Title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to={`/stories/${storySlug}`}
              className="p-2 rounded-xl hover:bg-black/5 transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-medium"
              title="ត្រឡប់ទៅទំព័ររឿង"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">ត្រឡប់ក្រោយ</span>
            </Link>

            <div className="border-l border-current/20 h-5" />

            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold truncate font-khmerTitle">
                {storyTitle}
              </h1>
              <p className="text-[11px] opacity-75 truncate">
                ភាគ {chapterNumber}: {chapterTitle}
              </p>
            </div>
          </div>

          {/* Quick Actions & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Chapters Drawer Trigger */}
            {allChapters.length > 0 && (
              <button
                onClick={() => setChaptersDrawerOpen(!chaptersDrawerOpen)}
                className="p-2 rounded-xl hover:bg-black/5 transition-colors text-xs flex items-center gap-1"
                title="បញ្ជីភាគ"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden md:inline font-khmer">ភាគ ({allChapters.length})</span>
              </button>
            )}

            {/* Bookmark button */}
            <button
              onClick={onBookmarkToggle}
              className={`p-2 rounded-xl transition-colors ${
                isBookmarked
                  ? 'text-[#6C55D9] bg-[#E9E5FA]'
                  : 'hover:bg-black/5 opacity-80'
              }`}
              title={isBookmarked ? 'បានចំណាំ' : 'ចំណាំទុក'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Reader Settings Menu Toggle */}
            <div className="relative">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={`p-2 rounded-xl transition-colors ${
                  settingsOpen ? 'bg-[#6C55D9] text-white' : 'hover:bg-black/5 opacity-80'
                }`}
                title="កំណត់ការអាន"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Reader Settings Dropdown Popup */}
              {settingsOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#1E1E22] text-[#242424] dark:text-[#E4E4E7] rounded-2xl shadow-card border border-[#EAEAEA] dark:border-[#2E2E34] p-4 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setSettingsOpen(false)}
                >
                  <div className="text-sm font-bold pb-2 border-b border-gray-100 dark:border-gray-800 font-khmer">
                    ការកំណត់បទពិសោធន៍អាន
                  </div>

                  {/* Reading Themes */}
                  <div className="py-3">
                    <label className="text-xs font-semibold opacity-75 block mb-2 font-khmer">
                      ផ្ទាំងពណ៌អាន
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                          theme === 'light'
                            ? 'border-[#6C55D9] bg-[#E9E5FA] text-[#6C55D9] font-bold shadow-sm'
                            : 'border-[#EAEAEA] bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5" />
                        <span>ពន្លឺ</span>
                      </button>

                      <button
                        onClick={() => setTheme('sepia')}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                          theme === 'sepia'
                            ? 'border-[#8B5A2B] bg-[#EAE0C8] text-[#433422] font-bold shadow-sm'
                            : 'border-[#DDD1B6] bg-[#F4ECD8] text-[#433422] hover:bg-[#EAE0C8]'
                        }`}
                      >
                        <Coffee className="w-3.5 h-3.5" />
                        <span>សេពា</span>
                      </button>

                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                          theme === 'dark'
                            ? 'border-[#6C55D9] bg-[#27272A] text-white font-bold shadow-sm'
                            : 'border-[#27272A] bg-[#18181B] text-gray-300 hover:bg-[#27272A]'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span>ងងឹត</span>
                      </button>
                    </div>
                  </div>

                  {/* Font Size Adjuster */}
                  <div className="py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold opacity-75 font-khmer">
                        ទំហំអក្សរ
                      </label>
                      <span className="text-xs font-mono font-medium">{fontSize}px</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={decreaseFontSize}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title="បន្ថយទំហំ"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="range"
                        min="14"
                        max="28"
                        step="1"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="flex-1 accent-[#6C55D9]"
                      />
                      <button
                        onClick={increaseFontSize}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title="បង្កើនទំហំ"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Line Height Adjuster */}
                  <div className="py-3 border-t border-gray-100 dark:border-gray-800">
                    <label className="text-xs font-semibold opacity-75 block mb-2 font-khmer">
                      គម្លាតបន្ទាត់ (Line Height)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['normal', 'relaxed', 'loose'] as ReaderLineHeight[]).map((lh) => (
                        <button
                          key={lh}
                          onClick={() => setLineHeight(lh)}
                          className={`py-1.5 text-xs rounded-lg border font-medium capitalize transition-all ${
                            lineHeight === lh
                              ? 'border-[#6C55D9] bg-[#E9E5FA] text-[#6C55D9] font-bold'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {lh === 'normal' ? 'ធម្មតា' : lh === 'relaxed' ? 'ស្រួលភ្នែក' : 'ទូលាយ'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Width */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                    <label className="text-xs font-semibold opacity-75 block mb-2 font-khmer">
                      ទទឹងអត្ថបទ
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['narrow', 'medium', 'wide'] as ReaderContentWidth[]).map((cw) => (
                        <button
                          key={cw}
                          onClick={() => setContentWidth(cw)}
                          className={`py-1.5 text-xs rounded-lg border font-medium capitalize transition-all ${
                            contentWidth === cw
                              ? 'border-[#6C55D9] bg-[#E9E5FA] text-[#6C55D9] font-bold'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {cw === 'narrow' ? 'តូច' : cw === 'medium' ? 'មធ្យម' : 'ធំទូលាយ'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Chapters Drawer Overlay */}
      {chaptersDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-md bg-white dark:bg-[#1E1E22] text-[#242424] dark:text-[#E4E4E7] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#EAEAEA] dark:border-[#2E2E34] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base font-khmerTitle">{storyTitle}</h3>
                <p className="text-xs opacity-75 font-khmer">បញ្ជីភាគទាំងអស់ ({allChapters.length} ភាគ)</p>
              </div>
              <button
                onClick={() => setChaptersDrawerOpen(false)}
                className="p-2 rounded-lg hover:bg-black/5"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {allChapters.map((chap) => (
                <button
                  key={chap.id}
                  onClick={() => {
                    onSelectChapter?.(chap.id);
                    setChaptersDrawerOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-sm transition-all flex items-center justify-between ${
                    chap.chapterNumber === chapterNumber
                      ? 'bg-[#E9E5FA] dark:bg-[#27272A] text-[#6C55D9] dark:text-purple-300 font-bold border border-[#6C55D9]/30'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="font-khmer">ភាគ {chap.chapterNumber}: {chap.title}</span>
                  {chap.chapterNumber === chapterNumber && (
                    <span className="text-xs px-2 py-0.5 rounded bg-[#6C55D9] text-white">កំពុងអាន</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
