import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [settings, setSettings] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      try {
        const user = await base44.auth.me();
        let appRole = user.app_role;
        let playerId = user.player_id;

        if (!appRole) {
          const invites = await base44.entities.Invitation.filter({
            email: user.email,
            status: "pending",
          });
          if (invites.length > 0) {
            const invite = invites[0];
            await base44.auth.updateMe({
              app_role: invite.app_role,
              player_id: invite.player_id,
              player_name: invite.player_name,
            });
            await base44.entities.Invitation.update(invite.id, { status: "accepted" });
            appRole = invite.app_role;
            playerId = invite.player_id;
          } else {
            await base44.auth.updateMe({ app_role: "coach" });
            appRole = "coach";
          }
        }

        const settingsData = await base44.entities.TeamSettings.list();
        const teamSettings = settingsData[0] || null;

        if (appRole === "coach" && !teamSettings) {
          navigate("/onboarding");
          return;
        }

        let child = null;
        if ((appRole === "parent" || appRole === "follower") && playerId) {
          try {
            child = await base44.entities.Player.get(playerId);
          } catch (e) {}
        }

        setSettings(teamSettings);
        setUserRole(appRole);
        setSelectedChild(child);
        setCurrentUser({ ...user, app_role: appRole, player_id: playerId });
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading || !userRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        teamName={settings?.team_name}
        ageGroup={settings ? `${settings.age_group} • ${settings.location}` : ""}
        userRole={userRole}
        currentUser={currentUser}
      />
      <main className="lg:pl-56 pt-14 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet context={{ settings, userRole, selectedChild, currentUser }} />
        </div>
      </main>
    </div>
  );
}
