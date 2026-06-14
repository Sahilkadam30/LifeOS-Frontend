import { useEffect, useState } from "react";
import SkillSidebar from "../../components/skills/SkillSidebar";
import StudySessionForm from "../../components/skills/StudySessionForm";
import StudySessionTable from "../../components/skills/StudySessionTable";
import SuccessModal from "../../components/SuccessModal";
import {
  getStudySessions,
  createStudySession,
  deleteStudySession,
} from "../../services/skillService";

export default function StudySessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const res = await getStudySessions();
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to load sessions", err);
    }
  };

  const saveSession = async (data) => {
    await createStudySession(data);
    setShowSuccess(true);
    loadSessions();
  };

  const removeSession = async (id) => {
    await deleteStudySession(id);
    loadSessions();
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <SkillSidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">Study Sessions</h1>
          <p className="text-sm text-[#64748B] mt-1">Log and review your study sessions</p>
        </div>

        <StudySessionForm onSubmit={saveSession} />

        <div className="mt-6">
          <StudySessionTable sessions={sessions} onDelete={removeSession} />
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Session Logged!"
        description="Your study session has been logged successfully."
      />
    </div>
  );
}