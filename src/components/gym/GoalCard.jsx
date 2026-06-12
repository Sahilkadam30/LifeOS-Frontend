export default function GoalCard({ goal }) {

  const progress =
    (goal.currentValue / goal.targetValue) * 100;

  return (

    <div className="bg-white p-4 rounded-[20px] shadow-sm">

      <h5>{goal.goalTitle}</h5>

      <div className="progress mt-3">

        <div
          className="progress-bar"
          style={{
            width: `${progress}%`
          }}
        />
      </div>

      <div className="mt-2">

        {goal.currentValue}
        /
        {goal.targetValue}

      </div>

    </div>
  );
}