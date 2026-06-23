import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { UserPlus, Mail } from "lucide-react";
import { format } from "date-fns";
import InviteFollowerDialog from "./InviteFollowerDialog";

export default function ManageFollowers({ player, parentName }) {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);

  const loadFollowers = () => {
    base44.entities.Invitation.filter({ player_id: player.id, app_role: "follower" }, "-created_date", 50)
      .then((data) => { setFollowers(data); setLoading(false); });
  };

  useEffect(() => { loadFollowers(); }, [player.id]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Followers</h3>
        <button onClick={() => setInviteOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
          <UserPlus className="w-3.5 h-3.5" /> Invite Follower
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-100">
        {followers.map((f) => (
          <div key={f.id} className="flex items-center gap-3 p-4">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{f.email}</p>
              <p className="text-xs text-slate-400">Invited by {f.invited_by_name} · {format(new Date(f.created_date), "MMM d, yyyy")}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${f.status === "accepted" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
              {f.status === "accepted" ? "Active" : "Pending"}
            </span>
          </div>
        ))}
        {followers.length === 0 && !loading && (
          <div className="p-6 text-center text-sm text-slate-400">
            No followers yet. Invite a grandparent or family member to follow {player.name}'s schedule and scores.
          </div>
        )}
      </div>
      <InviteFollowerDialog open={inviteOpen} onClose={() => setInviteOpen(false)}
        player={player} parentName={parentName}
        onInvited={() => { setInviteOpen(false); loadFollowers(); }} />
    </div>
  );
}
