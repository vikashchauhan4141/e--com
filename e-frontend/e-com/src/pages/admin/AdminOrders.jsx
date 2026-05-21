import React, { useEffect, useState } from 'react';
import { 
  IoCalendarOutline, 
  IoPersonOutline, 
  IoCardOutline,
  IoChevronDown,
  IoChevronUp,
  IoSyncOutline,
  IoAddOutline,
  IoClose,
  IoTrashOutline
} from 'react-icons/io5';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';
import { Pagination } from '../../components/common/Pagination';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Direct Admin Order Creation states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    size: 'M',
    color: 'Black',
    quantity: 1
  });
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [orderStatus, setOrderStatus] = useState('Processing');
  const [promoCode, setPromoCode] = useState('');

  const fetchOrders = async () => {
    try {
      const q = new URLSearchParams();
      q.append('page', page);
      q.append('limit', 10);
      if (filterStatus && filterStatus !== 'All') {
        q.append('status', filterStatus);
      }
      const data = await api.get(`/admin/orders?${q.toString()}`);
      setOrders(data.orders || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load dispatch catalog');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleFilterStatusChange = (status) => {
    setFilterStatus(status);
    setPage(1);
  };

  useEffect(() => {
    fetchOrders();
  }, [page, filterStatus]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Expand / collapse single order drawer details
  const toggleExpand = (id) => {
    setExpandedOrders(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Change order status triggers backend PATCH
  const handleStatusChange = async (id, newStatus) => {
    try {
      const loadingToast = toast.loading('Updating shipping coordinate...');
      await api.patch(`/admin/orders/${id}/status`, { status: newStatus });
      toast.dismiss(loadingToast);
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  // Change order payment status triggers backend PATCH
  const handlePaymentStatusChange = async (id, newPaymentStatus) => {
    try {
      const loadingToast = toast.loading('Updating ledger records...');
      await api.patch(`/admin/orders/${id}/status`, { paymentStatus: newPaymentStatus });
      toast.dismiss(loadingToast);
      toast.success(`Ledger marked as ${newPaymentStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to update ledger records');
    }
  };

  // Permanently delete an order from database ledgers
  const handleDeleteOrder = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to permanently delete this order? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      const loadingToast = toast.loading('Deleting order ledgers...');
      await api.delete(`/admin/orders/${id}`);
      toast.dismiss(loadingToast);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to delete order');
      console.error(err);
    }
  };

  // Administrative direct order placement flows
  const handleCreateOrderOpen = async () => {
    try {
      const usersData = await api.get('/admin/users');
      setUsersList(usersData.users || []);

      const productsData = await api.get('/admin/products');
      const activeProds = (productsData.products || []).filter(p => p.isActive && p.stock > 0);
      setProductsList(activeProds);

      setSelectedUser(usersData.users?.[0]?._id || '');
      setOrderItems([]);
      
      const defaultProd = activeProds?.[0];
      setCurrentItem({
        productId: defaultProd?._id || '',
        size: defaultProd?.sizes?.[0] || 'M',
        color: defaultProd?.colors?.[0] || 'Black',
        quantity: 1
      });

      const firstUser = usersData.users?.[0];
      setShippingDetails({
        fullName: firstUser ? firstUser.name : '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        phone: ''
      });

      setPromoCode('');
      setPaymentMethod('COD');
      setPaymentStatus('Pending');
      setOrderStatus('Processing');
      setCreateModalOpen(true);
    } catch (err) {
      toast.error('Failed to load user and product directories');
      console.error(err);
    }
  };

  const handleUserChange = (userId) => {
    setSelectedUser(userId);
    const selectedUserDoc = usersList.find(u => u._id === userId);
    if (selectedUserDoc) {
      setShippingDetails(prev => ({
        ...prev,
        fullName: selectedUserDoc.name
      }));
    }
  };

  const handleProductChange = (productId) => {
    const product = productsList.find(p => p._id === productId);
    if (product) {
      setCurrentItem({
        productId,
        size: product.sizes?.[0] || 'M',
        color: product.colors?.[0] || 'Black',
        quantity: 1
      });
    }
  };

  const handleAddLineItem = () => {
    if (!currentItem.productId) {
      toast.error('Please select a product');
      return;
    }

    const product = productsList.find(p => p._id === currentItem.productId);
    if (!product) return;

    if (currentItem.quantity > product.stock) {
      toast.error(`Only ${product.stock} items in stock for this product`);
      return;
    }

    const existingIndex = orderItems.findIndex(
      item => item.productId === currentItem.productId && item.size === currentItem.size && item.color === currentItem.color
    );

    if (existingIndex > -1) {
      const updated = [...orderItems];
      const newQty = updated[existingIndex].quantity + currentItem.quantity;
      if (newQty > product.stock) {
        toast.error(`Total quantity (${newQty}) exceeds available stock (${product.stock})`);
        return;
      }
      updated[existingIndex].quantity = newQty;
      setOrderItems(updated);
    } else {
      setOrderItems(prev => [...prev, {
        ...currentItem,
        name: product.name,
        image: product.image,
        price: product.discountPrice || product.price
      }]);
    }

    toast.success('Line item added to order draft');
  };

  const handleRemoveLineItem = (index) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateOrderSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error('Please select a customer');
      return;
    }
    if (orderItems.length === 0) {
      toast.error('Please add at least one item to place order');
      return;
    }
    if (!shippingDetails.fullName || !shippingDetails.street || !shippingDetails.city || !shippingDetails.state || !shippingDetails.zipCode || !shippingDetails.phone) {
      toast.error('Please complete all logistics shipping address coordinates');
      return;
    }

    try {
      const loadingToast = toast.loading('Dispatching custom administrative order...');
      
      const payload = {
        userId: selectedUser,
        items: orderItems.map(item => ({
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity
        })),
        shippingAddress: shippingDetails,
        paymentMethod,
        paymentStatus,
        status: orderStatus,
        couponCode: promoCode
      };

      await api.post('/admin/orders', payload);
      
      toast.dismiss(loadingToast);
      toast.success('Direct custom order placed successfully!');
      setCreateModalOpen(false);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to place administrative order');
    }
  };

  // Prices formatting helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getOrderStatusStyle = (status) => {
    const map = {
      Processing: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
      Shipped: 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
      Delivered: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
      Cancelled: 'bg-red-500/10 text-red-500 border border-red-500/20'
    };
    return map[status] || 'bg-outline/20 text-secondary';
  };

  const getPaymentStatusStyle = (status) => {
    const map = {
      Pending: 'bg-amber-500/5 text-amber-500 border border-amber-500/10',
      Paid: 'bg-emerald-500/5 text-emerald-500 border border-emerald-500/10',
      Failed: 'bg-red-500/5 text-red-500 border border-red-500/10'
    };
    return map[status] || 'bg-outline/10 text-secondary';
  };

  // Filtered orders comes directly paginated from backend
  const filteredOrders = orders;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <h2 className="font-heading font-light text-2xl text-ink leading-tight">
            Orders <span className="font-semibold text-primary">Dispatch</span>
          </h2>
          <p className="text-xs text-secondary mt-1 tracking-wide">
            Track customer deliveries, coordinate shipping status, and audit ledgers.
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
            onClick={handleCreateOrderOpen}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white rounded px-5 py-2 text-[10px] font-bold tracking-wider uppercase transition-colors shadow-md transition-all duration-300"
          >
            <IoAddOutline size={14} />
            Create Order
          </button>
        </div>
      </div>

      {/* Tabs navigation filters */}
      <div className="flex border-b border-outline-variant gap-6 overflow-x-auto pb-px">
        {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => {
          const isActive = filterStatus === tab;
          return (
            <button
              key={tab}
              onClick={() => handleFilterStatusChange(tab)}
              className={`pb-4 text-[10px] font-bold tracking-widest uppercase relative transition-colors duration-200 ${
                isActive ? 'text-primary font-bold' : 'text-secondary hover:text-ink'
              }`}
            >
              <span>{tab}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-slideIn"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Database catalog entries */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[9px] tracking-widest text-secondary uppercase animate-pulse">Querying ledgers...</span>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed border-outline-variant rounded bg-surface-container-lowest">
          <p className="text-xs text-secondary tracking-wider uppercase">No {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} orders registered</p>
          <p className="text-[10px] text-secondary">No customer data matches these filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrders.includes(order._id);
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div 
                key={order._id}
                className="border border-outline-variant bg-surface-container-lowest shadow-sm rounded overflow-hidden transition-all duration-300"
              >
                
                {/* Header overview row */}
                <div 
                  className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-surface-container-low transition-colors duration-150 ${
                    isExpanded ? 'bg-surface-container-low/50 border-b border-outline-variant' : ''
                  }`}
                  onClick={() => toggleExpand(order._id)}
                >
                  {/* Order credentials */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <p className="text-xs font-bold text-ink leading-tight">Order #{order.orderNumber}</p>
                      <div className="flex items-center gap-1.5 text-[9px] text-secondary mt-1 font-mono uppercase">
                        <IoCalendarOutline size={12} />
                        <span>{orderDate}</span>
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="flex items-center gap-2">
                      <IoPersonOutline size={14} className="text-secondary" />
                      <div>
                        <p className="text-[10px] font-bold text-ink truncate leading-tight">
                          {order.user?.name || order.shippingAddress?.fullName}
                        </p>
                        <p className="text-[9px] text-secondary truncate">
                          {order.user?.email || 'Guest Client'}
                        </p>
                      </div>
                    </div>

                    {/* Total cost */}
                    <div>
                      <p className="text-[9px] text-secondary uppercase tracking-wider">Total Ledger</p>
                      <p className="text-xs font-bold text-ink mt-0.5">{formatCurrency(order.pricing?.total || 0)}</p>
                    </div>

                    {/* Payment status display */}
                    <div>
                      <p className="text-[9px] text-secondary uppercase tracking-wider mb-0.5">Method</p>
                      <span className="text-[9px] font-semibold text-secondary flex items-center gap-1">
                        <IoCardOutline size={12} />
                        {order.payment?.method}
                      </span>
                    </div>
                  </div>

                  {/* Curation controls */}
                  <div 
                    className="flex items-center gap-3 self-end lg:self-auto"
                    onClick={(e) => e.stopPropagation()} // Stop expansion trigger
                  >
                    
                    {/* Payment Status Dropdown Selector */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-secondary font-bold uppercase tracking-widest text-right pr-1">Ledger Status</span>
                      <select
                        value={order.payment?.status}
                        onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                        className={`text-[9px] font-bold tracking-wider uppercase px-2 py-1.5 rounded focus:outline-none cursor-pointer ${getPaymentStatusStyle(order.payment?.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>

                    {/* Dispatch Status Dropdown Selector */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-secondary font-bold uppercase tracking-widest text-right pr-1">Shipping Status</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-[9px] font-bold tracking-wider uppercase px-3 py-1.5 rounded focus:outline-none cursor-pointer ${getOrderStatusStyle(order.status)}`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Toggle expand drawer */}
                    <button 
                      onClick={() => toggleExpand(order._id)}
                      className="p-1 rounded hover:bg-surface-container text-secondary hover:text-ink mt-4"
                    >
                      {isExpanded ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
                    </button>

                    {/* Permanently delete order */}
                    <button 
                      onClick={() => handleDeleteOrder(order._id)}
                      className="p-1.5 rounded hover:bg-error/10 text-secondary hover:text-error mt-4 transition-colors duration-150"
                      title="Delete Order"
                    >
                      <IoTrashOutline size={15} />
                    </button>

                  </div>

                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="p-6 bg-surface-container-lowest/50 border-t border-outline-variant/30 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideIn">
                    
                    {/* Items table */}
                    <div className="md:col-span-2 space-y-4">
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-ink border-b border-outline-variant pb-2">
                        Purchased Pieces ({order.items?.length || 0})
                      </h4>

                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                            <div className="flex items-center gap-4">
                              <img 
                                src={item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=80&q=80'} 
                                alt={item.name} 
                                className="w-10 h-12 rounded border object-cover bg-surface-container"
                              />
                              <div>
                                <p className="text-xs font-bold text-ink">{item.name}</p>
                                <p className="text-[9px] text-secondary mt-0.5 uppercase tracking-wider">
                                  Size: <span className="font-semibold text-ink">{item.size}</span> &nbsp;|&nbsp; 
                                  Color: <span className="font-semibold text-ink">{item.color}</span>
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-xs font-bold text-ink">{formatCurrency(item.price)}</p>
                              <p className="text-[9px] text-secondary mt-0.5 font-semibold">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary prices inside drawer */}
                      <div className="bg-surface-container-low border border-outline-variant p-4 rounded space-y-2">
                        <div className="flex justify-between text-[10px] text-secondary">
                          <span>Basket Subtotal</span>
                          <span className="font-semibold text-ink">{formatCurrency(order.pricing?.subtotal || 0)}</span>
                        </div>
                        {order.pricing?.discount > 0 && (
                          <div className="flex justify-between text-[10px] text-error font-medium">
                            <span>Promotional Coupon ({order.pricing?.couponCode})</span>
                            <span>-{formatCurrency(order.pricing?.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-[10px] text-secondary">
                          <span>Logistics Shipping</span>
                          <span className="font-semibold text-ink">{formatCurrency(order.pricing?.shipping || 0)}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-ink border-t border-outline-variant/50 pt-2 mt-1">
                          <span>Settled Amount</span>
                          <span>{formatCurrency(order.pricing?.total || 0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Logistics details */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-ink border-b border-outline-variant pb-2">
                        Logistics shipping Details
                      </h4>

                      <div className="space-y-3 text-xs">
                        <div>
                          <p className="text-[9px] text-secondary uppercase font-bold tracking-wide">Receiver</p>
                          <p className="font-semibold text-ink mt-0.5">{order.shippingAddress?.fullName}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-secondary uppercase font-bold tracking-wide">Logistics Street</p>
                          <p className="text-secondary mt-0.5 leading-snug">{order.shippingAddress?.street}</p>
                          <p className="text-secondary leading-snug">
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}
                          </p>
                          <p className="text-secondary leading-snug">{order.shippingAddress?.country}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-secondary uppercase font-bold tracking-wide">Contact Coordinate</p>
                          <p className="font-semibold text-ink mt-0.5">{order.shippingAddress?.phone || 'No phone provided'}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />

      {/* DIRECT ORDER PLACEMENT GLASS OVERLAY MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay mask */}
          <div 
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
            onClick={() => setCreateModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-surface-container-lowest border border-outline-variant shadow-2xl rounded w-full max-w-2xl max-h-[85vh] flex flex-col z-10 animate-scaleUp text-left">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
              <div>
                <h3 className="font-heading font-semibold text-sm tracking-widest uppercase text-ink">
                  Create Custom Administrative Order
                </h3>
                <p className="text-[9px] text-secondary mt-0.5 tracking-wide uppercase">
                  Place an order directly into the system on behalf of a registered customer
                </p>
              </div>
              
              <button 
                onClick={() => setCreateModalOpen(false)}
                className="text-secondary hover:text-ink p-1 transition-colors"
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleCreateOrderSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
              
              {/* Customer Select dropdown */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">
                  Select Customer *
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => handleUserChange(e.target.value)}
                  className="w-full text-xs bg-surface-container px-3.5 py-2.5 rounded border border-outline focus:border-ink focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>Select a customer profile</option>
                  {usersList.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>

              {/* Line Item Selector box */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">
                  Add Catalog Pieces
                </label>
                
                {productsList.length === 0 ? (
                  <p className="text-xs text-secondary italic">No products available in the active store catalog</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-surface-container border border-outline-variant p-4 rounded">
                    
                    {/* Product dropdown */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[8px] font-bold tracking-widest text-secondary uppercase block">Product Name</label>
                      <select
                        value={currentItem.productId}
                        onChange={(e) => handleProductChange(e.target.value)}
                        className="w-full text-[11px] bg-surface-container-low px-3 py-2 rounded border border-outline focus:border-ink focus:outline-none cursor-pointer"
                      >
                        {productsList.map(p => (
                          <option key={p._id} value={p._id}>
                            {p.name} - {formatCurrency(p.discountPrice || p.price)} ({p.stock} left)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Size */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold tracking-widest text-secondary uppercase block">Size</label>
                      <select
                        value={currentItem.size}
                        onChange={(e) => setCurrentItem(prev => ({ ...prev, size: e.target.value }))}
                        className="w-full text-[11px] bg-surface-container-low px-3 py-2 rounded border border-outline focus:border-ink focus:outline-none cursor-pointer"
                      >
                        {(productsList.find(p => p._id === currentItem.productId)?.sizes || ['S', 'M', 'L']).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Color */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold tracking-widest text-secondary uppercase block">Color</label>
                      <select
                        value={currentItem.color}
                        onChange={(e) => setCurrentItem(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full text-[11px] bg-surface-container-low px-3 py-2 rounded border border-outline focus:border-ink focus:outline-none cursor-pointer"
                      >
                        {(productsList.find(p => p._id === currentItem.productId)?.colors || ['Black', 'White']).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity & add button row */}
                    <div className="sm:col-span-4 flex items-center justify-between gap-4 mt-1 border-t border-outline-variant/30 pt-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-bold tracking-widest text-secondary uppercase">Quantity</span>
                        <input
                          type="number"
                          min="1"
                          value={currentItem.quantity}
                          onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: Math.max(1, Number(e.target.value)) }))}
                          className="w-16 text-center text-xs bg-surface-container-low px-2 py-1.5 rounded border border-outline focus:border-ink focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddLineItem}
                        className="bg-ink hover:bg-black text-white px-4 py-1.5 text-[9px] font-bold tracking-wider uppercase rounded transition-colors flex items-center gap-1"
                      >
                        <IoAddOutline size={14} />
                        Add Piece
                      </button>
                    </div>

                  </div>
                )}
              </div>

              {/* Draft table of added items */}
              {orderItems.length > 0 && (
                <div className="space-y-2 border border-outline-variant p-4 rounded bg-surface-container-low/40">
                  <h4 className="text-[9px] font-bold tracking-widest uppercase text-ink">Line Items Order draft</h4>
                  
                  <div className="divide-y divide-outline-variant/40 max-h-40 overflow-y-auto">
                    {orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 text-xs">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=80&q=80'} 
                            alt="" 
                            className="w-8 h-10 object-cover rounded border" 
                          />
                          <div>
                            <p className="font-bold text-ink truncate max-w-[240px]">{item.name}</p>
                            <p className="text-[9px] text-secondary">
                              Size: <span className="font-semibold text-ink">{item.size}</span> &nbsp;|&nbsp; 
                              Color: <span className="font-semibold text-ink">{item.color}</span> &nbsp;|&nbsp; 
                              Qty: <span className="font-semibold text-ink">{item.quantity}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-ink">{formatCurrency(item.price * item.quantity)}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveLineItem(idx)}
                            className="text-error hover:bg-error/10 p-1 rounded transition-colors"
                          >
                            <IoTrashOutline size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping address details */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold tracking-widest uppercase text-ink border-b border-outline-variant/60 pb-1.5">
                  Shipping Logistics Address
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">Receiver Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingDetails.fullName}
                      onChange={(e) => setShippingDetails(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                      placeholder="Customer Full Name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">Receiver Contact Phone *</label>
                    <input
                      type="text"
                      required
                      value={shippingDetails.phone}
                      onChange={(e) => setShippingDetails(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={shippingDetails.street}
                      onChange={(e) => setShippingDetails(prev => ({ ...prev, street: e.target.value }))}
                      className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                      placeholder="Apartment, suite, block, landmark details"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">City *</label>
                    <input
                      type="text"
                      required
                      value={shippingDetails.city}
                      onChange={(e) => setShippingDetails(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                      placeholder="e.g. Mumbai"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">State *</label>
                    <input
                      type="text"
                      required
                      value={shippingDetails.state}
                      onChange={(e) => setShippingDetails(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                      placeholder="e.g. Maharashtra"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">Zip / Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={shippingDetails.zipCode}
                      onChange={(e) => setShippingDetails(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                      placeholder="e.g. 400001"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">Country *</label>
                    <input
                      type="text"
                      required
                      value={shippingDetails.country}
                      onChange={(e) => setShippingDetails(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Billing and ledger details */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold tracking-widest uppercase text-ink border-b border-outline-variant/60 pb-1.5">
                  Ledger and Payment Configuration
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full text-xs bg-surface-container px-3.5 py-2.5 rounded border border-outline focus:border-ink focus:outline-none cursor-pointer"
                    >
                      <option value="COD">Cash on Delivery (COD)</option>
                      <option value="ONLINE">Online Payment (ONLINE)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">Ledger Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="w-full text-xs bg-surface-container px-3.5 py-2.5 rounded border border-outline focus:border-ink focus:outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">Dispatch Status</label>
                    <select
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value)}
                      className="w-full text-xs bg-surface-container px-3.5 py-2.5 rounded border border-outline focus:border-ink focus:outline-none cursor-pointer"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">Promo Code (Optional)</label>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none"
                      placeholder="e.g. STYLEE10, FREESHIP"
                    />
                  </div>
                </div>
              </div>

              {/* Price Calculations Review summary */}
              {(() => {
                const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                const isPromoValid = ['STYLEE10', 'LAVENDER10', 'AURA10'].includes(promoCode.toUpperCase());
                const discount = isPromoValid ? Math.round(subtotal * 0.1) : 0;
                const isFreeShip = promoCode.toUpperCase() === 'FREESHIP';
                const shipping = subtotal === 0 || subtotal >= 5000 || isFreeShip ? 0 : 150;
                const total = Math.max(subtotal + shipping - discount, 0);

                return (
                  <div className="bg-surface-container-low border border-outline-variant p-4 rounded space-y-2 mt-4 text-xs">
                    <h5 className="font-bold text-[9px] uppercase tracking-wider text-secondary">Ledger Calculation Preview</h5>
                    <div className="flex justify-between text-secondary">
                      <span>Basket Subtotal</span>
                      <span className="font-semibold text-ink">{formatCurrency(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-error font-medium">
                        <span>Coupon Discount ({promoCode.toUpperCase()})</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-secondary">
                      <span>Shipping Fee</span>
                      <span className="font-semibold text-ink">{formatCurrency(shipping)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-ink border-t border-outline-variant/60 pt-2 mt-1">
                      <span>Estimated Ledger Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                );
              })()}

            </form>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3 rounded-b">
              <button 
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="border border-outline hover:border-ink px-4 py-2 text-[10px] font-bold tracking-wider uppercase text-secondary hover:text-ink rounded transition-colors duration-200"
              >
                Cancel
              </button>
              
              <button 
                onClick={handleCreateOrderSubmit}
                disabled={orderItems.length === 0}
                className={`px-5 py-2 text-[10px] font-bold tracking-wider uppercase rounded transition-colors shadow ${
                  orderItems.length === 0 
                    ? 'bg-primary/50 text-white cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                Dispatch Order
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
