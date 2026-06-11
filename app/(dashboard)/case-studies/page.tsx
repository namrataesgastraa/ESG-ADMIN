'use client';

import { useEffect } from 'react';

import { BrandLine } from '@/components/BrandLine';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { deleteCaseStudyThunk, fetchCaseStudiesThunk } from '@/lib/store/slices/caseStudySlice';
import { formatDate } from '@/lib/utils/formatDate';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { confirmDelete, toast } from '@/lib/utils/confirm';

export default function CaseStudyList() {
  const dispatch = useAppDispatch();
  const { items, pagination, loading, error } = useAppSelector(state => state.caseStudy);

  useEffect(() => {
    dispatch(fetchCaseStudiesThunk({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleDelete = async (id: number) => {
  const confirmed = await confirmDelete('Delete?', 'This action cannot be undone. Are you sure you want to delete this case study?');

  if (confirmed && pagination) { // This "proves" to TypeScript that pagination is not null/undefined
    try {
      await dispatch(deleteCaseStudyThunk(id)).unwrap();
      
      // Now TS knows pagination.page exists
      const isLastItem = items.length === 1 && pagination.page > 1;
      const pageToFetch = isLastItem ? pagination.page - 1 : pagination.page;

      dispatch(fetchCaseStudiesThunk({ page: pageToFetch, limit: pagination.limit }));
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

          <h1 className="text-3xl font-bold tracking-tight text-astraa-dark">Case Studies</h1>
        </div>

        <Link href="/case-studies/create">
          <button className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-astraa-violet text-white text-sm font-semibold rounded-lg hover:opacity-90 transition shadow-sm">
            Create Case Study
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-8 py-4 text-left">Project</th>
              <th className="px-8 py-4 text-left">Category</th>
              <th className="px-8 py-4 text-left">Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {/* Loading state */}
            {loading && (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-astraa-violet border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-400">Loading case studies...</span>
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
                  <p className="text-sm text-gray-400">No case studies found.</p>
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading &&
              !error &&
              items.map(study => (
                <tr key={study.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  {/* Project */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      {study.image && (
                        <img
                          src={study.image}
                          alt={study.title}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                        />
                      )}

                      <div className="flex flex-col">
                        <span className="text-[15px] font-semibold text-astraa-dark">{study.title}</span>
                        <span className="text-xs text-gray-500 mt-1">{formatDate(study.createdAt)}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-8 py-5 text-sm text-gray-700">{study.category?.name ?? '—'}</td>

                  {/* Status */}
                  <td className="px-8 py-5">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        study.is_active ? 'bg-astraa-violet/10 text-astraa-violet' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {study.is_active ? 'Published' : 'Inactive'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-8 py-5">
                    <div className="flex justify-end items-center gap-4 text-gray-500">
                      {/* <button className="hover:text-astraa-violet transition">
                        <Eye size={18} />
                      </button> */}

                      <Link href={`/case-studies/edit/${study.id}`}>
                        <button className="cursor-pointer hover:text-astraa-violet transition">
                          <Pencil size={18} />
                        </button>
                      </Link>

                      <button onClick={() => handleDelete(study.id)} className="cursor-pointer hover:text-red-500 transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {pagination && pagination.totalPages > 1 && (
          <div className="px-8 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {items.length} of {pagination.total} results
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={(pagination?.page ?? 1)  <= 1}
                onClick={() =>
                  dispatch(
                    fetchCaseStudiesThunk({
                      page: (pagination?.page ?? 1) - 1,
                      limit: pagination?.limit ?? 10,
                    }),
                  )
                }
                className="cursor-pointer px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              <span className="text-xs text-gray-500 px-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() =>
                  dispatch(
                    fetchCaseStudiesThunk({
                      page: pagination.page + 1,
                      limit: pagination.limit,
                    }),
                  )
                }
                className="cursor-pointer px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
