import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { LayoutDashboard, Users, Calendar, MessageSquare, Settings, Menu, X, Trophy, Activity, DollarSign, LogOut } from "lucide-react";

const navByRole = {
  coach: [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Roster", path: "/roster", icon: Users },
    { label: "Schedule", path: "/schedule", icon: Calendar },
    { label: "Pitch Counts", path: "/pitch-counts", icon: Activity },
    { label: "Dues", path: "/dues", icon: DollarSign },
    { label: "Messages", path: "/messages", icon: MessageSquare },
    { label: "Team Settings", path: "/settings", icon: Settings },
  ],
  parent: [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Schedule", path: "/schedule", icon: Calendar },
    { label: "Dues", path: "/dues", icon: DollarSign },
    { label: "Messages", path: "/messages", icon: MessageSquare },
    { label: "Pitch Counts", path: "/pitch-counts", icon: Activity },
  ],
  follower: [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Schedule", path: "/schedule", icon: Calendar },
    { label: "Messages", path: "/messages", icon: MessageSquare },
  ],
};

const roleLabels = { coach: "Coach", parent: "Parent", follower: "Follower" };
const roleColors = { coach: "bg-red-100 text-red-800", parent: "bg-blue-100 text-blue-800", follower: "bg-slate-100 text-slate-600" };

export default function Sidebar({ teamName, ageGroup, userRole, currentUser }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = navByRole[userRole] || navByRole.coach;

  const handleLogout = () => base44.auth.logout("/login");

  const NavContent = () => (
    <>
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-red-700 flex items-center justify-center shrink-0">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-white font-bold text-sm truncate">{teamName || "Team Connect"}</h2>
          <p className="text-slate-400 text-xs uppercase tracking-wider">{ageGroup || "Youth Sports"}</p>
        </div>
      </div>

      <div className="px-3 mb-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">{roleLabels[userRole]} View</p>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}>
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">
              {(currentUser?.full_name || currentUser?.email || "U")[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white truncate">{currentUser?.full_name || currentUser?.email}</p>
            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mt-0.5 ${roleColors[userRole]}`}>
              {roleLabels[userRole]}
            </span>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition">
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm">{teamName || "Team Connect"}</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`lg:hidden fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 transform transition-transform duration-300 flex flex-col ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <NavContent />
      </div>

      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:fixed lg:inset-y-0 bg-slate-900">
        <NavContent />
      </aside>
    </>
  );
}
