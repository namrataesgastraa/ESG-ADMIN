'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchWhitePapersThunk,
  deleteWhitePaperThunk,
  toggleWhitePaperStatusThunk,
} from '@/lib/store/slices/whitePaperSlice';
import { BrandLine } from '@/components/BrandLine';
import { formatDate } from '@/lib/utils/formatDate';
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { confirmDelete, toast } from '@/lib/utils/confirm';

export default function WhitePaperList() {
  const dispatch = useAppDispatch();
  const { items, pagination, loading, error } = useAppSelector(state => state.whitePaper);

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    dispatch(fetchWhitePapersThunk({ page: currentPage, limit: 10, search: searchQuery }));
  }, [dispatch, currentPage, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDelete(
      'Delete?',
      'This action cannot be undone. Are you sure you want to delete this white paper?',
    );

    if (confirmed && pagination) {
      try {
        await dispatch(deleteWhitePaperThunk(id)).unwrap();
        const isLastItem = items.length === 1 && pagination.page > 1;
        const pageToFetch = isLastItem ? pagination.page - 1 : pagination.page;

        dispatch(fetchWhitePapersThunk({ page: pageToFetch, limit: pagination.limit }));
      } catch (err) {
        toast.error('Failed');
      }
    }
  };
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLine />
          <h1 className="text-3xl font-bold text-astraa-dark tracking-tight">White Papers</h1>
        </div>
        <Link href="/white-paper/create">
          <button className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-astraa-violet text-white text-sm font-semibold rounded-lg hover:opacity-90 transition shadow-sm">
            <Plus size={18} /> Upload White Paper
          </button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search white papers..."
          value={searchInput}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-astraa-violet/20 outline-none transition bg-white"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase text-gray-500 tracking-wider">
            <tr>
              <th className="px-8 py-4 text-left">Document</th>
              <th className="px-8 py-4 text-left">Category</th>
              <th className="px-8 py-4 text-left">Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-astraa-violet border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-400">Loading white papers...</span>
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
                  <p className="text-sm text-gray-400">No white papers found.</p>
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              items.map(wp => (
                <tr key={wp.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  {/* Project */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      {wp.image ? (
                        <img
                          src={wp.image}
                          alt={wp.title}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-[10px]">
                          No Image
                        </div>
                      )}

                      <div className="flex flex-col">
                        <span className="text-[15px] font-semibold text-astraa-dark">{wp.title}</span>
                        <span className="text-xs text-gray-500 mt-1">{formatDate(wp.createdAt)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                      {wp.category?.name || 'Uncategorized'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-8 py-5">
                    <button
                      //   onClick={() => dispatch(toggleWhitePaperStatusThunk({ id: wp.id, isActive: !wp.is_active }))}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                        wp.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {wp.is_active ? 'Active' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end items-center gap-4 text-gray-500">
                      <Link href={`/white-paper/edit/${wp.id}`}>
                        <button className="cursor-pointer hover:text-astraa-violet transition">
                          <Pencil size={18} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(wp.id)}
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

        {pagination && pagination.totalPages > 1 && (
          <div className="px-8 py-4 bg-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Page {pagination.page} of {pagination.totalPages}
              <span className="mx-1">•</span> {pagination.total} total white papers
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 border rounded-lg disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 border rounded-lg disabled:opacity-40"
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
