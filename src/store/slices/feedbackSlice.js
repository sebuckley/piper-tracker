export const createFeedbackSlice = (set, get) => ({
  sportsFeedback: [],   // stores full sessions

  // ⭐ Add a full session feedback entry
addFeedbackSession: (session) => {
  const childId = get().activeChild;
  if (!childId) return;

  const user = get().user;
  const deviceId = get().deviceId;

  // ⭐ Calculate stars: detailed sessions derive them from the score,
  // simple sessions use the manually chosen value
  const mode = session.mode === "simple" ? "simple" : "detailed";
  const score = mode === "simple" ? null : Number(session.score ?? 0);
  let starsAwarded = 0;

  if (mode === "simple") {
    starsAwarded = Math.max(0, Number(session.starsAwarded) || 0);
  } else if (score >= 10) starsAwarded = 3;
  else if (score >= 9) starsAwarded = 2;
  else if (score >= 8) starsAwarded = 1;

  // ⭐ Build new session object
  const newSession = {
    id: crypto.randomUUID(),
    sportId: session.sportId,
    sportName: session.sportName || "",
    mode,
    date: session.date || Date.now(),
    notes: mode === "simple" ? (session.notes || "") : "",

    entries: (session.entries || []).map(e => ({
      ...e,
      id: crypto.randomUUID()
    })),

    overall: {
      effort: session.overall?.effort || "",
      listening: session.overall?.listening || "",
      behaviour: session.overall?.behaviour || "",
      summary: session.overall?.summary || ""
    },

    score,
    starsAwarded,

    addedBy: user?.email ?? "unknown",
    addedAt: Date.now(),
    addedDeviceId: deviceId
  };

  // ⭐ Save session
  set(state => ({
    sportsFeedback: [...state.sportsFeedback, newSession]
  }));


  // ⭐ Add stars to global behaviour log
  if (starsAwarded > 0) {
    const sportLabel = session.sportName || session.sportId;
    get().addBehaviourLog(
      `${sportLabel} feedback`,
      mode === "simple"
        ? `${starsAwarded} star(s) awarded in ${sportLabel}.  See session feedback for full details`
        : `You achieved a score of ${score}/10 performance with ${starsAwarded} star(s) awarded in ${sportLabel}.  See session feedback for full details`,
      starsAwarded,
      newSession.date
    );
  }

  // ⭐ Save to KV
  get().saveToKV(childId);
},


  // ⭐ Update a full session
  updateFeedbackSession: (sessionId, updates) => {
    const childId = get().activeChild;
    if (!childId) return;

    const user = get().user;
    const deviceId = get().deviceId;

    set(state => ({
      sportsFeedback: state.sportsFeedback.map(s =>
        s.id === sessionId
          ? {
              ...s,
              ...updates,
              updatedBy: user?.email ?? "unknown",
              updatedAt: Date.now(),
              updatedDeviceId: deviceId
            }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  // ⭐ Delete a full session
  removeFeedbackSession: (sessionId) => {
    const childId = get().activeChild;
    if (!childId) return;

    const user = get().user;
    const deviceId = get().deviceId;

    const session = get().sportsFeedback.find(s => s.id === sessionId);

    if (session) {
      const removalLog = {
        ...session,
        removedBy: user?.email ?? "unknown",
        removedAt: Date.now(),
        removedDeviceId: deviceId
      };
      // Optional: store removal logs
      // set({ feedbackRemovalLogs: [...get().feedbackRemovalLogs, removalLog] });
    }

    set(state => ({
      sportsFeedback: state.sportsFeedback.filter(s => s.id !== sessionId)
    }));

    get().saveToKV(childId);
  },

  // ⭐ Get all feedback sessions for a sport
  getFeedbackForSport: (sportId) =>
    get().sportsFeedback.filter(s => s.sportId === sportId)
});
