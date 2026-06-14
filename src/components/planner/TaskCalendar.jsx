import { useState, useCallback } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const localizer = momentLocalizer(moment);

const PRIORITY_COLORS = {
  HIGH:   { bg: "#EF4444", dot: "#FEE2E2", label: "High" },
  MEDIUM: { bg: "#F59E0B", dot: "#FEF3C7", label: "Medium" },
  LOW:    { bg: "#16A34A", dot: "#DCFCE7", label: "Low" },
};

const VIEW_OPTIONS = [
  { key: Views.MONTH,  label: "Month"  },
  { key: Views.WEEK,   label: "Week"   },
  { key: Views.DAY,    label: "Day"    },
  { key: Views.AGENDA, label: "Agenda" },
];

/* ── Custom Toolbar ─────────────────────────────────────────── */
function CustomToolbar({ date, view, onNavigate, onView, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 20,
        padding: "14px 20px",
        background: "#F8FAFC",
        borderRadius: 14,
        border: "1px solid #E2E8F0",
      }}
    >
      {/* Left: nav controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          type="button"
          onClick={() => onNavigate("TODAY")}
          style={navBtn("#2563EB", "#fff")}
        >
          Today
        </button>

        <button
          type="button"
          onClick={() => onNavigate("PREV")}
          style={iconBtn()}
          title="Previous"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          onClick={() => onNavigate("NEXT")}
          style={iconBtn()}
          title="Next"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Centre: current label */}
      <span
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#1E293B",
          flex: 1,
          textAlign: "center",
          minWidth: 140,
        }}
      >
        {label}
      </span>

      {/* Right: view switcher */}
      <div style={{ display: "flex", gap: 4 }}>
        {VIEW_OPTIONS.map(({ key, label: lbl }) => (
          <button
            key={key}
            type="button"
            onClick={() => onView(key)}
            style={viewBtn(view === key)}
          >
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Style helpers (plain JS objects — immune to Tailwind Preflight) ── */
function navBtn(bg, color) {
  return {
    cursor: "pointer",
    background: bg,
    color,
    border: "none",
    borderRadius: 8,
    padding: "7px 16px",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "inherit",
    lineHeight: 1,
    transition: "opacity .15s",
  };
}

function iconBtn() {
  return {
    cursor: "pointer",
    background: "#fff",
    color: "#475569",
    border: "1px solid #E2E8F0",
    borderRadius: 8,
    width: 34,
    height: 34,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontFamily: "inherit",
    lineHeight: 1,
    transition: "background .15s",
  };
}

function viewBtn(active) {
  return {
    cursor: "pointer",
    background: active ? "#1E293B" : "#fff",
    color: active ? "#fff" : "#475569",
    border: "1px solid " + (active ? "#1E293B" : "#E2E8F0"),
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    fontFamily: "inherit",
    lineHeight: 1,
    transition: "all .15s",
  };
}

/* ── Main Component ─────────────────────────────────────────── */
export default function TaskCalendar({ tasks = [] }) {
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());

  const events = tasks
    .filter((t) => t.startDate)
    .map((task) => ({
      id:       task.id,
      title:    task.title,
      start:    new Date(`${task.startDate}T${task.startTime || "09:00"}`),
      end:      new Date(`${task.dueDate || task.startDate}T${task.endTime || "10:00"}`),
      allDay:   false,
      resource: task.priority,
    }));

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: PRIORITY_COLORS[event.resource]?.bg || "#2563EB",
      borderRadius: 6,
      border: "none",
      color: "#fff",
      fontSize: 12,
      padding: "2px 8px",
      fontWeight: 600,
    },
  });

  const components = useCallback(
    () => ({
      toolbar: (props) => (
        <CustomToolbar
          {...props}
          onNavigate={(action) => {
            let next = new Date(currentDate);
            if (action === "TODAY") {
              next = new Date();
            } else if (action === "PREV") {
              if (currentView === Views.MONTH)  next.setMonth(next.getMonth() - 1);
              else if (currentView === Views.WEEK) next.setDate(next.getDate() - 7);
              else if (currentView === Views.DAY)  next.setDate(next.getDate() - 1);
              else next.setDate(next.getDate() - 7); // agenda
            } else if (action === "NEXT") {
              if (currentView === Views.MONTH)  next.setMonth(next.getMonth() + 1);
              else if (currentView === Views.WEEK) next.setDate(next.getDate() + 7);
              else if (currentView === Views.DAY)  next.setDate(next.getDate() + 1);
              else next.setDate(next.getDate() + 7);
            }
            setCurrentDate(next);
            props.onNavigate(action);
          }}
          onView={(v) => {
            setCurrentView(v);
            props.onView(v);
          }}
        />
      ),
    }),
    [currentDate, currentView]
  );

  return (
    <div style={{ fontFamily: "'Inter','Manrope',sans-serif" }}>
      {/* Priority legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
        {Object.entries(PRIORITY_COLORS).map(([key, { bg, label }]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748B" }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: bg }} />
            {label}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div style={{ height: 580 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          view={currentView}
          onNavigate={setCurrentDate}
          onView={setCurrentView}
          eventPropGetter={eventStyleGetter}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          components={components()}
          style={{ fontFamily: "inherit" }}
        />
      </div>
    </div>
  );
}