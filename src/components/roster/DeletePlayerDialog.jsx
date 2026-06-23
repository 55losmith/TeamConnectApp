import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function DeletePlayerDialog({ player, open, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { setDeleting(false); }, [open, player]);

  if (!player) return null;

  const handleDelete = async () => {
    setDeleting(true);
    if (player.parent_email) {
      // No user unlink API — but we can clean up invitations
      await base44.entities.Invitation.deleteMany({ player_id: player.id }).catch(() => {});
    } else {
      await base44.entities.Invitation.deleteMany({ player_id: player.id }).catch(() => {});
    }
    await base44.entities.Payment.deleteMany({ player_id: player.id }).catch(() => {});
    await base44.entities.PitchLog.deleteMany({ player_id: player.id }).catch(() => {});
    await base44.entities.Player.delete(player.id);
    setDeleting(false);
    onDeleted();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-600" /> Delete Player</DialogTitle></DialogHeader>
        <div className="py-2">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-semibold text-slate-900">{player.name}</span> (#{player.jersey_number})? This will also remove their payment records, pitch logs, and pending invitations. This cannot be undone.
          </p>
        </div>
        <DialogFooter className="gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-medium hover:bg-red-800 transition disabled:opacity-50">
            <Trash2 className="w-4 h-4" /> {deleting ? "Deleting..." : "Delete Player"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
