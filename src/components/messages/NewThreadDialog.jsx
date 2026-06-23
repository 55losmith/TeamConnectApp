import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function NewThreadDialog({ open, onClose, onCreated, coachName }) {
  const [form, setForm] = useState({ parent_name: "", subject: "", message: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const thread = await base44.entities.Thread.create({
      parent_name: form.parent_name, subject: form.subject,
      last_message_body: form.message, last_sender_role: "coach",
    });
    await base44.entities.Message.create({
      body: form.message, message_type: "conversation", thread_id: thread.id,
      sender_role: "coach", sender_name: coachName || "Coach", recipient_name: form.parent_name,
    });
    setSaving(false);
    setForm({ parent_name: "", subject: "", message: "" });
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>New Conversation</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Parent Name *</label>
            <input required value={form.parent_name} onChange={(e) => setForm({ ...form, parent_name: e.target.value })} placeholder="e.g. Jennifer Williams" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Subject *</label>
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Pitching schedule" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Message *</label>
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Write your message..." className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 resize-none" />
          </div>
          <button type="submit" disabled={saving} className="w-full py-2.5 bg-red-800 text-white rounded-lg text-sm font-medium hover:bg-red-900 transition disabled:opacity-50">
            {saving ? "Starting..." : "Start Conversation"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
