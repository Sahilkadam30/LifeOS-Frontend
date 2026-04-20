export default function PhotoUpload() {
  return (
    <div className="card">
      <h2 className="font-semibold mb-4 text-lg">📷 Upload Photos</h2>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="h-20 bg-gray-200 rounded-lg"></div>
        <div className="h-20 bg-gray-200 rounded-lg"></div>
        <div className="h-20 bg-gray-200 rounded-lg"></div>
        <div className="h-20 bg-gray-200 rounded-lg"></div>
        <div className="h-20 bg-gray-200 rounded-lg"></div>
        <div className="h-20 bg-gray-200 rounded-lg"></div>
      </div>

      <div className="border-2 border-dashed p-4 text-center rounded-lg text-gray-500">
        Drag & Drop Photos
      </div>
    </div>
  );
}