'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandLine } from '@/components/BrandLine';
import { useAppDispatch } from '@/lib/store/hooks';
import { createCategoryThunk } from '@/lib/store/slices/categorySlice';
import { Upload } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function CreateCategory() {
  const [name, setName] = useState('');
  const [error, setError] = useState(''); // Inline error state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useAppDispatch();
  const router = useRouter();

  const validate = () => {
    if (!name.trim()) {
      setError("Category name is required");
      return false;
    }
    if (name.length < 3) {
      setError("Category name must be at least 3 characters");
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Please provide a valid category name");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Creating category...");

    try {
      await dispatch(createCategoryThunk(name)).unwrap();
      toast.success("Category created successfully!", { id: loadingToast });
      router.push('/category'); 
    } catch (err: any) {
      toast.error(err || "Failed to create category", { id: loadingToast });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-10">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <BrandLine />
        <div>
          <h1 className="text-3xl font-bold text-astraa-dark tracking-tight">Create Category</h1>
          <p className="text-sm text-gray-500 mt-1">Add a new industry category for Astraa</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 space-y-8">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(''); // Clear error while typing
            }}
            placeholder="e.g. Energy Transition"
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
            className="cursor-pointer px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button 
            onClick={handleSubmit}
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
      </div>
    </div>
  );
}