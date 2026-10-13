import { useState } from "react";
import { useAppStore } from "../../../store/useAppStore";

export default function SessionForm({ sport, editingSession, close }) {
  const { addClassSession, updateClassSession } = useAppStore();

  const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const MINUTES = ["00","05","10","15","20","25","30","35","40","45","50","55"];
  const STATUS_OPTIONS = ["live", "historic", "cancelled"];

  const [day, setDay] = useState(editingSession?.day || "");
  const [hour, setHour] = useState(editingSession ? editingSession.time.split(":")[0] : "");
  const [minute, setMinute] = useState(editingSession ? editingSession.time.split(":")[1] : "");
  const [categories, setCategories] = useState(editingSession?.categories || []);
  const [clubId, setClubId] = useState(editingSession?.clubId || "");
  const [status, setStatus] = useState(editingSession?.status || "live");

  const [isFuture, setIsFuture] = useState(Boolean(editingSession?.startDate));
  const [startDate, setStartDate] = useState(editingSession?.startDate || "");

  const toggleCategory = id => {
    setCategories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const save = () => {
    const time = `${hour}:${minute}`;

    const payload = {
      day,
      time,
      categories,
      clubId,
      status,
      startDate: isFuture ? startDate : null
    };

    if (editingSession) {
      updateClassSession(sport.id, editingSession.id, payload);
    } else {
      addClassSession(
        sport.id,
        day,
        time,
        categories,
        clubId,
        status,
        isFuture ? startDate : null
      );
    }

    close();
  };

  return (
    <div
      className="p-3 mb-4"
      style={{
        borderRadius: "16px",
        border: "1px solid #e6e6e6",
        backgroundColor: "#ffffff"
      }}
    >
      <label className="form-label" style={{ color: "#1f2a44", fontWeight: 600 }}>
        {editingSession ? "Edit Session" : "New Session"}
      </label>

      {/* Day */}
      <select
        className="form-control mb-3"
        value={day}
        onChange={e => setDay(e.target.value)}
        style={{ borderRadius: "12px" }}
      >
        <option value="">Select Day</option>
        {DAYS.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {/* Hour */}
      <select
        className="form-control mb-3"
        value={hour}
        onChange={e => setHour(e.target.value)}
        style={{ borderRadius: "12px" }}
      >
        <option value="">Hour</option>
        {HOURS.map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>

      {/* Minute */}
      <select
        className="form-control mb-3"
        value={minute}
        onChange={e => setMinute(e.target.value)}
        style={{ borderRadius: "12px" }}
      >
        <option value="">Minute</option>
        {MINUTES.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {/* Future toggle */}
      <select
        className="form-control mb-3"
        value={isFuture ? "future" : "now"}
        onChange={e => {
          const val = e.target.value;
          setIsFuture(val === "future");
          if (val === "now") setStartDate("");
        }}
        style={{ borderRadius: "12px" }}
      >
        <option value="now">Now</option>
        <option value="future">Future</option>
      </select>

      {/* Start date */}
      {isFuture && (
        <input
          type="date"
          className="form-control mb-3"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          style={{ borderRadius: "12px" }}
        />
      )}

      {/* Club */}
      <select
        className="form-control mb-3"
        value={clubId}
        onChange={e => setClubId(e.target.value)}
        style={{ borderRadius: "12px" }}
      >
        <option value="">Select Club</option>
        {sport.clubs?.filter(c => !c.hidden).map(club => (
          <option key={club.id} value={club.id}>
            {club.name}
          </option>
        ))}
      </select>

      {/* Status */}
      <select
        className="form-control mb-3"
        value={status}
        onChange={e => setStatus(e.target.value)}
        style={{ borderRadius: "12px" }}
      >
        {STATUS_OPTIONS.map(s => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      {/* Categories */}
      <label className="form-label" style={{ color: "#1f2a44", fontWeight: 600 }}>
        Categories
      </label>

      <div className="mb-3 d-flex flex-wrap gap-2">
        {sport.categories.map(cat => {
          const active = categories.includes(cat.id);
          return (
            <div
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: active ? "2px solid #b300ff" : "1px solid #dcdcdc",
                backgroundColor: active ? "#b300ff10" : "#ffffff",
                color: active ? "#b300ff" : "#1f2a44",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              {cat.name}
            </div>
          );
        })}
      </div>

      <div className="d-flex gap-2">
        <button
          className="btn"
          style={{
            backgroundColor: "#b300ff",
            color: "white",
            fontWeight: 600,
            borderRadius: "12px"
          }}
          onClick={save}
        >
          Save
        </button>

        <button
          className="btn btn-light"
          style={{
            borderRadius: "12px",
            border: "1px solid #dcdcdc",
            fontWeight: 600
          }}
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
