export default function SearchListItem({ label, source, onAdd }) {
  return (
    <div
      className="d-flex justify-content-between align-items-center mb-2 p-2"
      style={{
        borderRadius: "12px",
        border: "1px solid #e6e6e6",
        backgroundColor: "#fafafa"
      }}
    >
      <span>
        {label}
        {source && (
          <span style={{ color: "#b300ff" }}> ({source})</span>
        )}
      </span>

      <button
        className="btn btn-sm"
        style={{
          backgroundColor: "#b300ff",
          color: "white",
          fontWeight: 600,
          borderRadius: "10px",
          padding: "4px 10px"
        }}
        onClick={onAdd}
      >
        Add
      </button>
    </div>
  );
}
