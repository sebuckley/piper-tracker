import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function Login() {
  // Unified auth slice
  const login = useAppStore(s => s.login);
  const error = useAppStore(s => s.authError);
  const user = useAppStore(s => s.user);
  const initAuth = useAppStore(s => s.initAuth);

  // Unified device slice
  const initDevice = useAppStore(s => s.initDevice);
  const refreshDeviceRecord = useAppStore(s => s.refreshDeviceRecord);

  // Unified user + family + children slices
  const loadUserIdentity = useAppStore(s => s.loadUserIdentity);
  const loadFamilyGroup = useAppStore(s => s.loadFamilyGroup);
  const loadChildrenFromFamilyGroup = useAppStore(s => s.loadChildrenFromFamilyGroup);
  const loadDevicesFromFamilyGroup = useAppStore(s => s.loadDevicesFromFamilyGroup);
  const loadInvites = useAppStore(s => s.loadInvites);

  // Unified KV slice
  const loadFromKV = useAppStore(s => s.loadFromKV);
  const activeChild = useAppStore(s => s.activeChild);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ---------------------------------------------------------
  // INIT DEVICE + AUTH LISTENER
  // ---------------------------------------------------------
  useEffect(() => {
    initDevice();
    initAuth();
  }, []);

  // ---------------------------------------------------------
  // LOGIN SIDE EFFECTS (Firestore + KV)
  // ---------------------------------------------------------
  useEffect(() => {
    if (!user) return;

    const uid = user.uid;

    (async () => {
      // 1. Load user identity (Firestore)
      await loadUserIdentity(uid);

      // 2. Load family group (Firestore)
      await loadFamilyGroup(uid);

      // 3. Load children (Firestore)
      await loadChildrenFromFamilyGroup();

      // 4. Load devices (Firestore)
      await loadDevicesFromFamilyGroup();

      // 5. Load invites (Firestore)
      await loadInvites(uid);

      // 6. Refresh device record
      await refreshDeviceRecord(uid);

      // 7. Load KV tracker state (if active child exists)
      const childId = useAppStore.getState().activeChild;
      if (childId) {
        await loadFromKV(childId);
      }
    })();
  }, [user]);

  // ---------------------------------------------------------
  // LOAD TRACKER STATE WHEN activeChild CHANGES
  // ---------------------------------------------------------
  useEffect(() => {
    if (activeChild) {
      loadFromKV(activeChild);
    }
  }, [activeChild]);

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
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
