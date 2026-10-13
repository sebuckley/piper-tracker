import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";

import { useAuthStore } from "./store/authStore";
import { useAppStore } from "./store/useAppStore";

import Login from "./components/Login";
import Profile from "./components/Profile";
import Header from "./components/Header";

import Dashboard from "./components/Dashboard";
import AddBehaviour from "./components/AddBehaviour";
import AddAchievement from "./components/AddAchievement";
import SportsClasses from "./components/SportsClasses";
import Rewards from "./components/Rewards";
import Settings from "./components/Settings";

import AddSport from "./components/sports/AddSport";
import SportsDetails from "./components/sports/SportsDetails";
import SportsManage from "./components/sports/SportsManage/SportsManage";
import SportsCategories from "./components/sports/SportsCategories";
import CategoryManage from "./components/sports/CategoryManage";
import RoutineManage from "./components/sports/RoutineManage";
import SessionFeedback from "./components/sports/SessionFeedback";
import SessionHistory from "./components/sports/SessionHistory";

export default function App() {
  const { user, loading, init } = useAuthStore();

  const activeChild = useAppStore(state => state.activeChild);
  const children = useAppStore(state => state.children);
  const child = children.find(c => c.id === activeChild);

  const loadUserFromKV = useAppStore(state => state.loadUserFromKV);
  const loadFromKV = useAppStore(state => state.loadFromKV);

  const [lastChild, setLastChild] = useState(null);

  // Auth init
  useEffect(() => {
    init();
  }, []);

  // Load user profile + children from KV
  useEffect(() => {
    if (!user) return;

    const hasLocalUser =
      useAppStore.getState().children.length > 0 ||
      useAppStore.getState().profile.uid;

    if (!hasLocalUser) {
      loadUserFromKV(user.uid);
    }
  }, [user]);

  // Load tracker state when activeChild changes
  useEffect(() => {
    if (!activeChild) return;

    if (activeChild !== lastChild) {
      loadFromKV(activeChild);
      setLastChild(activeChild);
    }
  }, [activeChild, lastChild, loadFromKV]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <Login />;

  return (
    <HashRouter>
      <Header child={child} />

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          padding: "20px"
        }}
      >
        {/* ⭐ Navigation Buttons converted to real links */}
        <nav className="d-flex gap-3 justify-content-center mb-4 flex-wrap">
          {[
            ["/", "Dashboard"],
            ["/behaviour", "Behaviour"],
            ["/achievement", "Achievements"],
            ["/sports", "Sports & Activities"],
            ["/rewards", "Rewards"],
            ["/settings", "Settings"],
            ["/profile", "Profile"]
          ].map(([path, label]) => (
            <Link
              key={path}
              to={path}
              className="btn"
              style={{
                backgroundColor: "#ffffff",
                color: "#1f2a44",
                borderRadius: "12px",
                padding: "10px 20px",
                fontWeight: "600",
                border: "1px solid #dcdcdc",
                transition: "0.2s",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div
          className="container"
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "24px"
          }}
        >
          {/* ⭐ All routes now handled here */}
          <Routes>
            {/* MAIN APP */}
            <Route path="/" element={<Dashboard child={child} />} />
            <Route path="/behaviour" element={<AddBehaviour />} />
            <Route path="/achievement" element={<AddAchievement />} />
            <Route path="/sports" element={<SportsClasses />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />

            {/* SPORTS MODULE */}
            <Route path="/sports/add" element={<AddSport />} />
            <Route path="/sports/:id" element={<SportsDetails />} />
            <Route path="/sports/:id/manage" element={<SportsManage />} />

            {/* ⭐ NEW UNIVERSAL CATEGORY SYSTEM */}
            <Route path="/sports/:id/categories" element={<SportsCategories />} />
            <Route path="/sports/:sportId/categories/:categoryId" element={<CategoryManage />} />
            <Route
              path="/sports/:sportId/categories/:categoryId/skills"
              element={<RoutineManage />}
            />
            <Route
              path="/sports/:sportId/categories/:categoryId/routines/:routineId"
              element={<RoutineManage />}
            />

            {/* FEEDBACK */}
            <Route path="/sports/:id/feedback" element={<SessionFeedback />} />
            <Route path="/sports/:id/history" element={<SessionHistory />} />
          </Routes>

        </div>
      </div>
    </HashRouter>
  );
}
