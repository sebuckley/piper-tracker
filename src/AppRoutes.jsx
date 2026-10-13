import { HashRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import AddBehaviour from "./components/AddBehaviour";
import AddAchievement from "./components/AddAchievement";
import SportsClasses from "./components/SportsClasses";
import Rewards from "./components/Rewards";
import Settings from "./components/Settings";
import Profile from "./components/Profile";

import AddSport from "./components/sports/AddSport";
import SportsDetails from "./components/sports/SportsDetails";
import SportsManage from "./components/sports/SportsManage";
import SportsRoutines from "./components/sports/SportsRoutines";
import SportsApparatus from "./components/sports/SportsApparatus";
import SessionFeedback from "./components/sports/SessionFeedback";
import SessionHistory from "./components/sports/SessionHistory";

export default function AppRoutes() {
  return (
    <HashRouter>
      <Routes>

        {/* MAIN APP PAGES */}
        <Route path="/" element={<Dashboard />} />
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
        <Route path="/sports/:id/routines" element={<SportsRoutines />} />
        <Route path="/sports/:id/apparatus" element={<SportsApparatus />} />
        <Route path="/sports/:id/feedback" element={<SessionFeedback />} />
        <Route path="/sports/:id/history" element={<SessionHistory />} />

      </Routes>
    </HashRouter>
  );
}
