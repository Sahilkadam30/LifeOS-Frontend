import { useState, useEffect } from "react";

export default function WorkoutModal({
  workout,
  onSave
}) {

  const [form, setForm] = useState({
    exerciseName: "",
    sets: "",
    reps: "",
    weight: "",
    workoutDate: "",
    notes: ""
  });

  useEffect(() => {

    if (workout) {
      setForm(workout);
    }

  }, [workout]);

  const handleChange = e => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (

    <div
      className="modal fade"
      id="workoutModal">

      <div className="modal-dialog">

        <div className="modal-content rounded-4">

          <div className="modal-header">
            <h5>Workout</h5>
          </div>

          <div className="modal-body">

            <input
              name="exerciseName"
              className="form-control mb-3"
              placeholder="Exercise"
              value={form.exerciseName}
              onChange={handleChange}
            />

            <input
              name="sets"
              type="number"
              className="form-control mb-3"
              placeholder="Sets"
              value={form.sets}
              onChange={handleChange}
            />

            <input
              name="reps"
              type="number"
              className="form-control mb-3"
              placeholder="Reps"
              value={form.reps}
              onChange={handleChange}
            />

            <input
              name="weight"
              type="number"
              className="form-control mb-3"
              placeholder="Weight"
              value={form.weight}
              onChange={handleChange}
            />

            <input
              name="workoutDate"
              type="date"
              className="form-control mb-3"
              value={form.workoutDate}
              onChange={handleChange}
            />

            <textarea
              name="notes"
              className="form-control"
              value={form.notes}
              onChange={handleChange}
            />

          </div>

          <div className="modal-footer">

            <button
              className="btn btn-primary"
              onClick={() => onSave(form)}>
              Save
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}