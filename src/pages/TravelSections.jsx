import { useEffect, useState } from "react";
import API from "../api";

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
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      "
    >
      {sections.map((section) => {
        const visitedCount =
          section.places?.filter(
            (p) => p.visited
          ).length || 0;

        const total =
          section.places?.length || 0;

        const percent =
          Math.round(
            (visitedCount / total) * 100
          ) || 0;

        return (
          <div
            key={section.id}
            className="
              bg-white
              rounded-[30px]
              p-6
              shadow-sm
              border
              border-[#ECECEC]
            "
          >
            {/* HEADER */}
            <div
              className="
                flex
                justify-between
                items-start
                mb-5
              "
            >
              <div className="flex gap-3">
                <div
                  className="
                    w-4
                    h-4
                    rounded-full
                    mt-1
                  "
                  style={{
                    background:
                      section.color,
                  }}
                />

                <div>
                  <h3
                    className="
                      text-[22px]
                      font-['Playfair_Display']
                      text-[#222]
                    "
                  >
                    {section.title}
                  </h3>

                  <p
                    className="
                      text-[14px]
                      text-[#777]
                      mt-2
                    "
                  >
                    {section.description}
                  </p>
                </div>
              </div>

              <button
                className="
                  text-[#888]
                  text-[20px]
                "
                onClick={async () => {
                  try {
                    await API.delete(
                      `/sections/${section.id}`
                    );

                    fetchSections();
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                ⋮
              </button>
            </div>

            {/* PROGRESS */}
            <div className="mb-5">
              <div
                className="
                  flex
                  justify-between
                  text-[14px]
                  mb-3
                "
              >
                <span className="text-[#666]">
                  {visitedCount} of {total}
                  {" "}visited
                </span>

                <span
                  className="font-semibold"
                  style={{
                    color:
                      section.color,
                  }}
                >
                  {percent}%
                </span>
              </div>

              <div
                className="
                  w-full
                  h-[10px]
                  bg-[#ECECEC]
                  rounded-full
                  overflow-hidden
                "
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${percent}%`,
                    background:
                      section.color,
                  }}
                />
              </div>
            </div>

            {/* PLACES */}
            <div className="space-y-4">
              {section.places?.map(
                (place) => (
                  <div
                    key={place.id}
                    className="
                      bg-[#F8F6F4]
                      rounded-[22px]
                      p-4
                      flex
                      justify-between
                      items-center
                    "
                  >
                    <div>
                      <h4
                        className="
                          text-[15px]
                          font-semibold
                          text-[#222]
                        "
                      >
                        {place.placeName}
                      </h4>

                      <p
                        className="
                          text-[13px]
                          text-[#777]
                          mt-1
                        "
                      >
                        {place.stateName}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={
                        place.visited
                      }
                      className="w-5 h-5"
                      style={{
                        accentColor:
                          section.color,
                      }}
                      onChange={async () => {
                        try {
                          const updatedPlaces =
                            section.places.map(
                              (p) =>
                                p.id === place.id
                                  ? {
                                      ...p,
                                      visited:
                                        !p.visited,
                                    }
                                  : p
                            );

                          await API.put(
                            `/sections/${section.id}`,
                            {
                              ...section,
                              places:
                                updatedPlaces,
                            }
                          );

                          fetchSections();
                        } catch (err) {
                          console.log(err);
                        }
                      }}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}