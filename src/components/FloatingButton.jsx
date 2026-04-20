export default function FloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-black text-white w-14 h-14 rounded-full text-3xl shadow-lg hover:scale-110 transition"
    >
      +
    </button>
  );
}