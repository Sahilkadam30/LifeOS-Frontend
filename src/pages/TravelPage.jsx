import Sidebar from "../components/Sidebar";
import AddPlaceForm from "../components/AddPlaceForm";
import PhotoUpload from "../components/PhotoUpload";
import MapView from "../components/MapView";
import Wishlist from "../components/Wishlist";
import Timeline from "../components/Timeline";

export default function TravelPage() {
  return (
    <div className="flex h-screen bg-gray-100">
  <Sidebar />

  <div className="flex-1 p-6 overflow-auto">
    <h1 className="text-2xl font-bold mb-6">Travel Module</h1>

    <div className="grid grid-cols-3 gap-5">
      <AddPlaceForm />
      <PhotoUpload />
      <MapView />
    </div>

    <div className="grid grid-cols-2 gap-5 mt-5">
      <Wishlist />
      <Timeline />
    </div>
  </div>
</div>
  );
}