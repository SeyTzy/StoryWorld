import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { storyService } from '../../services/storyService';
import { Story, Chapter } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminChapters: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialStoryId = searchParams.get('storyId') || '';

  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryId, setSelectedStoryId] = useState(initialStoryId);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    adminService.getStories({ limit: 100 }).then((res) => {
      setStories(res.data);
      if (!selectedStoryId && res.data.length > 0) {
        setSelectedStoryId(res.data[0].id);
      }
    });
  }, []);

  const fetchSelectedStory = async (storyId: string) => {
    if (!storyId) return;
    try {
      setLoading(true);
      const story = stories.find((s) => s.id === storyId);
      if (story) {
        const full = await storyService.getStoryBySlug(story.slug);
        setCurrentStory(full);
      }
    } catch (err) {
      console.error('Failed to load story chapters', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStoryId) {
      fetchSelectedStory(selectedStoryId);
    }
  }, [selectedStoryId, stories]);

  const handleOpenCreate = () => {
    setEditingChapter(null);
    const nextNum = (currentStory?.chapters?.length || 0) + 1;
    setChapterNumber(nextNum);
    setTitle(`ភាគទី ${nextNum}`);
    setContent('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (chapterSummary: any) => {
    try {
      setLoading(true);
      const fullChap = await storyService.getChapterById(chapterSummary.id);
      setEditingChapter(fullChap);
      setChapterNumber(fullChap.chapterNumber);
      setTitle(fullChap.title);
      setContent(fullChap.content);
      setErrorMsg(null);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to load chapter for edit', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStoryId || !title.trim() || !content.trim()) {
      setErrorMsg('សូមបំពេញចំណងជើង និងខ្លឹមសារភាគ');
      return;
    }

    try {
      setSaving(true);
      if (editingChapter) {
        await adminService.updateChapter(editingChapter.id, {
          chapterNumber,
          title: title.trim(),
          content: content.trim(),
        });
      } else {
        await adminService.createChapter({
          storyId: selectedStoryId,
          chapterNumber,
          title: title.trim(),
          content: content.trim(),
        });
      }

      setIsModalOpen(false);
      fetchSelectedStory(selectedStoryId);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'ការរក្សាទុកមិនបានសម្រេច');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await adminService.deleteChapter(deletingId);
      setDeletingId(null);
      fetchSelectedStory(selectedStoryId);
    } catch (err) {
      console.error('Delete chapter error:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#242424] font-khmerTitle">
            គ្រប់គ្រងភាគនៃរឿង
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] mt-1 font-khmer">
            បន្ថែម ផ្លាស់ប្តូរ និងកែសម្រួលអត្ថបទនៃភាគនីមួយៗ
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          disabled={!selectedStoryId}
          className="px-5 py-2.5 bg-[#6C55D9] hover:bg-[#5841C5] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>បន្ថែមភាគថ្មី</span>
        </button>
      </div>

      {/* Select Story */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#EAEAEA] flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <label className="text-sm font-bold text-[#242424] font-khmer shrink-0">
          ជ្រើសរើសរឿង៖
        </label>
        <select
          value={selectedStoryId}
          onChange={(e) => setSelectedStoryId(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] text-sm text-[#242424]"
        >
          {stories.map((story) => (
            <option key={story.id} value={story.id}>
              {story.title} ({story.author})
            </option>
          ))}
        </select>
      </div>

      {/* Chapters Table */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-soft overflow-hidden">
        {loading ? (
          <LoadingSpinner text="កំពុងទាញយកទិន្នន័យភាគ..." className="py-20" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F7F5F1] text-xs text-[#777777] uppercase font-mono">
                <tr>
                  <th className="px-6 py-4">ភាគទី</th>
                  <th className="px-6 py-4">ចំណងជើងភាគ</th>
                  <th className="px-6 py-4">កាលបរិច្ឆេទបង្កើត</th>
                  <th className="px-6 py-4 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {currentStory?.chapters && currentStory.chapters.length > 0 ? (
                  currentStory.chapters.map((chap) => (
                    <tr key={chap.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-[#6C55D9]">
                        {chap.chapterNumber}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#242424] font-khmer">
                        {chap.title}
                      </td>
                      <td className="px-6 py-4 text-[#777777] text-xs">
                        {new Date(chap.createdAt).toLocaleDateString('km-KH')}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(chap)}
                          className="p-1.5 rounded-lg hover:bg-[#E9E5FA] text-[#6C55D9]"
                          title="កែសម្រួល"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(chap.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                          title="លុប"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-[#777777]">
                      មិនទាន់មានភាគនៅឡើយទេ។ ចុច "បន្ថែមភាគថ្មី" ដើម្បីបញ្ចូលភាគដំបូង។
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add / Edit Chapter */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
              <h2 className="text-xl font-bold text-[#242424] font-khmerTitle">
                {editingChapter ? 'កែសម្រួលភាគ' : 'បន្ថែមភាគថ្មី'}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-[#242424] mb-1 font-khmer">
                    ភាគទី # *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-[#242424] mb-1 font-khmer">
                    ចំណងជើងភាគ *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ឧ. ភាគ ១៖ ការចាប់ផ្តើមដំណើរ"
                    className="w-full px-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] text-sm font-khmer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1 font-khmer">
                  ខ្លឹមសារនៃភាគ (Khmer Story Content) *
                </label>
                <textarea
                  rows={14}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="សរសេរ ឬបិទភ្ជាប់ខ្លឹមសារអត្ថបទរឿងជាភាសាខ្មែរនៅទីនេះ..."
                  className="w-full p-4 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] focus:bg-white text-sm font-khmer leading-relaxed"
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

      {/* Delete Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#242424] font-khmerTitle">បញ្ជាក់ការលុបភាគ</h3>
            <p className="text-xs text-[#777777]">
              តើអ្នកពិតជាចង់លុបភាគនេះចេញពីប្រព័ន្ធមែនទេ?
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
