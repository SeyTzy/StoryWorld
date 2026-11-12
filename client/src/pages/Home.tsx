import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Flame, 
  BookMarked, 
  Compass,
  CheckCircle2
} from 'lucide-react';
import { storyService } from '../services/storyService';
import { categoryService } from '../services/categoryService';
import { Story, Category } from '../types';
import { StoryGrid } from '../components/stories/StoryGrid';

export const Home: React.FC = () => {
  const [featuredStories, setFeaturedStories] = useState<Story[]>([]);
  const [popularStories, setPopularStories] = useState<Story[]>([]);
  const [latestStories, setLatestStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [feat, pop, latest, cats] = await Promise.allSettled([
          storyService.getFeaturedStories(),
          storyService.getPopularStories(),
          storyService.getLatestStories(),
          categoryService.getCategories(),
        ]);

        if (feat.status === 'fulfilled') setFeaturedStories(feat.value);
        if (pop.status === 'fulfilled') setPopularStories(pop.value);
        if (latest.status === 'fulfilled') setLatestStories(latest.value);
        if (cats.status === 'fulfilled') setCategories(cats.value);
      } catch (err) {
        console.error('Home page load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F5F1] to-white pt-12 pb-20 border-b border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9E5FA] text-[#6C55D9] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>គេហទំព័រអានរឿងខ្មែរទំនើបលេខ ១</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#242424] leading-tight font-khmerTitle">
                ស្វែងរកពិភពរឿងខ្មែរ <br />
                <span className="text-[#6C55D9]">រីករាយនឹងការអាន</span> គ្រប់ពេលវេលា
              </h1>

              <p className="text-base sm:text-lg text-[#777777] max-w-xl mx-auto lg:mx-0 leading-relaxed font-khmer">
                ប្រមូលផ្តុំរឿងនិទានបុរាណខ្មែរ រឿងប្រលោមលោក រឿងខ្លី និងរឿងអប់រំជាច្រើនសម្បូរបែប ជាមួយនឹងផ្ទាំងអានដ៏ស្រួលភ្នែក និងមានផាសុកភាពបំផុត។
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/explore"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#6C55D9] hover:bg-[#5841C5] text-white font-medium text-base shadow-soft hover:shadow-card-hover transition-all"
                >
                  <Compass className="w-5 h-5" />
                  <span>រុករករឿងទាំងអស់</span>
                </Link>

                <Link
                  to="/explore?sort=popular"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-50 text-[#242424] border border-[#EAEAEA] font-medium text-base shadow-sm transition-all"
                >
                  <Flame className="w-5 h-5 text-amber-500" />
                  <span>រឿងកំពុងពេញនិយម</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#777777]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>អានឥតគិតថ្លៃ ១០០%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>កំណត់ទំហំអក្សរ & ផ្ទាំងពណ៌បាន</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>ចងចាំប្រវត្តិអានស្វ័យប្រវត្តិ</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual / Book composition */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-3xl bg-white p-4 shadow-card border border-[#EAEAEA]">
                <div className="w-full h-full rounded-2xl overflow-hidden relative group">
                  <img
                    src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop"
                    alt="StoryWorld Editorial Showcase"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="px-2.5 py-1 rounded-full bg-[#6C55D9] text-white text-xs font-semibold w-max mb-2">
                      ពិសេសប្រចាំសប្តាហ៍
                    </span>
                    <h2 className="text-xl font-bold font-khmerTitle leading-snug">
                      ទំព័រសៀវភៅនៃក្តីស្រមៃ និងការចងចាំ
                    </h2>
                    <p className="text-xs text-white/80 line-clamp-2 mt-1">
                      ជ្រើសរើសរឿងល្អៗដើម្បីពង្រីកចំណេះដឹង និងបណ្តែតអារម្មណ៍ជាមួយស្នាដៃនិពន្ធដ៏ល្អឯក។
                    </p>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-5 -left-5 bg-white p-3.5 rounded-2xl shadow-card border border-[#EAEAEA] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E9E5FA] text-[#6C55D9] flex items-center justify-center">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#777777]">ចំណាំរឿង</p>
                    <p className="text-sm font-bold text-[#242424]">អានបន្តគ្រប់ទីកន្លែង</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#242424] font-khmerTitle">
              ប្រភេទរឿងពេញនិយម
            </h2>
            <p className="text-xs sm:text-sm text-[#777777]">ជ្រើសរើសប្រភេទរឿងដែលលោកអ្នកចូលចិត្ត</p>
          </div>
          <Link
            to="/explore"
            className="text-xs sm:text-sm font-medium text-[#6C55D9] hover:underline flex items-center gap-1"
          >
            <span>មើលទាំងអស់</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/explore?category=${cat.slug}`}
              className="p-4 rounded-2xl bg-[#F7F5F1] hover:bg-[#E9E5FA] border border-[#EAEAEA] hover:border-[#6C55D9]/40 text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform text-[#6C55D9]">
                <BookOpen className="w-5 h-5" />
              </div>
              <p className="font-bold text-sm text-[#242424] group-hover:text-[#6C55D9] font-khmer transition-colors">
                {cat.name}
              </p>
              {cat._count?.stories !== undefined && (
                <p className="text-[11px] text-[#777777] mt-0.5">{cat._count.stories} រឿង</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6C55D9] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>រឿងណែនាំពិសេស</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] font-khmerTitle">
              រឿងដែលអ្នកមិនគួររំលង
            </h2>
          </div>
          <Link
            to="/explore?sort=popular"
            className="text-sm font-medium text-[#6C55D9] hover:text-[#5841C5] flex items-center gap-1"
          >
            <span>ស្វែងរកបន្ថែម</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <StoryGrid stories={featuredStories.slice(0, 4)} isLoading={loading} />
      </section>

      {/* Popular Stories Section */}
      <section className="bg-[#F7F5F1] py-16 border-y border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>មានអ្នកអានច្រើនជាងគេ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] font-khmerTitle">
                រឿងពេញនិយមបំផុត
              </h2>
            </div>
            <Link
              to="/explore?sort=popular"
              className="text-sm font-medium text-[#6C55D9] hover:text-[#5841C5] flex items-center gap-1"
            >
              <span>មើលទាំងអស់</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <StoryGrid stories={popularStories.slice(0, 8)} isLoading={loading} />
        </div>
      </section>

      {/* Latest Stories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
              <Clock className="w-4 h-4" />
              <span>ទើបចេញផ្សាយថ្មីៗ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] font-khmerTitle">
              រឿងទើបនឹងបន្ថែម
            </h2>
          </div>
          <Link
            to="/explore?sort=latest"
            className="text-sm font-medium text-[#6C55D9] hover:text-[#5841C5] flex items-center gap-1"
          >
            <span>មើលទាំងអស់</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <StoryGrid stories={latestStories.slice(0, 8)} isLoading={loading} />
      </section>

      {/* Reading Callout / Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#6C55D9] to-[#5841C5] text-white p-8 sm:p-12 overflow-hidden shadow-card">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-khmerTitle leading-tight">
              បង្កើតទម្លាប់អានរាល់ថ្ងៃ <br />ជាមួយ StoryWorld
            </h2>
            <p className="text-sm sm:text-base text-purple-100 font-khmer leading-relaxed">
              ចូលរួមជាមួយសហគមន៍អ្នកអានខ្មែរ ចំណាំសៀវភៅដែលអ្នកចូលចិត្ត និងតាមដានដំណើរការអានរបស់អ្នកដោយងាយស្រួល។
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#6C55D9] font-bold text-sm shadow-sm hover:bg-purple-50 transition-colors"
              >
                <span>បង្កើតគណនីឥតគិតថ្លៃ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="absolute right-[-40px] -bottom-10 opacity-15 pointer-events-none">
            <BookOpen className="w-96 h-96" />
          </div>
        </div>
      </section>
    </div>
  );
};
