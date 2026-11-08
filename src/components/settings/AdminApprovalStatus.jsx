import { Link } from "react-router-dom";

export default function AdminApprovalStatus({ environment, adminLink, error, loading, retry }) {
  return (
    <>
      <div className={`alert ${environment === "production" ? "alert-warning" : "alert-info"}`} role="status">
        Approval environment: <strong>{environment === "production" ? "Production" : environment === "development" ? "Development" : "Invalid"}</strong>
        {" · "}<Link to={adminLink}>Change environment</Link>
      </div>
      {loading && !error && <div role="status">Loading approvals…</div>}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error} {loading && <button type="button" className="btn btn-sm btn-outline-danger" onClick={retry}>Retry</button>}
        </div>
      )}
    </>
  );
}
