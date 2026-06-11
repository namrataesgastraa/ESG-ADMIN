'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchBlogsThunk, deleteBlogThunk, toggleBlogStatusThunk } from '@/lib/store/slices/blogSlice';
import { BrandLine } from '@/components/BrandLine';
import { formatDate } from '@/lib/utils/formatDate';
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight, Loader2, Link2, Layers } from 'lucide-react';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import { confirmDelete, toast } from '@/lib/utils/confirm';
import { TablePagination } from '@/components/TablePagination';

export default function BlogList() {
  const dispatch = useAppDispatch();
  const { items, pagination, loading, error } = useAppSelector(state => state.blog);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    dispatch(
      fetchBlogsThunk({
        page: currentPage,
        limit: currentLimit,
        search: searchQuery,
      }),
    );
  }, [dispatch, currentPage, searchQuery, currentLimit]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDelete(
      'Delete?',
      'This action cannot be undone. Are you sure you want to delete this blog post?',
    );

    if (confirmed && pagination) {
      try {
        await dispatch(deleteBlogThunk(id)).unwrap();
        const isLastItem = items.length === 1 && pagination.page > 1;
        const pageToFetch = isLastItem ? pagination.page - 1 : pagination.page;

        dispatch(fetchBlogsThunk({ page: pageToFetch, limit: pagination.limit }));
      } catch (err) {
        toast.error('Failed to delete blog post.');
      }
    }
  };

  return (
    <div className="space-y-10 text-astraa-dark">
      <Toaster position="top-right" />

      {/* Top Action Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLine />
          <h1 className="text-3xl font-bold tracking-tight">CMS Layout Blogs</h1>
        </div>

        <Link href="/blogs/create">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-astraa-violet text-white text-sm font-bold rounded-lg hover:opacity-90 transition shadow-sm cursor-pointer">
            <Plus size={18} /> Create Layout Post
          </button>
        </Link>
      </div>

      {/* Control Filters Block */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by main title, brand, or context parameters..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-astraa-violet/20 outline-none transition bg-white text-sm font-semibold text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Responsive Structural Datagrid */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase text-gray-500 tracking-wider">
            <tr>
              <th className="px-8 py-4 w-4/12">Article Details</th>
              <th className="px-6 py-4 w-2/12">Brand Profiles</th>
              {/* <th className="px-6 py-4 w-2/12 text-center">Engine Blocks</th> */}
              <th className="px-6 py-4 w-2/12">Status</th>
              <th className="px-8 py-4 w-2/12 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading && items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Loader2 className="animate-spin text-astraa-violet" size={26} />
                    <span className="text-xs font-medium">Loading CMS configuration profiles...</span>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-medium">
                  {error ? <span className="text-red-500">{error}</span> : 'No dynamic blogs matching criteria found.'}
                </td>
              </tr>
            ) : (
              items.map(blog => (
                <tr key={blog.id} className="hover:bg-gray-50/50 transition border-b border-gray-100">
                  {/* Article Title Hierarchy Column */}
                  <td className="px-8 py-5">
                    <div className="flex flex-col space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-astraa-violet/10 text-astraa-violet px-2 py-0.5 rounded">
                          {blog.eyebrow || 'Insight'}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(blog.createdAt)}</span>
                      </div>
                      <span className="font-bold text-[15px] leading-snug truncate text-gray-900">
                        {blog.main_title}
                      </span>
                      <span className="text-xs text-gray-500 font-medium line-clamp-1">{blog.sub_title}</span>
                    </div>
                  </td>

                  {/* Brand Profile Metadata Links Column */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col space-y-1">
                      <span className="font-bold text-xs text-gray-700">{blog.blog_name}</span>
                      {blog.website_url && (
                        <a
                          href={blog.website_url.startsWith('http') ? blog.website_url : `https://${blog.website_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-astraa-violet text-xs flex items-center gap-1 transition font-medium underline decoration-dashed underline-offset-2 hover:decoration-solid w-fit"
                        >
                          <Link2 size={12} /> Visit Domain
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Tab Metric Blocks Counting Component Column - RESTORED */}
                  {/* <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold">
                      <Layers size={14} className="text-gray-400" />
                      <span>{blog.tabs?.length || 0} Builder Tabs</span>
                    </div>
                  </td> */}

                  {/* Operational Status Column */}
                  <td className="px-6 py-5">
                    <button
                      onClick={() => dispatch(toggleBlogStatusThunk({ id: blog.id, isActive: !blog.is_active }))}
                      className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full transition-colors cursor-pointer outline-none ${
                        blog.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {blog.is_active ? 'Active' : 'Draft'}
                    </button>
                  </td>

                  {/* Grid Routing Interactions Column */}
                  <td className="px-8 py-5 text-right space-x-4">
                    <Link
                      href={`/blogs/edit/${blog.id}`}
                      className="inline-block text-gray-400 hover:text-astraa-violet transition"
                    >
                      <button className="cursor-pointer">
                        <Pencil size={18} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {pagination && items.length > 0 && (
          <TablePagination
            total={pagination.total}
            page={pagination.page}
            limit={currentLimit}
            totalPages={pagination.totalPages}
            onPageChange={newPage => handlePageChange(newPage)}
            onLimitChange={newLimit => {
              setCurrentLimit(newLimit);
              handlePageChange(1);
            }}
          />
        )}
      </div>
    </div>
  );
}