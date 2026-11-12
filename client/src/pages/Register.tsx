import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError('សូមបំពេញព័ត៌មានទាំងអស់អោយបានពេញលេញ');
      return;
    }

    if (password.length < 6) {
      setError('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ');
      return;
    }

    if (password !== confirmPassword) {
      setError('ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.register({ name, email, password });
      login(res.user, res.token);
      navigate('/');
    } catch (err: any) {
      const message = err.response?.data?.message || 'ការចុះឈ្មោះមិនបានសម្រេច។ អ៊ីមែលនេះប្រហែលជាត្រូវបានប្រើប្រាស់រួចហើយ។';
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
            បង្កើតគណនីថ្មី
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] font-khmer">
            ក្លាយជាសមាជិកដើម្បីរក្សាទុក និងតាមដានរឿងដែលអ្នកចូលចិត្ត
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-khmer">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#242424] mb-1.5 font-khmer">
              ឈ្មោះពេញ (Full Name)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ឧ. សុខ ចិន្តា"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F1] border border-transparent rounded-xl focus:bg-white focus:border-[#6C55D9] focus:outline-none text-sm transition-all"
              />
              <User className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

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
                placeholder="យ៉ាងតិច ៦ តួអក្សរ"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F1] border border-transparent rounded-xl focus:bg-white focus:border-[#6C55D9] focus:outline-none text-sm transition-all"
              />
              <Lock className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#242424] mb-1.5 font-khmer">
              ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់ (Confirm Password)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="វាយបញ្ចូលពាក្យសម្ងាត់ម្តងទៀត"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F1] border border-transparent rounded-xl focus:bg-white focus:border-[#6C55D9] focus:outline-none text-sm transition-all"
              />
              <Lock className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#6C55D9] hover:bg-[#5841C5] text-white font-bold rounded-xl text-sm shadow-soft transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>កំពុងបង្កើតគណនី...</span>
              </>
            ) : (
              <>
                <span>បង្កើតគណនី</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-[#EAEAEA] text-xs text-[#777777]">
          <span>មានគណនីរួចហើយមែនទេ? </span>
          <Link to="/login" className="text-[#6C55D9] font-bold hover:underline">
            ចូលគណនីនៅទីនេះ
          </Link>
        </div>
      </div>
    </div>
  );
};
