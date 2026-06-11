'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BrandLine } from '@/components/BrandLine';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateCategoryThunk } from '@/lib/store/slices/categorySlice';
import { getCategoryByIdApi } from '@/lib/api/categoryApi';
import { Upload, ChevronLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function EditCategory() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch current data
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const res = await getCategoryByIdApi(id);
        setName(res.data.name);
      } catch (err) {
        toast.error("Failed to load category details");
        router.push('/category');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadCategory();
  }, [id, router]);

  // Validation logic
  const validate = () => {
    if (!name.trim()) {
      setError("Category name is required");
      return false;
    }
    setError('');
    return true;
  };

  const handleUpdate = async () => {
    if (!validate()) {
      toast.error("Please provide a category name");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Updating category...");

    try {
      await dispatch(
        updateCategoryThunk({
          id,
          data: { name,is_active: true }, // Status (is_active) removed as per previous update
        }),
      ).unwrap();

      toast.success("Category updated successfully!", { id: loadingToast });
      router.push('/category');
    } catch (err: any) {
      toast.error(err || "Failed to update category", { id: loadingToast });
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 border-4 border-astraa-violet border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 font-medium">Loading category details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-10">
      <Toaster position="top-right" />

      {/* Breadcrumb / Back Button */}
      <button 
        onClick={() => router.back()}
        className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-astraa-violet transition text-sm font-medium"
      >
        <ChevronLeft size={16} /> Back to List
      </button>

      {/* Header */}
      <div className="flex items-center gap-4">
        <BrandLine />
        <div>
          <h1 className="text-3xl font-bold text-astraa-dark tracking-tight">Edit Category</h1>
          <p className="text-sm text-gray-500 mt-1">Modify industry details for ID: {id}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 space-y-8">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={e => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter category name"
            className={`w-full border rounded-lg px-4 py-3 text-[15px] outline-none transition ring-offset-1 focus:ring-2 ${
              error 
                ? 'border-red-500 ring-red-100' 
                : 'border-gray-200 focus:border-astraa-violet focus:ring-astraa-violet/10'
            }`}
          />
          {error && <p className="text-[12px] text-red-500 mt-1.5 font-medium">{error}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
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
              <Upload size={16} />
            )}
            {isSubmitting ? 'Saving...' : 'Update Category'}
          </button>
        </div>
      </div>
    </div>
  );
}