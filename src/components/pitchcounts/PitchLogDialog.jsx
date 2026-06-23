import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { getRestDays, getEligibleDate } from "@/lib/pitchRules";

const positions = ["Pitcher", "Catcher", "First Base", "Second Base", "Third Base", "Shortstop", "Left Field", "Center Field", "Right Field", "DH", "Utility"];

export default function PitchLogDialog({ open, onClose, onCreated }) {
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState({ player_name: "", player_id: "", pitches_thrown: "", log_date: format(new Date(), "yyyy-MM-dd"), event_title: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) base44.entities.Player.list("jersey_number", 50).then(setPlayers);
  }, [open]);

  const pitches = Number(form.pitches_thrown) || 0;
  const restDays = pitches > 0 ? getRestDays(pitches) : null;
  const eligibleDate = (pitches > 0 && form.log_date) ? getEligibleDate(form.log_date, pitches) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const player = players.find((p) => p.id === form.player_id);
    await base44.entities.PitchLog.create({
      player_name: player?.name || form.player_name,
      player_id: form.player_id,
      pitches_thrown: pitches,
      log_date: form.log_date,
      event_title: form.event_title,
      rest_days_required: getRestDays(pitches),
      eligible_date: format(getEligibleDate(form.log_date, pitches), "yyyy-MM-dd"),
    });
    setSaving(false);
    setForm({ player_name: "", player_id: "", pitches_thrown: "", log_date: format(new Date(), "yyyy-MM-dd"), event_title: "" });
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Log Pitch Count</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Player *</label>
            <select required value={form.player_id} onChange={(e) => setForm({ ...form, player_id: e.target.value, player_name: players.find((p) => p.id === e.target.value)?.name || "" })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 bg-white">
              <option value="">Select player...</option>
              {players.map((p) => <option key={p.id} value={p.id}>#{p.jersey_number} {p.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Pitches Thrown *</label>
              <input required type="number" value={form.pitches_thrown} onChange={(e) => setForm({ ...form, pitches_thrown: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Date *</label>
              <input required type="date" value={form.log_date} onChange={(e) => setForm({ ...form, log_date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Event / Context</label>
            <input value={form.event_title} onChange={(e) => setForm({ ...form, event_title: e.target.value })} placeholder="e.g. Game vs. Hawks"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
          </div>
          {restDays !== null && eligibleDate && (
            <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
              <p className="text-slate-700"><span className="font-semibold">Rest required:</span> {restDays} day{restDays !== 1 ? "s" : ""}</p>
              <p className="text-slate-700"><span className="font-semibold">Eligible to pitch:</span> {format(eligibleDate, "EEEE, MMM d")}</p>
            </div>
          )}
          <button type="submit" disabled={saving} className="w-full py-2.5 bg-red-800 text-white rounded-lg text-sm font-medium hover:bg-red-900 transition disabled:opacity-50">
            {saving ? "Saving..." : "Log Pitches"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
