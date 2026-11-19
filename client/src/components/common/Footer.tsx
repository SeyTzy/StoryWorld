import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F7F5F1] border-t border-[#EAEAEA] mt-16 sm:mt-20 pt-10 sm:pt-16 pb-8 sm:pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="lg:max-w-xs xl:max-w-sm space-y-3 pb-6 border-b border-[#EAEAEA]/80 lg:border-b-0 lg:pb-0 shrink-0">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#6C55D9] flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#242424] font-sans">
                Story<span className="text-[#6C55D9]">World</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[#777777] leading-relaxed font-khmer">
              គេហទំព័រអានរឿងខ្មែរតាមប្រព័ន្ធអ៊ីនធឺណិតទំនើប ផ្តល់ជូននូវបទពិសោធន៍អានដ៏កក់ក្តៅ និងស្រួលភ្នែកសម្រាប់អ្នកអានគ្រប់រូប។
            </p>
          </div>

          {/* 3 Balanced Link Columns (Always 3 columns per row, side-by-side on mobile and desktop) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 flex-1 lg:max-w-2xl">
            
            {/* Quick Links */}
            <div className="min-w-0">
              <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#242424] mb-2.5 sm:mb-4 font-sans break-words">
                រុករក
              </h3>
              <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm text-[#777777]">
                <li>
                  <Link to="/" className="hover:text-[#6C55D9] transition-colors block py-0.5 break-words">
                    ទំព័រដើម
                  </Link>
                </li>
                <li>
                  <Link to="/explore" className="hover:text-[#6C55D9] transition-colors block py-0.5 break-words">
                    រឿងទាំងអស់
                  </Link>
                </li>
                <li>
                  <Link to="/explore?sort=popular" className="hover:text-[#6C55D9] transition-colors block py-0.5 break-words">
                    រឿងពេញនិយម
                  </Link>
                </li>
                <li>
                  <Link to="/explore?sort=latest" className="hover:text-[#6C55D9] transition-colors block py-0.5 break-words">
                    រឿងថ្មីៗ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="min-w-0">
              <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#242424] mb-2.5 sm:mb-4 font-sans break-words">
                ប្រភេទរឿង
              </h3>
              <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm text-[#777777]">
                <li>
                  <Link to="/explore?category=donghou" className="hover:text-[#6C55D9] transition-colors block py-0.5 break-words">
                    រឿងនិទាន Novel
                  </Link>
                </li>
                <li>
                  <Link to="/explore?category=manhwa" className="hover:text-[#6C55D9] transition-colors block py-0.5 break-words">
                    រឿងនិទាន Manhwa
                  </Link>
                </li>
                <li>
                  <Link to="/explore?category=mystery" className="hover:text-[#6C55D9] transition-colors block py-0.5 break-words">
                    រឿងអាថ៌កំបាំង
                  </Link>
                </li>
                <li>
                  <Link to="/explore?category=education" className="hover:text-[#6C55D9] transition-colors block py-0.5 break-words">
                    រឿងអប់រំ និងទស្សនវិជ្ជា
                  </Link>
                </li>
              </ul>
            </div>

            {/* About / Library */}
            <div className="min-w-0">
              <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#242424] mb-2.5 sm:mb-4 font-sans break-words">
                គណនី និងជំនួយ
              </h3>
              <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm text-[#777777]">
                <li>
                  <Link to="/my-library" className="hover:text-[#6C55D9] transition-colors block py-0.5 break-words">
                    បណ្ណាល័យរបស់ខ្ញុំ
                  </Link>
                </li>
                <li>
                  <Link to="/history" className="hover:text-[#6C55D9] transition-colors block py-0.5 break-words">
                    ប្រវត្តិអាន
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[#6C55D9] transition-colors block py-0.5 break-words">
                    ចូលគណនី
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-[#6C55D9] transition-colors block py-0.5 break-words">
                    បង្កើតគណនីថ្មី
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar - Centered Copyright & Attribution */}
        <div className="border-t border-[#EAEAEA] mt-10 sm:mt-12 pt-6 sm:pt-8 flex flex-col items-center justify-center text-center text-xs text-[#777777] gap-2">
          <p className="flex items-center justify-center gap-1.5 flex-wrap">
            <span>បង្កើតឡើងដោយក្តីស្រឡាញ់ចំពោះអក្សរសាស្ត្រខ្មែរ</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline shrink-0" />
          </p>
          <p>© {new Date().getFullYear()} StoryWorld. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
