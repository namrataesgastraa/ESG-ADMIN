'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  clearCaseStudyExcelPreview,
  previewCaseStudyExcelThunk,
  uploadCaseStudyExcelThunk,
} from '@/lib/store/slices/caseStudySlice';
import { BrandLine } from '@/components/BrandLine';
import { ChevronLeft, Eye, FileSpreadsheet, FileText, ImagePlus, Upload } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const EXCEL_TYPES = ['.xlsx', '.xls'];

export default function CreateCaseStudy() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { excelPreview, loading } = useAppSelector(state => state.caseStudy);

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const excelInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      dispatch(clearCaseStudyExcelPreview());
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [dispatch, coverPreview]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const buildFormData = () => {
    const data = new FormData();
    if (excelFile) data.append('excel_file', excelFile);
    if (coverImage) data.append('cover_image', coverImage);
    if (pdfFile) data.append('pdf_file', pdfFile);
    return data;
  };

  const handlePreview = async () => {
    if (!excelFile) {
      toast.error('Please select an Excel file first');
      return;
    }
    const toastId = toast.loading('Generating preview...');
    try {
      await dispatch(previewCaseStudyExcelThunk(buildFormData())).unwrap();
      toast.success('Preview ready', { id: toastId });
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Preview failed', { id: toastId });
    }
  };

  const handlePublish = async () => {
    if (!excelFile) {
      toast.error('Please select an Excel file first');
      return;
    }
    const toastId = toast.loading('Publishing case study...');
    try {
      await dispatch(uploadCaseStudyExcelThunk(buildFormData())).unwrap();
      toast.success('Case study published!', { id: toastId });
      router.push('/case-studies');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to publish', { id: toastId });
    }
  };

  const categoryTags: string[] = Array.isArray(excelPreview?.category_tags)
    ? excelPreview.category_tags
    : [];
  const keyInsights: string[] = Array.isArray(excelPreview?.key_insights)
    ? excelPreview.key_insights
    : [];
  const summaryParagraphs: string[] = Array.isArray(excelPreview?.summary_content?.paragraphs)
    ? excelPreview.summary_content.paragraphs
    : [];
  const relatedCount = Array.isArray(excelPreview?.related_case_studies)
    ? excelPreview.related_case_studies.length
    : 0;

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
          <p className="text-sm text-gray-500 mt-1">
            Upload the Excel workbook, cover image and PDF, preview, then publish.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 space-y-10">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">Case Study Excel</label>
          <input
            type="file"
            hidden
            ref={excelInputRef}
            accept={EXCEL_TYPES.join(',')}
            onChange={e => setExcelFile(e.target.files?.[0] ?? null)}
          />
          <div
            onClick={() => excelInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex items-center gap-4 cursor-pointer hover:border-astraa-violet hover:bg-astraa-violet/5 transition"
          >
            <FileSpreadsheet size={28} className={excelFile ? 'text-astraa-violet' : 'text-gray-300'} />
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {excelFile ? excelFile.name : 'Upload .xlsx workbook'}
              </p>
              <p className="text-xs text-gray-400">
                Sheets: Basic Info, Summary, Key Insights, Related Case Studies
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Cover Image</label>
            <input type="file" hidden ref={coverInputRef} accept="image/*" onChange={handleCoverChange} />
            <div
              onClick={() => coverInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 min-h-[180px] flex flex-col items-center justify-center cursor-pointer hover:border-astraa-violet hover:bg-astraa-violet/5 transition"
            >
              {coverPreview ? (
                <img src={coverPreview} className="h-40 w-full object-cover rounded-lg" alt="Cover preview" />
              ) : (
                <div className="flex flex-col items-center">
                  <ImagePlus size={24} className="text-gray-400 mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Upload Cover Image</p>
                  <p className="text-xs text-gray-400">PNG, JPG</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Case Study PDF</label>
            <input type="file" hidden ref={pdfInputRef} accept=".pdf" onChange={e => setPdfFile(e.target.files?.[0] ?? null)} />
            <div
              onClick={() => pdfInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 min-h-[180px] flex flex-col items-center justify-center cursor-pointer hover:border-astraa-violet hover:bg-astraa-violet/5 transition group"
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
          </div>
        </div>

        {excelPreview ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-6 space-y-5">
            <div className="flex items-center gap-2 text-astraa-violet">
              <Eye size={16} />
              <span className="text-xs font-bold uppercase tracking-wide">Parsed Preview</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-astraa-dark">{excelPreview.title || 'Untitled Case Study'}</h3>
              {excelPreview.subtitle ? (
                <p className="text-sm text-gray-500 mt-1">{excelPreview.subtitle}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
              <p><span className="font-semibold text-gray-700">Slug:</span> {excelPreview.slug || '—'}</p>
              <p><span className="font-semibold text-gray-700">Industry:</span> {excelPreview.industry_tag || '—'}</p>
              <p><span className="font-semibold text-gray-700">Date:</span> {excelPreview.published_date || '—'}</p>
              <p><span className="font-semibold text-gray-700">Read time:</span> {excelPreview.read_time || '—'}</p>
              <p><span className="font-semibold text-gray-700">Published:</span> {excelPreview.published ? 'Yes' : 'No (draft)'}</p>
              <p><span className="font-semibold text-gray-700">Related cards:</span> {relatedCount}</p>
            </div>

            {categoryTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categoryTags.map((tag, i) => (
                  <span key={`${tag}-${i}`} className="rounded-full bg-astraa-violet/10 px-3 py-1 text-xs font-medium text-astraa-violet">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {summaryParagraphs.length > 0 ? (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Summary</p>
                <p className="text-sm text-gray-600 line-clamp-3">{summaryParagraphs[0]}</p>
              </div>
            ) : null}

            {keyInsights.length > 0 ? (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                  Key Insights ({keyInsights.length})
                </p>
                <ul className="space-y-1.5">
                  {keyInsights.slice(0, 4).map((insight, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-astraa-violet" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex justify-between items-center pt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={handlePreview}
            disabled={loading || !excelFile}
            className="cursor-pointer px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2 transition"
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            onClick={handlePublish}
            disabled={loading || !excelFile}
            className="cursor-pointer px-8 py-2.5 bg-astraa-violet text-white rounded-lg text-sm font-bold shadow-md hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {loading ? 'Working...' : 'Publish Case Study'}
          </button>
        </div>
      </div>
    </div>
  );
}
