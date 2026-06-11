'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchLogsThunk } from '@/lib/store/slices/logSlice';
import { BrandLine } from '@/components/BrandLine';
import { formatDate } from '@/lib/utils/formatDate';
import { Mail, Smartphone, Globe } from 'lucide-react';

export default function DownloadLogs() {
  const dispatch = useAppDispatch();
  const { items, loading, pagination } = useAppSelector((state) => state.logs);

  useEffect(() => {
    dispatch(fetchLogsThunk({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (newPage: number) => {
    dispatch(fetchLogsThunk({ page: newPage, limit: 10 }));
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <BrandLine />
        <h1 className="text-3xl font-bold text-astraa-dark">Logs</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs font-semibold uppercase text-gray-700">
              <th className="px-8 py-4 text-left">User Details</th>
              <th className="px-8 py-4 text-left">Activity</th>
              <th className="px-8 py-4 text-left">Case Study</th>
              <th className="px-8 py-4 text-left">Network Info</th>
              <th className="px-8 py-4 text-right">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Loading state */}
            {loading && (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-astraa-violet border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-400">Loading logs...</span>
                  </div>
                </td>
              </tr>
            )}

            {/* Empty state */}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center text-sm text-gray-400">
                  No activity logs found.
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading && items.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition">
                <td className="px-8 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[14px] font-medium text-astraa-dark">
                      <Mail size={14} className="text-gray-400" /> {log.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Smartphone size={14} className="text-gray-400" /> {log.mobile}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    log.type === 'white_paper' ? 'bg-blue-50 text-blue-600' : 
                    log.type === 'blog' ? 'bg-gray-50 text-gray-600' : 
                    'bg-purple-50 text-purple-600'
                  }`}>
                    {log.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-astraa-violet">{log.title}</span>
                    <span className="text-[11px] text-gray-600 uppercase tracking-wider">{log.category_name}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <Globe size={14} className="text-gray-500" /> {log.ip_address}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <span className="text-xs font-medium text-gray-600">
                    {formatDate(log.createdAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Section */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-8 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <p className="text-xs text-gray-500 font-medium">
              Showing {items.length} of {pagination.total} entries
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={(pagination?.page ?? 1) <= 1 || loading}
                onClick={() => handlePageChange((pagination?.page ?? 1) - 1)}
                className="cursor-pointer px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition bg-white"
              >
                Previous
              </button>

              <span className="text-xs text-gray-500 px-2 font-semibold">
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