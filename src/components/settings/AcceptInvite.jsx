import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";

export default function AcceptInviteScreen({ user }) {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    async function run() {
      const ok = await useAppStore.getState().acceptInvite(user.uid, user.email);
      setAccepted(ok);
    }
    run();
  }, [user]);

  if (!accepted) {
    return null; // no invite → skip screen
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card p-4 shadow-sm text-center">
        <h3 className="mb-3">Welcome to the Family Group</h3>
        <p>Your account has been linked successfully.</p>
        <p>You now have access to shared children and devices.</p>
      </div>
    </div>
  );
}
