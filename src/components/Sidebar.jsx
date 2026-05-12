import {
  FiBookOpen,
  FiEdit3,
  FiFileText,
  FiStar,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const Sidebar = ({
  activeTab,
  setActiveTab,
  showFavorites,
  setShowFavorites,
}) => {

  return (
    <div className="w-[280px] bg-white border-r border-gray-200 h-screen p-6 flex flex-col justify-between">

      <div>

        <h1 className="text-4xl font-bold text-[#323232] mb-10">
          My Space
        </h1>

        <div className="space-y-3">

          {/* NOTES */}
          <button
            onClick={() => {
              setActiveTab("NOTE");
              setShowFavorites(false);
            }}
            className={`w-full rounded-xl px-4 py-3 flex items-center gap-3 font-medium transition
            ${
              activeTab === "NOTE" && !showFavorites
                ? "bg-[#EEE7F8] text-[#6B46C1]"
                : "hover:bg-gray-100 text-[#323232]"
            }`}
          >
            <FiFileText />
            Notes
          </button>

          {/* STORIES */}
          <button
            onClick={() => {
              setActiveTab("STORY");
              setShowFavorites(false);
            }}
            className={`w-full rounded-xl px-4 py-3 flex items-center gap-3 font-medium transition
            ${
              activeTab === "STORY" && !showFavorites
                ? "bg-[#EEE7F8] text-[#6B46C1]"
                : "hover:bg-gray-100 text-[#323232]"
            }`}
          >
            <FiBookOpen />
            Storytelling
          </button>

          {/* POEMS */}
          <button
            onClick={() => {
              setActiveTab("POEM");
              setShowFavorites(false);
            }}
            className={`w-full rounded-xl px-4 py-3 flex items-center gap-3 font-medium transition
            ${
              activeTab === "POEM" && !showFavorites
                ? "bg-[#EEE7F8] text-[#6B46C1]"
                : "hover:bg-gray-100 text-[#323232]"
            }`}
          >
            <FiEdit3 />
            Poems
          </button>

          {/* FAVORITES */}
          <button
            onClick={() => setShowFavorites(true)}
            className={`w-full rounded-xl px-4 py-3 flex items-center gap-3 font-medium transition
            ${
              showFavorites
                ? "bg-[#EEE7F8] text-[#6B46C1]"
                : "hover:bg-gray-100 text-[#323232]"
            }`}
          >
            <FiStar />
            Favorites
          </button>
        </div>
      </div>

      <div className="space-y-3">

        <button className="w-full hover:bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 text-[#323232]">
          <FiSettings />
          Settings
        </button>

        <button className="w-full hover:bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 text-[#323232]">
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;