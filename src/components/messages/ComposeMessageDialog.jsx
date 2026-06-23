import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ComposeMessageDialog({ open, onClose, onCreated, coachName }) {
  const [form, setForm] = useState({ title: "", body: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.Message.create({
      title: form.title, body: form.body, message_type: "broadcast",
      sender_role: "coach", sender_name: coachName || "Coach",
    });
    setSaving(false);
    setForm({ title: "", body: "" });
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Send Broadcast</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Subject *</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Message subject" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Message *</label>
            <textarea required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={4} placeholder="Write your broadcast..." className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 resize-none" />
          </div>
          <button type="submit" disabled={saving} className="w-full py-2.5 bg-red-800 text-white rounded-lg text-sm font-medium hover:bg-red-900 transition disabled:opacity-50">
            {saving ? "Sending..." : "Send Broadcast"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
