import { useState } from "react";
import API from "../api";
import MapView from "../components/MapView";
import { useNavigate } from "react-router-dom";

import "../styles/ManageTrip.css";

export default function ManageTrip() {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("visited");

  // ✅ VISITED FORM
  const [visitedForm, setVisitedForm] = useState({
    placeName: "",
    type: "",
    visitedOn: "",
    city: "",
    latitude: "",
    longitude: "",
  });

  // ✅ WISHLIST FORM
  const [wishlistForm, setWishlistForm] = useState({
    placeName: "",
    planDate: "",
    city: "",
    latitude: "",
    longitude: "",
  });

  // 📍 MAP CLICK
  const setCoordinates = ({
  latitude,
  longitude,
  placeName,
  city,
}) => {

  if (activeTab === "visited") {

    setVisitedForm({
      ...visitedForm,

      latitude,
      longitude,

      // ✅ AUTO FILL
      placeName:
        visitedForm.placeName || placeName,

      city:
        visitedForm.city || city,
    });

  } else {

    setWishlistForm({
      ...wishlistForm,

      latitude,
      longitude,

      // ✅ AUTO FILL
      placeName:
        wishlistForm.placeName || placeName,

      city:
        wishlistForm.city || city,
    });
  }
};

  // ✅ SAVE VISITED
  const saveVisited = async () => {

    try {

      await API.post("/visited", visitedForm);

      alert("Visited Place Added");

      navigate("/travel");

    } catch (err) {
      console.log(err);
    }
  };

  // ✅ SAVE WISHLIST
  const saveWishlist = async () => {

    try {

      await API.post("/wishlist", wishlistForm);

      alert("Wishlist Place Added");

      navigate("/travel");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="manage-trip-page">

      {/* HEADER */}
      <div className="manage-header">

        <h2>Manage Trips</h2>

        <button
          className="back-btn"
          onClick={() => navigate("/travel")}
        >
          Back
        </button>
      </div>

      {/* TABS */}
      <div className="trip-tabs">

        <button
          className={
            activeTab === "visited"
              ? "tab-active"
              : ""
          }
          onClick={() => setActiveTab("visited")}
        >
          Add Visited
        </button>

        <button
          className={
            activeTab === "wishlist"
              ? "tab-active"
              : ""
          }
          onClick={() => setActiveTab("wishlist")}
        >
          Add Wishlist
        </button>
      </div>

      <div className="manage-grid">

        {/* FORM */}
        <div className="form-card">

          {/* VISITED FORM */}
          {activeTab === "visited" && (
            <>
              <h3>Add Visited Place</h3>

              <input
                placeholder="Place Name"
                value={visitedForm.placeName}
                onChange={(e) =>
                  setVisitedForm({
                    ...visitedForm,
                    placeName: e.target.value,
                  })
                }
              />

              <input
                placeholder="Type"
                value={visitedForm.type}
                onChange={(e) =>
                  setVisitedForm({
                    ...visitedForm,
                    type: e.target.value,
                  })
                }
              />

              <input
                type="date"
                onChange={(e) =>
                  setVisitedForm({
                    ...visitedForm,
                    visitedOn: e.target.value,
                  })
                }
              />

              <input
                placeholder="City"
                value={visitedForm.city}
                onChange={(e) =>
                  setVisitedForm({
                    ...visitedForm,
                    city: e.target.value,
                  })
                }
              />

              <input
                placeholder="Latitude"
                value={visitedForm.latitude}
                readOnly
              />

              <input
                placeholder="Longitude"
                value={visitedForm.longitude}
                readOnly
              />

              <button onClick={saveVisited}>
                Save Visited
              </button>
            </>
          )}

          {/* WISHLIST FORM */}
          {activeTab === "wishlist" && (
            <>
              <h3>Add Wishlist Place</h3>

              <input
                placeholder="Place Name"
                value={wishlistForm.placeName}
                onChange={(e) =>
                  setWishlistForm({
                    ...wishlistForm,
                    placeName: e.target.value,
                  })
                }
              />

              <input
                type="date"
                onChange={(e) =>
                  setWishlistForm({
                    ...wishlistForm,
                    planDate: e.target.value,
                  })
                }
              />

              <input
                placeholder="City"
                value={wishlistForm.city}
                onChange={(e) =>
                  setWishlistForm({
                    ...wishlistForm,
                    city: e.target.value,
                  })
                }
              />

              <input
                placeholder="Latitude"
                value={wishlistForm.latitude}
                readOnly
              />

              <input
                placeholder="Longitude"
                value={wishlistForm.longitude}
                readOnly
              />

              <button onClick={saveWishlist}>
                Save Wishlist
              </button>
            </>
          )}
        </div>

        {/* MAP */}
        <div className="map-section">

          <MapView
            visited={[]}
            wishlist={[]}
            setCoordinates={setCoordinates}
          />

        </div>
      </div>
    </div>
  );
}