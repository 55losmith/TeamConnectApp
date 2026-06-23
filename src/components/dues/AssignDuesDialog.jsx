import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

export default function AssignDuesDialog({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ payment_type: "monthly", amount: "150", description: "", due_date: format(new Date(), "yyyy-MM-dd") });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const players = await base44.entities.Player.list("jersey_number", 100);
    const payments = players.map((p) => ({
      player_name: p.name, player_id: p.id, amount: Number(form.amount),
      payment_type: form.payment_type, description: form.description, due_date: form.due_date, status: "unpaid",
    }));
    await base44.entities.Payment.bulkCreate(payments);
    setSaving(false);
    setForm({ payment_type: "monthly", amount: "150", description: "", due_date: format(new Date(), "yyyy-MM-dd") });
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Assign Dues to Roster</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-800">
            This will create a payment record for all {`players`} on the roster.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Type *</label>
              <select value={form.payment_type} onChange={(e) => setForm({ ...form, payment_type: e.target.value, amount: e.target.value === "monthly" ? "150" : "75" })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 bg-white">
                <option value="monthly">Monthly Dues</option>
                <option value="tournament">Tournament Fee</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Amount ($) *</label>
              <input required type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Description *</label>
            <input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={form.payment_type === "monthly" ? "e.g. June Dues" : "e.g. Summer Slugfest Tournament"}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Due Date *</label>
            <input required type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
          </div>
          <button type="submit" disabled={saving} className="w-full py-2.5 bg-red-800 text-white rounded-lg text-sm font-medium hover:bg-red-900 transition disabled:opacity-50">
            {saving ? "Assigning..." : "Assign to All Players"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
