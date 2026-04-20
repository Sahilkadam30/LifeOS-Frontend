export default function Timeline() {
  return (
    <div className="card">
      <h2 className="font-semibold text-lg mb-4">📅 Travel Timeline</h2>

      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-200 rounded-full"></div>
          <span className="text-sm mt-1">Paris</span>
        </div>

        <div className="flex-1 h-1 bg-gray-300 mx-2"></div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-purple-200 rounded-full"></div>
          <span className="text-sm mt-1">Rome</span>
        </div>

        <div className="flex-1 h-1 bg-gray-300 mx-2"></div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-green-200 rounded-full"></div>
          <span className="text-sm mt-1">Bali</span>
        </div>
      </div>
    </div>
  );
}