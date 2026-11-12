import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { storyService } from '../services/storyService';
import { categoryService } from '../services/categoryService';
import { Story, Category } from '../types';
import { StoryGrid } from '../components/stories/StoryGrid';

export const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const sortParam = (searchParams.get('sort') as 'latest' | 'oldest' | 'popular') || 'latest';
  const pageParam = Number(searchParams.get('page')) || 1;

  const [stories, setStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParam);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch categories once
  useEffect(() => {
    categoryService.getCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // Sync search input when url changes
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Fetch stories whenever filter/search/sort/page changes
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const res = await storyService.getStories({
          search: searchParam || undefined,
          category: categoryParam || undefined,
          sort: sortParam,
          page: pageParam,
          limit: 12,
        });
        setStories(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalItems(res.pagination.total);
      } catch (err) {
        console.error('Error fetching stories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [searchParam, categoryParam, sortParam, pageParam]);

  const updateFilters = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, val);
      }
    });
    // Reset to page 1 unless page itself was explicitly updated
    if (!('page' in updates)) {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() || null });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#242424] font-khmerTitle">
          រុករករឿងទាំងអស់
        </h1>
        <p className="text-sm text-[#777777] mt-1 font-khmer">
          ស្វែងរកប្រលោមលោក រឿងនិទាន និងស្នាដៃនិពន្ធខ្មែរគ្រប់ប្រភេទ ({totalItems} រឿង)
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#F7F5F1] p-4 sm:p-6 rounded-3xl border border-[#EAEAEA] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search box */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-6 relative">
            <input
              type="text"
              placeholder="ស្វែងរកតាមចំណងជើង ឬឈ្មោះអ្នកនិពន្ធ..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-24 py-3 bg-white rounded-2xl border border-[#EAEAEA] focus:border-[#6C55D9] focus:outline-none text-sm placeholder:text-[#777777]"
            />
            <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#6C55D9] text-white text-xs font-medium rounded-xl hover:bg-[#5841C5] transition-colors"
            >
              ស្វែងរក
            </button>
          </form>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={categoryParam}
                onChange={(e) => updateFilters({ category: e.target.value || null })}
                className="w-full pl-10 pr-8 py-3 bg-white rounded-2xl border border-[#EAEAEA] focus:border-[#6C55D9] focus:outline-none text-sm text-[#242424] appearance-none"
              >
                <option value="">ប្រភេទទាំងអស់</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Filter className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={sortParam}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="w-full pl-10 pr-8 py-3 bg-white rounded-2xl border border-[#EAEAEA] focus:border-[#6C55D9] focus:outline-none text-sm text-[#242424] appearance-none"
              >
                <option value="latest">រឿងថ្មីៗបំផុត</option>
                <option value="popular">រឿងពេញនិយមបំផុត</option>
                <option value="oldest">រឿងចាស់ៗ</option>
              </select>
              <ArrowUpDown className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Pills Quick Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => updateFilters({ category: null })}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              !categoryParam
                ? 'bg-[#6C55D9] text-white shadow-sm'
                : 'bg-white text-[#777777] hover:bg-[#E9E5FA] hover:text-[#6C55D9] border border-[#EAEAEA]'
            }`}
          >
            ទាំងអស់
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => updateFilters({ category: c.slug })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                categoryParam === c.slug
                  ? 'bg-[#6C55D9] text-white shadow-sm'
                  : 'bg-white text-[#777777] hover:bg-[#E9E5FA] hover:text-[#6C55D9] border border-[#EAEAEA]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Story Grid */}
      <StoryGrid
        stories={stories}
        isLoading={loading}
        emptyTitle="រកមិនឃើញរឿងដែលអ្នកស្វែងរកទេ"
        emptyDescription="សូមព្យាយាមស្វែងរកជាមួយពាក្យគន្លឹះផ្សេង ឬដកតម្រងប្រភេទរឿងចេញ។"
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => updateFilters({ page: String(pageParam - 1) })}
            disabled={pageParam <= 1}
            className={`p-2.5 rounded-xl border border-[#EAEAEA] transition-colors ${
              pageParam > 1
                ? 'hover:bg-[#E9E5FA] hover:text-[#6C55D9]'
                : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="px-4 py-2 text-sm font-medium text-[#242424] font-khmer">
            ទំព័រ {pageParam} នៃ {totalPages}
          </span>

          <button
            onClick={() => updateFilters({ page: String(pageParam + 1) })}
            disabled={pageParam >= totalPages}
            className={`p-2.5 rounded-xl border border-[#EAEAEA] transition-colors ${
              pageParam < totalPages
                ? 'hover:bg-[#E9E5FA] hover:text-[#6C55D9]'
                : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
