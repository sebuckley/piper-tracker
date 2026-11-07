import { useEffect, useState } from "react";
import ClubForm from "./ClubForm";
import { useAppStore } from "../../../store/useAppStore";
import { API_BASE } from "../../../config/api";
import { formatAddress } from "../../../utils/formatAddress";

// Search the approved global clubs; if the club isn't there, show the add form.
export default function ClubSearchAdd({ sport, close }) {
  const addClub = useAppStore(s => s.addClub);

  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false); // true once results match the current term
  const [error, setError] = useState(false);

  const trimmed = term.trim();

  useEffect(() => {
    if (trimmed.length < 2) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/clubs?q=${encodeURIComponent(trimmed)}&sport=${encodeURIComponent(sport.name)}`
        );
        if (!res.ok) throw new Error("search failed");
        const data = await res.json();
        if (!cancelled) {
          setResults(data);
          setError(false);
          setSearched(true);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
          setError(true);
          setSearched(true);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, sport.name]);

  const alreadyAdded = name =>
    (sport.clubs || []).some(
      c => !c.hidden && c.name.trim().toLowerCase() === name.trim().toLowerCase()
    );

  const addGlobalClub = club => {
    addClub(
      sport.id,
      { ...club, sport: club.sport || sport.name },
      { fromGlobal: true }
    );
    close();
  };

  const showForm = trimmed.length >= 2 && searched && results.length === 0;

  return (
    <div>
      <div
        className="p-3 mb-3"
        style={{ borderRadius: "16px", border: "1px solid #e6e6e6", backgroundColor: "#ffffff" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label className="form-label m-0" style={{ color: "#1f2a44", fontWeight: 600 }}>
            Find a club
          </label>
          <button
            className="btn btn-light btn-sm"
            style={{ borderRadius: "10px", border: "1px solid #dcdcdc" }}
            onClick={close}
          >
            Cancel
          </button>
        </div>

        <input
          className="form-control"
          placeholder="Search clubs by name…"
          value={term}
          autoFocus
          onChange={e => {
            setTerm(e.target.value);
            setSearched(false);
          }}
          style={{ borderRadius: "12px" }}
        />

        <div className="text-muted small mt-2">
          Search clubs already added by other users. If yours isn't listed, you can add it
          below and it will be sent for review.
        </div>

        {error && (
          <div className="text-danger small mt-2">
            Couldn't search existing clubs right now. You can still add a new one.
          </div>
        )}

        {results.map(club => {
          const added = alreadyAdded(club.name);
          return (
            <div
              key={club.name}
              className="p-2 mt-2 d-flex justify-content-between align-items-center"
              style={{ borderRadius: "10px", border: "1px solid #e6e6e6", backgroundColor: "#fafafa" }}
            >
              <div style={{ textAlign: "left" }}>
                <strong>{club.name}</strong>
                {club.address && (
                  <div className="text-muted small">{formatAddress(club.address)}</div>
                )}
              </div>
              <button
                className="btn btn-sm"
                disabled={added}
                style={{
                  backgroundColor: "#b300ff",
                  color: "white",
                  fontWeight: 600,
                  borderRadius: "10px",
                  padding: "6px 14px"
                }}
                onClick={() => addGlobalClub(club)}
              >
                {added ? "Added" : "+ Add"}
              </button>
            </div>
          );
        })}

        {showForm && (
          <div className="text-muted small mt-2">
            No clubs found for "{trimmed}" — add it below.
          </div>
        )}
      </div>

      {showForm && <ClubForm sport={sport} editingClub={null} close={close} initialName={trimmed} />}
    </div>
  );
}
