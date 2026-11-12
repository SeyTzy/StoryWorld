import { create } from 'zustand';
import { ReaderTheme, ReaderContentWidth, ReaderLineHeight } from '../types';

interface ReaderStoreState {
  theme: ReaderTheme;
  fontSize: number;
  lineHeight: ReaderLineHeight;
  contentWidth: ReaderContentWidth;
  setTheme: (theme: ReaderTheme) => void;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  setLineHeight: (lineHeight: ReaderLineHeight) => void;
  setContentWidth: (width: ReaderContentWidth) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
  theme: 'light' as ReaderTheme,
  fontSize: 18,
  lineHeight: 'relaxed' as ReaderLineHeight,
  contentWidth: 'medium' as ReaderContentWidth,
};

export const useReaderStore = create<ReaderStoreState>((set, get) => {
  // Load saved preferences from localStorage
  const savedTheme = (localStorage.getItem('sw_reader_theme') as ReaderTheme) || DEFAULT_SETTINGS.theme;
  const savedFontSize = Number(localStorage.getItem('sw_reader_fontSize')) || DEFAULT_SETTINGS.fontSize;
  const savedLineHeight = (localStorage.getItem('sw_reader_lineHeight') as ReaderLineHeight) || DEFAULT_SETTINGS.lineHeight;
  const savedContentWidth = (localStorage.getItem('sw_reader_contentWidth') as ReaderContentWidth) || DEFAULT_SETTINGS.contentWidth;

  return {
    theme: savedTheme,
    fontSize: savedFontSize,
    lineHeight: savedLineHeight,
    contentWidth: savedContentWidth,

    setTheme: (theme: ReaderTheme) => {
      localStorage.setItem('sw_reader_theme', theme);
      set({ theme });
    },

    setFontSize: (fontSize: number) => {
      const clamped = Math.min(Math.max(fontSize, 14), 28);
      localStorage.setItem('sw_reader_fontSize', String(clamped));
      set({ fontSize: clamped });
    },

    increaseFontSize: () => {
      const current = get().fontSize;
      if (current < 28) {
        const next = current + 2;
        localStorage.setItem('sw_reader_fontSize', String(next));
        set({ fontSize: next });
      }
    },

    decreaseFontSize: () => {
      const current = get().fontSize;
      if (current > 14) {
        const next = current - 2;
        localStorage.setItem('sw_reader_fontSize', String(next));
        set({ fontSize: next });
      }
    },

    setLineHeight: (lineHeight: ReaderLineHeight) => {
      localStorage.setItem('sw_reader_lineHeight', lineHeight);
      set({ lineHeight });
    },

    setContentWidth: (contentWidth: ReaderContentWidth) => {
      localStorage.setItem('sw_reader_contentWidth', contentWidth);
      set({ contentWidth });
    },

    resetSettings: () => {
      localStorage.removeItem('sw_reader_theme');
      localStorage.removeItem('sw_reader_fontSize');
      localStorage.removeItem('sw_reader_lineHeight');
      localStorage.removeItem('sw_reader_contentWidth');
      set(DEFAULT_SETTINGS);
    },
  };
});
