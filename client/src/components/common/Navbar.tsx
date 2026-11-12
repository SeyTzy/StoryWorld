import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  Clock, 
  User as UserIcon, 
  LogOut, 
  ShieldAlert, 
  Menu, 
  X,
  Compass
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#EAEAEA] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#6C55D9] flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#242424] group-hover:text-[#6C55D9] transition-colors font-sans">
                Story<span className="text-[#6C55D9]">World</span>
              </span>
              <span className="text-[11px] text-[#777777] font-khmer hidden sm:inline -mt-1">
                ស្វែងរកពិភពរឿង • រីករាយនឹងការអាន
              </span>
            </div>
          </Link>

          {/* Search bar on desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ស្វែងរកចំណងជើងរឿង ឬឈ្មោះអ្នកនិពន្ធ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-[#F7F5F1] border border-transparent rounded-full focus:bg-white focus:border-[#6C55D9] focus:outline-none transition-all placeholder:text-[#777777] text-[#242424]"
              />
              <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-[#6C55D9] bg-[#E9E5FA]' : 'text-[#242424] hover:text-[#6C55D9] hover:bg-slate-50'
              }`}
            >
              ទំព័រដើម
            </Link>
            <Link
              to="/explore"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/explore') ? 'text-[#6C55D9] bg-[#E9E5FA]' : 'text-[#242424] hover:text-[#6C55D9] hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>រុករករឿង</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/my-library"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/my-library') ? 'text-[#6C55D9] bg-[#E9E5FA]' : 'text-[#242424] hover:text-[#6C55D9] hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>បណ្ណាល័យ</span>
                </Link>
                <Link
                  to="/history"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/history') ? 'text-[#6C55D9] bg-[#E9E5FA]' : 'text-[#242424] hover:text-[#6C55D9] hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>ប្រវត្តិអាន</span>
                </Link>
              </>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#F7F5F1] transition-colors border border-[#EAEAEA]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#6C55D9] text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="text-sm font-medium text-[#242424] hidden md:inline max-w-[120px] truncate">
                    {user?.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-[#EAEAEA] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#EAEAEA]">
                      <p className="text-xs text-[#777777]">ចូលប្រើដោយ</p>
                      <p className="text-sm font-bold text-[#242424] truncate">{user?.name}</p>
                      <p className="text-xs text-[#777777] truncate">{user?.email}</p>
                    </div>

                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6C55D9] font-medium hover:bg-[#E9E5FA] transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>ផ្ទាំងគ្រប់គ្រង Admin</span>
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#242424] hover:bg-[#F7F5F1] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#777777]" />
                      <span>គណនីរបស់ខ្ញុំ</span>
                    </Link>

                    <Link
                      to="/my-library"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#242424] hover:bg-[#F7F5F1] transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-[#777777]" />
                      <span>សៀវភៅចំណាំ</span>
                    </Link>

                    <div className="border-t border-[#EAEAEA] my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>ចាកចេញ</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#242424] hover:text-[#6C55D9] transition-colors"
                >
                  ចូលគណនី
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#6C55D9] hover:bg-[#5841C5] rounded-xl shadow-sm transition-all"
                >
                  ចុះឈ្មោះ
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#242424] hover:bg-[#F7F5F1]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#EAEAEA] animate-in fade-in slide-in-from-top-1">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ស្វែងរកចំណងជើង ឬអ្នកនិពន្ធ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F7F5F1] border border-transparent rounded-xl focus:bg-white focus:border-[#6C55D9] focus:outline-none"
                />
                <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </form>

            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/') ? 'text-[#6C55D9] bg-[#E9E5FA]' : 'text-[#242424]'
                }`}
              >
                ទំព័រដើម
              </Link>
              <Link
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/explore') ? 'text-[#6C55D9] bg-[#E9E5FA]' : 'text-[#242424]'
                }`}
              >
                រុករករឿង
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/my-library"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive('/my-library') ? 'text-[#6C55D9] bg-[#E9E5FA]' : 'text-[#242424]'
                    }`}
                  >
                    បណ្ណាល័យរបស់ខ្ញុំ
                  </Link>
                  <Link
                    to="/history"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive('/history') ? 'text-[#6C55D9] bg-[#E9E5FA]' : 'text-[#242424]'
                    }`}
                  >
                    ប្រវត្តិអាន
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-lg text-sm font-bold text-[#6C55D9] bg-[#E9E5FA]"
                    >
                      ផ្ទាំងគ្រប់គ្រង Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
