import { useState } from "react";
import EmojiPickerLib from "emoji-picker-react";

// Emoji chooser. Shows a searchable curated list (`suggestions`) first, with a
// "More icons" toggle that opens the full emoji library.
export default function EmojiPicker({ value, onChange, suggestions, resolve = e => e, searchFn }) {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [term, setTerm] = useState("");

  const results = searchFn ? searchFn(term) : suggestions;

  const pick = emoji => {
    onChange(emoji);
    setOpen(false);
    setShowAll(false);
    setTerm("");
  };

  return (
    <div className="mb-3">
      <button
        type="button"
        className="btn d-flex align-items-center gap-2"
        style={{ border: "1px solid #dcdcdc", borderRadius: "12px", background: "white" }}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ fontSize: "1.6rem" }}>{resolve(value)}</span>
        <span className="small" style={{ color: "#1f2a44", fontWeight: 600 }}>
          {open ? "Close" : "Choose icon"}
        </span>
      </button>

      {open && (
        <div
          className="mt-2 p-2"
          style={{ border: "1px solid #e6e6e6", borderRadius: "12px", background: "white" }}
        >
          {!showAll && (
            <>
              <input
                className="form-control mb-2"
                style={{ borderRadius: "10px" }}
                placeholder="Search icons…"
                value={term}
                autoFocus
                onChange={e => setTerm(e.target.value)}
              />

              <div style={{ maxHeight: "180px", overflowY: "auto", display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {results.map(({ emoji }) => (
                  <button
                    key={emoji}
                    type="button"
                    className="btn btn-light"
                    style={{
                      fontSize: "1.5rem",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      border: emoji === value ? "2px solid #b300ff" : "1px solid transparent"
                    }}
                    onClick={() => pick(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
                {results.length === 0 && (
                  <div className="text-muted small p-2">No suggested icons match "{term}".</div>
                )}
              </div>
            </>
          )}

          {showAll && (
            <EmojiPickerLib
              width="100%"
              height={360}
              lazyLoadEmojis
              onEmojiClick={data => pick(data.emoji)}
            />
          )}

          <button
            type="button"
            className="btn btn-link btn-sm mt-2 p-0"
            style={{ color: "#b300ff", fontWeight: 600, textDecoration: "none" }}
            onClick={() => setShowAll(s => !s)}
          >
            {showAll ? "← Back to suggestions" : "More icons…"}
          </button>
        </div>
      )}
    </div>
  );
}
