'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchWhitePaperByIdThunk, updateWhitePaperThunk } from '@/lib/store/slices/whitePaperSlice';
import { fetchWPCategoriesThunk } from '@/lib/store/slices/whitePaperCategorySlice';
import { BrandLine } from '@/components/BrandLine';
import { ChevronLeft, Save, Loader2, FileText, ImagePlus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function EditWhitePaper() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.whitePaper);
  const { items: categories } = useAppSelector(state => state.wpCategory);
  const [formData, setFormData] = useState({ title: '', description: '', category_id: '' });


  // Files
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingPdf, setExistingPdf] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   dispatch(fetchWPCategoriesThunk({ page: 1, limit: 100 }));

  //   // Fetch existing WP data
  //   if (id) {
  //     getWhitePaperByIdApi(Number(id)).then(res => {
  //       const wp = res.data;
  //       setFormData({
  //         title: wp.title,
  //         description: wp.description,
  //         category_id: wp.category_id.toString()
  //       });
  //       setImagePreview(wp.image);
  //       if (wp.pdf_file) setExistingPdf(wp.pdf_file.split('/').pop());
  //     });
  //   }
  // }, [id, dispatch]);

    useEffect(() => {
      dispatch(fetchWPCategoriesThunk({ page: 1, limit: 100 }));
      if (id) {
        dispatch(fetchWhitePaperByIdThunk(Number(id)))
          .unwrap()
          .then(data => {
            setFormData({
              title: data.title,
              description: data.description,
              category_id: data.category_id.toString(),
            });
            setImagePreview(data.image);
            if (data.pdf_file) {
              setExistingPdf(data.pdf_file.split('/').pop());
            }
          })
          .catch(() => toast.error('Failed to load white paper data'));
      }
    }, [id, dispatch]);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.category_id) newErrors.category_id = 'Please select a category';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!imagePreview && !imageFile) newErrors.image = 'Feature image is required';
    if (!existingPdf && !pdfFile) newErrors.pdf = 'PDF file is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Updating white paper...');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category_id', formData.category_id);
    if (imageFile) data.append('image', imageFile);
    if (pdfFile) data.append('pdf_file', pdfFile);

    try {
      await dispatch(updateWhitePaperThunk({ id: Number(id), formData: data })).unwrap();
      toast.success('White paper updated!', { id: loadingToast });
      router.push('/white-paper');
    } catch (err: any) {
      toast.error(err || 'Update failed.', { id: loadingToast });
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
        className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-astraa-violet transition text-sm font-medium"
      >
        <ChevronLeft size={16} /> Back to List
      </button>

      <div className="flex items-center gap-4">
        <BrandLine />
        <div>
          <h1 className="text-3xl font-bold text-astraa-dark tracking-tight">Edit White Paper</h1>
          <p className="text-sm text-gray-500 mt-1">Update your project details and media</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 space-y-10">
        <div className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Project Information</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Project Title</label>
              <input
                type="text"
                value={formData.title}
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

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Project Description</label>
          <textarea
            rows={5}
            value={formData.description}
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
          {/* Image */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Feature Image</label>

            {/* Wrap in label to remove the need for Ref-clicks */}
            <label
              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer min-h-[180px] transition group ${
                errors.image
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 hover:border-astraa-violet hover:bg-astraa-violet/5'
              }`}
            >
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                    if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
                  }
                }}
              />

              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img src={imagePreview} className="w-full h-36 object-cover rounded-lg" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4 text-gray-300 group-hover:text-astraa-violet">
                  <ImagePlus size={28} className="mb-2" />
                  <span className="text-sm font-medium">Upload Image</span>
                </div>
              )}
            </label>

            <ErrorMsg name="image" />
          </div>

          {/* PDF */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700"> White Paper PDF</label>
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
              ) : existingPdf ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText size={32} className="text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 px-4 line-clamp-1">{existingPdf}</span>
                  <span className="text-[10px] text-astraa-violet font-bold uppercase">Click to Replace</span>
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
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  setPdfFile(file);
                  if (errors.pdf) setErrors({ ...errors, pdf: '' });
                }
              }}
            />
            <ErrorMsg name="pdf" />
          </div>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
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
              <Save size={16} />
            )}
            {isSubmitting ? 'Updating...' : 'Update white paper'}
          </button>
        </div>
      </div>
    </div>
  );
}
