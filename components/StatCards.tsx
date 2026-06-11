interface Stat {
  label: string;
  value: string | number;
  color: string;
}

const stats: Stat[] = [];

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      {stats.map((stat: Stat) => (
        <div
          key={stat.label}
          className="group relative p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-astraa-violet/30 transition-all duration-300 hover:-translate-y-1"
        >
          {/* Subtle bottom gradient accent */}
          <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-astraa-violet to-astraa-coral group-hover:w-full transition-all duration-500 rounded-b-2xl" />

          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">{stat.label}</p>
          <div className="flex items-baseline gap-1">
            <p className={`text-4xl font-bold font-raleway tracking-tighter ${stat.color}`}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
