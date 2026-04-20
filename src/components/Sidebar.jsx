export default function Sidebar() {
  return (
    <div className="w-64 bg-white p-5 shadow-md flex flex-col justify-between">
      
      <div>
        <h2 className="text-xl font-bold mb-6">🌍 Travel</h2>

        <ul className="space-y-3 text-gray-600">
          <li className="hover:text-blue-500 cursor-pointer">Dashboard</li>
          <li className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg font-semibold">
            My Travels
          </li>
          <li className="hover:text-blue-500 cursor-pointer">Visited Places</li>
          <li className="hover:text-blue-500 cursor-pointer">Wishlist</li>
          <li className="hover:text-blue-500 cursor-pointer">Timeline</li>
        </ul>
      </div>

      <button className="bg-blue-500 text-white py-2 rounded-xl mt-6 hover:bg-blue-600">
        + Add New Trip
      </button>
    </div>
  );
}