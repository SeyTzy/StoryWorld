import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F7F5F1] border-t border-[#EAEAEA] mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#6C55D9] flex items-center justify-center text-white shadow-soft">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#242424] font-sans">
                Story<span className="text-[#6C55D9]">World</span>
              </span>
            </Link>
            <p className="text-sm text-[#777777] leading-relaxed font-khmer">
              គេហទំព័រអានរឿងខ្មែរតាមប្រព័ន្ធអ៊ីនធឺណិតទំនើប ផ្តល់ជូននូវបទពិសោធន៍អានដ៏កក់ក្តៅ និងស្រួលភ្នែកសម្រាប់អ្នកអានគ្រប់រូប។
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#242424] mb-4 font-sans">
              រុករក
            </h3>
            <ul className="space-y-2.5 text-sm text-[#777777]">
              <li>
                <Link to="/" className="hover:text-[#6C55D9] transition-colors">ទំព័រដើម</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-[#6C55D9] transition-colors">រឿងទាំងអស់</Link>
              </li>
              <li>
                <Link to="/explore?sort=popular" className="hover:text-[#6C55D9] transition-colors">រឿងពេញនិយម</Link>
              </li>
              <li>
                <Link to="/explore?sort=latest" className="hover:text-[#6C55D9] transition-colors">រឿងថ្មីៗ</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#242424] mb-4 font-sans">
              ប្រភេទរឿង
            </h3>
            <ul className="space-y-2.5 text-sm text-[#777777]">
              <li>
                <Link to="/explore?category=donghou" className="hover:text-[#6C55D9] transition-colors">រឿងនិទាន Novel</Link>
              </li>
              <li>
                <Link to="/explore?category=manhwa" className="hover:text-[#6C55D9] transition-colors">រឿងនិទាន Manhwa</Link>
              </li>
              <li>
                <Link to="/explore?category=mystery" className="hover:text-[#6C55D9] transition-colors">រឿងអាថ៌កំបាំង</Link>
              </li>
              <li>
                <Link to="/explore?category=education" className="hover:text-[#6C55D9] transition-colors">រឿងអប់រំ និងទស្សនវិជ្ជា</Link>
              </li>
            </ul>
          </div>

          {/* About / Library */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#242424] mb-4 font-sans">
              គណនី និងជំនួយ
            </h3>
            <ul className="space-y-2.5 text-sm text-[#777777]">
              <li>
                <Link to="/my-library" className="hover:text-[#6C55D9] transition-colors">បណ្ណាល័យរបស់ខ្ញុំ</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-[#6C55D9] transition-colors">ប្រវត្តិអាន</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#6C55D9] transition-colors">ចូលគណនី</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#6C55D9] transition-colors">បង្កើតគណនីថ្មី</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#EAEAEA] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#777777] gap-4">
          <p>© {new Date().getFullYear()} StoryWorld. All rights reserved.</p>
          <p className="flex items-center gap-1">
            បង្កើតឡើងដោយក្តីស្រឡាញ់ចំពោះអក្សរសាស្ត្រខ្មែរ <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
