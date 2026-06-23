import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function RecordScoreDialog({ event, open, onClose, onSaved }) {
  const [form, setForm] = useState({ team_score: "", opponent_score: "", innings: "6" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setForm({ team_score: event.team_score || "", opponent_score: event.opponent_score || "", innings: event.innings || "6" });
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const ts = Number(form.team_score);
    const os = Number(form.opponent_score);
    const result = ts > os ? "Win" : ts < os ? "Loss" : "Tie";
    await base44.entities.Event.update(event.id, { team_score: ts, opponent_score: os, game_result: result, innings: Number(form.innings) });
    setSaving(false);
    onSaved();
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Record Score</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <p className="text-sm font-medium text-slate-700">{event.title}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Our Score *</label>
              <input required type="number" value={form.team_score} onChange={(e) => setForm({ ...form, team_score: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Opponent Score *</label>
              <input required type="number" value={form.opponent_score} onChange={(e) => setForm({ ...form, opponent_score: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Innings Played</label>
            <input type="number" value={form.innings} onChange={(e) => setForm({ ...form, innings: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
          </div>
          {form.team_score && form.opponent_score && (
            <div className="bg-slate-50 rounded-lg p-3 text-sm">
              <span className="font-semibold">Result: </span>
              <span className={Number(form.team_score) > Number(form.opponent_score) ? "text-green-700" : Number(form.team_score) < Number(form.opponent_score) ? "text-red-700" : "text-slate-700"}>
                {Number(form.team_score) > Number(form.opponent_score) ? "Win" : Number(form.team_score) < Number(form.opponent_score) ? "Loss" : "Tie"}
              </span>
            </div>
          )}
          <button type="submit" disabled={saving} className="w-full py-2.5 bg-red-800 text-white rounded-lg text-sm font-medium hover:bg-red-900 transition disabled:opacity-50">
            {saving ? "Saving..." : "Save Score"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
