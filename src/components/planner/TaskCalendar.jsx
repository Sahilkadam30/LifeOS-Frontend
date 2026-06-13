import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const priorityColors = {
  HIGH:   "#EF4444",
  MEDIUM: "#F59E0B",
  LOW:    "#16A34A",
};

export default function TaskCalendar({ tasks = [] }) {
  const events = tasks
    .filter((t) => t.startDate)
    .map((task) => ({
      id:       task.id,
      title:    `${task.title} (${task.priority})`,
      start:    new Date(`${task.startDate}T${task.startTime || "09:00"}`),
      end:      new Date(`${task.dueDate || task.startDate}T${task.endTime || "10:00"}`),
      allDay:   false,
      resource: task.priority,
    }));

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: priorityColors[event.resource] || "#2563EB",
      borderRadius: 6,
      border: "none",
      color: "#fff",
      fontSize: 12,
      padding: "2px 8px",
      fontWeight: 600,
    },
  });

  return (
    <div style={{ fontFamily: "'Inter','Manrope',sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1E293B", margin: 0 }}>📅 Calendar View</h2>
        {/* Legend */}
        <div style={{ display: "flex", gap: 12 }}>
          {[["🔴", "High", "#EF4444"], ["🟡", "Medium", "#F59E0B"], ["🟢", "Low", "#16A34A"]].map(([icon, label, color]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748B" }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 560 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventStyleGetter}
          views={["month", "week", "day", "agenda"]}
          style={{ fontFamily: "inherit" }}
        />
      </div>
    </div>
  );
}