import { useState } from "react";
import useAppStore from "../../../store/useAppStore";

export default function CreditEditor({ childId, onClose }) {
  const addCredit = useAppStore(state => state.addCredit);

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const save = () => {
    if (!amount) return;
    addCredit(childId, Number(amount), reason || "Pocket Money");
    onClose();
  };

  return (
    <div className="mt-3">
      <div className="small mb-1">Add Credit</div>

      <input
        type="number"
        className="form-control mb-2"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Reason (optional)"
        value={reason}
        onChange={e => setReason(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      <div className="d-flex gap-2">
        <button
          className="btn btn-sm"
          style={{
            backgroundColor: "#b300ff",
            color: "white",
            borderRadius: "10px"
          }}
          onClick={save}
        >
          Save
        </button>

        <button
          className="btn btn-light btn-sm"
          style={{
            borderRadius: "10px",
            border: "1px solid #dcdcdc"
          }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
