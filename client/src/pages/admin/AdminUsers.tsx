import React, { useEffect, useState } from 'react';
import { Search, UserCheck, UserX } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { User } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers({ page, limit: 10, search: searchTerm || undefined });
      setUsers(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm]);

  const handleToggleStatus = async (user: User) => {
    try {
      const nextStatus = !user.isActive;
      await adminService.toggleUserStatus(user.id, nextStatus);
      setUsers(users.map((u) => (u.id === user.id ? { ...u, isActive: nextStatus } : u)));
    } catch (err) {
      console.error('Failed to update user status', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#242424] font-khmerTitle">
          គ្រប់គ្រងអ្នកប្រើប្រាស់ (Users)
        </h1>
        <p className="text-xs sm:text-sm text-[#777777] mt-1 font-khmer">
          មើលបញ្ជីអ្នកប្រើប្រាស់ ស្វែងរក និងគ្រប់គ្រងសិទ្ធិដំណើរការគណនី
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="ស្វែងរកតាមឈ្មោះ ឬអ៊ីមែល..."
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

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-soft overflow-hidden">
        {loading ? (
          <LoadingSpinner text="កំពុងទាញយកបញ្ជីអ្នកប្រើប្រាស់..." className="py-20" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F7F5F1] text-xs text-[#777777] uppercase font-mono">
                <tr>
                  <th className="px-6 py-4">ឈ្មោះ</th>
                  <th className="px-6 py-4">អ៊ីមែល</th>
                  <th className="px-6 py-4">តួនាទី</th>
                  <th className="px-6 py-4">កាលបរិច្ឆេទបង្កើត</th>
                  <th className="px-6 py-4">ស្ថានភាព</th>
                  <th className="px-6 py-4 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#242424] font-khmer flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#6C55D9] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span>{user.name}</span>
                    </td>
                    <td className="px-6 py-4 text-[#555555]">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#777777] text-xs">
                      {new Date(user.createdAt).toLocaleDateString('km-KH')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          user.isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.isActive ? 'សកម្ម' : 'ផ្អាកដំណើរការ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 ml-auto transition-colors ${
                          user.isActive
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {user.isActive ? (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            <span>ផ្អាកគណនី</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>បើកដំណើរការ</span>
                          </>
                        )}
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
    </div>
  );
};
