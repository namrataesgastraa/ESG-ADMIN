'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { createWhitePaperThunk } from '@/lib/store/slices/whitePaperSlice';
import { fetchWPCategoriesThunk } from '@/lib/store/slices/whitePaperCategorySlice';
import { BrandLine } from '@/components/BrandLine';
import { Upload, ImagePlus, FileText, ChevronLeft, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
export default function CreateWhitePaper() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.whitePaper);
  const { items: categories } = useAppSelector(state => state.wpCategory);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
  });

  // File State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

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
  // Fetch categories for the dropdown
  useEffect(() => {
    dispatch(fetchWPCategoriesThunk({ page: 1, limit: 100 }));
  }, [dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
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
    const loadingToast = toast.loading('Publishing white paper...');
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category_id', formData.category_id);

    if (imageFile) data.append('image', imageFile);
    if (pdfFile) data.append('pdf_file', pdfFile);

    try {
      await dispatch(createWhitePaperThunk(data)).unwrap();
      toast.success('White paper published!', { id: loadingToast });
      router.push('/white-paper');
    } catch (err: any) {
      toast.error(err || 'Failed to publish white paper.', { id: loadingToast });
      setIsSubmitting(false);
    }
  };
  const ErrorMsg = ({ name }: { name: string }) =>
    errors[name] ? <p className="text-[12px] text-red-500 mt-1.5 font-medium">{errors[name]}</p> : null;

  return (
    <div className="max-w-5xl space-y-10 pb-20">
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
          <h1 className="text-3xl font-bold text-astraa-dark tracking-tight">Upload White Paper</h1>
          <p className="text-sm text-gray-500 mt-1">Publish technical documents and research reports</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 space-y-10">
        <div className="grid grid-cols-2 gap-8">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Document Title</label>
            <input
              type="text"
              placeholder="e.g., Annual Sustainability Report 2026"
              value={formData.title}
              onChange={e => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              className={`w-full border rounded-lg px-4 py-3 text-[15px] outline-none transition ring-offset-1 focus:ring-2 ${
                errors.title
                  ? 'border-red-500 ring-red-100'
                  : 'border-gray-200 focus:border-astraa-violet focus:ring-astraa-violet/10'
              }`}
            />
            <ErrorMsg name="title" />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <select
              value={formData.category_id}
              onChange={e => {
                setFormData({ ...formData, category_id: e.target.value });
                if (errors.category_id) setErrors({ ...errors, category_id: '' });
              }}
              className={`w-full border rounded-lg px-4 py-3 text-[15px] outline-none transition ring-offset-1 focus:ring-2 ${
                errors.category_id
                  ? 'border-red-500 ring-red-100'
                  : 'border-gray-200 focus:border-astraa-violet focus:ring-astraa-violet/10'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ErrorMsg name="category_id" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">Description / Abstract</label>
          <textarea
            rows={4}
            placeholder="Briefly describe the contents of this white paper..."
            value={formData.description}
            onChange={e => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
            className={`w-full border rounded-lg px-4 py-3 text-[15px] outline-none resize-none transition ring-offset-1 focus:ring-2 ${
              errors.description
                ? 'border-red-500 ring-red-100'
                : 'border-gray-200 focus:border-astraa-violet focus:ring-astraa-violet/10'
            }`}
          />
          <ErrorMsg name="description" />
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Feature Image Upload */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Cover Image</label>
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
                <div className="relative w-full h-full">
                  <img src={imagePreview} className="h-40 w-full object-cover rounded-lg shadow-sm" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                    <span className="text-white text-xs font-bold uppercase">Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400 group-hover:text-astraa-violet">
                  <ImagePlus size={32} className="mb-2" />
                  <p className="text-sm font-semibold">Upload Cover</p>
                </div>
              )}
            </div>
            <ErrorMsg name="image" />
          </div>

          {/* PDF Upload */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">White Paper PDF</label>
            <input type="file" hidden ref={pdfInputRef} accept=".pdf" onChange={handlePdfChange} />
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
                  <span className="text-sm font-medium text-astraa-dark truncate max-w-[200px]">{pdfFile.name}</span>
                  <span className="text-[10px] text-astraa-violet font-bold uppercase">Change PDF</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400 group-hover:text-astraa-violet">
                  <FileText size={32} className="mb-2" />
                  <p className="text-sm font-semibold">Upload Document</p>
                </div>
              )}
            </div>
            <ErrorMsg name="pdf" />
          </div>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer px-6 py-2.5 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
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
            {isSubmitting ? 'Publishing...' : 'Publish White Paper'}
          </button>
        </div>
      </div>
    </div>
  );
}
