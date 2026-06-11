interface Industry {
  name: string;
  status: string;
  lead: string;
}

const industries: Industry[] = [];

export default function IndustryTable() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/20 overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-astraa-dark font-raleway">Sector Expertise Monitor</h3>
          <p className="text-xs text-gray-400 mt-1">Real-time status across 15 industries</p>
        </div>
        <button className="text-xs font-bold text-astraa-violet hover:underline tracking-widest uppercase">
          View All Report →
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-[10px] uppercase tracking-[0.15em] text-gray-400">
              <th className="px-8 py-4 font-bold">Industry Sector</th>
              <th className="px-8 py-4 font-bold">Project Phase</th>
              <th className="px-8 py-4 font-bold text-right">ESG Pillar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {industries.map((item) => (
              <tr key={item.name} className="group hover:bg-gray-50/80 transition-colors">
                <td className="px-8 py-5 font-medium text-astraa-dark flex items-center gap-3">
                  {/* Geometric bullet point */}
                  <div className="w-2 h-2 rounded-full border border-astraa-violet group-hover:bg-astraa-violet transition-colors" />
                  {item.name}
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-astraa-coral animate-pulse" />
                      <span className="text-gray-500 text-sm">{item.status}</span>
                   </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <span className={`inline-block px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase border ${
                    item.lead === 'Environmental' ? 'border-green-100 bg-green-50/30 text-green-700' : 
                    item.lead === 'Social' ? 'border-blue-100 bg-blue-50/30 text-blue-700' : 
                    'border-purple-100 bg-purple-50/30 text-purple-700'
                  }`}>
                    {item.lead}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}