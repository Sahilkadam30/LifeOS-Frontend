export default function Wishlist() {
  return (
    <div className="card">
      <h2 className="font-semibold text-lg mb-3">❤️ Wishlist</h2>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
          <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
          <div>
            <p className="font-medium">Bali, Indonesia</p>
            <span className="text-sm text-gray-500">Beach</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
          <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
          <div>
            <p className="font-medium">Swiss Alps</p>
            <span className="text-sm text-gray-500">Mountains</span>
          </div>
        </div>
      </div>
    </div>
  );
}