export default function DashboardHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center mb-8">
      {/* Brand Signature Line [cite: 88] */}
      <div className="w-[2px] h-8 bg-gradient-to-b from-[#7516EA] to-[#F16B86] mr-4 shrink-0" />
      <h1 className="text-2xl font-bold text-[#232234] font-raleway tracking-tight">
        {title}
      </h1>
    </div>
  );
}