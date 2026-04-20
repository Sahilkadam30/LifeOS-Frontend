export default function PostCard({ post }) {
  return (
    <div className="bg-white/70 backdrop-blur-md shadow-md rounded-2xl p-4 mb-4 border border-gray-100">
      <p className="text-gray-800 text-lg">{post.content}</p>
      <p className="text-xs text-gray-400 mt-2">
        {new Date(post.createdAt).toLocaleString()}
      </p>
    </div>
  );
}