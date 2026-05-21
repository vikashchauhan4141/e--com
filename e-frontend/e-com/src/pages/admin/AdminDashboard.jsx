import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  IoCashOutline, 
  IoBagCheckOutline, 
  IoShirtOutline, 
  IoPeopleOutline, 
  IoWarningOutline, 
  IoArrowForwardOutline,
  IoSyncOutline
} from 'react-icons/io5';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      toast.error('Failed to load dashboard metrics');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[9px] tracking-widest text-secondary uppercase animate-pulse">Loading Analytics...</span>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const statCards = [
    {
      title: 'Total Sales Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: <IoCashOutline size={22} className="text-[#a78bfa]" />,
      bg: 'from-[#6366f1]/5 to-[#a78bfa]/5 border-[#a78bfa]/20',
      description: 'Earnings from successful transactions'
    },
    {
      title: 'Dispatched Orders',
      value: stats?.totalOrders || 0,
      icon: <IoBagCheckOutline size={22} className="text-[#38bdf8]" />,
      bg: 'from-[#0284c7]/5 to-[#38bdf8]/5 border-[#38bdf8]/20',
      description: 'Volume of client purchases'
    },
    {
      title: 'Curated Catalog Items',
      value: stats?.totalProducts || 0,
      icon: <IoShirtOutline size={22} className="text-[#f472b6]" />,
      bg: 'from-[#db2777]/5 to-[#f472b6]/5 border-[#f472b6]/20',
      description: 'Active/inactive clothing pieces'
    },
    {
      title: 'Registered Clients',
      value: stats?.totalUsers || 0,
      icon: <IoPeopleOutline size={22} className="text-[#34d399]" />,
      bg: 'from-[#059669]/5 to-[#34d399]/5 border-[#34d399]/20',
      description: 'Verified active customer base'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Greetings Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <h2 className="font-heading font-light text-2xl text-ink leading-tight">
            Dashboard <span className="font-semibold text-primary">Overview</span>
          </h2>
          <p className="text-xs text-secondary mt-1 tracking-wide">
            Real-time coordinates and metrics for Stylee Atelier.
          </p>
        </div>

        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 border border-outline hover:border-ink rounded px-4 py-2 text-[10px] font-bold tracking-wider uppercase text-secondary hover:text-ink transition-colors duration-200"
        >
          <IoSyncOutline size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Metrics'}
        </button>
      </div>

      {/* Numerical Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div 
            key={idx}
            className={`flex flex-col p-6 rounded bg-gradient-to-br ${card.bg} border shadow-sm transition-transform duration-300 hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold tracking-widest text-secondary uppercase leading-none">
                {card.title}
              </span>
              {card.icon}
            </div>
            <div className="text-2xl font-bold tracking-tight text-ink mt-4 mb-2">
              {card.value}
            </div>
            <span className="text-[9px] text-secondary leading-normal mt-auto">
              {card.description}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dynamic Pipelines & status progress */}
        <div className="lg:col-span-2 border border-outline-variant bg-surface-container-lowest/80 backdrop-blur-md rounded p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-ink border-b border-outline-variant pb-4 mb-6">
              Order Pipeline Dispatch
            </h3>
            
            {/* Status breakdown pipeline progress rows */}
            <div className="space-y-5">
              {[
                { label: 'Processing (Unfulfilled)', key: 'Processing', color: 'bg-amber-500', barColor: 'from-amber-500/20 to-amber-500' },
                { label: 'Shipped (In Transit)', key: 'Shipped', color: 'bg-sky-500', barColor: 'from-sky-500/20 to-sky-500' },
                { label: 'Delivered (Completed)', key: 'Delivered', color: 'bg-emerald-500', barColor: 'from-emerald-500/20 to-emerald-500' },
                { label: 'Cancelled', key: 'Cancelled', color: 'bg-red-500', barColor: 'from-red-500/20 to-red-500' }
              ].map((pipe) => {
                const count = stats?.statusCounts?.[pipe.key] || 0;
                const total = stats?.totalOrders || 1;
                const percentage = Math.round((count / total) * 100);

                return (
                  <div key={pipe.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-secondary uppercase">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${pipe.color}`}></span>
                        <span>{pipe.label}</span>
                      </div>
                      <span>{count} orders ({percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${pipe.barColor} transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-outline-variant flex items-center justify-between">
            <p className="text-[10px] text-secondary">
              Review current items in delivery transit pipelines.
            </p>
            <Link 
              to="/admin/orders" 
              className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-primary uppercase hover:underline"
            >
              Dispatch Center
              <IoArrowForwardOutline size={12} />
            </Link>
          </div>
        </div>

        {/* Categories distribution breakdown */}
        <div className="border border-outline-variant bg-surface-container-lowest/80 backdrop-blur-md rounded p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-ink border-b border-outline-variant pb-4 mb-6">
              Inventory Distribution
            </h3>

            {/* Quick static metrics summary inside elegant design */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-outline-variant">
                <span className="text-[10px] text-secondary uppercase">Active Collections</span>
                <span className="text-xs font-semibold text-ink">{stats?.totalCategories || 0} categories</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-outline-variant">
                <span className="text-[10px] text-secondary uppercase">Stock Out Count</span>
                <span className={`text-xs font-bold ${stats?.outOfStockCount > 0 ? 'text-error' : 'text-emerald'}`}>
                  {stats?.outOfStockCount || 0} products
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[10px] text-secondary uppercase">Low Stock Threshold</span>
                <span className="text-xs font-semibold text-ink">Less than 5 items</span>
              </div>
            </div>

            {/* Circular progress visual representation */}
            <div className="relative w-36 h-36 mx-auto mt-8 flex items-center justify-center border-4 border-outline rounded-full">
              <div className="text-center">
                <span className="text-[8px] text-secondary tracking-widest uppercase block mb-1">Catalog</span>
                <span className="text-xl font-bold text-ink">{stats?.totalProducts || 0}</span>
                <span className="text-[7px] text-secondary uppercase block mt-1">Pieces</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Warning Center: Low Stock Alerts */}
      <div className="border border-outline-variant bg-surface-container-lowest/80 backdrop-blur-md rounded p-6 lg:p-8">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-6">
          <div className="flex items-center gap-3">
            <IoWarningOutline size={18} className="text-amber-500" />
            <h3 className="text-xs font-bold tracking-widest uppercase text-ink">
              Stock Warning Radar (Low Stock Alerts)
            </h3>
          </div>
          {stats?.lowStockProducts?.length > 0 && (
            <span className="bg-error-container/20 text-error px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider">
              {stats.lowStockProducts.length} Items Alert
            </span>
          )}
        </div>

        {stats?.lowStockProducts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 border border-dashed border-outline-variant rounded">
            <p className="text-[10px] text-secondary uppercase tracking-widest">Inventory levels are healthy</p>
            <p className="text-[9px] text-secondary">All products have 5 or more units in stock.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-[9px] text-secondary tracking-widest uppercase">
                  <th className="pb-3 font-semibold">Product Name</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold text-center">Remaining Stock</th>
                  <th className="pb-3 font-semibold text-right">Curation</th>
                </tr>
              </thead>
              <tbody>
                {stats?.lowStockProducts?.map((prod) => (
                  <tr key={prod._id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors duration-150">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={prod.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=80&q=80'} 
                          alt={prod.name} 
                          className="w-8 h-8 rounded border object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-ink truncate max-w-[200px]">{prod.name}</p>
                          <p className="text-[9px] text-secondary font-mono">ID: {prod.legacyId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-secondary">{prod.categoryName || 'General'}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        prod.stock === 0 ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {prod.stock === 0 ? 'Out of stock' : `${prod.stock} left`}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link 
                        to="/admin/products"
                        className="text-[9px] font-bold tracking-widest text-primary uppercase hover:underline"
                      >
                        Adjust
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
