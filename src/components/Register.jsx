import { useState } from "react";
import { registerLocalFamily } from "../utils/registration";

export default function Register({ onBack, onRegistered }) {
  const [values, setValues] = useState({
    firstName: "", lastName: "", familyName: "", email: "", password: "", confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = event => {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
  };

  const submit = async event => {
    event.preventDefault();
    if (busy) return;
    const firstName = values.firstName.trim();
    const lastName = values.lastName.trim();
    const familyName = values.familyName.trim();
    const email = values.email.trim();
    if (!firstName || !lastName || !familyName || !email) {
      setError("Enter your name, family name and email.");
      return;
    }
    if (values.password.length < 6) {
      setError("Your password must be at least 6 characters.");
      return;
    }
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await registerLocalFamily({ firstName, lastName, familyName, email, password: values.password });
      onRegistered(email);
    } catch (err) {
      console.error("[Registration] Local registration failed", err.code || err.message);
      setError(err.message || "Registration failed. Check that the local Firebase emulators are running, then try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "480px" }}>
      <div className="card p-4 shadow-sm text-start">
        <h3 className="mb-3" style={{ color: "#b300ff" }}>Create a family</h3>
        <div className="alert alert-warning">Local test only: this creates an account and family in the Firebase emulators, not the live system.</div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <form onSubmit={submit}>
          {[
            { name: "firstName", label: "First name", autoComplete: "given-name" },
            { name: "lastName", label: "Last name", autoComplete: "family-name" },
            { name: "familyName", label: "Family name", autoComplete: "off" },
            { name: "email", label: "Email", type: "email", autoComplete: "email" },
            { name: "password", label: "Password", type: "password", autoComplete: "new-password", minLength: 6 },
            { name: "confirmPassword", label: "Confirm password", type: "password", autoComplete: "new-password", minLength: 6 }
          ].map(field => (
            <div className="mb-3" key={field.name}>
              <label className="form-label fw-bold" htmlFor={`register-${field.name}`}>{field.label}</label>
              <input
                className="form-control"
                id={`register-${field.name}`}
                name={field.name}
                type={field.type || "text"}
                autoComplete={field.autoComplete}
                minLength={field.minLength}
                required
                value={values[field.name]}
                onChange={update}
                disabled={busy}
              />
            </div>
          ))}
          <button type="submit" className="btn w-100" style={{ backgroundColor: "#b300ff", color: "white", fontWeight: 600, borderRadius: "10px" }} disabled={busy}>
            {busy ? "Creating family…" : "Create account and family"}
          </button>
          <button type="button" className="btn app-btn-secondary w-100 mt-2" onClick={onBack} disabled={busy}>Back to login</button>
        </form>
      </div>
    </div>
  );
}
