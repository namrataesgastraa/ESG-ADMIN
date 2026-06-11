'use client';

import { useEffect } from 'react';
import { BrandLine } from '@/components/BrandLine';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { deleteCategoryThunk, fetchCategoriesThunk } from '@/lib/store/slices/categorySlice';
import { formatDate } from '@/lib/utils/formatDate';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { confirmDelete, toast } from '@/lib/utils/confirm';

export default function CategoryList() {
  const dispatch = useAppDispatch();
  const { items, pagination, loading, error } = useAppSelector(state => state.category);

  // Initial Fetch
  useEffect(() => {
    dispatch(fetchCategoriesThunk({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Handle Delete with our reusable confirm modal
  const handleDelete = async (id: number) => {
    const confirmed = await confirmDelete(
      'Delete Category?',
      'Removing this category might affect case studies linked to it.'
    );

    if (confirmed) {
      try {
        await dispatch(deleteCategoryThunk(id)).unwrap();
        toast.success('Category deleted successfully');
        
        // Refresh the current page logic
        const currentPage = pagination?.page ?? 1;
        const isLastItem = items.length === 1 && currentPage > 1;
        dispatch(fetchCategoriesThunk({ 
          page: isLastItem ? currentPage - 1 : currentPage, 
          limit: pagination?.limit ?? 10 
        }));
      } catch (err) {
        toast.error('Failed to delete category');
      }
    }
  };

  // Pagination Helper
  const handlePageChange = (newPage: number) => {
    dispatch(fetchCategoriesThunk({ page: newPage, limit: pagination?.limit ?? 10 }));
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLine />
          <h1 className="text-3xl font-bold tracking-tight text-astraa-dark">Categories</h1>
        </div>

        <Link href="/category/create">
          <button className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-astraa-violet text-white text-sm font-semibold rounded-lg hover:opacity-90 transition shadow-sm">
            Create Category
          </button>
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-8 py-4 text-left">Category Name</th>
              <th className="px-8 py-4 text-left">Created Date</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={3} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-astraa-violet border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-400">Loading categories...</span>
                  </div>
                </td>
              </tr>
            )}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-8 py-16 text-center text-sm text-gray-400">
                  No categories found.
                </td>
              </tr>
            )}

            {!loading && items.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50 transition">
                <td className="px-8 py-5">
                  <span className="text-[15px] font-semibold text-astraa-dark">{cat.name}</span>
                </td>
                <td className="px-8 py-5 text-sm text-gray-500">{formatDate(cat.createdAt)}</td>
                
                <td className="px-8 py-5">
                  <div className="flex justify-end items-center gap-4 text-gray-500">
                    <Link href={`/category/edit/${cat.id}`}>
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

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-8 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Showing {items.length} of {pagination.total} categories
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={(pagination?.page ?? 1) <= 1 || loading}
                onClick={() => handlePageChange((pagination?.page ?? 1) - 1)}
                className="cursor-pointer px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition bg-white"
              >
                Previous
              </button>

              <span className="text-xs text-gray-500 px-2 font-medium">
                Page {pagination?.page} of {pagination?.totalPages}
              </span>

              <button
                disabled={(pagination?.page ?? 1) >= (pagination?.totalPages ?? 1) || loading}
                onClick={() => handlePageChange((pagination?.page ?? 1) + 1)}
                className="cursor-pointer px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition bg-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}