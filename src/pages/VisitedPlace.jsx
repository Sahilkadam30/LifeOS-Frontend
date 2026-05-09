import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import MapView from "../components/MapView";
import "../styles/VisitedPlace.css";

import {
  FaMapMarkerAlt,
  FaHeart,
  FaUniversity,
  FaGlobe,
} from "react-icons/fa";

export default function VisitedPlace() {
  const [visited, setVisited] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const v = await API.get("/visited");
      const w = await API.get("/wishlist");

      setVisited(v.data);
      setWishlist(w.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this place?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/visited/${id}`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (trip) => {
    navigate(`/edit-visited/${trip.id}`, {
      state: trip,
    });
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div>
          <div className="logo">TripTracker</div>

          <div className="sidebar-menu">
            <div className="sidebar-item sidebar-active">
              Dashboard
            </div>

            <div className="sidebar-item">
              Visited Trips
            </div>

            <div className="sidebar-item">
              Wishlist
            </div>

            <div className="sidebar-item">
              Map View
            </div>

            <div className="sidebar-item">
              Statistics
            </div>

            <div className="sidebar-item">
              Settings
            </div>
          </div>
        </div>

        <div className="logout-btn">Logout</div>
      </div>

      {/* MAIN */}
      <div className="dashboard-main">
        <div className="dashboard-top">
          <div className="dashboard-title">
            Dashboard
          </div>

          <div className="top-actions">
            <button
              className="add-btn"
              onClick={() => navigate("/add-visited")}
            >
              + Add New
            </button>

            <div className="profile-circle"></div>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-icon green">📍</div>

            <div className="stats-text">
              <p>Visited Places</p>
              <h2>{visited.length}</h2>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-icon orange">❤</div>

            <div className="stats-text">
              <p>Wishlist Places</p>
              <h2>{wishlist.length}</h2>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-icon black">🏛</div>

            <div className="stats-text">
              <p>Cities Explored</p>
              <h2>
                {
                  new Set(
                    visited.map((v) => v.city)
                  ).size
                }
              </h2>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-icon beige">🌍</div>

            <div className="stats-text">
              <p>Total Trips</p>
              <h2>
                {visited.length + wishlist.length}
              </h2>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="content-grid">
          {/* LEFT */}
          <div className="left-section">
            {/* VISITED */}
            <div className="custom-card">
              <div className="card-header">
                <h4>Visited Trips</h4>

                <button
                  className="small-btn"
                  onClick={() =>
                    navigate("/add-visited")
                  }
                >
                  + Add Visited
                </button>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Place</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>City</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {visited.map((v) => (
                    <tr key={v.id}>
                      <td>{v.placeName}</td>
                      <td>{v.type}</td>
                      <td>{v.visitedOn}</td>
                      <td>{v.city}</td>

                      <td>
                        <div className="action-btns">
                          <button
                            className="edit-btn"
                            onClick={() =>
                              handleEdit(v)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(v.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="view-link">
                View all visited trips →
              </div>
            </div>

            {/* WISHLIST */}
            <div className="custom-card">
              <div className="card-header">
                <h4>Wishlist</h4>

                <button
                  className="small-btn"
                  onClick={() =>
                    navigate("/add-wishlist")
                  }
                >
                  + Add Wishlist
                </button>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Place</th>
                    <th>Date</th>
                    <th>City</th>
                  </tr>
                </thead>

                <tbody>
                  {wishlist.map((w) => (
                    <tr key={w.id}>
                      <td>{w.placeName}</td>
                      <td>{w.planDate}</td>
                      <td>{w.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="view-link">
                View all wishlist places →
              </div>
            </div>
          </div>

          {/* RIGHT MAP */}
          <div className="map-card">
            <MapView
              visited={visited}
              wishlist={wishlist}
            />
          </div>
        </div>
      </div>
    </div>
  );
}