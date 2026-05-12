import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import FloatingButton from "../components/FloatingButton";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import "../styles/TravelFeed.css";

export default function TravelFeed() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [showHeart, setShowHeart] = useState({});
  const [currentIndex, setCurrentIndex] = useState({});
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});

  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.user);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const navigate = useNavigate();

  // FETCH
  const fetchPosts = async () => {
    try {
      const res = await API.get("/travel/my");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      fetchPosts();

      const payload = JSON.parse(atob(token.split(".")[1]));

      setCurrentUser(payload.sub);
    } catch (error) {
      console.error("Invalid token:", error);

      navigate("/login");
    }
  }, [token]);

  // LIKE
  const likePost = async (postId) => {
    try {
      const res = await API.post(`/travel/like/${postId}`);

      setPosts(
        posts.map((p) => (p.id === postId ? { ...p, likeCount: res.data } : p)),
      );

      setLikedPosts((prev) => ({ ...prev, [postId]: true }));
    } catch (err) {
      console.error(err);
    }
  };

  // DOUBLE TAP
  const handleDoubleTap = (postId) => {
    likePost(postId);

    setShowHeart((prev) => ({ ...prev, [postId]: true }));

    setTimeout(() => {
      setShowHeart((prev) => ({ ...prev, [postId]: false }));
    }, 800);
  };

  // COMMENT
  const addComment = async (postId) => {
    try {
      const text = commentText[postId];
      if (!text) return;

      const res = await API.post(`/travel/comment/${postId}`, text, {
        headers: { "Content-Type": "text/plain" },
      });

      setPosts(
        posts.map((p) =>
          p.id === postId
            ? { ...p, comments: [...(p.comments || []), res.data] }
            : p,
        ),
      );

      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE
  const openDeletePopup = (postId) => {
    setSelectedPostId(postId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/travel/post/${selectedPostId}`);
      setPosts((prev) => prev.filter((p) => p.id !== selectedPostId));
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedPostId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container-fluid mt-3 px-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={{ color: "#C9996B" }}>Travel Track</h4>

        <div>
          <button
            className="btn me-2"
            style={{ backgroundColor: "#C9996B", color: "white" }}
            onClick={() => navigate("/add-journey")}
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
              {/* IMAGE */}
              <div
                className="image-container"
                onDoubleClick={() => handleDoubleTap(post.id)}
              >
                {showHeart[post.id] && (
                  <div className="heart-animation">❤️</div>
                )}

                {post.images?.length > 1 && (
                  <div className="image-counter">
                    {(currentIndex[post.id] || 0) + 1}/{post.images.length}
                  </div>
                )}

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

              {/* CONTENT */}
              <div className="card-body">
                <h6>{post.caption}</h6>

                <p className="text-muted small">
                  {new Date(post.createdAt).toLocaleString()}
                </p>

                {/* ACTION BAR */}
                <div className="action-bar">
                  {/* LIKE */}
                  <span
                    className="action-btn"
                    onClick={() => likePost(post.id)}
                  >
                    <span className="icon">❤️</span>
                    <span className="label">Like</span>
                    <span className="count">{post.likeCount || 0}</span>
                  </span>

                  {/* COMMENT */}
                  <span
                    className="action-btn"
                    onClick={() =>
                      setShowComments((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }))
                    }
                  >
                    <span className="icon">💬</span>
                    <span className="label">Comment</span>
                    <span className="count">{post.comments?.length || 0}</span>
                  </span>

                  {/* DELETE */}
                  {post.user?.username === currentUser && (
                    <span
                      className="action-btn delete-btn"
                      onClick={() => openDeletePopup(post.id)}
                    >
                      <span className="icon">🗑</span>
                      <span className="label">Delete</span>
                    </span>
                  )}
                </div>

                {/* COMMENTS */}
                {showComments[post.id] && (
                  <div className="comment-section">
                    {post.comments?.map((c) => (
                      <p key={c.id} className="mb-1">
                        <b>{c.user?.username}</b>: {c.text}
                      </p>
                    ))}

                    <div className="d-flex mt-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add comment..."
                        value={commentText[post.id] || ""}
                        onChange={(e) =>
                          setCommentText({
                            ...commentText,
                            [post.id]: e.target.value,
                          })
                        }
                      />

                      <button
                        className="btn btn-primary ms-2"
                        onClick={() => addComment(post.id)}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE POPUP */}
      {showConfirm && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h5>Are you sure?</h5>
            <p>You want to delete this post</p>

            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn"
                style={{ backgroundColor: "#C9996B", color: "white" }}
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <FloatingButton onClick={() => navigate("/add-journey")} />
    </div>
  );
}
