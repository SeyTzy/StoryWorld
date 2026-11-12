import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FolderTree, X, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Category } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('សូមបញ្ចូលឈ្មោះប្រភេទរឿង');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
      };

      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, payload);
      } else {
        await adminService.createCategory(payload);
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'រក្សាទុកមិនបានជោគជ័យ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await adminService.deleteCategory(deletingId);
      setDeletingId(null);
      fetchCategories();
    } catch (err) {
      console.error('Delete category error:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#242424] font-khmerTitle">
            គ្រប់គ្រងប្រភេទរឿង (Categories)
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] mt-1 font-khmer">
            បង្កើត និងគ្រប់គ្រងចំណាត់ថ្នាក់ប្រភេទរឿងក្នុងបណ្ណាល័យ
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-[#6C55D9] hover:bg-[#5841C5] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>បង្កើតប្រភេទថ្មី</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-soft overflow-hidden">
        {loading ? (
          <LoadingSpinner text="កំពុងទាញយកប្រភេទរឿង..." className="py-20" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F7F5F1] text-xs text-[#777777] uppercase font-mono">
                <tr>
                  <th className="px-6 py-4">ឈ្មោះប្រភេទ</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">ការពិពណ៌នា</th>
                  <th className="px-6 py-4">ចំនួនរឿង</th>
                  <th className="px-6 py-4 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#242424] font-khmer flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#E9E5FA] text-[#6C55D9] flex items-center justify-center">
                        <FolderTree className="w-4 h-4" />
                      </div>
                      <span>{cat.name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[#777777]">
                      {cat.slug}
                    </td>
                    <td className="px-6 py-4 text-[#555555] text-xs max-w-xs truncate">
                      {cat.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-[#555555] font-semibold">
                      {cat._count?.stories ?? 0} រឿង
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 rounded-lg hover:bg-[#E9E5FA] text-[#6C55D9]"
                        title="កែសម្រួល"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(cat.id)}
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

      {/* Modal Add / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
              <h2 className="text-xl font-bold text-[#242424] font-khmerTitle">
                {editingCategory ? 'កែសម្រួលប្រភេទរឿង' : 'បង្កើតប្រភេទរឿងថ្មី'}
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
              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1 font-khmer">
                  ឈ្មោះប្រភេទរឿង *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ឧ. រឿងព្រេងនិទាន"
                  className="w-full px-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1 font-khmer">
                  Slug (អក្សរកាត់សម្រាប់តំណភ្ជាប់)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ឧ. folktales"
                  className="w-full px-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1 font-khmer">
                  ការពិពណ៌នា
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="រៀបរាប់ត្រួសៗអំពីប្រភេទរឿងនេះ..."
                  className="w-full px-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] text-sm resize-none"
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
            <h3 className="font-bold text-lg text-[#242424] font-khmerTitle">បញ្ជាក់ការលុប</h3>
            <p className="text-xs text-[#777777]">
              តើអ្នកពិតជាចង់លុបប្រភេទរឿងនេះមែនទេ?
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
