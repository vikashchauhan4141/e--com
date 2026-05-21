import React, { useEffect, useState, useContext } from 'react';
import { 
  IoSearchOutline, 
  IoShieldCheckmarkOutline, 
  IoPersonOutline,
  IoSyncOutline
} from 'react-icons/io5';
import { api } from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Pagination } from '../../components/common/Pagination';

export const AdminUsers = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      const q = new URLSearchParams();
      q.append('page', page);
      q.append('limit', 10);
      if (search) {
        q.append('search', search);
      }
      const data = await api.get(`/admin/users?${q.toString()}`);
      setUsers(data.users || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (err) {
      toast.error('Failed to query user registry');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Reset page to 1 when search filters change
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  // Switch role between 'user' and 'admin'
  const handleRoleToggle = async (userId, currentRole) => {
    if (userId === currentUser._id) {
      toast.error('Self-demotion or modifying your own permissions is blocked');
      return;
    }

    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    const actionText = nextRole === 'admin' ? 'promote this user to Admin?' : 'demote this user to Customer?';
    
    if (!window.confirm(`Are you absolutely sure you want to ${actionText}`)) {
      return;
    }

    try {
      const loadingToast = toast.loading('Synchronizing database keys...');
      await api.patch(`/admin/users/${userId}/role`, { role: nextRole });
      toast.dismiss(loadingToast);
      toast.success('Permissions updated successfully');
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update credentials');
    }
  };

  // Users are already filtered and paginated from backend
  const filteredUsers = users;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <h2 className="font-heading font-light text-2xl text-ink leading-tight">
            User <span className="font-semibold text-primary">Access</span>
          </h2>
          <p className="text-xs text-secondary mt-1 tracking-wide">
            Manage system roles, review client profiles, and authorize workspace credentials.
          </p>
        </div>

        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 border border-outline hover:border-ink rounded px-4 py-2 text-[10px] font-bold tracking-wider uppercase text-secondary hover:text-ink transition-colors duration-200"
        >
          <IoSyncOutline size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Audit Registry'}
        </button>
      </div>

      {/* Search Input bar */}
      <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant p-4 rounded shadow-sm">
        <IoSearchOutline size={16} className="absolute left-7.5 text-secondary" />
        <input 
          type="text" 
          placeholder="Search user registry by name, email, credentials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-surface-container pl-10 pr-4 py-2.5 rounded border border-outline focus:border-ink focus:outline-none placeholder-secondary transition-colors"
        />
      </div>

      {/* Database registry entries */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[9px] tracking-widest text-secondary uppercase animate-pulse">Querying databases...</span>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed border-outline-variant rounded bg-surface-container-lowest">
          <p className="text-xs text-secondary tracking-wider uppercase">No matching clients found</p>
          <p className="text-[10px] text-secondary">Adjust search filters to locate credentials.</p>
        </div>
      ) : (
        <div className="border border-outline-variant bg-surface-container-lowest rounded shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-outline-variant text-[9px] text-secondary tracking-widest uppercase bg-surface-container-low">
                <th className="p-4 font-semibold">Client Name</th>
                <th className="p-4 font-semibold">Contact Email</th>
                <th className="p-4 font-semibold">Authorized Role</th>
                <th className="p-4 font-semibold">Joined Date</th>
                <th className="p-4 font-semibold text-right">Access Curation</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((item) => {
                const joinedDate = new Date(item.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });
                const isSelf = item._id === currentUser._id;

                return (
                  <tr key={item._id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors duration-150">
                    
                    {/* User Name & Profile */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                          alt={item.name} 
                          className="w-8 h-8 rounded-full border object-cover bg-surface-container"
                        />
                        <div>
                          <p className="text-xs font-bold text-ink leading-tight flex items-center gap-1.5">
                            {item.name}
                            {isSelf && (
                              <span className="bg-primary-container/20 text-primary px-1.5 py-0.5 text-[7px] font-bold rounded tracking-wider uppercase">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-[8px] text-secondary mt-0.5 font-mono uppercase">UID: {item._id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4 text-xs font-medium text-secondary">{item.email}</td>

                    {/* Role badge */}
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1.5 ${
                        item.role === 'admin' 
                          ? 'bg-primary/10 text-primary border border-primary/20' 
                          : 'bg-outline/20 text-secondary'
                      }`}>
                        {item.role === 'admin' ? <IoShieldCheckmarkOutline size={12} /> : <IoPersonOutline size={12} />}
                        <span className="uppercase tracking-wider text-[9px]">{item.role}</span>
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="p-4 text-xs text-secondary">{joinedDate}</td>

                    {/* Access Controls */}
                    <td className="p-4 text-right">
                      {isSelf ? (
                        <span className="text-[9px] text-secondary/60 tracking-wider uppercase pr-2">Console Session</span>
                      ) : (
                        <button
                          onClick={() => handleRoleToggle(item._id, item.role)}
                          className={`text-[9px] font-bold tracking-widest uppercase border rounded px-3 py-1.5 transition-colors ${
                            item.role === 'admin' 
                              ? 'border-error text-error hover:bg-error/10' 
                              : 'border-primary text-primary hover:bg-primary/10'
                          }`}
                        >
                          {item.role === 'admin' ? 'Demote Access' : 'Promote Access'}
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />

    </div>
  );
};
