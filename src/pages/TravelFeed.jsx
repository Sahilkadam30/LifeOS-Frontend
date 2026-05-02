import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import FloatingButton from "../components/FloatingButton";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import "../styles/TravelFeed.css";

export default function TravelFeed() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [showHeart, setShowHeart] = useState({});
  const [currentIndex, setCurrentIndex] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/travel/my");
      const data = res.data;

      if (Array.isArray(data)) setPosts(data);
      else if (Array.isArray(data.content)) setPosts(data.content);
      else setPosts([]);
    } catch (err) {
      console.error(err);
      setPosts([]);
    }
  };

  // ❤️ DOUBLE TAP LIKE
  const handleDoubleTap = (postId) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: true }));

    // show heart animation
    setShowHeart((prev) => ({ ...prev, [postId]: true }));

    setTimeout(() => {
      setShowHeart((prev) => ({ ...prev, [postId]: false }));
    }, 800);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddJourney = () => {
    navigate("/add-journey");
  };

  return (
    <div className="container-fluid mt-3 px-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={{ color: "#C9996B" }}>Travel Track</h4>

        <div>
          <button
            className="btn me-2"
            style={{ backgroundColor: "#C9996B", color: "white" }}
            onClick={handleAddJourney}
          >
            + Add Place
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="post-grid">
        {posts.map((post) => (
          <div key={post.id}>

            <div className="card post-card">

              {/* ❤️ HEART BURST */}
              <div
  className="image-container"
  onDoubleClick={() => handleDoubleTap(post.id)}
>
  {/* ❤️ Heart */}
  {showHeart[post.id] && (
    <div className="heart-animation">❤️</div>
  )}

  {/* 🔢 Image Counter */}
  {post.images?.length > 1 && (
    <div className="image-counter">
      {(currentIndex[post.id] || 0) + 1}/{post.images.length}
    </div>
  )}

  {/* 🖼️ Swiper */}
  {post.images?.length > 0 && (
    <Swiper
      spaceBetween={10}
      onSlideChange={(swiper) =>
        setCurrentIndex((prev) => ({
          ...prev,
          [post.id]: swiper.activeIndex,
        }))
      }
    >
      {post.images.map((img) => (
        <SwiperSlide key={img.id}>
          <img src={img.imageUrl} className="post-img" alt="" />
        </SwiperSlide>
      ))}
    </Swiper>
  )}
</div>

              {/* Content */}
              <div className="card-body">
                <h6>{post.caption}</h6>

                <p className="text-muted small">
                  {new Date(post.createdAt).toLocaleString()}
                </p>

                <span className="like-btn">
                  {likedPosts[post.id] ? "❤️" : "🤍"}
                </span>
              </div>

            </div>

          </div>
        ))}
      </div>

      <FloatingButton onClick={handleAddJourney} />
    </div>
  );
}