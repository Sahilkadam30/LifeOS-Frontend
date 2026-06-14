export default function WorkoutTable({
  workouts,
  onEdit,
  onDelete
}) {

  return (
    <div className="card border-0 shadow-sm rounded-4">

      <div className="card-body">

        <table className="table">

          <thead>
            <tr>
              <th>Exercise</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>Weight</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {workouts.map(w => (

              <tr key={w.id}>
                <td>{w.exerciseName}</td>
                <td>{w.sets}</td>
                <td>{w.reps}</td>
                <td>{w.weight} kg</td>
                <td>{w.workoutDate}</td>

                <td>

                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => onEdit(w)}>
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(w.id)}>
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}