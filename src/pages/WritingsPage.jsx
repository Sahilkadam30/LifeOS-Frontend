import { useEffect, useState } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import WritingCard from "../components/WritingCard";
import AddWritingModal from "../components/AddWritingModal";
import { getAllWritings } from "../services/writingService";

const WritingsPage = () => {
  const [data, setData] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("NOTE");

  // LOAD DATA
  const loadData = async () => {
    try {
      const response = await getAllWritings();
      setData(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // FILTER DATA
  const filteredData = data
    .filter((item) => {
      // FAVORITES
      if (showFavorites) {
        return item.favorite;
      }
      // NORMAL FILTER
      return item.type === activeTab;
    })
    .filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

  // PAGE TITLE
  const getTitle = () => {
    if (showFavorites) {
      return "Favorites";
    }
    if (activeTab === "NOTE") {
      return "Notes";
    }
    if (activeTab === "STORY") {
      return "Storytelling";
    }
    return "Poems";
  };

  // DESCRIPTION
  const getDescription = () => {
    if (showFavorites) {
      return "Your curated favorites collection.";
    }
    if (activeTab === "NOTE") {
      return "Capture your daily thoughts, code snippets, and quick ideas.";
    }
    if (activeTab === "STORY") {
      return "Document your deep creative stories and journal entries.";
    }
    return "Reflect feelings and emotions through elegant poems.";
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] font-['Inter',_sans-serif]">
      {/* SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {/* TOP HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight leading-none mb-2">
              {getTitle()}
            </h1>
            <p className="text-[#64748B] text-[15px]">
              {getDescription()}
            </p>
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium px-5 py-3 rounded-[10px] text-[15px] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <FiPlus className="text-lg" />
            <span>Create New</span>
          </button>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] px-5 py-3.5 flex items-center gap-3 mb-8 shadow-sm">
          <FiSearch className="text-[#64748B] text-lg" />
          <input
            type="text"
            placeholder={`Search through your ${getTitle().toLowerCase()}...`}
            className="outline-none w-full bg-transparent text-[#1E293B] text-[15px] placeholder-[#94A3B8]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* WRITING CARDS GRID */}
        {filteredData.length > 0 ? (
          <div className="flex flex-col gap-6">
            {filteredData.map((item) => (
              <WritingCard
                key={item.id}
                item={item}
                refreshData={loadData}
              />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-16 text-center shadow-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[#F5F7FA] rounded-full flex items-center justify-center text-[#94A3B8] mb-4 text-2xl">
              ✍️
            </div>
            <h2 className="text-[22px] font-semibold text-[#1E293B] mb-2">
              No {getTitle()} Found
            </h2>
            <p className="text-[#64748B] text-[15px] max-w-md mx-auto">
              Get started by creating your very first {getTitle().toLowerCase()} piece to store here securely.
            </p>
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {openModal && (
        <AddWritingModal
          closeModal={() => setOpenModal(false)}
          refreshData={loadData}
        />
      )}
    </div>
  );
};

export default WritingsPage;