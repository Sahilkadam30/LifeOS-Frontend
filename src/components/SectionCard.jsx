const SectionCard = ({ item }) => {
  return (
    <div
      className="rounded-2xl border p-5 mb-4"
      style={{ backgroundColor: item.cardColor }}
    >
      <div className="flex justify-between mb-4">
        <h3 className="font-bold text-xl text-[#323232]">
          {item.title}
        </h3>

        <span className="text-sm text-gray-500">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-[#323232] leading-7 line-clamp-4">
        {item.content}
      </p>
    </div>
  );
};

export default SectionCard;