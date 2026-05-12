import {
  FiMoreHorizontal,
  FiStar,
} from "react-icons/fi";

import { toggleFavorite } from "../services/writingService";

const WritingCard = ({
  item,
  refreshData,
}) => {

  const handleFavorite = async () => {

    try {

      await toggleFavorite(item.id);

      refreshData();

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div
      className="rounded-3xl border p-6 shadow-sm hover:shadow-md transition"
      style={{
        backgroundColor: item.cardColor,
      }}
    >

      {/* Top */}
      <div className="flex justify-between items-start mb-5">

        <div>

          <h2 className="text-3xl font-bold text-[#323232] mb-2">
            {item.title}
          </h2>

          <span className="text-gray-500">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>

        <FiMoreHorizontal className="text-xl cursor-pointer" />
      </div>

      {/* Content */}
      <p className="text-[#323232] leading-9 text-lg whitespace-pre-wrap">
        {item.content}
      </p>

      {/* Bottom */}
      <div className="flex justify-end mt-6">

        <button
          onClick={handleFavorite}
          className="transition"
        >
          <FiStar
            className={`text-2xl cursor-pointer transition
            ${
              item.favorite
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-500"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default WritingCard;