import { useState } from "react";
import SuccessModal from "./SuccessModal";
import { createWriting } from "../services/writingService";
import { FiX } from "react-icons/fi";

const colors = [
  "#2563EB",
  "#16A34A",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

const AddWritingModal = ({ closeModal, refreshData }) => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "NOTE",
    cardColor: colors[0],
  });

  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("Please fill out both title and content.");
      return;
    }

    try {
      await createWriting(form);
      refreshData();
      setForm({ title: "", content: "", type: "NOTE", cardColor: colors[0] });
      setError("");
      setShowSuccess(true);
    } catch (err) {
      console.log(err);
      setError("Failed to save. Please try again.");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    closeModal();
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
        <div className="bg-white w-full max-w-[550px] rounded-[16px] shadow-xl border border-[#E2E8F0] overflow-hidden transform transition-all">
          {/* Modal Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <h2 className="text-[20px] font-semibold text-[#1E293B]">
              Create Writing
            </h2>
            <button
              onClick={closeModal}
              className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3 text-[14px] bg-[#FDECEC] border border-[#EF4444]/20 text-[#EF4444] rounded-[10px]">
                {error}
              </div>
            )}

            {/* Title input */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                Title
              </label>
              <input
                type="text"
                placeholder="Give your writing a title..."
                className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-3 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B]"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Type dropdown */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                Category
              </label>
              <select
                className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-3 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B] cursor-pointer"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="NOTE">Note</option>
                <option value="STORY">Storytelling</option>
                <option value="POEM">Poem</option>
              </select>
            </div>

            {/* Card Accent Color selection */}
            <div className="space-y-2">
              <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider block">
                Accent Color
              </label>
              <div className="flex gap-3 pt-1">
                {colors.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setForm({ ...form, cardColor: color })}
                    className={`w-9 h-9 rounded-full cursor-pointer transition-all duration-200 border-2 ${
                      form.cardColor === color
                        ? "border-slate-800 scale-110 shadow-sm"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Content area */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                Content
              </label>
              <textarea
                rows="6"
                placeholder="Pour your thoughts here..."
                className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-4 py-3 outline-none text-[15px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition-all text-[#1E293B] resize-none"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 rounded-[10px] border border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] hover:bg-slate-50 transition-all duration-200 font-medium text-[14px]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-[10px] font-medium text-[14px] transition-all duration-200 shadow-sm hover:shadow"
              >
                Save Writing
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success popup */}
      <SuccessModal
        open={showSuccess}
        onClose={handleSuccessClose}
        title="Writing Saved!"
        description="Your writing has been saved to your collection successfully."
      />
    </>
  );
};

export default AddWritingModal;