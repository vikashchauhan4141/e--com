import React, { useEffect, useState } from 'react';
import { 
  IoSearchOutline, 
  IoAddOutline, 
  IoCreateOutline, 
  IoTrashOutline,
  IoClose,
  IoSyncOutline,
  IoGridOutline
} from 'react-icons/io5';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    isActive: true
  });

  const fetchCategories = async () => {
    try {
      const data = await api.get('/admin/categories');
      setCategories(data.categories || []);
    } catch (err) {
      toast.error('Failed to load category taxonomy');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCategories();
  };

  const handleCreateOpen = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      image: '',
      description: '',
      isActive: true
    });
    setModalOpen(true);
  };

  const handleEditOpen = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      image: cat.image || '',
      description: cat.description || '',
      isActive: cat.isActive !== undefined ? cat.isActive : true
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      if (editingCategory) {
        // Edit category
        await api.put(`/admin/categories/${editingCategory._id}`, formData);
        toast.success('Category updated successfully');
      } else {
        // Create category
        await api.post('/admin/categories', formData);
        toast.success('Category added successfully');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this category tag? All linked product displays will be affected.')) {
      return;
    }

    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success('Category tag deleted permanently');
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <h2 className="font-heading font-light text-2xl text-ink leading-tight">
            Category <span className="font-semibold text-primary">Tags</span>
          </h2>
          <p className="text-xs text-secondary mt-1 tracking-wide">
            Crate, manage, and curate store collections and product taxonomies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 border border-outline hover:border-ink rounded px-4 py-2 text-[10px] font-bold tracking-wider uppercase text-secondary hover:text-ink transition-colors duration-200"
          >
            <IoSyncOutline size={14} className={refreshing ? 'animate-spin' : ''} />
          </button>
          
          <button
            onClick={handleCreateOpen}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white rounded px-5 py-2 text-[10px] font-bold tracking-wider uppercase transition-colors shadow-md"
          >
            <IoAddOutline size={16} />
            Create Category
          </button>
        </div>
      </div>

      {/* Filter and Search Hub */}
      <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant p-4 rounded shadow-sm">
        <IoSearchOutline size={16} className="absolute left-7.5 text-secondary" />
        <input 
          type="text" 
          placeholder="Search categories by tag, description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-surface-container pl-10 pr-4 py-2.5 rounded border border-outline focus:border-ink focus:outline-none placeholder-secondary transition-colors"
        />
      </div>

      {/* Database Catalog Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[9px] tracking-widest text-secondary uppercase animate-pulse">Syncing tags...</span>
          </div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed border-outline-variant rounded bg-surface-container-lowest">
          <p className="text-xs text-secondary tracking-wider uppercase">No categories found</p>
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="text-[9px] font-bold tracking-widest uppercase text-primary border border-outline rounded px-4 py-2 hover:border-ink"
            >
              Reset Search
            </button>
          )}
        </div>
      ) : (
        <div className="border border-outline-variant bg-surface-container-lowest rounded shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-outline-variant text-[9px] text-secondary tracking-widest uppercase bg-surface-container-low">
                <th className="p-4 font-semibold">Category Tag</th>
                <th className="p-4 font-semibold">Taxonomy Slug</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <tr key={cat._id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors duration-150 text-xs">
                  
                  {/* Tag + Image thumbnail */}
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      {cat.image ? (
                        <img 
                          src={cat.image} 
                          alt={cat.name} 
                          className="w-10 h-10 rounded border object-cover bg-surface-container"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded border bg-surface-container flex items-center justify-center text-secondary">
                          <IoGridOutline size={18} />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-ink leading-snug">{cat.name}</p>
                        <p className="text-[8px] text-secondary font-mono mt-0.5">UID: {cat.legacyId || cat._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="p-4 font-mono text-[10px] text-secondary">/{cat.slug}</td>

                  {/* Description */}
                  <td className="p-4 text-secondary max-w-[240px] truncate" title={cat.description}>
                    {cat.description || <span className="italic text-secondary/40">No description provided</span>}
                  </td>

                  {/* Status Badge */}
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                      cat.isActive 
                        ? 'bg-emerald-500/15 text-emerald-500' 
                        : 'bg-outline/20 text-secondary'
                    }`}>
                      {cat.isActive ? 'ACTIVE' : 'DRAFT'}
                    </span>
                  </td>

                  {/* Action triggers */}
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditOpen(cat)}
                        className="p-1.5 rounded hover:bg-surface-container text-secondary hover:text-primary transition-colors"
                        title="Edit details"
                      >
                        <IoCreateOutline size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat._id)}
                        className="p-1.5 rounded hover:bg-surface-container text-secondary hover:text-error transition-colors"
                        title="Delete category"
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CURATION OVERLAY DIALOG MODAL BOX */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay mask */}
          <div 
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-surface-container-lowest border border-outline-variant shadow-2xl rounded w-full max-w-md flex flex-col z-10 animate-scaleUp text-left">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
              <div>
                <h3 className="font-heading font-semibold text-sm tracking-widest uppercase text-ink">
                  {editingCategory ? 'Modify Category Tag' : 'Create Category Tag'}
                </h3>
                <p className="text-[9px] text-secondary mt-0.5 tracking-wide uppercase">
                  {editingCategory ? `Legacy ID: ${editingCategory.legacyId}` : 'Build store taxonomy parameters'}
                </p>
              </div>
              
              <button 
                onClick={() => setModalOpen(false)}
                className="text-secondary hover:text-ink p-1 transition-colors"
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Category Name */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">
                  Category Name *
                </label>
                <input 
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                  placeholder="e.g. Linen Shirts"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">
                  Image Thumbnail URL
                </label>
                <input 
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">
                  Category Description
                </label>
                <textarea 
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                  placeholder="Describe details, mood boards, editorial contexts..."
                />
              </div>

              {/* Active Toggle checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary bg-surface-container rounded border-outline cursor-pointer focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-[10px] font-bold tracking-wider uppercase text-ink cursor-pointer">
                  Activate Category (Visible on storefront lists)
                </label>
              </div>

            </form>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3 rounded-b">
              <button 
                type="button"
                onClick={() => setModalOpen(false)}
                className="border border-outline hover:border-ink px-4 py-2 text-[10px] font-bold tracking-wider uppercase text-secondary hover:text-ink rounded transition-colors duration-200"
              >
                Cancel
              </button>
              
              <button 
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2 text-[10px] font-bold tracking-wider uppercase rounded transition-colors shadow shadow-primary/20"
              >
                {editingCategory ? 'Save Tag' : 'Create Tag'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
