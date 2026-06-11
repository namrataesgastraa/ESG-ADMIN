'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchWPCategoryByIdThunk, updateWPCategoryThunk } from '@/lib/store/slices/whitePaperCategorySlice';
import { BrandLine } from '@/components/BrandLine';
import { ChevronLeft, CheckCircle, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function EditWPCategory() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.wpCategory);
  const [errors, setError] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch existing data on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchWPCategoryByIdThunk(Number(id)))
        .unwrap()
        .then(data => {
          const category = Array.isArray(data) ? data[0] : data;
          setName(category?.name ?? '');
        })
        .catch(() => router.push('/white-paper-category'));
    }
  }, [id, dispatch, router]);

  const validate = () => {
    if (!name.trim()) {
      setError('Category name is required');
      return false;
    }
    setError('');
    return true;
  };
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please provide a category name');
      return;
    }
    setIsSubmitting(true);
    const loadingToast = toast.loading('Updating category...');
    try {
      // You'll need to ensure updateWPCategoryThunk exists in your slice
      await dispatch(updateWPCategoryThunk({ id: Number(id), name })).unwrap();
      toast.success('Category updated successfully!', { id: loadingToast });
      router.push('/white-paper-category');
    } catch (err) {
      toast.error('Failed to update category', { id: loadingToast });
    }
  };



  return (
    <div className="max-w-2xl space-y-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-astraa-violet transition text-sm font-medium"
      >
        <ChevronLeft size={16} /> Back to List
      </button>

      <div className="flex items-center gap-4">
        <BrandLine />
        <div>
          <h1 className="text-3xl font-bold text-astraa-dark tracking-tight">Edit Category</h1>
          <p className="text-sm text-gray-500 mt-1">Modify white paper category for ID: {id}</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Category Name</label>
          <input
            type="text"
            placeholder="Enter white paper category name"
            value={name}
            onChange={e => setName(e.target.value)}
            className={`w-full border rounded-lg px-4 py-3 text-[15px] outline-none transition ring-offset-1 focus:ring-2 ${
              errors 
                ? 'border-red-500 ring-red-100' 
                : 'border-gray-200 focus:border-astraa-violet focus:ring-astraa-violet/10'
            }`}
          />
          {errors && <p className="text-xs text-red-500 font-medium">{errors}</p>}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="cursor-pointer px-8 py-2.5 bg-astraa-violet text-white rounded-lg text-sm font-bold shadow-md hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle size={16} />
            )}
            {isSubmitting ? 'Saving...' : 'Update Category'}
          </button>
        </div>
      </form>
    </div>
  );
}
