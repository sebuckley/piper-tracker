import { useState } from "react";
import ClubForm from "./ClubForm";
import { useAppStore } from "../../../store/useAppStore";

export default function ClubsSection({ sport }) {
  const { hideClub } = useAppStore();
  const [editingClub, setEditingClub] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const SOCIAL_ICONS = {
    Facebook: (
      <svg width="18" height="18" fill="#b300ff">
        <path d="M12 2h3V0h-3c-2.8 0-5 2.2-5 5v3H5v3h2v7h3v-7h3l1-3h-4V5c0-1 .8-2 2-2z"/>
      </svg>
    ),
    Instagram: (
      <svg width="18" height="18" fill="#b300ff">
        <path d="M9 2c2.4 0 2.7 0 3.6.1.9.1 1.4.3 1.7.5.4.2.7.5.9.9.2.3.4.8.5 1.7.1.9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1.9-.3 1.4-.5 1.7-.2.4-.5.7-.9.9-.3.2-.8.4-1.7.5-.9.1-1.2.1-3.6.1s-2.7 0-3.6-.1c-.9-.1-1.4-.3-1.7-.5-.4-.2-.7-.5-.9-.9-.2-.3-.4-.8-.5-1.7C2 11.7 2 11.4 2 9s0-2.7.1-3.6c.1-.9.3-1.4.5-1.7.2-.4.5-.7.9-.9.3-.2.8-.4 1.7-.5C6.3 2 6.6 2 9 2zm0 2C6.6 4 6.4 4 5.7 4.1c-.7.1-1 .2-1.2.3-.3.1-.5.3-.6.6-.1.2-.2.5-.3 1.2C4 6.4 4 6.6 4 9s0 2.6.1 3.3c.1.7.2 1 .3 1.2.1.3.3.5.6.6.2.1.5.2 1.2.3C6.4 14 6.6 14 9 14s2.6 0 3.3-.1c.7-.1 1-.2 1.2-.3.3-.1.5-.3.6-.6.1-.2.2-.5.3-1.2.1-.7.1-.9.1-3.3s0-2.6-.1-3.3c-.1-.7-.2-1-.3-1.2-.1-.3-.3-.5-.6-.6-.2-.1-.5-.2-1.2-.3C11.6 4 11.4 4 9 4zm0 2.5A2.5 2.5 0 1 1 9 11a2.5 2.5 0 0 1 0-5zm3-1.8a.7.7 0 1 1-1.4 0 .7.7 0 0 1 1.4 0z"/>
      </svg>
    ),
    "Twitter / X": (
      <svg width="18" height="18" fill="#b300ff">
        <path d="M14 2l-4 5 5 7h-2l-4-5-4 5H3l5-7-4-5h2l3 4 3-4z"/>
      </svg>
    ),
    TikTok: (
      <svg width="18" height="18" fill="#b300ff">
        <path d="M12 2c.3 1.3 1.2 2.3 2.5 2.7v2c-1.1-.1-2.1-.5-3-1v5.3c0 2.4-2 4-4.2 4-2.3 0-4.3-1.8-4.3-4s2-4 4.3-4h.2v2h-.2c-1.2 0-2.2.9-2.2 2s1 2 2.2 2c1.1 0 2.2-.8 2.2-2V2h2.3z"/>
      </svg>
    ),
    YouTube: (
      <svg width="18" height="18" fill="#b300ff">
        <path d="M15 4c1 .2 1.7 1 1.8 2.1.2 1.7.2 3.5 0 5.2-.1 1.1-.8 1.9-1.8 2.1C13.3 14 9 14 9 14s-4.3 0-6-.6C2 13.2 1.3 12.4 1.2 11.3c-.2-1.7-.2-3.5 0-5.2C1.3 5 2 4.2 3 4 4.7 3.4 9 3.4 9 3.4s4.3 0 6 .6zM7 10.5V6.5l4 2-4 2z"/>
      </svg>
    ),
    Snapchat: (
      <svg width="18" height="18" fill="#b300ff">
        <path d="M9 2c2 0 3.5 1.6 3.5 3.5v1c0 .8.4 1.5 1 2 .6.5 1.3.8 2 .8v2c-.7 0-1.4.3-2 .8-.6.5-1 1.2-1 2v1c0 2-1.5 3.5-3.5 3.5S5.5 17 5.5 15v-1c0-.8-.4-1.5-1-2-.6-.5-1.3-.8-2-.8V9c.7 0 1.4-.3 2-.8.6-.5 1-1.2 1-2v-1C5.5 3.6 7 2 9 2z"/>
      </svg>
    ),
    LinkedIn: (
      <svg width="18" height="18" fill="#b300ff">
        <path d="M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 5h4v9H4V8zm6 0h4v1.5c.6-.9 1.7-1.5 3-1.5 2.5 0 4 1.7 4 4.6V17h-4v-4.2c0-1.3-.5-2.1-1.6-2.1-1 0-1.4.7-1.4 2.1V17h-4V8z"/>
      </svg>
    )
  };

  const SOCIAL_URLS = {
    Facebook: handle => `https://facebook.com/${handle.replace("@", "")}`,
    Instagram: handle => `https://instagram.com/${handle.replace("@", "")}`,
    "Twitter / X": handle => `https://twitter.com/${handle.replace("@", "")}`,
    TikTok: handle => `https://www.tiktok.com/@${handle.replace("@", "")}`,
    YouTube: handle => `https://youtube.com/${handle.replace("@", "")}`,
    Snapchat: handle => `https://www.snapchat.com/add/${handle.replace("@", "")}`,
    LinkedIn: handle => `https://www.linkedin.com/in/${handle.replace("@", "")}`
  };

  return (
    <div className="mt-4">
      <h3 className="h4" style={{ color: "#1f2a44", fontWeight: 600 }}>
        Clubs / Providers
      </h3>

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-sm"
          style={{ backgroundColor: "#b300ff", color: "white", borderRadius: "10px" }}
          onClick={() => {
            setEditingClub(null);
            setShowForm(true);
          }}
        >
          + Add Club
        </button>
      </div>

      {showForm && (
        <ClubForm
          sport={sport}
          editingClub={editingClub}
          close={() => {
            setShowForm(false);
            setEditingClub(null);
          }}
        />
      )}

      {sport.clubs?.filter(c => !c.hidden).length === 0 && (
        <div className="text-muted small">No clubs added yet.</div>
      )}

      {sport.clubs?.filter(c => !c.hidden).map(club => (
        <div
          key={club.id}
          className="p-3 mb-3"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff"
          }}
        >
          <div className="d-flex justify-content-between">
            <div>
              <strong style={{ color: "#b300ff", fontSize: "16px" }}>
                {club.name}
              </strong>

              <div className="small text-muted mt-2">
                {club.address && <div><strong>Address:</strong> {club.address}</div>}

                {club.email && (
                  <div>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${club.email}`} style={{ color: "#b300ff" }}>
                      {club.email}
                    </a>
                  </div>
                )}

                {club.website && (
                  <div>
                    <strong>Website:</strong>{" "}
                    <a
                      href={club.website.startsWith("http") ? club.website : `https://${club.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#b300ff" }}
                    >
                      {club.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Social Media */}
              {club.socials?.length > 0 && (
                <div className="d-flex gap-2 mt-3 flex-wrap align-items-center justify-content-center">
                  {club.socials.map((s, index) => {
                    const Icon = SOCIAL_ICONS[s.platform];
                    const url = SOCIAL_URLS[s.platform]?.(s.handle);

                    return (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 10px",
                          borderRadius: "12px",
                          border: "1px solid #b300ff",
                          backgroundColor: "#b300ff10",
                          color: "#b300ff",
                          fontWeight: 600,
                          textDecoration: "none"
                        }}
                      >
                        {Icon}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="d-flex gap-2 align-items-start">
              <button
                className="btn"
                style={{
                  borderRadius: "10px",
                  border: "1px solid #dcdcdc",
                  color: "#1f2a44"
                }}
                onClick={() => {
                  setEditingClub(club);
                  setShowForm(true);
                }}
              >
                Edit
              </button>

              <button
                className="btn btn-danger"
                style={{ borderRadius: "10px" }}
                onClick={() => hideClub(sport.id, club.id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
