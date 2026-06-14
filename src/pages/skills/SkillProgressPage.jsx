import { useEffect, useState } from "react";
import SkillSidebar from "../../components/skills/SkillSidebar";
import SkillProgressForm from "../../components/skills/SkillProgressForm";
import SkillProgressTable from "../../components/skills/SkillProgressTable";
import SuccessModal from "../../components/SuccessModal";
import { getSkillProgress, createSkillProgress, deleteSkillProgress } from "../../services/skillService";

export default function SkillProgressPage() {
  const [skills, setSkills] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const res = await getSkillProgress();
      setSkills(res.data);
    } catch (err) {
      console.error("Failed to load skills", err);
    }
  };

  const saveSkill = async (data) => {
    await createSkillProgress(data);
    setShowSuccess(true);
    loadSkills();
  };

  const removeSkill = async (id) => {
    await deleteSkillProgress(id);
    loadSkills();
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <SkillSidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">Skill Progress</h1>
          <p className="text-sm text-[#64748B] mt-1">Track and update your skill levels</p>
        </div>

        <SkillProgressForm onSubmit={saveSkill} />

        <div className="mt-6">
          <SkillProgressTable skills={skills} onDelete={removeSkill} />
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Skill Saved!"
        description="Your skill progress has been updated successfully."
      />
    </div>
  );
}