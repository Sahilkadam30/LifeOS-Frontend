import { useEffect, useState } from "react";
import SkillSidebar from "../../components/skills/SkillSidebar";
import SubjectForm from "../../components/skills/SubjectForm";
import SubjectTable from "../../components/skills/SubjectTable";
import SuccessModal from "../../components/SuccessModal";
import { getSubjects, createSubject, deleteSubject } from "../../services/skillService";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const res = await getSubjects();
      setSubjects(res.data);
    } catch (err) {
      console.error("Failed to load subjects", err);
    }
  };

  const saveSubject = async (data) => {
    await createSubject(data);
    setShowSuccess(true);
    loadSubjects();
  };

  const removeSubject = async (id) => {
    await deleteSubject(id);
    loadSubjects();
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <SkillSidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">Subjects</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage your learning subjects</p>
        </div>

        <SubjectForm onSubmit={saveSubject} />

        <div className="mt-6">
          <SubjectTable subjects={subjects} onDelete={removeSubject} />
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Subject Saved!"
        description="Your subject has been saved successfully."
      />
    </div>
  );
}