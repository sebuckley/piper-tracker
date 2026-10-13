import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useAppStore } from "../store/useAppStore";

export default function Login() {
  const { login, error, user, init } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loadUserFromKV = useAppStore(state => state.loadUserFromKV);
  const loadFromKV = useAppStore(state => state.loadFromKV);
  const activeChild = useAppStore(state => state.activeChild);

  // Initialise Firebase Auth
  useEffect(() => {
    init();
  }, []);

  // When user logs in → load user profile + children from KV
  useEffect(() => {
    if (!user) return;

    const uid = user.uid;

    // Load user profile + children + activeChild
    loadUserFromKV(uid);
  }, [user]);

  // When activeChild changes → load tracker state for that child
  useEffect(() => {
    if (activeChild) {
      loadFromKV(activeChild);
    }
  }, [activeChild]);

  if (user) {
    return <div className="p-4">You are logged in.</div>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card p-4 shadow-sm">
        <h3 className="mb-3">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <input
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          onClick={() => login(email, password)}
        >
          Login
        </button>
      </div>
    </div>
  );
}
