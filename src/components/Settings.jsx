import { useState } from "react";
import BehaviourSettings from "./settings/BehaviourSettings";
import AchievementSettings from "./settings/AchievementSettings";
import RewardsSettings from "./settings/RewardSettings";
import SkillsManager from "./SkillsManager";
import DevSettings from "./settings/DevSettings"; 

export default function Settings() {
  const [activeTab, setActiveTab] = useState("behaviour");

  const tabButtonStyle = (tab) => ({
    backgroundColor: activeTab === tab ? "#b300ff" : "white",
    color: activeTab === tab ? "white" : "#1f2a44",
    border: "1px solid #b300ff",
    borderRadius: "10px",
    padding: "10px 20px",
    fontWeight: "600",
    boxShadow: activeTab === tab ? "0 4px 10px rgba(179,0,255,0.25)" : "none",
    transition: "0.2s",
    whiteSpace: "nowrap"
  });

  return (
    <div className="container mt-4">

      {/* Settings Tabs */}
      <div className="d-flex gap-3 mb-4 flex-wrap">
        <button style={tabButtonStyle("behaviour")} onClick={() => setActiveTab("behaviour")}>
          Behaviour
        </button>

        <button style={tabButtonStyle("achievement")} onClick={() => setActiveTab("achievement")}>
          Achievements
        </button>

        <button style={tabButtonStyle("rewards")} onClick={() => setActiveTab("rewards")}>
          Rewards
        </button>

        {process.env.NODE_ENV === "development" && (
          <button style={tabButtonStyle("dev")} onClick={() => setActiveTab("dev")}>
            Dev
          </button>
        )}
      </div>

      {/* Render Selected Settings Panel */}
      {activeTab === "behaviour" && <BehaviourSettings />}
      {activeTab === "achievement" && <AchievementSettings />}
      {activeTab === "rewards" && <RewardsSettings />}
      {activeTab === "dev" && process.env.NODE_ENV === "development" && <DevSettings />}


    </div>
  );
}
