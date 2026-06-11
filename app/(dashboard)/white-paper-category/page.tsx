'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchWPCategoriesThunk,
  toggleWPCategoryStatusThunk,
  deleteWPCategoryThunk,
} from '@/lib/store/slices/whitePaperCategorySlice';
import { BrandLine } from '@/components/BrandLine';
import { formatDate } from '@/lib/utils/formatDate';
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { confirmDelete, toast } from '@/lib/utils/confirm';

export default function WhitePaperCategoryList() {
  const dispatch = useAppDispatch();

  // State from Redux
  const { items, pagination, loading, error } = useAppSelector(state => state.wpCategory);

  // Local UI States
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Debounce Logic: Updates searchQuery 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // 2. Data Fetching: Runs when page or searchQuery changes
  useEffect(() => {
    dispatch(
      fetchWPCategoriesThunk({
        page: currentPage,
        limit: 10,
        search: searchQuery,
      }),
    );
  }, [dispatch, currentPage, searchQuery]);

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDelete(
      'Delete?',
      'This action cannot be undone. Are you sure you want to delete this white paper category?',
    );

    if (confirmed && pagination) {
      // This "proves" to TypeScript that pagination is not null/undefined
      try {
        await dispatch(deleteWPCategoryThunk(id)).unwrap();

        // Now TS knows pagination.page exists
        const isLastItem = items.length === 1 && pagination.page > 1;
        const pageToFetch = isLastItem ? pagination.page - 1 : pagination.page;

        dispatch(fetchWPCategoriesThunk({ page: pageToFetch, limit: pagination.limit }));
      } catch (err) {
        toast.error('Failed');
      }
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLine />
          <h1 className="text-3xl font-bold text-astraa-dark tracking-tight">White Paper Categories</h1>
        </div>

        <Link href="/white-paper-category/create">
          <button className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-astraa-violet text-white text-sm font-semibold rounded-lg hover:opacity-90 transition shadow-sm">
            <Plus size={18} /> Add Category
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by category name..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-astraa-violet/20 outline-none transition bg-white"
        />
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
              <th className="px-8 py-4">Category Name</th>
              <th className="px-8 py-4">Created Date</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-astraa-violet border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-400">Loading white paper categories...</span>
                  </div>
                </td>
              </tr>
            )}

            {/* Error state */}
            {!loading && error && (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center">
                  <p className="text-sm text-red-500 font-medium">{error}</p>
                </td>
              </tr>
            )}

            {/* Empty state */}
            {!loading && !error && items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center">
                  <p className="text-sm text-gray-400">No white paper categories found.</p>
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              items.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50 transition">
                  <td className="px-8 py-5 text-[15px] font-bold text-astraa-dark">{cat.name}</td>
                  <td className="px-8 py-5 text-sm text-gray-500">{formatDate(cat.createdAt)}</td>
                  <td className="px-8 py-5">
                    <button
                      // onClick={() => dispatch(toggleWPCategoryStatusThunk({ id: cat.id, isActive: !cat.is_active }))}
                      className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full transition-colors ${
                        cat.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end items-center gap-4 text-gray-500">
                      <Link href={`/white-paper-category/edit/${cat.id}`}>
                        <button className="cursor-pointer hover:text-astraa-violet transition">
                          <Pencil size={18} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="cursor-pointer hover:text-red-500 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination Section */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Page {pagination.page} of {pagination.totalPages} • {pagination.total} total
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
