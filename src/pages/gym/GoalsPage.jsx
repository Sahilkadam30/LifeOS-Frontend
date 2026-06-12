import { useEffect, useState } from "react";
import gymService from "../../services/gymService";
import GoalCard from "../../components/gym/GoalCard";

export default function GoalsPage() {

  const [goals, setGoals] = useState([]);

  const loadGoals = async () => {
    const res =
      await gymService.getGoals();

    setGoals(res.data);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const deleteGoal = async (id) => {
    await gymService.deleteGoal(id);
    loadGoals();
  };

  return (
    <div className="container-fluid p-4">

      <h2 className="mb-4">
        Fitness Goals
      </h2>

      <div className="row g-4">

        {goals.map((goal) => (
          <div
            key={goal.id}
            className="col-md-4"
          >
            <GoalCard
              goal={goal}
              onDelete={deleteGoal}
            />
          </div>
        ))}

      </div>

    </div>
  );
}