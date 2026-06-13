import { FiTrash2, FiStar, FiCalendar } from "react-icons/fi";
import { toggleFavorite } from "../services/writingService";
import API from "../api";

const WritingCard = ({ item, refreshData }) => {
  const handleFavorite = async (e) => {
    e.stopPropagation();
    try {
      await toggleFavorite(item.id);
      refreshData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this writing?")) {
      try {
        await API.delete(`/writings/${item.id}`);
        refreshData();
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Safe color defaults or fallbacks
  const accentColor = item.cardColor || "#2563EB";

  return (
    <div
      className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
      style={{
        borderLeft: `5px solid ${accentColor}`,
      }}
    >
      <div>
        {/* Header Area */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-[20px] font-semibold text-[#1E293B] mb-1 group-hover:text-[#2563EB] transition-colors duration-200">
              {item.title}
            </h3>
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] uppercase tracking-wider">
              <FiCalendar className="text-xs" />
              <span>{new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleFavorite}
              className="p-2 rounded-full hover:bg-[#F5F7FA] text-[#64748B] hover:text-[#F59E0B] transition-all duration-200"
              title="Favorite"
            >
              <FiStar
                className={`text-lg transition ${
                  item.favorite
                    ? "fill-[#F59E0B] text-[#F59E0B]"
                    : ""
                }`}
              />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-[#FDECEC] text-[#64748B] hover:text-[#EF4444] transition-all duration-200"
              title="Delete"
            >
              <FiTrash2 className="text-lg" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <p className="text-[#334155] text-[15px] leading-relaxed whitespace-pre-wrap mb-6 font-normal">
          {item.content}
        </p>
      </div>

      {/* Footer / Accent label */}
      <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-4 mt-auto">
        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest bg-[#F5F7FA] px-2.5 py-1 rounded-[6px]">
          {item.type}
        </span>
        <div 
          className="w-3 h-3 rounded-full shadow-inner"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
};

export default WritingCard;