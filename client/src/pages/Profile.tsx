import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Shield, Calendar, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

export const Profile: React.FC = () => {
  const { user, setUser, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMessage('ពាក្យសម្ងាត់ថ្មីមិនត្រូវគ្នាទេ');
      return;
    }

    try {
      setUpdating(true);
      const updated = await authService.updateProfile({
        name: name.trim() || undefined,
        password: newPassword || undefined,
        avatar: avatarUrl.trim() || undefined,
      });

      setUser(updated);
      setSuccessMessage('ព័ត៌មានគណនីត្រូវបានកែប្រែដោយជោគជ័យ!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'មិនអាចកែប្រែព័ត៌មានបានទេ។ សូមព្យាយាមម្តងទៀត។');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#242424] font-khmerTitle">
          គណនីរបស់ខ្ញុំ
        </h1>
        <p className="text-sm text-[#777777] mt-1 font-khmer">
          គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន និងសុវត្ថិភាពគណនីរបស់អ្នក
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* User Card */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-[#EAEAEA] p-6 text-center space-y-4 shadow-soft">
          <div className="w-24 h-24 rounded-full bg-[#6C55D9] text-white flex items-center justify-center font-bold text-3xl mx-auto shadow-md overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#242424] font-khmerTitle">{user.name}</h2>
            <p className="text-xs text-[#777777] mt-0.5">{user.email}</p>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5 text-xs text-left text-[#777777]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#6C55D9]" />
                <span>តួនាទី (Role)</span>
              </span>
              <span className="font-bold text-[#6C55D9] bg-[#E9E5FA] px-2 py-0.5 rounded-full">
                {user.role}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#6C55D9]" />
                <span>ថ្ងៃចូលរួម</span>
              </span>
              <span>{new Date(user.createdAt).toLocaleDateString('km-KH')}</span>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-[#EAEAEA] p-6 sm:p-8 shadow-soft">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <h3 className="font-bold text-lg text-[#242424] font-khmerTitle pb-2 border-b border-[#EAEAEA]">
              កែប្រែព័ត៌មានគណនី
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1.5 font-khmer">
                  ឈ្មោះអ្នកប្រើប្រាស់ (Name)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] focus:bg-white focus:outline-none text-sm transition-all"
                  />
                  <User className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1.5 font-khmer">
                  តំណភ្ជាប់រូបតំណាង (Avatar Image URL)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] focus:bg-white focus:outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1.5 font-khmer">
                  អ៊ីមែល (Email) - មិនអាចកែប្រែបានទេ
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border border-transparent text-gray-500 text-sm cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <h3 className="font-bold text-lg text-[#242424] font-khmerTitle pt-4 pb-2 border-b border-[#EAEAEA]">
              ផ្លាស់ប្តូរពាក្យសម្ងាត់ (ទុកទទេបើមិនចង់ប្តូរ)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1.5 font-khmer">
                  ពាក្យសម្ងាត់ថ្មី
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] focus:bg-white focus:outline-none text-sm"
                  />
                  <Lock className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1.5 font-khmer">
                  ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់ថ្មី
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F1] rounded-xl border border-transparent focus:border-[#6C55D9] focus:bg-white focus:outline-none text-sm"
                  />
                  <Lock className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-3 bg-[#6C55D9] hover:bg-[#5841C5] text-white font-bold rounded-xl text-sm shadow-soft transition-all flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>កំពុងរក្សាទុក...</span>
                  </>
                ) : (
                  <span>រក្សាទុកព័ត៌មាន</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
