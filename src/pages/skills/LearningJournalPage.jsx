import { useEffect, useState } from "react";
import SkillSidebar from "../../components/skills/SkillSidebar";
import LearningJournalForm from "../../components/skills/LearningJournalForm";
import JournalList from "../../components/skills/JournalList";
import SuccessModal from "../../components/SuccessModal";
import { getJournals, createJournal, deleteJournal } from "../../services/skillService";

export default function LearningJournalPage() {
  const [journals, setJournals] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = async () => {
    try {
      const res = await getJournals();
      setJournals(res.data);
    } catch (err) {
      console.error("Failed to load journals", err);
    }
  };

  const saveJournal = async (data) => {
    await createJournal(data);
    setShowSuccess(true);
    loadJournals();
  };

  const removeJournal = async (id) => {
    await deleteJournal(id);
    loadJournals();
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <SkillSidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">Learning Journal</h1>
          <p className="text-sm text-[#64748B] mt-1">Record daily learning reflections</p>
        </div>

        <LearningJournalForm onSubmit={saveJournal} />

        <div className="mt-6">
          <JournalList journals={journals} onDelete={removeJournal} />
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Journal Saved!"
        description="Your learning journal entry has been saved successfully."
      />
    </div>
  );
}