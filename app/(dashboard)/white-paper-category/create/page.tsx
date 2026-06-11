'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { createWPCategoryThunk } from '@/lib/store/slices/whitePaperCategorySlice';
import { BrandLine } from '@/components/BrandLine';
import { ChevronLeft, Upload } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function CreateWPCategory() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // const { loading, error } = useAppSelector((state) => state.wpCategory);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!name.trim()) {
      setError('Category name is required');
      return false;
    }

    if (name.length < 3) {
      setError('Category name must be at least 3 characters');
      return false;
    }

    setError('');
    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please provide a valid category name');
      return;
    }

    const loadingToast = toast.loading('Creating category...');

    try {
      await dispatch(createWPCategoryThunk(name)).unwrap();

      toast.success('Category created successfully!', {
        id: loadingToast,
      });

      router.push('/white-paper-category');
    } catch (err: any) {
      toast.error(err || 'Failed to create category', {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="max-w-3xl space-y-10">
      <Toaster position="top-right" />
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-astraa-violet transition text-sm font-medium"
      >
        <ChevronLeft size={16} /> Back to List
      </button>

      <div className="flex items-center gap-4">
        <BrandLine />
        <div>
          <h1 className="text-3xl font-bold text-astraa-dark tracking-tight">Create Category</h1>
          <p className="text-sm text-gray-500 mt-1">Add a new white paper category</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Category Name</label>
          <input
            type="text"
            value={name}
            placeholder="e.g. Energy Transition"
            onChange={e => {
              setName(e.target.value);

              if (error) setError('');
            }}
            className={`w-full border rounded-lg px-4 py-2.5 outline-none transition ${
              error ? 'border-red-500' : 'border-gray-200 focus:border-astraa-violet'
            }`}
          />
          {error && <p className="text-[12px] text-red-500 mt-1.5 font-medium">{error}</p>}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            // onClick={handleSubmit}
            disabled={isSubmitting}
            className="cursor-pointer px-6 py-2.5 bg-astraa-violet text-white rounded-lg text-sm font-semibold hover:opacity-90 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {isSubmitting ? 'Creating...' : 'Publish Category'}
          </button>
        </div>
      </form>
    </div>
  );
}
