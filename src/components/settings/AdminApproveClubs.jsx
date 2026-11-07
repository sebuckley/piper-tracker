import { useEffect, useState } from "react";
import { API_BASE } from "../../config/api";
import { useNavigate, Link } from "react-router-dom";

export default function AdminApproveClubs() {
  const [pendingNew, setPendingNew] = useState([]);
  const [pendingUpdates, setPendingUpdates] = useState([]);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  // Load both new clubs + updates
  useEffect(() => {
    async function load() {
      const resNew = await fetch(`${API_BASE}/api/pending/clubs`);
      const resUpdates = await fetch(`${API_BASE}/api/pending/club-updates`);

      setPendingNew(await resNew.json());
      setPendingUpdates(await resUpdates.json());
    }
    load();
  }, []);

  // Approve NEW club
  const approveNew = async (item) => {
    await fetch(`${API_BASE}/api/approve/club`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ club: item.club })
    });

    await fetch(`${API_BASE}/api/pending/clubs/${item.id}`, {
      method: "DELETE"
    });

    setFeedback(`Approved new club "${item.club.name}"`);
    setPendingNew(pendingNew.filter(p => p.id !== item.id));
  };

  // Reject NEW club
  const rejectNew = async (item) => {
    await fetch(`${API_BASE}/api/pending/clubs/${item.id}`, {
      method: "DELETE"
    });

    setFeedback(`Rejected new club "${item.club.name}"`);
    setPendingNew(pendingNew.filter(p => p.id !== item.id));
  };

  // Approve UPDATE
  const approveUpdate = async (item) => {

    await fetch(`${API_BASE}/api/approve/club-update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clubName: item.clubName,
        updates: item.updates
      })
    });

    await fetch(`${API_BASE}/api/pending/club-updates/${item.id}`, {
      method: "DELETE"
    });

    setFeedback(`Approved update for club "${item.clubName}"`);
    setPendingUpdates(pendingUpdates.filter(p => p.id !== item.id));
  };

  // Reject UPDATE
  const rejectUpdate = async (item) => {
    await fetch(`${API_BASE}/api/pending/club-updates/${item.id}`, {
      method: "DELETE"
    });

    setFeedback(`Rejected update for club "${item.clubName}"`);
    setPendingUpdates(pendingUpdates.filter(p => p.id !== item.id));
  };

  // Social icons
  const SOCIAL_ICONS = {
    Facebook: <svg width="18" height="18" fill="#b300ff"><path d="M12 2h3V0h-3c-2.8 0-5 2.2-5 5v3H5v3h2v7h3v-7h3l1-3h-4V5c0-1 .8-2 2-2z"/></svg>,
    Instagram: <svg width="18" height="18" fill="#b300ff"><path d="M9 2c2.4 0 2.7 0 3.6.1..."/></svg>,
    "Twitter / X": <svg width="18" height="18" fill="#b300ff"><path d="M14 2l-4 5 5 7h-2l-4-5-4 5H3l5-7-4-5h2l3 4 3-4z"/></svg>,
    TikTok: <svg width="18" height="18" fill="#b300ff"><path d="M12 2c.3 1.3 1.2 2.3 2.5 2.7v2..."/></svg>,
    YouTube: <svg width="18" height="18" fill="#b300ff"><path d="M15 4c1 .2 1.7 1 1.8 2.1..."/></svg>,
    Snapchat: <svg width="18" height="18" fill="#b300ff"><path d="M9 2c2 0 3.5 1.6 3.5 3.5v1..."/></svg>,
    LinkedIn: <svg width="18" height="18" fill="#b300ff"><path d="M4 3a2 2 0 1 1 0 4..."/></svg>
  };

  const SOCIAL_URLS = {
    Facebook: h => `https://facebook.com/${h.replace("@", "")}`,
    Instagram: h => `https://instagram.com/${h.replace("@", "")}`,
    "Twitter / X": h => `https://twitter.com/${h.replace("@", "")}`,
    TikTok: h => `https://www.tiktok.com/@${h.replace("@", "")}`,
    YouTube: h => `https://youtube.com/${h.replace("@", "")}`,
    Snapchat: h => `https://www.snapchat.com/add/${h.replace("@", "")}`,
    LinkedIn: h => `https://www.linkedin.com/in/${h.replace("@", "")}`
  };

  const formatAddress = (address) => {
    if (!address) return "";
    const parts = [
      address.line1,
      address.line2,
      ...(address.extras || []),
      address.town,
      address.postcode
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="container mt-4">

      {/* ⭐ Breadcrumb */}
      <div className="mb-3">
        <nav style={{ fontWeight: 600, fontSize: "18px", textAlign: "left" }}>
          <Link to="/settings/admin" style={{ color: "#b300ff", textDecoration: "none" }}>
            Admin Panel
          </Link>
          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>
          <span style={{ color: "#1f2a44" }}>Approve Clubs</span>
        </nav>
      </div>

      {/* ⭐ NEW CLUBS */}
      <h2 className="h3 mb-4" style={{ color: "#b300ff", fontWeight: 700 }}>
        Pending New Clubs
      </h2>

      {pendingNew.length === 0 && (
        <div className="p-3" style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff",
          fontWeight: 600
        }}>
          No pending new clubs.
        </div>
      )}

      {pendingNew.map(item => {
        const club = item.club;

        console.log(item);

        return (
          <div key={item.id} className="p-3 mb-3" style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff"
          }}>
            <div className="d-flex gap-3">

              {/* ⭐ Club Logo */}
              {club.logo && (
                <img
                  src={club.logo}
                  alt="Club Logo"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "1px solid #e6e6e6"
                  }}
                />
              )}

              <div>
                <strong style={{ color: "#b300ff", fontSize: "18px" }}>
                  {club.name}
                </strong>

                <div className="mt-2" style={{ color: "#1f2a44" }}>
                  <strong>Address:</strong> {formatAddress(club.address)}<br />
                  {club.email && (
                    <>
                      <strong>Email:</strong>{" "}
                      <a href={`mailto:${club.email}`} style={{ color: "#b300ff" }}>
                        {club.email}
                      </a><br />
                    </>
                  )}
                  {club.website && (
                    <>
                      <strong>Website:</strong>{" "}
                      <a
                        href={club.website.startsWith("http") ? club.website : `https://${club.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#b300ff" }}
                      >
                        {club.website}
                      </a><br />
                    </>
                  )}

                  <strong>Sport:</strong> {item.sportName}<br />
                  <strong>Submitted by:</strong> {item.submittedBy}<br />
                  <strong>At:</strong> {new Date(item.submittedAt).toLocaleString()}
                </div>

                {/* ⭐ Social Media */}
                {club.socials?.length > 0 && (
                  <div className="d-flex gap-2 mt-3 flex-wrap">
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
            </div>

            {/* ⭐ Approve / Reject */}
            <div className="d-flex gap-2 mt-3">
              <button
                className="btn"
                style={{
                  backgroundColor: "#b300ff",
                  color: "white",
                  fontWeight: 600,
                  borderRadius: "12px"
                }}
                onClick={() => approveNew(item)}
              >
                Approve
              </button>

              <button
                className="btn btn-light"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #dcdcdc",
                  fontWeight: 600
                }}
                onClick={() => rejectNew(item)}
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}

      {/* ⭐ CLUB UPDATES */}
      <h2 className="h3 mt-5 mb-4" style={{ color: "#b300ff", fontWeight: 700 }}>
        Pending Club Updates
      </h2>

      {pendingUpdates.length === 0 && (
        <div className="p-3" style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff",
          fontWeight: 600
        }}>
          No pending club updates.
        </div>
      )}

      {pendingUpdates.map(item => (
       
        <div key={item.id} className="p-3 mb-3" style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff"
        }}>
           {console.log(item)}
          <strong style={{ color: "#b300ff", fontSize: "18px" }}>
            {item.clubName}
          </strong>

          <div className="mt-2" style={{ color: "#1f2a44" }}>
            <strong>Updated Fields:</strong>
            <pre style={{
              background: "#fafafa",
              padding: "10px",
              borderRadius: "12px",
              border: "1px solid #e6e6e6"
            }}>
              {JSON.stringify(item.updates, null, 2)}
            </pre>

            <strong>Submitted by:</strong> {item.submittedBy}<br />
            <strong>At:</strong> {new Date(item.submittedAt).toLocaleString()}
          </div>

          <div className="d-flex gap-2 mt-3">
            <button
              className="btn"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: 600,
                borderRadius: "12px"
              }}
              onClick={() => approveUpdate(item)}
            >
              Approve Update
            </button>

            <button
              className="btn btn-light"
              style={{
                borderRadius: "12px",
                border: "1px solid #dcdcdc",
                fontWeight: 600
              }}
              onClick={() => rejectUpdate(item)}
            >
              Reject Update
            </button>
          </div>
        </div>
      ))}

      {feedback && (
        <div className="p-3 mt-3" style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff",
          color: "#1f2a44",
          fontWeight: 600
        }}>
          {feedback}
        </div>
      )}
    </div>
  );
}
