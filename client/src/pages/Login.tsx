import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const isSessionExpired = queryParams.get('expired') === '1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('សូមបំពេញអ៊ីមែល និងពាក្យសម្ងាត់');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.login({ email, password });
      login(res.user, res.token);

      if (res.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'ការចូលប្រើបរាជ័យ។ សូមពិនិត្យអ៊ីមែល និងពាក្យសម្ងាត់របស់អ្នកម្តងទៀត។';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAEAEA] shadow-soft p-8 sm:p-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#6C55D9] flex items-center justify-center text-white shadow-soft">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#242424] font-khmerTitle">
            ចូលប្រើប្រាស់ StoryWorld
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] font-khmer">
            សូមស្វាគមន៍មកកាន់បណ្ណាល័យអានរឿងខ្មែរ
          </p>
        </div>

        {isSessionExpired && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>សម័យការរបស់អ្នកបានផុតកំណត់ហើយ។ សូមចូលប្រើម្តងទៀត។</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-khmer">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#242424] mb-1.5 font-khmer">
              អ៊ីមែល (Email)
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ឈ្មោះ@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F1] border border-transparent rounded-xl focus:bg-white focus:border-[#6C55D9] focus:outline-none text-sm transition-all"
              />
              <Mail className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#242424] mb-1.5 font-khmer">
              ពាក្យសម្ងាត់ (Password)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F1] border border-transparent rounded-xl focus:bg-white focus:border-[#6C55D9] focus:outline-none text-sm transition-all"
              />
              <Lock className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-[#777777]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#EAEAEA] text-[#6C55D9] focus:ring-[#6C55D9]"
              />
              <span>ចងចាំខ្ញុំ</span>
            </label>
            <span className="text-[#777777] hover:text-[#6C55D9] cursor-pointer">
              ភ្លេចពាក្យសម្ងាត់?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#6C55D9] hover:bg-[#5841C5] text-white font-bold rounded-xl text-sm shadow-soft transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>កំពុងចូល...</span>
              </>
            ) : (
              <>
                <span>ចូលគណនី</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-[#EAEAEA] text-xs text-[#777777]">
          <span>មិនទាន់មានគណនីនៅឡើយទេ? </span>
          <Link to="/register" className="text-[#6C55D9] font-bold hover:underline">
            ចុះឈ្មោះទីនេះ
          </Link>
        </div>
      </div>
    </div>
  );
};
