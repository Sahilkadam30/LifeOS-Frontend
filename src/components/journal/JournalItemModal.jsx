import React, { useState, useEffect } from "react";
import { FiX, FiFilm, FiBookOpen, FiCoffee, FiStar, FiFolderPlus } from "react-icons/fi";

const MEDIA_TYPES = [
  { value: "MOVIE", label: "Movie" },
  { value: "TV_SHOW", label: "TV Show / Series" },
  { value: "ANIME", label: "Anime" },
  { value: "DOCUMENTARY", label: "Documentary" },
];

const MOVIE_STATUSES = [
  { value: "WANT_TO_WATCH", label: "Want to Watch" },
  { value: "WATCHING", label: "Currently Watching" },
  { value: "WATCHED", label: "Watched" },
];

const BOOK_STATUSES = [
  { value: "WANT_TO_READ", label: "Want to Read" },
  { value: "READING", label: "Currently Reading" },
  { value: "READ", label: "Finished Reading" },
];

const FOOD_TYPES = [
  { value: "DISH", label: "Dish / Meal" },
  { value: "RESTAURANT", label: "Restaurant / Cafe" },
  { value: "RECIPE", label: "Homemade Recipe" },
  { value: "DRINK", label: "Coffee & Drinks" },
  { value: "DESSERT", label: "Dessert & Bakery" },
  { value: "SNACK", label: "Snack" },
];

const FOOD_STATUSES = [
  { value: "WANT_TO_TRY", label: "Want to Try" },
  { value: "TRIED", label: "Tried & Tasted" },
  { value: "FAVORITE", label: "All-Time Favorite ⭐" },
];

const COLOR_SWATCHES = [
  "#2563EB", "#8B5CF6", "#16A34A", "#F59E0B", "#EC4899",
  "#06B6D4", "#EF4444", "#14B8A6", "#64748B"
];

export default function JournalItemModal({
  isOpen,
  onClose,
  type = "movie", // "movie" | "book" | "food" | "favourite" | "category"
  item = null,    // If provided, edit mode
  categories = [],
  onSubmit,
  prefillCategoryId = null,  // Pre-select a category when opening from a category card
}) {
  const [formData, setFormData] = useState({});
  const [customCat, setCustomCat] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || item.name || "",
        name: item.name || item.title || "",
        author: item.author || "",
        type: item.type || (type === "movie" ? "MOVIE" : type === "food" ? "DISH" : ""),
        status: item.status || (type === "movie" ? "WANT_TO_WATCH" : type === "book" ? "WANT_TO_READ" : "WANT_TO_TRY"),
        description: item.description || "",
        categoryId: item.category?.id || (categories[0]?.id || ""),
        categoryName: "",
        icon: item.icon || "⭐",
        color: item.color || "#8B5CF6",
      });
    } else {
      setFormData({
        title: "",
        name: "",
        author: "",
        type: type === "movie" ? "MOVIE" : type === "food" ? "DISH" : "",
        status: type === "movie" ? "WANT_TO_WATCH" : type === "book" ? "WANT_TO_READ" : "WANT_TO_TRY",
        description: "",
        categoryId: prefillCategoryId || categories[0]?.id || "",
        categoryName: "",
        icon: "⭐",
        color: "#8B5CF6",
      });
      setCustomCat(false);
    }
  }, [item, type, isOpen, categories, prefillCategoryId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "movie" && !formData.title?.trim()) return alert("Please enter movie/show title");
    if (type === "book" && !formData.title?.trim()) return alert("Please enter book title");
    if (type === "food" && !formData.name?.trim()) return alert("Please enter dish or place name");
    if (type === "favourite" && !formData.title?.trim()) return alert("Please enter favourite item title");
    if (type === "category" && !formData.name?.trim()) return alert("Please enter category name");

    onSubmit(formData);
  };

  const getModalTitle = () => {
    const isEdit = Boolean(item);
    switch (type) {
      case "movie": return isEdit ? "Edit Movie / Series" : "Add Movie or Series";
      case "book": return isEdit ? "Edit Book Entry" : "Add Book to Log";
      case "food": return isEdit ? "Edit Food & Dining" : "Add Food Experience";
      case "favourite": {
        if (prefillCategoryId) {
          const cat = categories.find(c => c.id === prefillCategoryId || String(c.id) === String(prefillCategoryId));
          return cat ? `Add to: ${cat.icon || "⭐"} ${cat.name}` : "Add to Things I Love";
        }
        return isEdit ? "Edit Entry" : "Add to Things I Love";
      }
      case "category": return "Create Your Own List";
      default: return "Add Entry";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-['Inter',_sans-serif]">
      <div className="bg-white w-full max-w-lg rounded-[20px] shadow-2xl border border-[#E2E8F0] overflow-hidden transform transition-all duration-300">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center text-white shadow-xs">
              {type === "movie" && <FiFilm size={18} />}
              {type === "book" && <FiBookOpen size={18} />}
              {type === "food" && <FiCoffee size={18} />}
              {type === "favourite" && <FiStar size={18} />}
              {type === "category" && <FiFolderPlus size={18} />}
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#1E293B] leading-tight">
                {getModalTitle()}
              </h2>
              <p className="text-[12px] text-[#64748B] mt-0.5">
                Life Journal • Curate your personal stories
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#1E293B] p-2 rounded-full hover:bg-white transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* ================= MOVIE FIELDS ================= */}
          {type === "movie" && (
            <>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inception, Succession, Spirited Away"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] focus:bg-white transition-all"
                  >
                    {MEDIA_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] focus:bg-white transition-all"
                  >
                    {MOVIE_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Review / Thoughts (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Key takeaways, memorable scenes, rating, or personal review..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] focus:bg-white transition-all resize-none"
                />
              </div>
            </>
          )}

          {/* ================= BOOK FIELDS ================= */}
          {type === "book" && (
            <>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atomic Habits, To Kill a Mockingbird"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Author
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. James Clear"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] focus:bg-white transition-all"
                  >
                    {BOOK_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Notes & Highlights (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Favorite quotes, chapters, insights, or personal reflections..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] focus:bg-white transition-all resize-none"
                />
              </div>
            </>
          )}

          {/* ================= FOOD FIELDS ================= */}
          {type === "food" && (
            <>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Dish / Restaurant Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Truffle Pasta, Blue Tokai Coffee, Ramen"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Category Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] focus:bg-white transition-all"
                  >
                    {FOOD_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] focus:bg-white transition-all"
                  >
                    {FOOD_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Tasting Notes & Location (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Flavor profile, restaurant location, preparation tips..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] focus:bg-white transition-all resize-none"
                />
              </div>
            </>
          )}

          {/* ================= FAVOURITE FIELDS ================= */}
          {type === "favourite" && (
            <>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Your Pick *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder={(() => {
                    if (prefillCategoryId) {
                      const cat = categories.find(c => String(c.id) === String(prefillCategoryId));
                      return cat ? `Your ${cat.name}…` : "Enter your favourite…";
                    }
                    return "e.g. Coldplay - Yellow, Blue Tokai Coffee, Rishikesh";
                  })()}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] focus:bg-white transition-all"
                />
              </div>

              {/* Category selector — locked if pre-filled from card, editable otherwise */}
              {prefillCategoryId ? (() => {
                const cat = categories.find(c => String(c.id) === String(prefillCategoryId));
                return cat ? (
                  <div
                    className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5"
                    style={{ borderLeft: `4px solid ${cat.color || "#8B5CF6"}` }}
                  >
                    <span className="text-lg">{cat.icon || "⭐"}</span>
                    <div>
                      <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Saving to list</p>
                      <p className="text-[14px] font-bold text-[#1E293B]">{cat.name}</p>
                    </div>
                  </div>
                ) : null;
              })() : (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                      Category *
                    </label>
                  </div>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] focus:bg-white transition-all"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon || "⭐"} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {/* ================= CATEGORY FIELDS ================= */}
          {type === "category" && (
            <>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Architecture, Podcasting, Tech Setups"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1E293B] outline-none focus:border-[#8B5CF6] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Icon Emoji
                </label>
                <input
                  type="text"
                  placeholder="⭐, 🎨, 💡, 🎧, 🏛️"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-20 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2 text-[16px] text-[#1E293B] text-center outline-none focus:border-[#8B5CF6] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">
                  Accent Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_SWATCHES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c,
                        borderColor: formData.color === c ? "#1E293B" : "transparent",
                        boxShadow: formData.color === c ? "0 0 0 2px white inset" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-[10px] text-[14px] font-medium text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#7C3AED] hover:to-[#2563EB] text-white px-5 py-2.5 rounded-[10px] text-[14px] font-semibold shadow-md hover:shadow-lg transition-all transform active:scale-95"
            >
              {item ? "Save Changes" : "Save Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
