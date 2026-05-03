import { useEffect, useState } from "react";
import API from "../api"
import MapView from "../components/MapView";
import "../styles/VisitedPlace.css";
import { useNavigate } from "react-router-dom";
import AddWishlist from "./AddWishlist";

export default function VisitedPlace() {
  const [visited, setVisited] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const v = await API.get("/visited");
      const w = await API.get("/wishlist");

      setVisited(v.data);
      setWishlist(w.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Dashboard</h2>
        <div>
          <button className="btn btn-primary me-2" onClick={() => navigate("/add-visited")}>
            + Add Visited
          </button>
          <button className="btn btn-warning" onClick={() => navigate("/add-wishlist")}>
            + Add Wishlist
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="row my-4">
        <div className="col-md-3"><div className="card-box">Visited {visited.length}</div></div>
        <div className="col-md-3"><div className="card-box">Wishlist {wishlist.length}</div></div>
        <div className="col-md-3">
          <div className="card-box">
            Cities {new Set(visited.map(v => v.city)).size}
          </div>
        </div>
      </div>

      <div className="row">
        {/* TABLE */}
        <div className="col-md-5">
          <h5>Visited Trips</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Place</th>
                <th>Type</th>
                <th>Date</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {visited.map(v => (
                <tr key={v.id}>
                  <td>{v.placeName}</td>
                  <td>{v.type}</td>
                  <td>{v.visitedOn}</td>
                  <td>{v.city}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h5>Wishlist</h5>
          <table className="table table-striped">
            <tbody>
              {wishlist.map(w => (
                <tr key={w.id}>
                  <td>{w.placeName}</td>
                  <td>{w.planDate}</td>
                  <td>{w.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MAP */}
        <div className="col-md-7">
          <MapView visited={visited} wishlist={wishlist} />
        </div>
      </div>
    </div>
  );
}