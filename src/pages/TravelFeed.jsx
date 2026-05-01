import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import FloatingButton from "../components/FloatingButton";

export default function TravelFeed() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
  try {
    const res = await API.get("/travel/my");

    const data = res.data;

    if (Array.isArray(data)) {
      setPosts(data);
    } else if (Array.isArray(data.content)) {
      setPosts(data.content);
    } else {
      setPosts([]);
    }

  } catch (err) {
    console.error(err);
    setPosts([]);
  }
};

  const handleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: true,
    }));

    // TODO: Call backend like API
  };

  const handleAddJourney = () => {
    navigate("/add-journey");
  };

  return (
    <div className="container mt-3">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={{ color: "#C9996B" }}>Travel Track</h4>
        <button
          className="btn"
          style={{ backgroundColor: "#C9996B", color: "white" }}
          onClick={handleAddJourney}
        >
          + Add Place
        </button>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="card mb-4 shadow-sm"
          style={{ borderRadius: "12px" }}
          onDoubleClick={() => handleLike(post.id)}
        >

          {/* 🚀 MULTI IMAGE CAROUSEL */}
          {post.images?.length > 0 && (
            <div
              id={`carousel-${post.id}`}
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {post.images.map((img, index) => (
                  <div
                    key={img.id}
                    className={`carousel-item ${
                      index === 0 ? "active" : ""
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      className="d-block w-100"
                      alt="travel"
                      style={{ height: "300px", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>

              {/* Controls (only if multiple images) */}
              {post.images.length > 1 && (
                <>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target={`#carousel-${post.id}`}
                    data-bs-slide="prev"
                  >
                    <span className="carousel-control-prev-icon"></span>
                  </button>

                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target={`#carousel-${post.id}`}
                    data-bs-slide="next"
                  >
                    <span className="carousel-control-next-icon"></span>
                  </button>
                </>
              )}
            </div>
          )}

          {/* Content */}
          <div className="card-body">

            {/* Caption */}
            <h6 className="fw-bold">{post.caption}</h6>

            {/* Date & Time */}
            <p className="text-muted" style={{ fontSize: "12px" }}>
              {new Date(post.createdAt).toLocaleString()}
            </p>

            {/* Like */}
            <div className="mb-2">
              <span style={{ fontSize: "20px", cursor: "pointer" }}>
                {likedPosts[post.id] ? "❤️" : "🤍"}
              </span>
            </div>

            {/* Comments */}
            <div>
              {post.comments?.length > 0 ? (
                post.comments.map((c) => (
                  <p key={c.id} className="mb-1">
                    {c.text}
                  </p>
                ))
              ) : (
                <p className="text-muted" style={{ fontSize: "12px" }}>
                  No comments yet
                </p>
              )}
            </div>

          </div>
        </div>
      ))}

      {/* Floating Button (Reused) */}
      <FloatingButton onClick={handleAddJourney} />
    </div>
  );
}