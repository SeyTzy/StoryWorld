import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  FileText, 
  X, 
  AlertCircle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { categoryService } from '../../services/categoryService';
import { Story, Category, StoryStatus } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminStories: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: '',
    categoryId: '',
    description: '',
    coverImage: '',
    status: 'PUBLISHED' as StoryStatus,
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const [storiesRes, cats] = await Promise.all([
        adminService.getStories({ page, limit: 10, search: searchTerm || undefined }),
        categoryService.getCategories(),
      ]);
      setStories(storiesRes.data);
      setTotalPages(storiesRes.pagination.totalPages);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [page, searchTerm]);

  // Check query params for actions
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleOpenCreate();
      searchParams.delete('action');
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  const handleOpenCreate = () => {
    setEditingStory(null);
    setFormData({
      title: '',
      slug: '',
      author: '',
      categoryId: categories[0]?.id || '',
      description: '',
      coverImage: '',
      status: 'PUBLISHED',
    });
    setCoverFile(null);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (story: Story) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      slug: story.slug,
      author: story.author,
      categoryId: story.categoryId,
      description: story.description,
      coverImage: story.coverImage || '',
      status: story.status,
    });
    setCoverFile(null);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.title || !formData.author || !formData.categoryId || !formData.description) {
      setErrorMsg('សូមបំពេញព័ត៌មានដែលចាំបាច់ទាំងអស់');
      return;
    }

    try {
      setSaving(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('slug', formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'));
      data.append('author', formData.author);
      data.append('categoryId', formData.categoryId);
      data.append('description', formData.description);
      data.append('status', formData.status);
      if (formData.coverImage) {
        data.append('coverImage', formData.coverImage);
      }
      if (coverFile) {
        data.append('cover', coverFile);
      }

      if (editingStory) {
        await adminService.updateStory(editingStory.id, data);
      } else {
        await adminService.createStory(data);
      }

      setIsModalOpen(false);
      fetchStories();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'ការរក្សាទុកមិនបានសម្រេច។ សូមពិនិត្យទិន្នន័យម្តងទៀត។');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await adminService.deleteStory(deletingId);
      setDeletingId(null);
      fetchStories();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#242424] font-khmerTitle">
            គ្រប់គ្រងរឿងទាំងអស់
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] mt-1 font-khmer">
            បង្កើត កែសម្រួល បោះផ្សាយ ឬលុបរឿងចេញពីប្រព័ន្ធ
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-[#6C55D9] hover:bg-[#5841C5] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>បង្កើតរឿងថ្មី</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="ស្វែងរកតាមចំណងជើង ឬអ្នកនិពន្ធ..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-[#F7F5F1] rounded-xl text-sm border border-transparent focus:border-[#6C55D9] focus:outline-none"
          />
          <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Stories Table */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-soft overflow-hidden">
        {loading ? (
          <LoadingSpinner text="កំពុងទាញយកបញ្ជីរឿង..." className="py-20" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F7F5F1] text-xs text-[#777777] uppercase font-mono">
                <tr>
                  <th className="px-6 py-4">រឿង</th>
                  <th className="px-6 py-4">អ្នកនិពន្ធ</th>
                  <th className="px-6 py-4">ប្រភេទ</th>
                  <th className="px-6 py-4">ចំនួនភាគ</th>
                  <th className="px-6 py-4">ស្ថានភាព</th>
                  <th className="px-6 py-4 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {stories.map((story) => (
                  <tr key={story.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#242424] font-khmer flex items-center gap-3">
                      <img
                        src={story.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=100'}
                        alt=""
                        className="w-10 h-12 object-cover rounded-lg bg-gray-100 shrink-0"
                      />
                      <div>
                        <p className="line-clamp-1">{story.title}</p>
                        <span className="text-[11px] font-mono font-normal text-[#777777]">
                          /stories/{story.slug}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#555555]">{story.author}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#E9E5FA] text-[#6C55D9]">
                        {story.category?.name || 'ទូទៅ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#555555]">
                      <Link
                        to={`/admin/chapters?storyId=${story.id}`}
                        className="text-xs font-semibold text-[#6C55D9] hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{story._count?.chapters ?? (story.chapters ? story.chapters.length : 0)} ភាគ</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          story.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {story.status === 'PUBLISHED' ? 'បានបោះផ្សាយ' : 'ព្រាងទុក'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/stories/${story.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 inline-block"
                        title="មើលរឿងជាក់ស្តែង"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(story)}
                        className="p-1.5 rounded-lg hover:bg-[#E9E5FA] text-[#6C55D9]"
                        title="កែសម្រួល"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(story.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                        title="លុប"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
            className="px-4 py-2 border rounded-xl text-xs font-medium disabled:opacity-40"
          >
            មុន
          </button>
          <span className="px-4 py-2 text-xs font-medium font-khmer">
            ទំព័រ {page} នៃ {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
            className="px-4 py-2 border rounded-xl text-xs font-medium disabled:opacity-40"
          >
            បន្ទាប់
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
              <h2 className="text-xl font-bold text-[#242424] font-khmerTitle">
                {editingStory ? 'កែសម្រួលរឿង' : 'បង្កើតរឿងថ្មី'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-[#777777]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1 font-khmer">
                  ចំណងជើងរឿង *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ឧ. រឿងកុលាបប៉ៃលិន"
                  className="w-full px-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] focus:bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#242424] mb-1 font-khmer">
                    ឈ្មោះអ្នកនិពន្ធ *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="ឧ. ញ៉ុក ថែម"
                    className="w-full px-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] focus:bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#242424] mb-1 font-khmer">
                    ប្រភេទរឿង *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] focus:bg-white text-sm"
                  >
                    <option value="">-- ជ្រើសរើសប្រភេទ --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#242424] mb-1 font-khmer">
                    ស្ថានភាពបោះផ្សាយ
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StoryStatus })}
                    className="w-full px-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] focus:bg-white text-sm"
                  >
                    <option value="PUBLISHED">បានបោះផ្សាយ (PUBLISHED)</option>
                    <option value="DRAFT">ព្រាងទុក (DRAFT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#242424] mb-1 font-khmer">
                    តំណភ្ជាប់រូបគម្រប (Image URL)
                  </label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1 font-khmer">
                  ឬផ្ទុករូបភាពពីកុំព្យូទ័រ
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#E9E5FA] file:text-[#6C55D9] hover:file:bg-[#6C55D9] hover:file:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1 font-khmer">
                  សេចក្តីសង្ខេបនៃរឿង *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="រៀបរាប់ត្រួសៗអំពីដំណើររឿង..."
                  className="w-full px-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] focus:bg-white text-sm resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#EAEAEA]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border rounded-xl text-xs font-semibold hover:bg-gray-50"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#6C55D9] hover:bg-[#5841C5] text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  {saving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#242424] font-khmerTitle">បញ្ជាក់ការលុបរឿង</h3>
            <p className="text-xs text-[#777777]">
              តើអ្នកពិតជាចង់លុបរឿងនេះមែនទេ? រាល់ភាគទាំងអស់នៃរឿងនេះក៏នឹងត្រូវលុបចេញផងដែរ។
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold hover:bg-gray-50"
              >
                ទេ បោះបង់
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold"
              >
                យល់ព្រមលុប
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
