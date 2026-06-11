'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { createCaseStudyThunk } from '@/lib/store/slices/caseStudySlice';
import { fetchCategoriesThunk } from '@/lib/store/slices/categorySlice';
import { BrandLine } from '@/components/BrandLine';
import { Upload, ImagePlus, FileText, X, ChevronLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function CreateCaseStudy() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: categories } = useAppSelector(state => state.category);

  const [formData, setFormData] = useState({ title: '', description: '', category_id: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchCategoriesThunk({}));
  }, [dispatch]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.category_id) newErrors.category_id = 'Please select a category';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!imageFile) newErrors.image = 'Feature image is required'; // Now required
    if (!pdfFile) newErrors.pdf = 'PDF file is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      if (errors.pdf) setErrors({ ...errors, pdf: '' });
    }
  };

  const handlePublish = async () => {
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Publishing case study...');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category_id', formData.category_id);
    data.append('pdf_file', pdfFile!);
    data.append('image', imageFile!); // Guaranteed by validate()

    try {
      await dispatch(createCaseStudyThunk(data)).unwrap();
      toast.success('Case study published!', { id: loadingToast });
      router.push('/case-studies');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to publish case study';
      toast.error(message, { id: loadingToast });
      setIsSubmitting(false);
    }
  };

  // Reusable Error Component
  const ErrorMsg = ({ name }: { name: string }) =>
    errors[name] ? <p className="text-[12px] text-red-500 mt-1.5 font-medium">{errors[name]}</p> : null;

  return (
    <div className="max-w-5xl space-y-10 pb-20">
      <Toaster position="top-right" />
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-astraa-violet transition text-sm font-medium"
      >
        <ChevronLeft size={16} />
        Back to List
      </button>
      <div className="flex items-center gap-4">
        <BrandLine />
        <div>
          <h1 className="text-3xl font-bold text-astraa-dark tracking-tight">Create Case Study</h1>
          <p className="text-sm text-gray-500 mt-1">Add details about your sustainability project</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 space-y-10">
        <div className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Project Information</h2>
          <div className="grid grid-cols-2 gap-8">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Project Title</label>
              <input
                type="text"
                value={formData.title}
                placeholder="Enter project title"
                className={`w-full border rounded-lg px-4 py-3 text-[15px] outline-none transition ring-offset-1 focus:ring-2 ${
                  errors.title
                    ? 'border-red-500 ring-red-100'
                    : 'border-gray-200 focus:border-astraa-violet focus:ring-astraa-violet/10'
                }`}
                onChange={e => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
              />
              <ErrorMsg name="title" />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select
                value={formData.category_id}
                className={`w-full border rounded-lg px-4 py-3 text-[15px] outline-none bg-white transition ring-offset-1 focus:ring-2 ${
                  errors.category_id
                    ? 'border-red-500 ring-red-100'
                    : 'border-gray-200 focus:border-astraa-violet focus:ring-astraa-violet/10'
                }`}
                onChange={e => {
                  setFormData({ ...formData, category_id: e.target.value });
                  if (errors.category_id) setErrors({ ...errors, category_id: '' });
                }}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ErrorMsg name="category_id" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Project Description</label>
          <textarea
            value={formData.description}
            rows={4}
            placeholder="Describe the project impact..."
            className={`w-full border rounded-lg px-4 py-3 text-[15px] outline-none resize-none transition ring-offset-1 focus:ring-2 ${
              errors.description
                ? 'border-red-500 ring-red-100'
                : 'border-gray-200 focus:border-astraa-violet focus:ring-astraa-violet/10'
            }`}
            onChange={e => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
          />
          <ErrorMsg name="description" />
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Image Upload Area */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Feature Image</label>
            <input type="file" hidden ref={imageInputRef} accept="image/*" onChange={handleImageChange} />

            <div
              onClick={() => imageInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                errors.image
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 hover:border-astraa-violet hover:bg-astraa-violet/5'
              }`}
            >
              {imagePreview ? (
                <img src={imagePreview} className="h-40 w-full object-cover rounded-lg" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center">
                  <ImagePlus size={24} className="text-gray-400 mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Upload Image</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
            <ErrorMsg name="image" />
          </div>

          {/* PDF Upload Area */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Case Study PDF</label>
            <div
              onClick={() => pdfInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer min-h-[180px] transition group ${
                errors.pdf
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 hover:border-astraa-violet hover:bg-astraa-violet/5'
              }`}
            >
              {pdfFile ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText size={32} className="text-astraa-violet" />
                  <span className="text-xs font-semibold text-astraa-violet text-center px-4 line-clamp-1">
                    {pdfFile.name}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <FileText size={28} className="text-gray-300 group-hover:text-astraa-violet mb-2" />
                  <span className="text-sm font-medium text-gray-500 group-hover:text-astraa-violet">Upload PDF</span>
                </div>
              )}
            </div>
            <input
              type="file"
              hidden
              ref={pdfInputRef}
              accept=".pdf"
              onChange={handlePdfChange}
            />
            <ErrorMsg name="pdf" />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={isSubmitting}
            className="cursor-pointer px-8 py-2.5 bg-astraa-violet text-white rounded-lg text-sm font-bold shadow-md hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {isSubmitting ? 'Publishing...' : 'Publish Case Study'}
          </button>
        </div>
      </div>
    </div>
  );
}