export function IndustryCard() {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <div className="brand-line"></div> {/* Mandatory Brand Signature [cite: 87] */}
        <h3 className="font-bold text-astraa-dark">Sector Expertise</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">15 Industries Served</p>
      <div className="flex flex-wrap gap-2">
        {/* Outline-only chips to match icon style [cite: 105] */}
        <span className="px-3 py-1 border border-astraa-violet/20 text-astraa-violet rounded-full text-xs font-medium">Energy</span>
        <span className="px-3 py-1 border border-astraa-violet/20 text-astraa-violet rounded-full text-xs font-medium">Tech & IT</span>
      </div>
    </div>
  );
}