import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const positions = ["Pitcher", "Catcher", "First Base", "Second Base", "Third Base", "Shortstop", "Left Field", "Center Field", "Right Field", "DH", "Utility"];

export default function AddPlayerDialog({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "", jersey_number: "", primary_position: "Pitcher", secondary_position: "None",
    batting_hand: "Right", throwing_hand: "Right", parent_names: "", parent_email: "", parent_phone: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.Player.create({ ...form, jersey_number: Number(form.jersey_number) });
    setSaving(false);
    setForm({ name: "", jersey_number: "", primary_position: "Pitcher", secondary_position: "None", batting_hand: "Right", throwing_hand: "Right", parent_names: "", parent_email: "", parent_phone: "" });
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Add Player</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Player Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Jersey # *</label>
              <input required type="number" value={form.jersey_number} onChange={(e) => setForm({ ...form, jersey_number: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Primary Position *</label>
              <select value={form.primary_position} onChange={(e) => setForm({ ...form, primary_position: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 bg-white">
                {positions.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Secondary Position</label>
              <select value={form.secondary_position} onChange={(e) => setForm({ ...form, secondary_position: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 bg-white">
                <option>None</option>
                {positions.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Batting Hand</label>
              <select value={form.batting_hand} onChange={(e) => setForm({ ...form, batting_hand: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 bg-white">
                <option>Right</option><option>Left</option><option>Switch</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Throwing Hand</label>
              <select value={form.throwing_hand} onChange={(e) => setForm({ ...form, throwing_hand: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 bg-white">
                <option>Right</option><option>Left</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Parent / Guardian Names</label>
            <input value={form.parent_names} onChange={(e) => setForm({ ...form, parent_names: e.target.value })} placeholder="e.g. John Doe, Jane Doe" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Parent Email</label>
              <input type="email" value={form.parent_email} onChange={(e) => setForm({ ...form, parent_email: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Parent Phone</label>
              <input type="tel" value={form.parent_phone} onChange={(e) => setForm({ ...form, parent_phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="w-full py-2.5 bg-red-800 text-white rounded-lg text-sm font-medium hover:bg-red-900 transition disabled:opacity-50">
            {saving ? "Adding..." : "Add Player"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
