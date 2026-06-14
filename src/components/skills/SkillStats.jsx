const colorMap = {
  blue:   { bg: "bg-blue-50",   icon: "bg-blue-100 text-blue-600",   value: "text-blue-700" },
  green:  { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-600", value: "text-emerald-700" },
  purple: { bg: "bg-violet-50", icon: "bg-violet-100 text-violet-600", value: "text-violet-700" },
  amber:  { bg: "bg-amber-50",  icon: "bg-amber-100 text-amber-600",  value: "text-amber-700" },
};

export default function SkillStats({ title, value, icon, color = "blue" }) {
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className={`rounded-2xl p-5 ${c.bg} flex items-center gap-4 shadow-sm`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.icon} flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">{title}</p>
        <p className={`text-3xl font-bold mt-0.5 ${c.value}`}>{value}</p>
      </div>
    </div>
  );
}