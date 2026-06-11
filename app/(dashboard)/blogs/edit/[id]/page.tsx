'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateBlogThunk } from '@/lib/store/slices/blogSlice';
import { getBlogByIdApi } from '@/lib/api/blogApi';
import { BrandLine } from '@/components/BrandLine';
import { Upload, ImagePlus, ChevronLeft, Loader2, Info, Layout, Share2, Type, FileSearch } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function EditBlog() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.blog);

  // Active Tab Navigation Control
  const [activeTab, setActiveTab] = useState('profiles');

  // Core Metadata State Layer
  const [formData, setFormData] = useState({
    blogName: '',
    websiteUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    mediumUrl: '',
    mainTitle: '',
    subTitle: '',
    eyebrow: '',
    introParagraph1: '',
    introParagraph2: '',
    ctaText: '',
    coverCaption: '',
  });

  // Native Files & Previews State
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [tab1Image, setTab1Image] = useState<File | null>(null);
  const [tab3Image, setTab3Image] = useState<File | null>(null);
  const [tab5Image, setTab5Image] = useState<File | null>(null);

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [existingTab1Img, setExistingTab1Img] = useState<string | null>(null);
  const [existingTab3Img, setExistingTab3Img] = useState<string | null>(null);
  const [existingTab5Img, setExistingTab5Img] = useState<string | null>(null);

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tabs, setTabs] = useState<any[]>([]);
  const [references, setReferences] = useState<any[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const coverInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch existing blog configuration on mount and hydrate states
  useEffect(() => {
    if (!id) return;

    const hydrateBlogData = async () => {
      try {
        const response = await getBlogByIdApi(Number(id));
        const blog = response.data;

        setFormData({
          blogName: blog.blog_name || '',
          websiteUrl: blog.website_url || '',
          linkedinUrl: blog.linkedin_url || '',
          instagramUrl: blog.instagram_url || '',
          mediumUrl: blog.medium_url || '',
          mainTitle: blog.main_title || '',
          subTitle: blog.sub_title || '',
          eyebrow: blog.eyebrow || '',
          introParagraph1: blog.intro_paragraph_1 || '',
          introParagraph2: blog.intro_paragraph_2 || '',
          ctaText: blog.cta_text || '',
          coverCaption: blog.cover_caption || '',
        });

        setCoverPreview(blog.cover_image);

        // Map dynamic incoming tab payloads into structured local editor blocks
        const structuralTabs = blog.tabs.map((tab: any) => {
          const targetTab: any = {
            tab_order: tab.tab_order,
            heading: tab.heading,
            section_image_caption: tab.section_image_caption || '',
            paragraphs: tab.content?.paragraphs || [],
            intro: tab.content?.intro || '',
            bullets: (tab.bullets && Array.isArray(tab.bullets))
              ? tab.bullets.map((b: any) => ({ lead: b.lead, body: b.body }))
              : (tab.content?.bullets || []),
            cards: tab.content?.cards || []
          };

          if (tab.tab_order === 1) setExistingTab1Img(tab.section_image);
          if (tab.tab_order === 3) setExistingTab3Img(tab.section_image);
          if (tab.tab_order === 5) setExistingTab5Img(tab.section_image);

          return targetTab;
        });

        setTabs(structuralTabs.sort((a: any, b: any) => a.tab_order - b.tab_order));
        setReferences(blog.references || []);
        setIsPageLoading(false);
      } catch (err) {
        toast.error("Failed to load layout configuration profile.");
        router.push('/blogs');
      }
    };

    hydrateBlogData();
  }, [id, router]);

  // Form Validation Checklist
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.blogName.trim()) newErrors.blogName = 'Brand Name is strictly required.';
    if (!formData.mainTitle.trim()) newErrors.mainTitle = 'Main Title Text is required and must be unique.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (coverPreview?.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Safe type-guarded index helpers satisfying TS constraints
  const updateTabParagraph = (tabIndex: number, pIndex: number, value: string) => {
    const updated = [...tabs];
    const target = updated[tabIndex];
    if (target && target.paragraphs) {
      target.paragraphs[pIndex] = value;
      setTabs(updated);
    }
  };

  const updateCardItem = (tabIndex: number, cardIndex: number, itemIndex: number, value: string) => {
    const updated = [...tabs];
    const target = updated[tabIndex];
    if (target && target.cards && target.cards[cardIndex]) {
      target.cards[cardIndex].items[itemIndex] = value;
      setTabs(updated);
    }
  };

  const updateBulletBody = (tabIndex: number, bulletIndex: number, value: string) => {
    const updated = [...tabs];
    const target = updated[tabIndex];
    if (target && target.bullets && target.bullets[bulletIndex]) {
      target.bullets[bulletIndex].body = value;
      setTabs(updated);
    }
  };

  const updateBulletLead = (tabIndex: number, bulletIndex: number, value: string) => {
    const updated = [...tabs];
    const target = updated[tabIndex];
    if (target && target.bullets && target.bullets[bulletIndex]) {
      target.bullets[bulletIndex].lead = value;
      setTabs(updated);
    }
  };

  const addBullet = (tabIndex: number) => {
    const updated = [...tabs];
    const target = updated[tabIndex];
    if (target && target.bullets) {
      target.bullets.push({ lead: '', body: '' });
      setTabs(updated);
    }
  };

  const removeBullet = (tabIndex: number, bulletIndex: number) => {
    const updated = [...tabs];
    const target = updated[tabIndex];
    if (target && target.bullets && target.bullets.length > 1) {
      target.bullets.splice(bulletIndex, 1);
      setTabs(updated);
    }
  };

  const handleUpdateSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please resolve missing required fields before updating.');
      return;
    }

    const loadingToast = toast.loading('Syncing modified structure models...');

    const formattedTabs = tabs.map(tab => {
      const baseTab: any = {
        tab_order: tab.tab_order,
        heading: tab.heading,
        section_image_caption: tab.section_image_caption || null,
        content: {},
      };

      if (tab.paragraphs && tab.paragraphs.length > 0) baseTab.content.paragraphs = tab.paragraphs;
      if (tab.intro) baseTab.content.intro = tab.intro;
      if (tab.bullets && tab.bullets.length > 0) baseTab.content.bullets = tab.bullets;
      if (tab.cards && tab.cards.length > 0) baseTab.content.cards = tab.cards;

      return baseTab;
    });

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      data.append(snakeKey, val);
    });

    data.append('tabs', JSON.stringify(formattedTabs));
    data.append('references', JSON.stringify(references.filter(r => r.content?.trim() !== '')));

    if (coverImage) data.append('cover_image', coverImage);
    if (tab1Image) data.append('tab1_image', tab1Image);
    if (tab3Image) data.append('tab3_image', tab3Image);
    if (tab5Image) data.append('tab5_image', tab5Image);

    try {
      await dispatch(updateBlogThunk({ id: Number(id), formData: data })).unwrap();
      toast.success('Configuration schema updated successfully!', { id: loadingToast });
      router.push('/blogs');
    } catch (err: any) {
      toast.error(err || 'Failed to apply transformations', { id: loadingToast });
    }
  };

  if (isPageLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-2 text-gray-400">
        <Loader2 className="animate-spin text-astraa-violet" size={32} />
        <span className="text-sm font-medium">Hydrating component layout structures...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleUpdateSubmission} className="max-w-6xl space-y-10 pb-20 text-astraa-dark antialiased">
      <Toaster position="top-right" />
      
      {/* Back Link Wrapper */}
      <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-astraa-violet transition text-sm font-semibold tracking-wide group">
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Dashboard List
      </button>

      {/* Screen Header row */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          <BrandLine />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Modify CMS Layout Blog</h1>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Update Live Dynamic Configurations</p>
          </div>
        </div>
        {/* <button type="submit" disabled={loading} className="px-6 py-3 bg-astraa-violet text-white text-sm font-bold rounded-lg hover:opacity-95 active:scale-[0.99] transition flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer">
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          Save Modifications
        </button> */}
      </div>

      {/* Split Workspace Layout */}
      <div className="flex gap-8 items-start">
        
        {/* Left Vertical Tab Navigation Bar */}
        <div className="w-64 space-y-2 shrink-0 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2 block mb-2 select-none">
            Form Workspaces
          </span>
          {[
            { id: 'profiles', label: 'Brand Channels', icon: Share2 },
            { id: 'hero', label: 'Hero Layout Context', icon: Type },
            { id: 'matrix', label: 'Dynamic Tab Blocks', icon: Layout },
            { id: 'footer', label: 'References & CTA', icon: FileSearch },
          ].map((item) => {
            const Icon = item.icon;
            const hasError = (item.id === 'profiles' && errors.blogName) || (item.id === 'hero' && errors.mainTitle);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative ${
                  activeTab === item.id
                    ? 'bg-astraa-violet text-white shadow-sm shadow-astraa-violet/20'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} className={activeTab === item.id ? 'text-white' : 'text-gray-400'} />
                <span>{item.label}</span>
                {hasError && (
                  <div className="w-2 h-2 bg-red-500 rounded-full ml-auto animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Active View Form Container */}
        <div className="flex-grow">
          
          {/* Workspace: Brand Channel Profiles */}
          {activeTab === 'profiles' && (
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-astraa-violet uppercase tracking-widest">1. Brand Channel Profiles</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                    Brand Name{' '}
                    <span className="text-red-500 font-bold text-xl select-none animate-pulse">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.blogName}
                    onChange={e => {
                      setFormData({...formData, blogName: e.target.value});
                      if (errors.blogName) setErrors({...errors, blogName: ''});
                    }}
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none font-medium transition ${
                      errors.blogName
                        ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 focus:border-astraa-violet focus:ring-2 focus:ring-astraa-violet/10'
                    }`}
                  />
                  {errors.blogName && (
                    <p className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1">
                      <Info size={12} />
                      {errors.blogName}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Website Target Domain link
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. www.esgastraa.com"
                    value={formData.websiteUrl}
                    onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-astraa-violet transition"
                  />
                </div>
              </div>

              {/* Integrated Social Links Grid */}
              <div className="grid grid-cols-3 gap-6 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/company/..."
                    value={formData.linkedinUrl}
                    onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-medium outline-none focus:border-astraa-violet bg-gray-50/30 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Instagram Profile URL</label>
                  <input
                    type="text"
                    placeholder="https://instagram.com/..."
                    value={formData.instagramUrl}
                    onChange={e => setFormData({ ...formData, instagramUrl: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-medium outline-none focus:border-astraa-violet bg-gray-50/30 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Medium Profile URL</label>
                  <input
                    type="text"
                    placeholder="https://medium.com/@..."
                    value={formData.mediumUrl}
                    onChange={e => setFormData({ ...formData, mediumUrl: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-medium outline-none focus:border-astraa-violet bg-gray-50/30 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Workspace: Hero Layout Context */}
          {activeTab === 'hero' && (
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <h3 className="text-xs font-bold text-astraa-violet uppercase tracking-widest border-b border-gray-100 pb-3">
                2. Hero Header Settings
              </h3>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Eyebrow Tag Context 
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ESG Insight"
                    value={formData.eyebrow}
                    onChange={e => setFormData({ ...formData, eyebrow: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-astraa-violet transition"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                    Main Title Header Text <span className="text-red-500 font-bold text-xl select-none animate-pulse">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The Turning Point for ESG in India is here"
                    value={formData.mainTitle}
                    onChange={e => {
                      setFormData({ ...formData, mainTitle: e.target.value });
                      if (errors.mainTitle) setErrors({ ...errors, mainTitle: '' });
                    }}
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm font-bold outline-none transition ${
                      errors.mainTitle
                        ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 focus:border-astraa-violet focus:ring-2 focus:ring-astraa-violet/10'
                    }`}
                  />
                  {errors.mainTitle && (
                    <p className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1">
                      <Info size={12} />
                      {errors.mainTitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. CAG Brings ESG into Audit"
                  value={formData.subTitle}
                  onChange={e => setFormData({ ...formData, subTitle: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-astraa-violet transition"
                />
              </div>

              {/* Integrated Main Hero Cover Image Dynamic Asset Uploader Zone */}
              <div className="space-y-2 border border-gray-100 rounded-xl p-5 bg-gray-50/20">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Article Main Hero Cover Image <span className="text-gray-500 font-normal">(Optional)</span></label>
                <div onClick={() => coverInputRef.current?.click()} className="group border border-dashed border-gray-200 rounded-lg p-2 min-h-[150px] flex items-center justify-center cursor-pointer relative overflow-hidden bg-white hover:bg-gray-50 transition">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover Preview" className="h-36 w-full object-cover rounded shadow-sm" />
                  ) : (
                    <div className="text-gray-400 text-xs flex flex-col items-center gap-1.5 py-4">
                      <ImagePlus size={22} className="text-gray-400" />
                      <span>No image asset assigned to header background</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white font-bold text-xs uppercase tracking-wider">Replace Cover Binary</div>
                </div>
                <input type="file" ref={coverInputRef} hidden accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) { setCoverImage(file); setCoverPreview(URL.createObjectURL(file)); }
                }} />
                <div className="space-y-1 mt-3">
                  <label className="text-xs font-bold text-gray-500">Cover Image Caption (Optional)</label>
                  <input type="text" placeholder="Caption descriptor text line" value={formData.coverCaption} onChange={e => setFormData({...formData, coverCaption: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium outline-none mt-2 focus:border-astraa-violet bg-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Opening Segment Paragraph 1 <span className="text-gray-300 font-normal">(Optional)</span></label>
                  <textarea rows={3} value={formData.introParagraph1} onChange={e => setFormData({...formData, introParagraph1: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium resize-none outline-none focus:border-astraa-violet transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Opening Segment Paragraph 2 <span className="text-gray-300 font-normal">(Optional)</span></label>
                  <textarea rows={3} value={formData.introParagraph2} onChange={e => setFormData({...formData, introParagraph2: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium resize-none outline-none focus:border-astraa-violet transition" />
                </div>
              </div>
            </div>
          )}

          {/* Workspace: Dynamic Tab Blocks */}
          {activeTab === 'matrix' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex flex-col space-y-1 border-b border-gray-100 pb-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-sm font-bold uppercase text-gray-700 tracking-wider">
                  3. Tab Content Block Framework Matrix
                </h2>
                <p className="text-[11px] text-gray-500 font-medium italic">
                  All interior block segments below are optional. Blank fields will be pruned automatically on synchronization execution.
                </p>
              </div>

              {tabs.map((tab, tIdx) => (
                <div
                  key={tab.tab_order}
                  className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6 transition hover:border-gray-300"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="bg-astraa-violet/10 text-astraa-violet text-xs font-extrabold px-3 py-1 rounded-md border border-astraa-violet/10">TAB #{tab.tab_order}</span>
                    <span className="font-bold text-md text-gray-700">{tab.heading}</span>
                  </div>

                  {/* Render paragraphs dynamically */}
                  {tab.paragraphs && tab.paragraphs.length > 0 && (
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-gray-500 uppercase">Paragraph Node Stream Sequence</label>
                      {tab.paragraphs.map((para: string, pIdx: number) => (
                        <textarea key={pIdx} rows={2} value={para} onChange={e => updateTabParagraph(tIdx, pIdx, e.target.value)} className="w-full border border-gray-100 rounded-lg p-3 text-sm font-medium resize-none outline-none focus:border-gray-300 bg-gray-50/10" />
                      ))}
                    </div>
                  )}

                  {/* Render cards array inputs strictly matching Tab order #2 */}
                  {tab.cards && tab.cards.length > 0 && (
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-gray-500 uppercase block">Dynamic Dashboard Metrics Cards Grid</label>
                      <div className="grid grid-cols-3 gap-4">
                        {tab.cards.map((card: any, cIdx: number) => (
                          <div key={card.title} className="border border-gray-100 bg-gray-50/50 p-4 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-astraa-violet block mb-1">{card.title}</span>
                            {card.items?.map((item: string, iIdx: number) => (
                              <input key={iIdx} type="text" value={item} onChange={e => updateCardItem(tIdx, cIdx, iIdx, e.target.value)} className="w-full border bg-white px-3 py-1.5 rounded-lg text-xs font-semibold outline-none focus:border-astraa-violet transition" />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render Intro and Bullet layout blocks custom matching Tab order #4 */}
                  {tab.intro !== undefined && tab.bullets && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Context Segment Bullet Lead statement</label>
                        <input type="text" value={tab.intro} onChange={e => {
                          const updated = [...tabs];
                          updated[tIdx].intro = e.target.value;
                          setTabs(updated);
                        }} className="w-full border px-3 py-2 text-sm rounded-lg outline-none focus:border-astraa-violet" />
                      </div>
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                            Nested Bullets Explanation Array
                          </label>
                          <button
                            type="button"
                            onClick={() => addBullet(tIdx)}
                            className="text-xs text-astraa-violet font-bold hover:underline"
                          >
                            + Add Bullet
                          </button>
                        </div>
                        {tab.bullets.map((bullet: any, bIdx: number) => (
                          <div key={bIdx} className="flex gap-3 items-start group">
                            <input
                              type="text"
                              placeholder="Bullet title/lead..."
                              value={bullet.lead}
                              onChange={e => updateBulletLead(tIdx, bIdx, e.target.value)}
                              className="w-1/3 border border-gray-200 bg-white px-3 py-2 rounded-lg text-xs font-semibold outline-none focus:border-astraa-violet focus:ring-1 focus:ring-astraa-violet/20 transition"
                            />
                            <input
                              type="text"
                              placeholder="Provide body contextual descriptor segment..."
                              value={bullet.body}
                              onChange={e => updateBulletBody(tIdx, bIdx, e.target.value)}
                              className="flex-1 border border-gray-200 px-3 py-2 text-xs font-medium rounded-lg outline-none focus:border-astraa-violet focus:ring-1 focus:ring-astraa-violet/20 transition"
                            />
                            {tab.bullets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBullet(tIdx, bIdx)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition"
                                title="Delete bullet"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Asset Management hook checks handling relative URL assets */}
                  {[1, 3, 5].includes(tab.tab_order) && (
                    <div className="pt-4 border-t flex items-center justify-between text-xs font-bold text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Tab {tab.tab_order} Secondary Media Asset slot (Optional):
                        </span>
                        <input type="file" accept="image/*" onChange={e => {
                          const file = e.target.files?.[0] || null;
                          if (tab.tab_order === 1) setTab1Image(file);
                          if (tab.tab_order === 3) setTab3Image(file);
                          if (tab.tab_order === 5) setTab5Image(file);
                        }} className="file:bg-gray-100 file:border-0 file:rounded file:px-2 file:py-1 file:text-xs" />
                        
                        {/* {((tab.tab_order === 1 && existingTab1Img) || 
                          (tab.tab_order === 3 && existingTab3Img) || 
                          (tab.tab_order === 5 && existingTab5Img)) && (
                          <span className="text-green-600 text-[10px] bg-green-50 px-2 py-0.5 rounded uppercase tracking-wider">Asset Present on cloud</span>
                        )} */}
                      </div>
                      <input type="text" placeholder="Section Image Caption override" value={tab.section_image_caption} onChange={e => {
                        const updated = [...tabs];
                        updated[tIdx].section_image_caption = e.target.value;
                        setTabs(updated);
                      }} className="border border-gray-200 rounded px-3 py-1.5 text-xs font-medium w-1/3 outline-none focus:border-astraa-violet bg-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Workspace: References & CTA */}
          {activeTab === 'footer' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              {/* Dynamic References Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">4. Footnotes References </h3>
                {references.map((ref, idx) => (
                  <div key={ref.id || ref.reference_order} className="flex gap-4 items-center">
                    <span className="text-xs font-extrabold text-gray-400 bg-gray-50 border px-2 py-1 rounded">[{ref.reference_order}]</span>
                    <input type="text" value={ref.content} onChange={e => {
                      const updated = [...references];
                      updated[idx].content = e.target.value;
                      setReferences(updated);
                    }} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-xs font-medium outline-none focus:border-astraa-violet transition" />
                  </div>
                ))}
              </div>

              {/* Conversion Actions Row */}
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">5. Bottom Conversion Call-To-Action Box Text</label>
                <input type="text" value={formData.ctaText} onChange={e => setFormData({...formData, ctaText: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold outline-none focus:border-astraa-violet transition" />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Execution Actions Footbar */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-astraa-violet text-white rounded-lg text-sm font-bold shadow-md hover:opacity-95 disabled:opacity-50 flex items-center gap-2 transition cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload size={16} />}
          Save Modifications
        </button>
      </div>
    </form>
  );
}