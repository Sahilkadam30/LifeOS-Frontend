import { useEffect, useState } from "react";

import {
  FiSearch,
} from "react-icons/fi";

import Sidebar from "../components/Sidebar";
import WritingCard from "../components/WritingCard";
import AddWritingModal from "../components/AddWritingModal";

import {
  getAllWritings,
} from "../services/writingService";

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
      item.title
        .toLowerCase()
        .includes(search.toLowerCase())
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
      return "Your favorite writings and thoughts.";
    }

    if (activeTab === "NOTE") {
      return "Capture your thoughts and ideas.";
    }

    if (activeTab === "STORY") {
      return "Write your imagination and stories.";
    }

    return "Express emotions through poems.";
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F5]">

      {/* SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10">

        {/* TOP HEADER */}
        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-6xl font-bold text-[#323232] mb-3">
              {getTitle()}
            </h1>

            <p className="text-gray-500 text-xl">
              {getDescription()}
            </p>
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={() => setOpenModal(true)}
            className="bg-[#6B46C1] hover:bg-[#5b3cb0] text-white px-8 py-4 rounded-2xl text-lg transition"
          >
            + Add
          </button>
        </div>

        {/* SEARCH */}
        <div className="bg-white border rounded-2xl px-5 py-4 flex items-center gap-3 mb-8">

          <FiSearch className="text-gray-400 text-xl" />

          <input
            type="text"
            placeholder={`Search ${getTitle()}...`}
            className="outline-none w-full bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* WRITING CARDS */}
        <div className="flex flex-col gap-6">

          {filteredData.map((item) => (

            <WritingCard
              key={item.id}
              item={item}
              refreshData={loadData}
            />
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredData.length === 0 && (

          <div className="text-center py-24">

            <h2 className="text-3xl font-bold text-gray-400 mb-4">
              No {getTitle()} Found
            </h2>

            <p className="text-gray-500">
              Create your first {getTitle().toLowerCase()}.
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