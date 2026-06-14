export default function AchievementCard({ achievement }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6 flex flex-col items-center text-center hover:shadow-md transition">
      <div className="text-5xl mb-3">🏆</div>
      <h3 className="font-bold text-[#0F172A] text-sm mb-1">{achievement.title}</h3>
      <p className="text-[#64748B] text-xs leading-relaxed mb-3">{achievement.description}</p>
      {achievement.earnedDate && (
        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
          Earned: {achievement.earnedDate}
        </span>
      )}
    </div>
  );
}