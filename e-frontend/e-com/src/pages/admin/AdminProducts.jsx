import React, { useEffect, useState } from 'react';
import { 
  IoSearchOutline, 
  IoFilterOutline, 
  IoAddOutline, 
  IoCreateOutline, 
  IoTrashOutline,
  IoClose,
  IoSyncOutline
} from 'react-icons/io5';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';
import { ImageUploadDropzone } from '../../components/admin/ImageUploadDropzone';
import { Pagination } from '../../components/common/Pagination';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    gender: 'Unisex',
    price: '',
    discountPrice: '',
    stock: '',
    sizes: [],
    colors: [],
    image: '',
    description: '',
    isActive: true
  });

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['Black', 'White', 'Beige', 'Gray', 'Charcoal', 'Navy', 'Olive', 'Camel', 'Taupe'];

  const fetchProducts = async () => {
    try {
      const q = new URLSearchParams();
      if (search) q.append('search', search);
      if (selectedCategory) q.append('category', selectedCategory);
      if (selectedGender) q.append('gender', selectedGender);
      q.append('page', page);
      q.append('limit', 10);

      const data = await api.get(`/admin/products?${q.toString()}`);
      setProducts(data.products || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load products list');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.get('/categories');
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setPage(1);
  };

  const handleGenderChange = (value) => {
    setSelectedGender(value);
    setPage(1);
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, selectedCategory, selectedGender]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  // Open modal for Create Product
  const handleCreateOpen = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories[0]?._id || '',
      gender: 'Unisex',
      price: '',
      discountPrice: '',
      stock: '',
      sizes: ['S', 'M', 'L'],
      colors: ['Black', 'White'],
      image: '',
      description: '',
      isActive: true
    });
    setModalOpen(true);
  };

  // Open modal for Edit Product
  const handleEditOpen = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category?._id || product.category || '',
      gender: product.gender,
      price: product.price,
      discountPrice: product.discountPrice || '',
      stock: product.stock,
      sizes: product.sizes || [],
      colors: product.colors || [],
      image: product.image || '',
      description: product.description || '',
      isActive: product.isActive
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

  // Sizes checkbox handler
  const handleSizeToggle = (size) => {
    setFormData(prev => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  // Colors toggle handler
  const handleColorToggle = (color) => {
    setFormData(prev => {
      const colors = prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors };
    });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || formData.price === '' || formData.stock === '') {
      toast.error('Please complete all required coordinates');
      return;
    }

    let finalImageUrl = formData.image;

    // If image is a local File object, upload it to Cloudinary first!
    if (formData.image instanceof File) {
      const toastId = toast.loading('Uploading piece to Cloudinary...');
      try {
        const uploaderForm = new FormData();
        uploaderForm.append('image', formData.image);
        
        const res = await api.post('/admin/upload', uploaderForm);
        if (res && res.url) {
          finalImageUrl = res.url;
          toast.success('Piece uploaded to Cloudinary successfully', { id: toastId });
        } else {
          throw new Error('No upload URL returned from API');
        }
      } catch (err) {
        console.error('Image upload failed during product curation:', err);
        toast.error(err.message || 'Image upload failed. Curation aborted.', { id: toastId });
        return;
      }
    }

    try {
      const payload = {
        ...formData,
        image: finalImageUrl,
        price: Number(formData.price),
        discountPrice: formData.discountPrice !== '' ? Number(formData.discountPrice) : null,
        stock: Number(formData.stock)
      };

      if (editingProduct) {
        // Edit Operation
        await api.put(`/admin/products/${editingProduct._id}`, payload);
        toast.success('Product updated successfully');
      } else {
        // Create Operation
        await api.post('/admin/products', payload);
        toast.success('Product added to active catalog');
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  // Delete product handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this piece from the catalog? This is permanent.')) {
      return;
    }

    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Product deleted from inventory');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  // Formatter for prices
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <h2 className="font-heading font-light text-2xl text-ink leading-tight">
            Catalog <span className="font-semibold text-primary">Curation</span>
          </h2>
          <p className="text-xs text-secondary mt-1 tracking-wide">
            Add, update, and manage inventory pieces.
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
            Create Product
          </button>
        </div>
      </div>

      {/* Filter and Search Hub */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface-container-lowest border border-outline-variant p-4 rounded shadow-sm">
        
        {/* Search Input */}
        <div className="md:col-span-2 relative flex items-center">
          <IoSearchOutline size={16} className="absolute left-3.5 text-secondary" />
          <input 
            type="text" 
            placeholder="Search products by title, model..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full text-xs bg-surface-container pl-10 pr-4 py-2.5 rounded border border-outline focus:border-ink focus:outline-none placeholder-secondary transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="relative flex items-center">
          <IoFilterOutline size={14} className="absolute left-3.5 text-secondary" />
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full text-[10px] font-bold tracking-wider uppercase bg-surface-container pl-10 pr-8 py-2.5 rounded border border-outline focus:border-ink focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div className="relative flex items-center">
          <IoFilterOutline size={14} className="absolute left-3.5 text-secondary" />
          <select
            value={selectedGender}
            onChange={(e) => handleGenderChange(e.target.value)}
            className="w-full text-[10px] font-bold tracking-wider uppercase bg-surface-container pl-10 pr-8 py-2.5 rounded border border-outline focus:border-ink focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">All Genders</option>
            <option value="Women">Women</option>
            <option value="Men">Men</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

      </div>

      {/* Database Catalog Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[9px] tracking-widest text-secondary uppercase animate-pulse">Syncing catalog...</span>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed border-outline-variant rounded">
          <p className="text-xs text-secondary tracking-wider uppercase">No matching products found</p>
          <button 
            onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedGender(''); setPage(1); }}
            className="text-[9px] font-bold tracking-widest uppercase text-primary border border-outline rounded px-4 py-2 hover:border-ink"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="border border-outline-variant bg-surface-container-lowest rounded shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-outline-variant text-[9px] text-secondary tracking-widest uppercase bg-surface-container-low">
                <th className="p-4 font-semibold">Product Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Gender</th>
                <th className="p-4 font-semibold text-center">Stock</th>
                <th className="p-4 font-semibold text-right">Price</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod._id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors duration-150">
                  
                  {/* Name + thumbnail */}
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={prod.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=80&q=80'} 
                        alt={prod.name} 
                        className="w-10 h-12 rounded border object-cover bg-surface-container"
                      />
                      <div>
                        <p className="text-xs font-bold text-ink leading-snug">{prod.name}</p>
                        <p className="text-[8px] text-secondary font-mono mt-0.5">UID: {prod.legacyId || prod._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4 text-xs text-secondary">{prod.categoryName}</td>

                  {/* Gender */}
                  <td className="p-4 text-xs text-secondary">{prod.gender}</td>

                  {/* Stock */}
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      prod.stock === 0 
                        ? 'bg-red-500/10 text-red-500' 
                        : prod.stock < 5 
                          ? 'bg-amber-500/10 text-amber-500' 
                          : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {prod.stock === 0 ? 'SOLD OUT' : `${prod.stock} Units`}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end">
                      {prod.discountPrice ? (
                        <>
                          <span className="text-xs font-bold text-ink">{formatCurrency(prod.discountPrice)}</span>
                          <span className="text-[9px] text-secondary line-through">{formatCurrency(prod.price)}</span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-ink">{formatCurrency(prod.price)}</span>
                      )}
                    </div>
                  </td>

                  {/* Status Toggle Badge */}
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                      prod.isActive 
                        ? 'bg-emerald-500/15 text-emerald-500' 
                        : 'bg-outline/20 text-secondary'
                    }`}>
                      {prod.isActive ? 'ACTIVE' : 'DRAFT'}
                    </span>
                  </td>

                  {/* Action triggers */}
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditOpen(prod)}
                        className="p-1.5 rounded hover:bg-surface-container text-secondary hover:text-primary transition-colors"
                        title="Edit parameters"
                      >
                        <IoCreateOutline size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(prod._id)}
                        className="p-1.5 rounded hover:bg-surface-container text-secondary hover:text-error transition-colors"
                        title="Delete product"
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

      {/* Pagination Controls */}
      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />

      {/* CURATION OVERLAY DIALOG MODAL BOX */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay mask */}
          <div 
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-surface-container-lowest border border-outline-variant shadow-2xl rounded w-full max-w-2xl max-h-[85vh] flex flex-col z-10 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
              <div>
                <h3 className="font-heading font-semibold text-sm tracking-widest uppercase text-ink">
                  {editingProduct ? 'Configure Product Settings' : 'Create New Collection Piece'}
                </h3>
                <p className="text-[9px] text-secondary mt-0.5 tracking-wide uppercase">
                  {editingProduct ? `Legacy ID: ${editingProduct.legacyId}` : 'Assign variables to catalog data'}
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
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
              
              {/* Core Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">
                    Product Title *
                  </label>
                  <input 
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                    placeholder="e.g. Minimalist Cashmere Overshirt"
                  />
                </div>

                {/* Category Selector */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-surface-container px-3.5 py-2.5 rounded border border-outline focus:border-ink focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">
                    Gender Segment *
                  </label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-surface-container px-3.5 py-2.5 rounded border border-outline focus:border-ink focus:outline-none cursor-pointer"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                {/* Stock Quantity */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">
                    Stock Quantity *
                  </label>
                  <input 
                    type="number"
                    name="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                    placeholder="e.g. 50"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">
                    Base Price (INR) *
                  </label>
                  <input 
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                    placeholder="e.g. 3500"
                  />
                </div>

                {/* Discount price */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">
                    Discount price (INR - Optional)
                  </label>
                  <input 
                    type="number"
                    name="discountPrice"
                    min="0"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                    placeholder="e.g. 2999"
                  />
                </div>

              </div>

              {/* Image URL URL details */}
              <ImageUploadDropzone
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                label="Product Showcase Image"
              />

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">
                  Product description
                </label>
                <textarea 
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                  placeholder="Describe material details, sizing guidelines, editorial text..."
                />
              </div>

              {/* Sizes Selection checkboxes */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">
                  Sizes Available
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => {
                    const isSelected = formData.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`px-3 py-1.5 text-[9px] font-bold tracking-wide rounded uppercase border transition-colors ${
                          isSelected 
                            ? 'bg-primary text-white border-primary' 
                            : 'bg-surface-container border-outline text-secondary hover:text-ink'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors Selection list */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">
                  Color Options
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map(color => {
                    const isSelected = formData.colors.includes(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorToggle(color)}
                        className={`px-3 py-1.5 text-[9px] font-semibold tracking-wide rounded border transition-colors ${
                          isSelected 
                            ? 'bg-ink text-white border-ink' 
                            : 'bg-surface-container border-outline text-secondary hover:text-ink'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Status toggle option */}
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
                  Activate product (Set as visible in live store collections)
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
                {editingProduct ? 'Save Coordinates' : 'Submit Catalog Piece'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
