import { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import HoldScreen2 from "./components/reusable/HoldScreen2";
// import { FaUserLock } from "react-icons/fa";
// import { FaSpinner } from "react-icons/fa"

import { useAppStore } from "@/store/useAppStore";

import useScreenSize from "./utils/useScreenSize";

import Login from "./components/Login";
import Profile from "./components/Profile";
import Header from "./components/Header";
import NavigationTabs from "./components/navigation/Tabs";

import Dashboard from "./components/Dashboard";
import AddBehaviour from "./components/AddBehaviour";
import AddAchievement from "./components/AddAchievement";
import SportsClasses from "./components/SportsClasses";
import Rewards from "./components/Rewards";

import Settings from "./components/Settings";
import BehaviourSettings from "./components/settings/BehaviourSettings";
import AchievementSettings from "./components/settings/AchievementSettings";
import RewardsSettings from "./components/settings/RewardSettings";
import DeviceSettings from "./components/settings/DeviceManagement";
import FamilySettings from "./components/settings/FamilySettings";
import ChildManager from "./components/settings/ChildManager";
import BankAccountSettings from "./components/settings/BankAccountSettings";

import AdminPanel from "./components/settings/AdminPanel"
import DevSettings from "./components/settings/DevSettings";
import AdminApproveSports from "./components/settings/AdminApproveSports";
import AdminApproveClubs from "./components/settings/AdminApproveClubs";
import AdminApproveSkills from "./components/settings/AdminApproveSkills";
import AdminApproveRoutines from "./components/settings/AdminApproveRoutines";
import AdminApproveCategories from "./components/settings/AdminApproveCategories";
import AdminApproveRewards from "./components/settings/AdminApproveRewards";
import AdminTemplatesList from "./components/settings/AdminTemplatesList";
import AdminTemplateEditor from "./components/settings/AdminTemplateEditor"

import AddSport from "./components/sports/AddSport";
import SportsDetails from "./components/sports/SportsDetails";
import SportsManage from "./components/sports/SportsManage/SportsManage";
import SportsCategories from "./components/sports/SportsCategories";
import CategoryManage from "./components/sports/CategoryManage";
import ManageSkillsPage from "./components/sports/skills/SkillsManage";
import RoutineManage from "./components/sports/skills/routines/RoutineManage";
import SessionFeedback from "./components/sports/SessionFeedback";
import SessionHistory from "./components/sports/SessionHistory";

import BankAccounts from "./components/bank/BankAccount";
import BankAccountHistory from "./components/bank/BankAccountHistory";



export default function App() {
  // Unified store: auth + user + family + children + devices + KV
  const user = useAppStore(s => s.user);
  const authLoading = useAppStore(s => s.authLoading);
  const initAuth = useAppStore(s => s.initAuth);


  const activeChild = useAppStore(s => s.activeChild);
  const children = useAppStore(s => s.children || []);

  const child = children.find(c => c.id === activeChild) || null;

  const isViewer = useAppStore(s => s.isViewer());
  const isEditor = useAppStore(s => s.isEditor());
  const isOwner = useAppStore(s => s.isOwner());

  const { isLarge } = useScreenSize();

  // Loaders
  const loadUserIdentity = useAppStore(s => s.loadUserIdentity);
  const loadFamilyGroup = useAppStore(s => s.loadFamilyGroup);
  const loadChildrenFromFamilyGroup = useAppStore(s => s.loadChildrenFromFamilyGroup);
  const loadDevicesFromFamilyGroup = useAppStore(s => s.loadDevicesFromFamilyGroup);
  const refreshDeviceRecord = useAppStore(s => s.refreshDeviceRecord);
  const loadActiveChildOnLogin = useAppStore(s => s.loadActiveChildOnLogin);

  const loadFromKV = useAppStore(s => s.loadFromKV);
  const loadDefaultSports = useAppStore(s => s.loadDefaultSports);
  const loadingData = useAppStore(s => s.loadingData);

  // Init auth listener
  useEffect(() => {
    initAuth();
  }, []);

  // Load Firestore + KV after login
  useEffect(() => {
    if (!user) return;

    const uid = user.uid;

    (async () => {
      await loadUserIdentity(uid);
      await loadFamilyGroup(uid);
      await loadChildrenFromFamilyGroup();
      await loadDevicesFromFamilyGroup();
      await refreshDeviceRecord(uid);
      await loadActiveChildOnLogin();
      await loadDefaultSports();

      const childId = useAppStore.getState().activeChild;
      if (childId) {
        await loadFromKV(childId);
      }
    })();
  }, [user]);

  // Reload KV when active child changes
  useEffect(() => {
    if (!activeChild) return;
    loadFromKV(activeChild);
  }, [activeChild]);

  if (authLoading) return <HoldScreen2
      title="Logging You In"
      subtitle="Please wait a moment while we prepare your personalised planner."
  
    />;

  if (loadingData) return  <HoldScreen2
      title="Loading Your Data"
      subtitle="Fetching your latest progress, achievements and routines."
    />;

  if (!user) return <Login />;

  return (
    <HashRouter>
      <Header />

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          padding: "20px"
        }}
      >
        {isLarge && (
          <NavigationTabs
            isViewer={isViewer}
            isEditor={isEditor}
            isOwner={isOwner}
          />
        )}

        <div
          className="container"
          style={{
            maxWidth: "1200px",
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "24px"
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/behaviour" element={<AddBehaviour />} />
            <Route path="/achievement" element={<AddAchievement />} />
            <Route path="/sports" element={<SportsClasses />} />
            <Route path="/rewards" element={<Rewards />} />

            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/behaviour" element={<BehaviourSettings />} />
            <Route path="/settings/achievements" element={<AchievementSettings />} />
            <Route path="/settings/rewards" element={<RewardsSettings />} />
            <Route path="/settings/device" element={<DeviceSettings />} />
            <Route path="/settings/family" element={<FamilySettings />} />
            <Route path="/settings/child" element={<ChildManager />} />
            <Route path="/settings/bank" element={<BankAccountSettings />} />

            {process.env.NODE_ENV === "development" && (
              <>
              <Route path="/settings/admin/" element={<AdminPanel />} />
              <Route path="/settings/admin/dev" element={<DevSettings />} />
              <Route path="/settings/admin/approve-sports" element={<AdminApproveSports />} />
              <Route path="/settings/admin/approveskills" element={<AdminApproveSkills />} />
              <Route path="/settings/admin/approveroutines" element={<AdminApproveRoutines />} />
              <Route path="/settings/admin/approvecategories" element={<AdminApproveCategories />} />
              <Route path="/settings/admin/approverewards" element={<AdminApproveRewards />} />
              <Route path="/settings/admin/approveclubs" element={<AdminApproveClubs />} />
              <Route path="/settings/admin/templates" element={<AdminTemplatesList />} />
              <Route path="/settings/admin/template/:templateId" element={<AdminTemplateEditor />} />

              </>
            )}

            <Route path="/profile" element={<Profile />} />

            <Route path="/sports/add" element={<AddSport />} />
            <Route path="/sports/:id" element={<SportsDetails />} />
            <Route path="/sports/:id/manage" element={<SportsManage />} />

            <Route path="/sports/:id/categories" element={<SportsCategories />} />
            <Route path="/sports/:sportId/categories/:categoryId" element={<CategoryManage />} />
            <Route path="/sports/:sportId/categories/:categoryId/skills" element={<RoutineManage />} />
            <Route path="/sports/:sportId/categories/:categoryId/skills/manage" element={<ManageSkillsPage />}
/>
            <Route path="/sports/:sportId/categories/:categoryId/routines/:routineId" element={<RoutineManage />} />

            <Route path="/sports/:sportId/feedback" element={<SessionFeedback />} />
            <Route path="/sports/:sportId/history" element={<SessionHistory />} />


            {/* ⭐ NEW BANK ACCOUNT PAGE ⭐ */}
            <Route path="/bank" element={<BankAccounts />} />
            <Route path="/bank/history/:accountId" element={<BankAccountHistory />} />

          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}
