import { useEffect, useState } from "react";
import API from "../api";
import SuccessModal from "../components/SuccessModal";
import { FiTrash2, FiCheckSquare, FiSquare, FiEdit2, FiPlus, FiX, FiSave } from "react-icons/fi";

/* ── colour swatches for the picker ── */
const COLORS = [
  "#2563EB", "#16A34A", "#F59E0B", "#EF4444",
  "#8B5CF6", "#06B6D4", "#EC4899", "#14B8A6",
  "#F97316", "#64748B",
];

export default function TravelSections({ targetEditId, onSectionUpdated, onEditDone } = {}) {
  const [sections, setSections]       = useState([]);
  const [editId, setEditId]           = useState(null);   // which section is being edited
  const [editData, setEditData]       = useState({});     // draft state for the section being edited
  const [newPlace, setNewPlace]       = useState({ placeName: "", stateName: "" }); // new destination row
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg]   = useState({ title: "", description: "" });

  const triggerSuccess = (title, description) => {
    setSuccessMsg({ title, description });
    setShowSuccess(true);
  };

  // ── Fetch ──────────────────────────────────────────
  const fetchSections = async () => {
    try {
      const res = await API.get("/sections");
      setSections(res.data);
      if (onSectionUpdated) onSectionUpdated(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchSections(); }, []);

  // ── Auto-focus target section for editing if requested ──
  useEffect(() => {
    if (targetEditId && sections.length > 0) {
      const match = sections.find((s) => s.id === targetEditId);
      if (match) {
        startEdit(match);
        setTimeout(() => {
          const el = document.getElementById(`section-card-${match.id}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 80);
      }
    }
  }, [targetEditId, sections]);

  // ── Start editing a section ────────────────────────
  const startEdit = (section) => {
    setEditId(section.id);
    setEditData({
      title:       section.title       || "",
      description: section.description || "",
      color:       section.color       || "#2563EB",
      places:      section.places      ? [...section.places] : [],
    });
    setNewPlace({ placeName: "", stateName: "" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
    if (onEditDone) onEditDone();
  };

  // ── Save edits ─────────────────────────────────────
  const saveEdit = async () => {
    try {
      await API.put(`/sections/${editId}`, editData);
      triggerSuccess("Collection Updated! ✏️", "Your collection has been saved successfully.");
      setEditId(null);
      setEditData({});
      if (onEditDone) onEditDone();
      fetchSections();
    } catch (err) {
      console.log(err);
    }
  };

  // ── Add a new destination row to the draft ─────────
  const addPlaceToDraft = () => {
    if (!newPlace.placeName.trim()) return;
    setEditData((prev) => ({
      ...prev,
      places: [...(prev.places || []), { ...newPlace, visited: false }],
    }));
    setNewPlace({ placeName: "", stateName: "" });
  };

  // ── Remove a destination from the draft ───────────
  const removePlaceFromDraft = (idx) => {
    setEditData((prev) => ({
      ...prev,
      places: prev.places.filter((_, i) => i !== idx),
    }));
  };

  // ── Toggle visited (in saved list, not edit mode) ──
  const toggleVisited = async (section, place) => {
    try {
      const updatedPlaces = section.places.map((p) =>
        p.id === place.id ? { ...p, visited: !p.visited } : p
      );
      await API.put(`/sections/${section.id}`, { ...section, places: updatedPlaces });
      fetchSections();
    } catch (err) {
      console.log(err);
    }
  };

  // ── Delete a whole section ─────────────────────────
  const deleteSection = async (section) => {
    if (!window.confirm(`Delete "${section.title}"?`)) return;
    try {
      await API.delete(`/sections/${section.id}`);
      fetchSections();
    } catch (err) {
      console.log(err);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 font-['Inter',_sans-serif]">
      {sections.map((section) => {
        const isEditing   = editId === section.id;
        const data        = isEditing ? editData : section;
        const visitedCount = data.places?.filter((p) => p.visited).length || 0;
        const total        = data.places?.length || 0;
        const percent      = total > 0 ? Math.round((visitedCount / total) * 100) : 0;
        const accentColor  = data.color || "#2563EB";

        return (
          <div
            key={section.id}
            id={`section-card-${section.id}`}
            className={`bg-white rounded-[16px] border ${isEditing ? "border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-md" : "border-[#E2E8F0] shadow-sm"} p-6 hover:shadow-md transition-all duration-300 flex flex-col`}
            style={{ borderTop: `4px solid ${accentColor}` }}
          >
            {/* ── HEADER ───────────────────────────── */}
            <div className="flex justify-between items-start mb-4">
              {isEditing ? (
                <input
                  className="flex-1 text-[18px] font-bold text-[#1E293B] border border-[#E2E8F0] rounded-[8px] px-3 py-1.5 outline-none focus:border-[#2563EB] mr-3"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  placeholder="Collection title"
                />
              ) : (
                <div className="flex-1">
                  <h3 className="text-[20px] font-semibold text-[#1E293B]">{section.title}</h3>
                  <p className="text-[14px] text-[#64748B] mt-1.5 line-clamp-2">{section.description}</p>
                </div>
              )}

              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                {isEditing ? (
                  <>
                    {/* Save */}
                    <button
                      onClick={saveEdit}
                      className="text-[#16A34A] hover:text-white hover:bg-[#16A34A] p-1.5 rounded-full border border-[#16A34A]/30 transition-colors"
                      title="Save Changes"
                    >
                      <FiSave className="text-base" />
                    </button>
                    {/* Cancel */}
                    <button
                      onClick={cancelEdit}
                      className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-full hover:bg-[#F8FAFC] transition-colors"
                      title="Cancel"
                    >
                      <FiX className="text-base" />
                    </button>
                  </>
                ) : (
                  <>
                    {/* Edit */}
                    <button
                      onClick={() => startEdit(section)}
                      className="text-[#64748B] hover:text-[#2563EB] p-1.5 rounded-full hover:bg-[#F8FAFC] transition-colors"
                      title="Edit Collection"
                    >
                      <FiEdit2 className="text-base" />
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => deleteSection(section)}
                      className="text-[#64748B] hover:text-[#EF4444] p-1.5 rounded-full hover:bg-[#F8FAFC] transition-colors"
                      title="Delete Section"
                    >
                      <FiTrash2 className="text-base" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ── EDIT: description & colour picker ── */}
            {isEditing && (
              <div className="mb-4 space-y-3">
                <textarea
                  className="w-full text-[13px] text-[#1E293B] border border-[#E2E8F0] rounded-[8px] px-3 py-2 outline-none focus:border-[#2563EB] resize-none"
                  rows={2}
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Description (optional)"
                />
                <div>
                  <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Accent Colour</p>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        title={c}
                        onClick={() => setEditData({ ...editData, color: c })}
                        className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c,
                          borderColor: editData.color === c ? "#1E293B" : "transparent",
                          boxShadow: editData.color === c ? "0 0 0 2px white inset" : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── PROGRESS ─────────────────────────── */}
            {!isEditing && (
              <div className="mb-6 bg-[#F8FAFC] rounded-[12px] p-4 border border-[#E2E8F0]/60">
                <div className="flex justify-between text-[13px] font-medium mb-2.5">
                  <span className="text-[#64748B] uppercase tracking-wider">{visitedCount} / {total} Visited</span>
                  <span className="font-bold" style={{ color: accentColor }}>{percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, backgroundColor: accentColor }}
                  />
                </div>
              </div>
            )}

            {/* ── PLACES LIST ──────────────────────── */}
            <div className="space-y-2.5 mt-auto">
              <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Destinations</p>

              {(isEditing ? editData.places : section.places)?.map((place, idx) => (
                <div
                  key={place.id ?? idx}
                  className="bg-[#F8FAFC] border border-[#E2E8F0]/40 rounded-[10px] p-3 flex justify-between items-center hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="pr-3 flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          className="flex-1 text-[13px] font-semibold text-[#1E293B] border border-[#E2E8F0] rounded-[6px] px-2 py-1 outline-none focus:border-[#2563EB]"
                          value={place.placeName}
                          onChange={(e) => {
                            const updated = [...editData.places];
                            updated[idx] = { ...updated[idx], placeName: e.target.value };
                            setEditData({ ...editData, places: updated });
                          }}
                          placeholder="Place name"
                        />
                        <input
                          className="w-28 text-[12px] text-[#64748B] border border-[#E2E8F0] rounded-[6px] px-2 py-1 outline-none focus:border-[#2563EB]"
                          value={place.stateName}
                          onChange={(e) => {
                            const updated = [...editData.places];
                            updated[idx] = { ...updated[idx], stateName: e.target.value };
                            setEditData({ ...editData, places: updated });
                          }}
                          placeholder="State/Region"
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className="text-[14px] font-semibold text-[#1E293B] truncate">{place.placeName}</h4>
                        <p className="text-[12px] text-[#64748B] mt-0.5">{place.stateName}</p>
                      </>
                    )}
                  </div>

                  {isEditing ? (
                    <button
                      onClick={() => removePlaceFromDraft(idx)}
                      className="text-[#94A3B8] hover:text-[#EF4444] p-1 transition-colors flex-shrink-0"
                      title="Remove destination"
                    >
                      <FiX className="text-base" />
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleVisited(section, place)}
                      className="text-lg focus:outline-none transition-transform active:scale-95 flex-shrink-0"
                      style={{ color: place.visited ? "#16A34A" : "#94A3B8" }}
                    >
                      {place.visited ? <FiCheckSquare className="text-xl" /> : <FiSquare className="text-xl" />}
                    </button>
                  )}
                </div>
              ))}

              {/* Add destination row (edit mode only) */}
              {isEditing && (
                <div className="flex gap-2 mt-3">
                  <input
                    className="flex-1 text-[13px] border border-dashed border-[#CBD5E1] rounded-[8px] px-3 py-2 outline-none focus:border-[#2563EB] bg-[#F8FAFC]"
                    placeholder="New destination name"
                    value={newPlace.placeName}
                    onChange={(e) => setNewPlace({ ...newPlace, placeName: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && addPlaceToDraft()}
                  />
                  <input
                    className="w-28 text-[12px] border border-dashed border-[#CBD5E1] rounded-[8px] px-3 py-2 outline-none focus:border-[#2563EB] bg-[#F8FAFC]"
                    placeholder="State"
                    value={newPlace.stateName}
                    onChange={(e) => setNewPlace({ ...newPlace, stateName: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && addPlaceToDraft()}
                  />
                  <button
                    onClick={addPlaceToDraft}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-2 rounded-[8px] transition-colors flex items-center gap-1 text-[13px] font-semibold flex-shrink-0"
                  >
                    <FiPlus /> Add
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {sections.length === 0 && (
        <div className="col-span-3 text-center py-16 text-[#94A3B8]">
          <div className="text-5xl mb-4">🗺️</div>
          <p className="text-[16px] font-semibold text-[#64748B]">No collections yet.</p>
          <p className="text-[14px]">Create a section from the Travel Dashboard.</p>
        </div>
      )}

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={successMsg.title}
        description={successMsg.description}
      />
    </div>
  );
}