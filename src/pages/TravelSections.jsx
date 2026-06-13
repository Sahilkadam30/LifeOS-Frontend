import { useEffect, useState } from "react";
import API from "../api";
import { FiTrash2, FiCheckSquare, FiSquare } from "react-icons/fi";

export default function TravelSections() {
  const [sections, setSections] = useState([]);

  const fetchSections = async () => {
    try {
      const res = await API.get("/sections");
      setSections(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 font-['Inter',_sans-serif]">
      {sections.map((section) => {
        const visitedCount = section.places?.filter((p) => p.visited).length || 0;
        const total = section.places?.length || 0;
        const percent = Math.round((visitedCount / total) * 100) || 0;
        const accentColor = section.color || "#2563EB";

        return (
          <div
            key={section.id}
            className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            style={{ borderTop: `4px solid ${accentColor}` }}
          >
            {/* CARD HEADER */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[20px] font-semibold text-[#1E293B]">
                  {section.title}
                </h3>
                <p className="text-[14px] text-[#64748B] mt-1.5 line-clamp-2">
                  {section.description}
                </p>
              </div>

              <button
                className="text-[#64748B] hover:text-[#EF4444] p-1.5 rounded-full hover:bg-[#F8FAFC] transition-colors"
                title="Delete Section"
                onClick={async () => {
                  if (window.confirm(`Are you sure you want to delete "${section.title}"?`)) {
                    try {
                      await API.delete(`/sections/${section.id}`);
                      fetchSections();
                    } catch (err) {
                      console.log(err);
                    }
                  }
                }}
              >
                <FiTrash2 className="text-lg" />
              </button>
            </div>

            {/* PROGRESS SECTION */}
            <div className="mb-6 bg-[#F8FAFC] rounded-[12px] p-4 border border-[#E2E8F0]/60">
              <div className="flex justify-between text-[13px] font-medium mb-2.5">
                <span className="text-[#64748B] uppercase tracking-wider">
                  {visitedCount} / {total} Visited
                </span>
                <span className="font-bold" style={{ color: accentColor }}>
                  {percent}%
                </span>
              </div>

              <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: accentColor,
                  }}
                />
              </div>
            </div>

            {/* PLACES LIST */}
            <div className="space-y-3 mt-auto">
              <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                Destinations
              </p>
              {section.places?.map((place) => (
                <div
                  key={place.id}
                  className="bg-[#F8FAFC] border border-[#E2E8F0]/40 rounded-[10px] p-3 flex justify-between items-center hover:bg-[#F1F5F9] transition-colors duration-200"
                >
                  <div className="pr-3">
                    <h4 className="text-[14px] font-semibold text-[#1E293B]">
                      {place.placeName}
                    </h4>
                    <p className="text-[12px] text-[#64748B] mt-0.5">
                      {place.stateName}
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        const updatedPlaces = section.places.map((p) =>
                          p.id === place.id ? { ...p, visited: !p.visited } : p
                        );

                        await API.put(`/sections/${section.id}`, {
                          ...section,
                          places: updatedPlaces,
                        });

                        fetchSections();
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                    className="text-lg focus:outline-none transition-transform active:scale-95"
                    style={{ color: place.visited ? "#16A34A" : "#94A3B8" }}
                  >
                    {place.visited ? (
                      <FiCheckSquare className="text-xl" />
                    ) : (
                      <FiSquare className="text-xl" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}