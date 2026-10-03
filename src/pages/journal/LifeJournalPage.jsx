import React, { useEffect, useState, useMemo } from "react";
import JournalSidebar from "../../components/journal/JournalSidebar";
import JournalItemModal from "../../components/journal/JournalItemModal";
import SuccessModal from "../../components/SuccessModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import {
  getJournalStats,
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getFood,
  createFood,
  updateFood,
  deleteFood,
  getCategories,
  createCategory,
  deleteCategory,
  getFavourites,
  createFavourite,
  deleteFavourite,
} from "../../services/journalService";
import {
  FiPlus,
  FiSearch,
  FiFilm,
  FiBookOpen,
  FiCoffee,
  FiStar,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiHeart,
  FiFilter,
  FiBookmark,
} from "react-icons/fi";

export default function LifeJournalPage() {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "movies" | "books" | "food" | "favourites"
  const [stats, setStats] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Data lists
  const [movies, setMovies] = useState([]);
  const [books, setBooks] = useState([]);
  const [food, setFood] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [movieStatusFilter, setMovieStatusFilter] = useState("ALL");
  const [movieTypeFilter, setMovieTypeFilter] = useState("ALL");
  const [bookStatusFilter, setBookStatusFilter] = useState("ALL");
  const [foodStatusFilter, setFoodStatusFilter] = useState("ALL");
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [showRestoreMenu, setShowRestoreMenu] = useState(false);

  // Modals state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "movie",
    item: null,
  });

  const [deleteConfig, setDeleteConfig] = useState({
    isOpen: false,
    type: "",
    id: null,
    title: "",
  });

  const [successInfo, setSuccessInfo] = useState({
    open: false,
    title: "",
    description: "",
  });

  const triggerSuccess = (title, description) => {
    setSuccessInfo({ open: true, title, description });
  };

  // ── Fetch Initial Data ─────────────────────────────────────
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, moviesRes, booksRes, foodRes, catsRes, favsRes] = await Promise.all([
        getJournalStats(),
        getMovies(),
        getBooks(),
        getFood(),
        getCategories(),
        getFavourites(),
      ]);

      setStats(statsRes.data || {});
      setMovies(moviesRes.data || []);
      setBooks(booksRes.data || []);
      setFood(foodRes.data || []);
      setCategories(catsRes.data || []);
      setFavourites(favsRes.data || []);
    } catch (err) {
      console.error("Failed to load journal data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // ── Modal Openers ─────────────────────────────────────────
  const openAddModal = (type = activeTab) => {
    const targetType = type === "overview" ? "movie" : type;
    setModalConfig({
      isOpen: true,
      type: targetType,
      item: null,
    });
  };

  const openEditModal = (item, type) => {
    setModalConfig({
      isOpen: true,
      type,
      item,
    });
  };

  // ── Submit Handler ─────────────────────────────────────────
  const handleModalSubmit = async (formData) => {
    const { type, item } = modalConfig;
    try {
      if (type === "movie") {
        if (item) {
          await updateMovie(item.id, formData);
          triggerSuccess("Movie Updated! 🎬", `"${formData.title}" has been updated.`);
        } else {
          await createMovie(formData);
          triggerSuccess("Movie Added! 🎬", `"${formData.title}" has been added to your watchlist.`);
        }
      } else if (type === "book") {
        if (item) {
          await updateBook(item.id, formData);
          triggerSuccess("Book Updated! 📚", `"${formData.title}" has been updated.`);
        } else {
          await createBook(formData);
          triggerSuccess("Book Saved! 📚", `"${formData.title}" has been added to your reading shelf.`);
        }
      } else if (type === "food") {
        if (item) {
          await updateFood(item.id, formData);
          triggerSuccess("Food Entry Updated! 🍽️", `"${formData.name}" has been updated.`);
        } else {
          await createFood(formData);
          triggerSuccess("Food Experience Saved! 🍽️", `"${formData.name}" has been logged in your taste journal.`);
        }
      } else if (type === "favourite") {
        await createFavourite(formData);
        triggerSuccess("Added to Things I Love! ❤️", `"${formData.title}" has been saved to your Things I Love list.`);
      } else if (type === "category") {
        await createCategory(formData);
        triggerSuccess("Category Created! 🏷️", `"${formData.name}" category is now available.`);
      }

      setModalConfig({ isOpen: false, type: "movie", item: null });
      loadAllData();
    } catch (err) {
      console.error(err);
      alert("Failed to save entry. Please try again.");
    }
  };

  const handleOpenDefaultQuestionModal = async (q, cat) => {
    if (cat) {
      setModalConfig({ isOpen: true, type: "favourite", item: null, prefillCategoryId: cat.id });
      return;
    }
    try {
      const res = await createCategory({
        name: q.label,
        icon: q.emoji,
        color: "#8B5CF6",
      });
      const newCat = res.data;
      setCategories(prev => {
        if (prev.some(c => c.id === newCat.id)) return prev;
        return [...prev, newCat];
      });
      setModalConfig({ isOpen: true, type: "favourite", item: null, prefillCategoryId: newCat.id });
    } catch (err) {
      console.error("Failed to create category on the fly", err);
      setModalConfig({ isOpen: true, type: "favourite", item: null });
    }
  };

  // ── Delete Handlers ───────────────────────────────────────
  const confirmDelete = (id, type, title) => {
    setDeleteConfig({
      isOpen: true,
      id,
      type,
      title: title || "this item",
    });
  };

  const handleDeleteConfirmed = async () => {
    const { id, type } = deleteConfig;
    try {
      if (type === "movie") await deleteMovie(id);
      else if (type === "book") await deleteBook(id);
      else if (type === "food") await deleteFood(id);
      else if (type === "favourite") await deleteFavourite(id);
      else if (type === "category" || type === "question") await deleteCategory(id);

      setDeleteConfig({ isOpen: false, id: null, type: "", title: "" });
      loadAllData();
      triggerSuccess(
        type === "question" ? "Question Removed!" : "Deleted!",
        type === "question"
          ? `"${deleteConfig.title}" question has been removed from your list.`
          : `The ${type} has been removed.`
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete entry.");
    }
  };

  // ── Quick Status Cycles ───────────────────────────────────
  const cycleMovieStatus = async (movie) => {
    const nextStatus =
      movie.status === "WANT_TO_WATCH"
        ? "WATCHING"
        : movie.status === "WATCHING"
        ? "WATCHED"
        : "WANT_TO_WATCH";
    try {
      await updateMovie(movie.id, { ...movie, status: nextStatus });
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const cycleBookStatus = async (book) => {
    const nextStatus =
      book.status === "WANT_TO_READ"
        ? "READING"
        : book.status === "READING"
        ? "READ"
        : "WANT_TO_READ";
    try {
      await updateBook(book.id, { ...book, status: nextStatus });
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const cycleFoodStatus = async (item) => {
    const nextStatus =
      item.status === "WANT_TO_TRY"
        ? "TRIED"
        : item.status === "TRIED"
        ? "FAVORITE"
        : "WANT_TO_TRY";
    try {
      await updateFood(item.id, { ...item, status: nextStatus });
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Filtered Collections ──────────────────────────────────
  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      const matchSearch = m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = movieStatusFilter === "ALL" || m.status === movieStatusFilter;
      const matchType = movieTypeFilter === "ALL" || m.type === movieTypeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [movies, searchQuery, movieStatusFilter, movieTypeFilter]);

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchSearch = b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = bookStatusFilter === "ALL" || b.status === bookStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [books, searchQuery, bookStatusFilter]);

  const filteredFood = useMemo(() => {
    return food.filter((f) => {
      const matchSearch = f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = foodStatusFilter === "ALL" || f.status === foodStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [food, searchQuery, foodStatusFilter]);

  const filteredFavourites = useMemo(() => {
    return favourites.filter((fav) => {
      const matchSearch = fav.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = !selectedCatId || fav.category?.id === selectedCatId;
      return matchSearch && matchCat;
    });
  }, [favourites, searchQuery, selectedCatId]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-['Inter',_sans-serif] flex">
      {/* SIDEBAR */}
      <JournalSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight leading-none mb-2 flex items-center gap-3">
              <span>Life Journal</span>
              <span className="text-[12px] font-semibold uppercase tracking-wider bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 px-2.5 py-1 rounded-[6px]">
                {activeTab === "overview" && "Dashboard"}
                {activeTab === "movies" && "Watchlist & Reviews"}
                {activeTab === "books" && "Reading Shelf"}
                {activeTab === "food" && "Culinary Log"}
                {activeTab === "favourites" && "Things I Love"}
              </span>
            </h1>
            <p className="text-[#64748B] text-[15px]">
              {activeTab === "overview" && "A dedicated space to chronicle your cultural milestones, reads, eats, and favorite things."}
              {activeTab === "movies" && "Keep track of movies, documentaries, and series you've watched or plan to see."}
              {activeTab === "books" && "Catalog your personal library, track your reading pace, and store quotes."}
              {activeTab === "food" && "Document memorable recipes, restaurants, specialty drinks, and bucket list tastes."}
              {activeTab === "favourites" && "All the places, songs, movies, foods, and things that make life beautiful."}
            </p>
          </div>

          {/* TOP ACTIONS */}
          <div className="flex items-center gap-3 flex-wrap">
            {activeTab !== "overview" && (
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[15px]" />
                <input
                  type="text"
                  placeholder={`Search in ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-[#E2E8F0] rounded-[10px] pl-10 pr-4 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] transition-all shadow-2xs w-52 md:w-64"
                />
              </div>
            )}

            <button
              onClick={() => openAddModal(activeTab === "overview" ? "movie" : activeTab)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#7C3AED] hover:to-[#2563EB] text-white font-medium px-5 py-2.5 rounded-[10px] text-[14px] shadow-sm hover:shadow transition-all transform active:scale-95"
            >
              <FiPlus className="text-base" />
              <span>
                {activeTab === "overview" && "Add New Entry"}
                {activeTab === "movies" && "Add Movie"}
                {activeTab === "books" && "Add Book"}
                {activeTab === "food" && "Add Food"}
                {activeTab === "favourites" && "Add to Things I Love"}
              </span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* ==================== 1. OVERVIEW TAB ========================= */}
        {/* ============================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* STATS 4-GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Movies Card */}
              <div
                onClick={() => setActiveTab("movies")}
                className="bg-white rounded-[16px] p-6 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-t-4 border-[#8B5CF6] cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Movies & Shows
                  </span>
                  <FiFilm className="text-[#8B5CF6] text-xl" />
                </div>
                <h2 className="text-[36px] font-bold text-[#1E293B] leading-none mt-1">
                  {stats.totalMovies || 0}
                </h2>
                <div className="mt-3 flex items-center justify-between text-[12px] text-[#64748B]">
                  <span>{stats.watchedMovies || 0} watched</span>
                  <span>{stats.wantToWatchMovies || 0} queued</span>
                </div>
              </div>

              {/* Books Card */}
              <div
                onClick={() => setActiveTab("books")}
                className="bg-white rounded-[16px] p-6 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-t-4 border-[#2563EB] cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Books Logged
                  </span>
                  <FiBookOpen className="text-[#2563EB] text-xl" />
                </div>
                <h2 className="text-[36px] font-bold text-[#1E293B] leading-none mt-1">
                  {stats.totalBooks || 0}
                </h2>
                <div className="mt-3 flex items-center justify-between text-[12px] text-[#64748B]">
                  <span>{stats.readBooks || 0} finished</span>
                  <span>{stats.wantToReadBooks || 0} on reading list</span>
                </div>
              </div>

              {/* Food Card */}
              <div
                onClick={() => setActiveTab("food")}
                className="bg-white rounded-[16px] p-6 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-t-4 border-[#16A34A] cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Food & Dining
                  </span>
                  <FiCoffee className="text-[#16A34A] text-xl" />
                </div>
                <h2 className="text-[36px] font-bold text-[#1E293B] leading-none mt-1">
                  {stats.totalFood || 0}
                </h2>
                <div className="mt-3 flex items-center justify-between text-[12px] text-[#64748B]">
                  <span>{stats.triedFood || 0} tasted</span>
                  <span>{stats.favoriteFood || 0} favorites</span>
                </div>
              </div>

              {/* Favourites Card */}
              <div
                onClick={() => setActiveTab("favourites")}
                className="bg-white rounded-[16px] p-6 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-t-4 border-[#F59E0B] cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Things I Love
                  </span>
                  <FiStar className="text-[#F59E0B] text-xl" />
                </div>
                <h2 className="text-[36px] font-bold text-[#1E293B] leading-none mt-1">
                  {stats.totalFavourites || 0}
                </h2>
                <div className="mt-3 flex items-center justify-between text-[12px] text-[#64748B]">
                  <span>{stats.totalCategories || 0} categories</span>
                  <span>Personal bests</span>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS BANNER */}
            <div className="bg-gradient-to-r from-[#071B3A] to-[#1E293B] rounded-[20px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div>
                <span className="text-[#8B5CF6] text-[12px] font-bold uppercase tracking-wider">Quick Capture</span>
                <h3 className="text-[22px] font-bold mt-1 text-white">Log what made your day memorable</h3>
                <p className="text-[#94A3B8] text-[14px] mt-1">Select an entry type to record your experiences, reviews, and favorites.</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => openAddModal("movie")}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-4 py-2 rounded-[10px] text-[13px] font-semibold flex items-center gap-2 transition-all"
                >
                  <FiFilm /> <span>+ Movie</span>
                </button>
                <button
                  onClick={() => openAddModal("book")}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-4 py-2 rounded-[10px] text-[13px] font-semibold flex items-center gap-2 transition-all"
                >
                  <FiBookOpen /> <span>+ Book</span>
                </button>
                <button
                  onClick={() => openAddModal("food")}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-4 py-2 rounded-[10px] text-[13px] font-semibold flex items-center gap-2 transition-all"
                >
                  <FiCoffee /> <span>+ Food</span>
                </button>
                <button
                  onClick={() => openAddModal("favourite")}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-4 py-2 rounded-[10px] text-[13px] font-semibold flex items-center gap-2 transition-all"
                >
                  <FiStar /> <span>+ Things I Love</span>
                </button>
              </div>
            </div>

            {/* TWO-COLUMN RECENT ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* CURRENTLY CONSUMING */}
              <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-2xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4">
                  <h3 className="text-[17px] font-bold text-[#1E293B] flex items-center gap-2">
                    <FiEye className="text-[#8B5CF6]" />
                    <span>In Progress Shelf</span>
                  </h3>
                  <span className="text-[12px] text-[#64748B]">Active Reading & Watching</span>
                </div>

                <div className="space-y-3">
                  {movies.filter(m => m.status === "WATCHING").map(m => (
                    <div key={`m-${m.id}`} className="p-3.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0]/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[8px] bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                          <FiFilm size={15} />
                        </div>
                        <div>
                          <p className="font-semibold text-[14px] text-[#1E293B]">{m.title}</p>
                          <p className="text-[12px] text-[#64748B]">Watching • {m.type?.replace("_", " ")}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => cycleMovieStatus(m)}
                        className="text-[12px] text-[#16A34A] hover:bg-[#16A34A]/10 px-2.5 py-1 rounded-[6px] border border-[#16A34A]/20 transition-all font-semibold"
                      >
                        Mark Watched
                      </button>
                    </div>
                  ))}

                  {books.filter(b => b.status === "READING").map(b => (
                    <div key={`b-${b.id}`} className="p-3.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0]/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[8px] bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
                          <FiBookOpen size={15} />
                        </div>
                        <div>
                          <p className="font-semibold text-[14px] text-[#1E293B]">{b.title}</p>
                          <p className="text-[12px] text-[#64748B]">Reading • {b.author || "Unknown Author"}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => cycleBookStatus(b)}
                        className="text-[12px] text-[#16A34A] hover:bg-[#16A34A]/10 px-2.5 py-1 rounded-[6px] border border-[#16A34A]/20 transition-all font-semibold"
                      >
                        Mark Read
                      </button>
                    </div>
                  ))}

                  {movies.filter(m => m.status === "WATCHING").length === 0 &&
                   books.filter(b => b.status === "READING").length === 0 && (
                    <div className="text-center py-8 text-[#94A3B8]">
                      <p className="text-[14px]">No books or movies currently marked as in-progress.</p>
                      <p className="text-[12px] mt-1 text-[#64748B]">Set status to 'Watching' or 'Reading' to see them here.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* RECENT FAVOURITES */}
              <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-2xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4">
                  <h3 className="text-[17px] font-bold text-[#1E293B] flex items-center gap-2">
                    <FiStar className="text-[#F59E0B]" />
                    <span>Things I Love</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab("favourites")}
                    className="text-[#8B5CF6] hover:underline text-[12px] font-semibold"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {favourites.slice(0, 5).map(fav => (
                    <div key={fav.id} className="p-3 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{fav.category?.icon || "⭐"}</span>
                        <div>
                          <p className="font-semibold text-[14px] text-[#1E293B]">{fav.title}</p>
                          <span
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-[4px] text-white"
                            style={{ backgroundColor: fav.category?.color || "#8B5CF6" }}
                          >
                            {fav.category?.name || "General"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {favourites.length === 0 && (
                    <div className="text-center py-8 text-[#94A3B8]">
                      <p className="text-[14px]">Nothing in Things I Love yet.</p>
                      <button
                        onClick={() => openAddModal("favourite")}
                        className="mt-2 text-[#8B5CF6] font-semibold text-[13px] hover:underline"
                      >
                        + Add your first item
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ==================== 2. MOVIES TAB =========================== */}
        {/* ============================================================== */}
        {activeTab === "movies" && (
          <div className="space-y-6">
            {/* FILTER BAR */}
            <div className="bg-white p-4 rounded-[14px] border border-[#E2E8F0] shadow-2xs flex flex-wrap items-center justify-between gap-4">
              {/* Status Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mr-1">Status:</span>
                {[
                  { id: "ALL", label: "All Movies" },
                  { id: "WANT_TO_WATCH", label: "Want to Watch" },
                  { id: "WATCHING", label: "Watching" },
                  { id: "WATCHED", label: "Watched" },
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setMovieStatusFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-[8px] text-[13px] font-semibold transition-all ${
                      movieStatusFilter === filter.id
                        ? "bg-[#8B5CF6] text-white shadow-2xs"
                        : "bg-[#F8FAFC] text-[#64748B] hover:text-[#1E293B]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Type:</span>
                <select
                  value={movieTypeFilter}
                  onChange={(e) => setMovieTypeFilter(e.target.value)}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] px-3 py-1.5 text-[13px] text-[#1E293B] outline-none"
                >
                  <option value="ALL">All Types</option>
                  <option value="MOVIE">Movie</option>
                  <option value="TV_SHOW">TV Show</option>
                  <option value="ANIME">Anime</option>
                  <option value="DOCUMENTARY">Documentary</option>
                </select>
              </div>
            </div>

            {/* MOVIES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMovies.map(movie => {
                const isWatched = movie.status === "WATCHED";
                const isWatching = movie.status === "WATCHING";

                return (
                  <div
                    key={movie.id}
                    className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                    style={{
                      borderTop: `4px solid ${
                        isWatched ? "#16A34A" : isWatching ? "#F59E0B" : "#8B5CF6"
                      }`,
                    }}
                  >
                    <div>
                      {/* TOP BADGES */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-[#F1F5F9] text-[#64748B] px-2.5 py-0.5 rounded-[6px]">
                          {movie.type?.replace("_", " ")}
                        </span>

                        <button
                          onClick={() => cycleMovieStatus(movie)}
                          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[6px] border transition-all flex items-center gap-1 ${
                            isWatched
                              ? "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/30"
                              : isWatching
                              ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30"
                              : "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30"
                          }`}
                          title="Click to change status"
                        >
                          {isWatched && <FiCheckCircle />}
                          {isWatching && <FiEye />}
                          {!isWatched && !isWatching && <FiClock />}
                          <span>{movie.status?.replace(/_/g, " ")}</span>
                        </button>
                      </div>

                      {/* TITLE */}
                      <h3 className="text-[18px] font-bold text-[#1E293B] leading-snug mb-2">
                        {movie.title}
                      </h3>

                      {/* DESCRIPTION */}
                      {movie.description ? (
                        <p className="text-[13px] text-[#64748B] leading-relaxed line-clamp-3">
                          {movie.description}
                        </p>
                      ) : (
                        <p className="text-[13px] text-[#94A3B8] italic">No review or notes recorded.</p>
                      )}
                    </div>

                    {/* CARD FOOTER ACTIONS */}
                    <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-4 mt-5">
                      <button
                        onClick={() => cycleMovieStatus(movie)}
                        className="text-[12px] text-[#64748B] hover:text-[#8B5CF6] font-medium transition-colors"
                      >
                        Next Status →
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(movie, "movie")}
                          className="text-[#64748B] hover:text-[#2563EB] p-1.5 rounded-full hover:bg-[#F8FAFC] transition-colors"
                          title="Edit movie"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => confirmDelete(movie.id, "movie", movie.title)}
                          className="text-[#64748B] hover:text-[#EF4444] p-1.5 rounded-full hover:bg-[#F8FAFC] transition-colors"
                          title="Delete movie"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredMovies.length === 0 && (
                <div className="col-span-3 bg-white rounded-[16px] border border-[#E2E8F0] p-12 text-center text-[#94A3B8]">
                  <FiFilm className="text-4xl mx-auto mb-3 opacity-40" />
                  <p className="text-[16px] font-semibold text-[#64748B]">No movies found.</p>
                  <p className="text-[14px] mt-1">Start tracking your films and series with "+ Add Movie".</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ==================== 3. BOOKS TAB ============================ */}
        {/* ============================================================== */}
        {activeTab === "books" && (
          <div className="space-y-6">
            {/* FILTER BAR */}
            <div className="bg-white p-4 rounded-[14px] border border-[#E2E8F0] shadow-2xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mr-1">Status:</span>
                {[
                  { id: "ALL", label: "All Books" },
                  { id: "WANT_TO_READ", label: "Want to Read" },
                  { id: "READING", label: "Currently Reading" },
                  { id: "READ", label: "Finished" },
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setBookStatusFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-[8px] text-[13px] font-semibold transition-all ${
                      bookStatusFilter === filter.id
                        ? "bg-[#2563EB] text-white shadow-2xs"
                        : "bg-[#F8FAFC] text-[#64748B] hover:text-[#1E293B]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* BOOKS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBooks.map(book => {
                const isRead = book.status === "READ";
                const isReading = book.status === "READING";

                return (
                  <div
                    key={book.id}
                    className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                    style={{
                      borderTop: `4px solid ${
                        isRead ? "#16A34A" : isReading ? "#F59E0B" : "#2563EB"
                      }`,
                    }}
                  >
                    <div>
                      {/* TOP BADGES */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[12px] font-medium text-[#64748B]">
                          {book.author ? `by ${book.author}` : "Author unlisted"}
                        </span>

                        <button
                          onClick={() => cycleBookStatus(book)}
                          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[6px] border transition-all flex items-center gap-1 ${
                            isRead
                              ? "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/30"
                              : isReading
                              ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30"
                              : "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30"
                          }`}
                          title="Click to change reading state"
                        >
                          {isRead && <FiCheckCircle />}
                          {isReading && <FiEye />}
                          {!isRead && !isReading && <FiClock />}
                          <span>{book.status?.replace(/_/g, " ")}</span>
                        </button>
                      </div>

                      {/* TITLE */}
                      <h3 className="text-[18px] font-bold text-[#1E293B] leading-snug mb-2">
                        {book.title}
                      </h3>

                      {/* DESCRIPTION */}
                      {book.description ? (
                        <p className="text-[13px] text-[#64748B] leading-relaxed line-clamp-3">
                          {book.description}
                        </p>
                      ) : (
                        <p className="text-[13px] text-[#94A3B8] italic">No highlights or notes recorded.</p>
                      )}
                    </div>

                    {/* CARD FOOTER ACTIONS */}
                    <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-4 mt-5">
                      <button
                        onClick={() => cycleBookStatus(book)}
                        className="text-[12px] text-[#64748B] hover:text-[#2563EB] font-medium transition-colors"
                      >
                        Next Status →
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(book, "book")}
                          className="text-[#64748B] hover:text-[#2563EB] p-1.5 rounded-full hover:bg-[#F8FAFC] transition-colors"
                          title="Edit book"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => confirmDelete(book.id, "book", book.title)}
                          className="text-[#64748B] hover:text-[#EF4444] p-1.5 rounded-full hover:bg-[#F8FAFC] transition-colors"
                          title="Delete book"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredBooks.length === 0 && (
                <div className="col-span-3 bg-white rounded-[16px] border border-[#E2E8F0] p-12 text-center text-[#94A3B8]">
                  <FiBookOpen className="text-4xl mx-auto mb-3 opacity-40" />
                  <p className="text-[16px] font-semibold text-[#64748B]">No books found.</p>
                  <p className="text-[14px] mt-1">Add your favorite or current books using "+ Add Book".</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ==================== 4. FOOD TAB ============================= */}
        {/* ============================================================== */}
        {activeTab === "food" && (
          <div className="space-y-6">
            {/* FILTER BAR */}
            <div className="bg-white p-4 rounded-[14px] border border-[#E2E8F0] shadow-2xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mr-1">Status:</span>
                {[
                  { id: "ALL", label: "All Items" },
                  { id: "WANT_TO_TRY", label: "Want to Try" },
                  { id: "TRIED", label: "Tried" },
                  { id: "FAVORITE", label: "Favorites ⭐" },
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setFoodStatusFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-[8px] text-[13px] font-semibold transition-all ${
                      foodStatusFilter === filter.id
                        ? "bg-[#16A34A] text-white shadow-2xs"
                        : "bg-[#F8FAFC] text-[#64748B] hover:text-[#1E293B]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* FOOD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredFood.map(item => {
                const isFavorite = item.status === "FAVORITE";
                const isTried = item.status === "TRIED";

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                    style={{
                      borderTop: `4px solid ${
                        isFavorite ? "#F59E0B" : isTried ? "#16A34A" : "#0EA5E9"
                      }`,
                    }}
                  >
                    <div>
                      {/* TOP BADGES */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-[#F1F5F9] text-[#64748B] px-2.5 py-0.5 rounded-[6px]">
                          {item.type}
                        </span>

                        <button
                          onClick={() => cycleFoodStatus(item)}
                          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[6px] border transition-all flex items-center gap-1 ${
                            isFavorite
                              ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30"
                              : isTried
                              ? "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/30"
                              : "bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]/30"
                          }`}
                          title="Click to update status"
                        >
                          {isFavorite && <FiStar className="fill-[#F59E0B]" />}
                          {isTried && <FiCheckCircle />}
                          {!isFavorite && !isTried && <FiClock />}
                          <span>{item.status?.replace(/_/g, " ")}</span>
                        </button>
                      </div>

                      {/* NAME */}
                      <h3 className="text-[18px] font-bold text-[#1E293B] leading-snug mb-2">
                        {item.name}
                      </h3>

                      {/* DESCRIPTION */}
                      {item.description ? (
                        <p className="text-[13px] text-[#64748B] leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      ) : (
                        <p className="text-[13px] text-[#94A3B8] italic">No tasting notes recorded.</p>
                      )}
                    </div>

                    {/* CARD FOOTER ACTIONS */}
                    <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-4 mt-5">
                      <button
                        onClick={() => cycleFoodStatus(item)}
                        className="text-[12px] text-[#64748B] hover:text-[#16A34A] font-medium transition-colors"
                      >
                        Next Status →
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(item, "food")}
                          className="text-[#64748B] hover:text-[#2563EB] p-1.5 rounded-full hover:bg-[#F8FAFC] transition-colors"
                          title="Edit food entry"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => confirmDelete(item.id, "food", item.name)}
                          className="text-[#64748B] hover:text-[#EF4444] p-1.5 rounded-full hover:bg-[#F8FAFC] transition-colors"
                          title="Delete food entry"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredFood.length === 0 && (
                <div className="col-span-3 bg-white rounded-[16px] border border-[#E2E8F0] p-12 text-center text-[#94A3B8]">
                  <FiCoffee className="text-4xl mx-auto mb-3 opacity-40" />
                  <p className="text-[16px] font-semibold text-[#64748B]">No food entries found.</p>
                  <p className="text-[14px] mt-1">Capture restaurants, coffee spots, and meals using "+ Add Food".</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ==================== 5. THINGS I LOVE TAB ==================== */}
        {/* ============================================================== */}
        {activeTab === "favourites" && (() => {
          // ── 35 default questions ──────────────────────────────────────
          const DEFAULT_QUESTIONS = [
            { emoji: "🎵", label: "Favourite Song" },
            { emoji: "🎤", label: "Favourite Singer/Artist" },
            { emoji: "🎬", label: "Favourite Movie" },
            { emoji: "📺", label: "Favourite Series" },
            { emoji: "📚", label: "Favourite Book" },
            { emoji: "🍕", label: "Favourite Food" },
            { emoji: "🍰", label: "Favourite Dessert" },
            { emoji: "☕", label: "Favourite Drink" },
            { emoji: "👨‍🍳", label: "Favourite Recipe" },
            { emoji: "🎮", label: "Favourite Game" },
            { emoji: "🏏", label: "Favourite Sport" },
            { emoji: "⚽", label: "Favourite Team" },
            { emoji: "🎨", label: "Favourite Artwork" },
            { emoji: "🧑‍🎨", label: "Favourite Artist" },
            { emoji: "💬", label: "Favourite Quote" },
            { emoji: "📖", label: "Favourite Story/Poem" },
            { emoji: "🧑‍💻", label: "Favourite Technology/Tool" },
            { emoji: "📚", label: "Favourite Bookstore" },
            { emoji: "🍽️", label: "Favourite Restaurant" },
            { emoji: "☕", label: "Favourite Café" },
            { emoji: "🌳", label: "Favourite Garden/Park" },
            { emoji: "🏛️", label: "Favourite Historical Place" },
            { emoji: "🛕", label: "Favourite Temple/Spiritual Place" },
            { emoji: "🏖️", label: "Favourite Beach" },
            { emoji: "🏔️", label: "Favourite Hill/Mountain" },
            { emoji: "🏙️", label: "Favourite City" },
            { emoji: "🗺️", label: "Favourite Travel Destination" },
            { emoji: "🎬", label: "Favourite Cinema/Theatre" },
            { emoji: "🏨", label: "Favourite Hotel/Stay" },
            { emoji: "🛍️", label: "Favourite Shopping Place" },
            { emoji: "🚶", label: "Favourite Walking Spot" },
            { emoji: "🌅", label: "Favourite Sunset Spot" },
            { emoji: "🌌", label: "Favourite Stargazing Spot" },
            { emoji: "📸", label: "Favourite Photography Spot" },
            { emoji: "🎨", label: "Favourite Art Gallery/Museum" },
          ];

          const defaultLabels = new Set(DEFAULT_QUESTIONS.map(q => q.label.toLowerCase().trim()));

          // categories that match default labels
          const defaultCatMap = {};
          categories.forEach(cat => {
            if (cat.name && defaultLabels.has(cat.name.toLowerCase().trim())) {
              defaultCatMap[cat.name.toLowerCase().trim()] = cat;
            }
          });

          // Active questions: default questions whose category exists for this user
          const activeDefaultQuestions = DEFAULT_QUESTIONS.filter(q => {
            return Boolean(defaultCatMap[q.label.toLowerCase().trim()]);
          });

          // Removed default questions (available to restore)
          const removedDefaultQuestions = DEFAULT_QUESTIONS.filter(q => {
            return !defaultCatMap[q.label.toLowerCase().trim()];
          });

          // user-created custom categories (not in default 35)
          const customCategories = categories.filter(
            cat => !defaultLabels.has(cat.name?.toLowerCase().trim())
          );

          const answeredCount = activeDefaultQuestions.filter(q => {
            const cat = defaultCatMap[q.label.toLowerCase().trim()];
            return cat && favourites.some(f => f.category?.id === cat.id);
          }).length;

          return (
            <div className="space-y-8">

              {/* ── HEADER ──────────────────────────────────────────── */}
              <div className="bg-gradient-to-r from-[#071B3A] to-[#1E293B] rounded-[20px] p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="text-[#F59E0B] text-[12px] font-bold uppercase tracking-wider">Life Journal</span>
                  <h2 className="text-[26px] font-bold mt-1">Things I Love ❤️</h2>
                  <p className="text-[#94A3B8] text-[14px] mt-1">
                    Answer the questions below — your favourite places, songs, foods, and more.
                  </p>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-[32px] font-bold text-white leading-none">{answeredCount}</p>
                    <p className="text-[12px] text-[#94A3B8] mt-1">
                      of {activeDefaultQuestions.length} answered
                    </p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <button
                    onClick={() => setModalConfig({ isOpen: true, type: "category", item: null })}
                    className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-[#1E293B] font-bold px-4 py-2.5 rounded-[10px] text-[13px] transition-all active:scale-95"
                  >
                    <FiPlus size={15} /> Create Your Own List
                  </button>
                </div>
              </div>

              {/* ── DEFAULT FAVOURITE THINGS PANEL ──────────────────── */}
              <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-sm overflow-hidden">
                {/* Panel header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9] bg-[#FAFBFC] flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-[8px] bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center text-[16px]">⭐</span>
                    <div>
                      <h3 className="text-[15px] font-bold text-[#1E293B]">Default Favourite Things</h3>
                      <p className="text-[12px] text-[#94A3B8]">
                        {activeDefaultQuestions.length > 0
                          ? `${answeredCount} of ${activeDefaultQuestions.length} filled in`
                          : "No questions active"}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Progress */}
                  <div className="flex items-center gap-4">
                    {/* Restore dropdown if questions were removed */}
                    {removedDefaultQuestions.length > 0 && (
                      <div className="relative">
                        <button
                          onClick={() => setShowRestoreMenu(!showRestoreMenu)}
                          className="text-[12px] font-semibold text-[#8B5CF6] hover:text-[#7C3AED] bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/15 border border-[#8B5CF6]/20 px-3 py-1.5 rounded-[8px] flex items-center gap-1.5 transition-all"
                        >
                          <FiPlus size={12} /> Restore Questions ({removedDefaultQuestions.length})
                        </button>

                        {showRestoreMenu && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setShowRestoreMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-72 max-h-72 overflow-y-auto bg-white border border-[#E2E8F0] rounded-[14px] shadow-2xl p-2 z-20">
                              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[#F1F5F9] mb-1">
                                <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                                  Removed Questions
                                </span>
                                <span className="text-[11px] text-[#64748B] font-semibold">
                                  {removedDefaultQuestions.length}
                                </span>
                              </div>
                              <div className="divide-y divide-[#F8FAFC]">
                                {removedDefaultQuestions.map((rq, rIdx) => (
                                  <button
                                    key={rIdx}
                                    onClick={async () => {
                                      try {
                                        await createCategory({ name: rq.label, icon: rq.emoji, color: "#8B5CF6" });
                                        loadAllData();
                                        setShowRestoreMenu(false);
                                        triggerSuccess("Question Restored!", `"${rq.label}" has been added back.`);
                                      } catch (e) {
                                        console.error(e);
                                      }
                                    }}
                                    className="w-full text-left flex items-center justify-between px-2.5 py-2 hover:bg-[#F8FAFC] rounded-[8px] text-[13px] text-[#1E293B] transition-colors group"
                                  >
                                    <span className="flex items-center gap-2 min-w-0">
                                      <span className="text-[16px] leading-none">{rq.emoji}</span>
                                      <span className="font-medium text-[13px] truncate">{rq.label}</span>
                                    </span>
                                    <span className="text-[11px] font-bold text-[#8B5CF6] group-hover:underline flex-shrink-0 ml-2">
                                      + Restore
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Progress bar */}
                    {activeDefaultQuestions.length > 0 && (
                      <div className="hidden sm:flex items-center gap-3">
                        <div className="w-32 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-full transition-all duration-700"
                            style={{
                              width: `${(answeredCount / activeDefaultQuestions.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-[12px] font-semibold text-[#64748B]">
                          {Math.round((answeredCount / activeDefaultQuestions.length) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Questions list */}
                <div className="divide-y divide-[#F1F5F9]">
                  {activeDefaultQuestions.length === 0 ? (
                    <div className="p-12 text-center text-[#94A3B8]">
                      <p className="text-[15px] font-semibold text-[#64748B]">All default questions have been removed.</p>
                      <p className="text-[13px] mt-1 text-[#94A3B8]">You can restore any question using the "Restore Questions" button above.</p>
                    </div>
                  ) : (
                    activeDefaultQuestions.map((q, idx) => {
                      const cat = defaultCatMap[q.label.toLowerCase().trim()];
                      const answers = cat ? favourites.filter(f => f.category?.id === cat.id) : [];
                      const accentColor = cat?.color || "#94A3B8";
                      const isAnswered = answers.length > 0;

                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-4 px-6 py-4 hover:bg-[#FAFBFC] transition-colors group"
                        >
                          {/* Emoji + answered indicator */}
                          <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5">
                            <span className="text-[22px] leading-none">{q.emoji}</span>
                            {isAnswered && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                            )}
                          </div>

                          {/* Label + answers */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-semibold text-[#1E293B] mb-1">{q.label}</p>

                            {answers.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {answers.map(fav => (
                                  <div
                                    key={fav.id}
                                    className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] pl-3 pr-1.5 py-1.5 group/item"
                                  >
                                    <span className="text-[13px] font-semibold text-[#1E293B]">{fav.title}</span>
                                    <button
                                      onClick={() => confirmDelete(fav.id, "favourite", fav.title)}
                                      className="text-[#CBD5E1] hover:text-[#EF4444] transition-colors opacity-0 group-hover/item:opacity-100 ml-0.5"
                                      title="Remove"
                                    >
                                      <FiTrash2 size={12} />
                                    </button>
                                  </div>
                                ))}
                                {/* + add another */}
                                <button
                                  onClick={() => handleOpenDefaultQuestionModal(q, cat)}
                                  className="text-[12px] text-[#8B5CF6] hover:text-[#7C3AED] bg-[#8B5CF6]/8 hover:bg-[#8B5CF6]/15 border border-[#8B5CF6]/20 rounded-[8px] px-2.5 py-1.5 font-semibold transition-all flex items-center gap-1"
                                >
                                  <FiPlus size={11} /> Add
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleOpenDefaultQuestionModal(q, cat)}
                                className="text-[12px] text-[#94A3B8] hover:text-[#8B5CF6] transition-colors flex items-center gap-1.5 group/add text-left"
                              >
                                <span className="w-5 h-5 rounded-full border border-dashed border-[#CBD5E1] group-hover/add:border-[#8B5CF6] flex items-center justify-center transition-colors">
                                  <FiPlus size={10} />
                                </span>
                                <span className="group-hover/add:text-[#8B5CF6] italic">
                                  {`What's your ${q.label.replace("Favourite ", "").toLowerCase()}?`}
                                </span>
                              </button>
                            )}
                          </div>

                          {/* Right: answered badge + delete question button */}
                          <div className="flex-shrink-0 flex items-center gap-2 pt-0.5">
                            {isAnswered ? (
                              <span className="text-[11px] font-bold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded-full">✓</span>
                            ) : (
                              <span className="text-[11px] text-[#CBD5E1] opacity-0 group-hover:opacity-100 transition-opacity">—</span>
                            )}

                            {cat && (
                              <button
                                onClick={() => confirmDelete(cat.id, "question", q.label)}
                                className="text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 p-1.5 rounded-[6px] transition-all opacity-0 group-hover:opacity-100"
                                title={`Delete "${q.label}" question`}
                              >
                                <FiTrash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* ── CUSTOM LISTS ──────────────────────────────────────── */}
              {customCategories.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-[16px] font-bold text-[#1E293B]">Your Custom Lists</h3>
                    <span className="text-[12px] text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">{customCategories.length}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customCategories.map(cat => {
                      const catItems = favourites.filter(f => f.category?.id === cat.id);
                      const accentColor = cat.color || "#8B5CF6";
                      return (
                        <div
                          key={cat.id}
                          className="bg-white rounded-[14px] border border-[#E2E8F0] p-5 shadow-2xs hover:shadow-md transition-all"
                          style={{ borderLeft: `4px solid ${accentColor}` }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[18px]">{cat.icon || "⭐"}</span>
                              <p className="text-[14px] font-bold text-[#1E293B]">{cat.name}</p>
                            </div>
                            <button
                              onClick={() => confirmDelete(cat.id, "category", cat.name)}
                              className="text-[#CBD5E1] hover:text-[#EF4444] transition-colors p-1"
                              title="Delete list"
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>

                          <div className="space-y-1.5 mb-3 min-h-[20px]">
                            {catItems.length === 0 ? (
                              <p className="text-[12px] text-[#CBD5E1] italic">Nothing saved yet</p>
                            ) : (
                              catItems.map(fav => (
                                <div key={fav.id} className="flex items-center justify-between gap-2 bg-[#F8FAFC] rounded-[7px] px-3 py-1.5 group">
                                  <p className="text-[13px] font-semibold text-[#1E293B] truncate">{fav.title}</p>
                                  <button
                                    onClick={() => confirmDelete(fav.id, "favourite", fav.title)}
                                    className="text-[#CBD5E1] hover:text-[#EF4444] transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <FiTrash2 size={11} />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>

                          <button
                            onClick={() => setModalConfig({ isOpen: true, type: "favourite", item: null, prefillCategoryId: cat.id })}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-[8px] text-[12px] font-semibold border border-dashed transition-all hover:border-solid"
                            style={{ borderColor: accentColor, color: accentColor }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${accentColor}10`; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
                          >
                            <FiPlus size={12} /> Add item
                          </button>
                        </div>
                      );
                    })}

                    {/* Add new list card */}
                    <button
                      onClick={() => setModalConfig({ isOpen: true, type: "category", item: null })}
                      className="bg-white rounded-[14px] border-2 border-dashed border-[#E2E8F0] p-5 hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/5 transition-all flex flex-col items-center justify-center gap-2 min-h-[120px] group"
                    >
                      <span className="w-10 h-10 rounded-full bg-[#F1F5F9] group-hover:bg-[#8B5CF6]/15 flex items-center justify-center text-[#94A3B8] group-hover:text-[#8B5CF6] transition-all">
                        <FiPlus size={18} />
                      </span>
                      <p className="text-[13px] font-semibold text-[#94A3B8] group-hover:text-[#8B5CF6] transition-colors">New Custom List</p>
                    </button>
                  </div>
                </div>
              )}

              {/* If no custom lists yet, show a subtle CTA */}
              {customCategories.length === 0 && (
                <button
                  onClick={() => setModalConfig({ isOpen: true, type: "category", item: null })}
                  className="w-full bg-white rounded-[14px] border-2 border-dashed border-[#E2E8F0] py-6 hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/5 transition-all flex items-center justify-center gap-3 group"
                >
                  <span className="w-9 h-9 rounded-full bg-[#F1F5F9] group-hover:bg-[#8B5CF6]/15 flex items-center justify-center text-[#94A3B8] group-hover:text-[#8B5CF6] transition-all">
                    <FiPlus size={16} />
                  </span>
                  <div className="text-left">
                    <p className="text-[14px] font-bold text-[#64748B] group-hover:text-[#8B5CF6] transition-colors">Create Your Own List</p>
                    <p className="text-[12px] text-[#94A3B8]">Add a custom category — Podcasts, Travel Gear, Anime, anything!</p>
                  </div>
                </button>
              )}

            </div>
          );
        })()}
      </div>

      {/* MODALS */}
      <JournalItemModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        type={modalConfig.type}
        item={modalConfig.item}
        categories={categories}
        onSubmit={handleModalSubmit}
        prefillCategoryId={modalConfig.prefillCategoryId || null}
      />

      <DeleteConfirmModal
        open={deleteConfig.isOpen}
        onClose={() => setDeleteConfig({ ...deleteConfig, isOpen: false })}
        onConfirm={handleDeleteConfirmed}
        title={deleteConfig.type === "question" ? "Delete Question?" : `Delete ${deleteConfig.type}?`}
        description={
          deleteConfig.type === "question"
            ? `Are you sure you want to remove "${deleteConfig.title}" from your list? Any answers saved to it will also be deleted.`
            : `Are you sure you want to delete "${deleteConfig.title}"? This cannot be undone.`
        }
      />

      <SuccessModal
        open={successInfo.open}
        onClose={() => setSuccessInfo({ ...successInfo, open: false })}
        title={successInfo.title}
        description={successInfo.description}
      />
    </div>
  );
}
