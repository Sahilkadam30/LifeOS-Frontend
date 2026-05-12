import { useEffect, useState } from "react";
import API from "../api";
import "../styles/TravelSections.css";

export default function TravelSections() {

  const [sections, setSections] = useState([]);

  const [sectionTitle, setSectionTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [places, setPlaces] = useState([
    {
      placeName: "",
      stateName: "",
      visited: false,
    },
  ]);

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

  const addPlaceField = () => {

    setPlaces([
      ...places,
      {
        placeName: "",
        stateName: "",
        visited: false,
      },
    ]);
  };

  const handlePlaceChange = (
    index,
    field,
    value
  ) => {

    const updated = [...places];

    updated[index][field] = value;

    setPlaces(updated);
  };

  const handleSave = async () => {

    try {

      await API.post("/sections", {
        title: sectionTitle,
        description,
        places,
      });

      alert("Section Created");

      setSectionTitle("");
      setDescription("");

      setPlaces([
        {
          placeName: "",
          stateName: "",
          visited: false,
        },
      ]);

      fetchSections();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="sections-page">

      {/* CREATE SECTION */}
      <div className="create-card">

        <h3>Create Section</h3>

        <input
          className="form-control mb-3"
          placeholder="Section Title"
          value={sectionTitle}
          onChange={(e) =>
            setSectionTitle(e.target.value)
          }
        />

        <input
          className="form-control mb-3"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        {places.map((p, index) => (

          <div
            key={index}
            className="place-row"
          >

            <input
              className="form-control"
              placeholder="Destination Name"
              value={p.placeName}
              onChange={(e) =>
                handlePlaceChange(
                  index,
                  "placeName",
                  e.target.value
                )
              }
            />

            <input
              className="form-control"
              placeholder="State Name"
              value={p.stateName}
              onChange={(e) =>
                handlePlaceChange(
                  index,
                  "stateName",
                  e.target.value
                )
              }
            />

          </div>
        ))}

        <button
          className="btn btn-secondary mt-2 me-2"
          onClick={addPlaceField}
        >
          + Add Destination
        </button>

        <button
          className="btn save-btn mt-2"
          onClick={handleSave}
        >
          Save Section
        </button>

      </div>

      {/* SECTION LIST */}
      <div className="sections-grid">

        {sections.map((section) => {

          const visitedCount =
            section.places.filter(
              (p) => p.visited
            ).length;

          const total = section.places.length;

          const percent =
            Math.round(
              (visitedCount / total) * 100
            ) || 0;

          return (

            <div
              key={section.id}
              className="section-card"
            >

              <div className="section-top">

                <div>
                  <h4>{section.title}</h4>

                  <p>
                    {total} places
                  </p>
                </div>

                <button
                  className="delete-btn"
                  onClick={async () => {

                    await API.delete(
                      `/sections/${section.id}`
                    );

                    fetchSections();
                  }}
                >
                  ⋮
                </button>

              </div>

              {/* PROGRESS */}
              <div className="progress-info">

                <div>
                  <span className="green-text">
                    {visitedCount}
                  </span>
                  {" "}of {total}
                </div>

                <div>
                  {percent}%
                </div>

              </div>

              <div className="progress mb-4">

                <div
                  className="progress-bar bg-success"
                  style={{
                    width: `${percent}%`,
                  }}
                ></div>

              </div>

              {/* DESTINATIONS */}
              {section.places.map((place) => (

                <div
                  key={place.id}
                  className="destination-item"
                >

                  <div>

                    <h6>
                      {place.placeName}
                    </h6>

                    <small>
                      {place.stateName}
                    </small>

                  </div>

                  <input
                    type="checkbox"
                    checked={place.visited}
                    onChange={async () => {

                      const updatedPlaces =
                        section.places.map((p) => {

                          if (p.id === place.id) {

                            return {
                              ...p,
                              visited: !p.visited,
                            };
                          }

                          return p;
                        });

                      await API.put(
                        `/sections/${section.id}`,
                        {
                          ...section,
                          places: updatedPlaces,
                        }
                      );

                      fetchSections();
                    }}
                  />

                </div>
              ))}

            </div>
          );
        })}
      </div>
    </div>
  );
}