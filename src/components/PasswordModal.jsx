import { useState } from "react";

export default function PasswordModal({ onSuccess, onClose }) {
  const [password, setPassword] = useState("");

  const handleCheck = () => {
    if (password === "admin123") {
      onSuccess();
    } else {
      alert("Wrong password!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-80">
        <h2 className="text-lg font-semibold mb-3">Enter Password</h2>
        <input
          type="password"
          className="w-full border p-2 rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleCheck} className="bg-black text-white px-3 py-1 rounded">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}