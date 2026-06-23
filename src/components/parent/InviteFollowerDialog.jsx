import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Check } from "lucide-react";

export default function InviteFollowerDialog({ open, onClose, player, parentName, onInvited }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail("");
      setError("");
      setSuccess(false);
    }
  }, [open]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await base44.users.inviteUser(email, "user");
      await base44.entities.Invitation.create({
        email,
        app_role: "follower",
        player_id: player.id,
        player_name: player.name,
        invited_by_name: parentName,
        status: "pending",
      });
      setSending(false);
      setSuccess(true);
    } catch (err) {
      setSending(false);
      setError(err.message || "Failed to send invite. Please ask the coach to invite this follower.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Invite Follower</DialogTitle></DialogHeader>
        {success ? (
          <div className="py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-slate-900 font-medium mb-1">Invitation sent!</p>
            <p className="text-xs text-slate-500">{email} will receive an email to set up their account as a follower for {player?.name}.</p>
            <button onClick={onInvited} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">Done</button>
          </div>
        ) : (
          <form onSubmit={handleInvite} className="space-y-4 mt-2">
            <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
              Followers can view the schedule, scores, and team broadcasts. They cannot send messages, view dues, or see pitch counts.
            </p>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Follower Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="grandparent@email.com"
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
              </div>
            </div>
            {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2">{error}</p>}
            <button type="submit" disabled={sending}
              className="w-full py-2.5 bg-red-800 text-white rounded-lg text-sm font-medium hover:bg-red-900 transition disabled:opacity-50">
              {sending ? "Sending Invite..." : "Send Invite"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
