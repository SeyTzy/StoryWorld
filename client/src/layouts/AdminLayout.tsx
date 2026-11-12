import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  LayoutDashboard, 
  BookMarked, 
  FolderTree, 
  Users, 
  ArrowLeft, 
  LogOut,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Protect Admin route
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F7F5F1]">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#EAEAEA] text-center space-y-4 shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-khmerTitle text-[#242424]">សិទ្ធិត្រូវបានបដិសេធ</h2>
          <p className="text-sm text-[#777777] font-khmer">
            អ្នកត្រូវតែមានគណនី Administrator ដើម្បីចូលទៅកាន់ផ្ទាំងគ្រប់គ្រងនេះ។
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 bg-[#6C55D9] text-white rounded-xl text-sm font-medium hover:bg-[#5841C5]"
            >
              ចូលគណនី Admin
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 bg-gray-100 text-[#242424] rounded-xl text-sm font-medium hover:bg-gray-200"
            >
              ត្រឡប់ទៅទំព័រដើម
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'ទិដ្ឋភាពទូទៅ (Dashboard)', path: '/admin', icon: LayoutDashboard },
    { label: 'គ្រប់គ្រងរឿង (Stories)', path: '/admin/stories', icon: BookMarked },
    { label: 'គ្រប់គ្រងភាគ (Chapters)', path: '/admin/chapters', icon: FileText },
    { label: 'ប្រភេទរឿង (Categories)', path: '/admin/categories', icon: FolderTree },
    { label: 'អ្នកប្រើប្រាស់ (Users)', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen flex bg-[#F7F5F1] text-[#242424] font-khmer">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#EAEAEA] flex flex-col shrink-0 hidden md:flex">
        {/* Brand */}
        <div className="p-6 border-b border-[#EAEAEA]">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#6C55D9] flex items-center justify-center text-white shadow-soft">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-[#242424] font-sans">
                Story<span className="text-[#6C55D9]">World</span>
              </span>
              <span className="block text-[10px] text-[#6C55D9] font-bold uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#E9E5FA] text-[#6C55D9] font-bold shadow-sm'
                    : 'text-[#555555] hover:bg-gray-50 hover:text-[#242424]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#6C55D9]' : 'text-[#777777]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="p-4 border-t border-[#EAEAEA] space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#555555] hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ទៅកាន់គេហទំព័រដើម</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>ចាកចេញ</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#EAEAEA] px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-[#242424] font-khmer">
              ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធ StoryWorld
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#242424]">{user?.name}</p>
              <p className="text-[10px] text-[#6C55D9] font-mono font-semibold">ADMINISTRATOR</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#6C55D9] text-white flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
