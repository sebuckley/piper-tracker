import { useAddedByName } from "../../utils/useAddedByName";

export default function TransactionViewer({ transaction, onClose }) {
  const resolveName = useAddedByName();
  if (!transaction) return null;

  return (
    <div
      className="p-3 mt-3"
      style={{
        background: "#fafafa",
        borderRadius: "12px",
        border: "1px solid #e6e6e6"
      }}
    >
      <h4 className="h6 mb-2" style={{ fontWeight: 600 }}>
        Transaction Details
      </h4>

      <div className="small mb-1">
        <strong>Type:</strong> {transaction.type}
      </div>

      <div className="small mb-1">
        <strong>Amount:</strong> €{transaction.amount}
      </div>

      <div className="small mb-1">
        <strong>Reason:</strong> {transaction.reason}
      </div>

      <div className="small mb-1">
        <strong>Balance After:</strong> €{transaction.balanceAfter}
      </div>

      <div className="small mb-1">
        <strong>Added By:</strong> {resolveName(transaction.addedBy)}
      </div>

      <div className="small mb-1">
        <strong>Added At:</strong>{" "}
        {new Date(transaction.addedAt).toLocaleString()}
      </div>

      <button
        className="btn btn-light btn-sm mt-2"
        style={{
          borderRadius: "10px",
          border: "1px solid #dcdcdc"
        }}
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}
