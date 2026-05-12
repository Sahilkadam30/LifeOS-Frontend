import { useState } from "react";
import { createWriting } from "../services/writingService";

const colors = [
  "#FFF7D6",
  "#E7F6EC",
  "#F3E8FF",
  "#EAF2FF",
  "#FDECEC",
];

const AddWritingModal = ({ closeModal, refreshData }) => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "NOTE",
    cardColor: colors[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createWriting(form);

    refreshData();
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-[#323232]">
          Add Writing
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Title"
            className="w-full border rounded-2xl px-5 py-4 outline-none"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            rows="6"
            placeholder="Write here..."
            className="w-full border rounded-2xl px-5 py-4 outline-none"
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
          />

          <select
            className="w-full border rounded-2xl px-5 py-4 outline-none"
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="NOTE">Note</option>
            <option value="STORY">Story</option>
            <option value="POEM">Poem</option>
          </select>

          <div className="flex gap-3">
            {colors.map((color) => (
              <div
                key={color}
                onClick={() =>
                  setForm({ ...form, cardColor: color })
                }
                className="w-10 h-10 rounded-full cursor-pointer border"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-3 rounded-xl border"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-[#6B46C1] text-white px-6 py-3 rounded-xl"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWritingModal;