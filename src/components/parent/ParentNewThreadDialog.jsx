import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ParentNewThreadDialog({ open, onClose, onCreated, parentName }) {
  const [form, setForm] = useState({ recipient: "Coaching Staff", subject: "", message: "" });
  const [otherParents, setOtherParents] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      base44.entities.Player.list("jersey_number", 100).then((players) => {
        const names = new Set();
        players.forEach((p) => {
          if (p.parent_names) {
            p.parent_names.split(",").forEach((n) => {
              const trimmed = n.trim();
              if (trimmed && trimmed !== parentName) names.add(trimmed);
            });
          }
        });
        setOtherParents([...names]);
      });
    }
  }, [open, parentName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const thread = await base44.entities.Thread.create({
      parent_name: parentName, subject: form.subject,
      last_message_body: form.message, last_sender_role: "parent",
    });
    await base44.entities.Message.create({
      body: form.message, message_type: "conversation", thread_id: thread.id,
      sender_role: "parent", sender_name: parentName, recipient_name: form.recipient,
    });
    setSaving(false);
    setForm({ recipient: "Coaching Staff", subject: "", message: "" });
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>New Message</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">To *</label>
            <select value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 bg-white">
              <option>Coaching Staff</option>
              {otherParents.map((name) => <option key={name}>{name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Subject *</label>
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Subject" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Message *</label>
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4} placeholder="Write your message..." className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 resize-none" />
          </div>
          <button type="submit" disabled={saving} className="w-full py-2.5 bg-red-800 text-white rounded-lg text-sm font-medium hover:bg-red-900 transition disabled:opacity-50">
            {saving ? "Sending..." : "Send Message"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
