import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookMarked, 
  FileText, 
  Users, 
  FolderTree, 
  Eye, 
  Plus, 
  TrendingUp, 
  ArrowRight
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { DashboardStats, Story } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentStories, setRecentStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [statsData, storiesData] = await Promise.all([
          adminService.getStats(),
          adminService.getStories({ limit: 5 }),
        ]);
        setStats(statsData);
        setRecentStories(storiesData.data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner text="កំពុងទាញយកទិន្នន័យស្ថិតិ..." className="py-24" />;
  }

  const statCards = [
    { label: 'រឿងសរុប (Stories)', value: stats?.totalStories ?? 0, icon: BookMarked, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'ភាគសរុប (Chapters)', value: stats?.totalChapters ?? 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'អ្នកប្រើប្រាស់ (Users)', value: stats?.totalUsers ?? 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'ប្រភេទរឿង (Categories)', value: stats?.totalCategories ?? 0, icon: FolderTree, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'ចំនួនមើលសរុប (Views)', value: stats?.totalViews?.toLocaleString() ?? '0', icon: Eye, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#242424] font-khmerTitle">
            ទិដ្ឋភាពទូទៅនៃប្រព័ន្ធ
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] mt-1 font-khmer">
            ស្វាគមន៍មកកាន់មជ្ឈមណ្ឌលគ្រប់គ្រងមាតិកា និងសហគមន៍ StoryWorld
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/stories?action=new"
            className="px-4 py-2.5 bg-[#6C55D9] hover:bg-[#5841C5] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>បង្កើតរឿងថ្មី</span>
          </Link>
          <Link
            to="/admin/chapters?action=new"
            className="px-4 py-2.5 bg-white border border-[#EAEAEA] hover:bg-gray-50 text-[#242424] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>បន្ថែមភាគថ្មី</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-[#EAEAEA] shadow-soft flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#777777] font-medium truncate">{card.label}</p>
                <p className="text-xl font-extrabold text-[#242424] mt-0.5">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Stories Table */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-soft overflow-hidden">
        <div className="p-6 border-b border-[#EAEAEA] flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base text-[#242424] font-khmerTitle">
            <TrendingUp className="w-5 h-5 text-[#6C55D9]" />
            <span>រឿងដែលបានបញ្ចូលថ្មីៗ</span>
          </div>
          <Link
            to="/admin/stories"
            className="text-xs font-semibold text-[#6C55D9] hover:underline flex items-center gap-1"
          >
            <span>គ្រប់គ្រងរឿងទាំងអស់</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F5F1] text-xs text-[#777777] uppercase font-mono">
              <tr>
                <th className="px-6 py-3.5">ចំណងជើងរឿង</th>
                <th className="px-6 py-3.5">អ្នកនិពន្ធ</th>
                <th className="px-6 py-3.5">ប្រភេទ</th>
                <th className="px-6 py-3.5">ភាគ</th>
                <th className="px-6 py-3.5">ស្ថានភាព</th>
                <th className="px-6 py-3.5 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {recentStories.map((story) => (
                <tr key={story.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#242424] font-khmer flex items-center gap-3">
                    <img
                      src={story.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=100'}
                      alt=""
                      className="w-8 h-10 object-cover rounded-md bg-gray-100 shrink-0"
                    />
                    <span className="line-clamp-1">{story.title}</span>
                  </td>
                  <td className="px-6 py-4 text-[#555555]">{story.author}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#E9E5FA] text-[#6C55D9]">
                      {story.category?.name || 'ទូទៅ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#555555]">
                    {story._count?.chapters ?? (story.chapters ? story.chapters.length : 0)} ភាគ
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        story.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {story.status === 'PUBLISHED' ? 'បានបោះផ្សាយ' : 'ព្រាង'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/stories?edit=${story.id}`}
                      className="text-xs text-[#6C55D9] font-semibold hover:underline"
                    >
                      កែសម្រួល
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
