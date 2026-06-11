'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const TablePagination: React.FC<PaginationProps> = ({
  total,
  page,
  limit,
  totalPages,
  onPageChange,
  onLimitChange,
}) => {
  
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div 
      className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-sm font-semibold text-gray-600 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      
      {/* Left Side: Rows Per Page Selector (ALWAYS VISIBLE) */}
      <div className="flex items-center gap-3">
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <select
            value={limit}
            onChange={(e) => {
              e.stopPropagation();
              onLimitChange(Number(e.target.value));
            }}
            className="appearance-none cursor-pointer bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-gray-900 outline-none focus:border-astraa-violet focus:ring-2 focus:ring-astraa-violet/10 shadow-sm transition-all"
          >
            {[5, 10, 20, 100].map((option) => (
              <option key={option} value={option} className="text-gray-900 font-semibold bg-white">
                {option}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        <span className="text-xs text-gray-400 font-medium tracking-wide">
          rows per page <span className="text-gray-300 ml-1">({total} items total)</span>
        </span>
      </div>

      {/* Right Side: Page Controls (Hides cleanly if there's only 1 page available) */}
      {totalPages > 1 ? (
        <div className="flex items-center gap-2 animate-in fade-in duration-200">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center shadow-sm"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>

          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return <span key={`ellipse-${idx}`} className="px-2 text-xs text-gray-400 font-bold tracking-widest">...</span>;
            }
            return (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => onPageChange(p as number)}
                className={`min-w-[32px] h-8 text-xs font-black rounded-lg transition-all border flex items-center justify-center ${
                  page === p ? 'bg-astraa-violet text-white border-astraa-violet shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center shadow-sm"
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      ) : (
        <span className="text-xs text-gray-400 font-medium italic select-none bg-gray-100/60 px-2.5 py-1 rounded-md border border-gray-200/40">
          Viewing all results
        </span>
      )}
    </div>
  );
};