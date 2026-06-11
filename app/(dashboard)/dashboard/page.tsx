'use client';

import { useEffect } from 'react';
import { BrandLine } from '@/components/BrandLine';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchCaseStudiesThunk } from '@/lib/store/slices/caseStudySlice';
import { fetchCategoriesThunk } from '@/lib/store/slices/categorySlice';
import { fetchLogsThunk } from '@/lib/store/slices/logSlice'; 
import { formatDate } from '@/lib/utils/formatDate';
import { FileText, Download, User } from 'lucide-react';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  
  const caseStudyCount = useAppSelector(state => state.caseStudy.pagination?.total ?? 0);
  const categoryCount = useAppSelector(state => state.category.pagination?.total ?? 0);
  const { items: logs, pagination: logPagination, loading: logsLoading } = useAppSelector(state => state.logs);
  
  useEffect(() => {
    dispatch(fetchCaseStudiesThunk({ page: 1, limit: 1 }));
    dispatch(fetchCategoriesThunk({ page: 1, limit: 1 }));
    dispatch(fetchLogsThunk({ page: 1, limit: 5 }));
  }, [dispatch]);

  const dynamicStats = [
    {
      label: 'Total Case Studies',
      value: caseStudyCount,
      meta: 'Across all categories',
      metaType: 'badge-violet',
      accent: 'bg-astraa-violet',
    },
    {
      label: 'Industry Categories',
      value: categoryCount,
      meta: 'Active industries',
      metaType: 'text',
      accent: 'bg-astraa-coral',
    },
    {
      label: 'Total Download Logs',
      value: logPagination?.total ?? 0, 
      meta: 'All-time activity',
      metaType: 'badge-green',
      accent: 'bg-[#1D9E75]',
    },
    {
      label: 'System Status',
      value: '100',
      unit: '%',
      meta: 'API is responsive',
      metaType: 'text',
      accent: 'bg-[#BA7517]',
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 font-raleway">
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-astraa-dark/10 px-8 h-[60px] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <BrandLine />
          <span className="text-base font-semibold text-astraa-dark">Intelligence Dashboard</span>
        </div>

        <div className="flex gap-3">
          <Link href="/category/create">
            <button className="cursor-pointer px-4 py-2 border border-astraa-dark/20 text-sm font-semibold rounded-lg hover:border-astraa-violet hover:text-astraa-violet transition">
              + Category
            </button>
          </Link>
          <Link href="/case-studies/create">
            <button className="cursor-pointer px-4 py-2 bg-astraa-dark text-white text-sm font-semibold rounded-lg hover:bg-astraa-violet transition">
              + Case Study
            </button>
          </Link>
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col gap-8 overflow-auto bg-[#F7F6F4]">
        {/* DYNAMIC CARDS */}
        <div className="grid grid-cols-4 gap-6">
          {dynamicStats.map(stat => (
            <div key={stat.label} className="bg-white border border-astraa-dark/10 rounded-xl p-6 relative shadow-sm hover:shadow-md transition-all">
              <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-xl ${stat.accent}`} />
              <p className="text-[11px] font-bold uppercase tracking-widest text-astraa-dark/50 mb-3">{stat.label}</p>
              <p className="text-3xl font-black text-astraa-dark">
                {stat.value}
                {stat.unit && <span className="text-sm font-normal text-astraa-dark/40 ml-1">{stat.unit}</span>}
              </p>
              <div className="mt-4">
                {stat.metaType.includes('badge') ? (
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${stat.metaType === 'badge-violet' ? 'bg-astraa-violet/10 text-astraa-violet' : 'bg-green-100 text-green-700'}`}>
                    {stat.meta}
                  </span>
                ) : (
                  <p className="text-xs text-astraa-dark/60 font-medium">{stat.meta}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* LOGS SECTION */}
        <div className="bg-white border border-astraa-dark/10 rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-astraa-dark/10 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-astraa-violet animate-pulse" />
               <span className="text-sm font-bold text-astraa-dark">Recent Activity</span>
            </div>
            <Link href="/logs" className="text-xs font-bold text-astraa-violet hover:underline underline-offset-4">
              View All Activity
            </Link>
          </div>

          <div className="divide-y divide-astraa-dark/5">
            {logsLoading ? (
              <div className="px-6 py-8 text-center text-sm text-gray-400">Loading logs...</div>
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <div key={log.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-astraa-violet/5 flex items-center justify-center text-astraa-violet">
                      <Download size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-astraa-dark">{log.title}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><User size={12}/> {log.email}</span>
                        <span>•</span>
                        <span>{log.category_name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-astraa-dark">{formatDate(log.createdAt)}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{log.ip_address}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-sm text-gray-400 italic">
                No activity recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}