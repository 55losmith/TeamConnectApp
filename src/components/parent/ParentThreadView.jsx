import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Send } from "lucide-react";
import { format } from "date-fns";

export default function ParentThreadView({ thread, onBack, parentName }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const loadMessages = () => {
    base44.entities.Message.filter({ thread_id: thread.id }, "created_date", 100).then((data) => {
      setMessages(data); setLoading(false);
    });
  };

  useEffect(() => { loadMessages(); }, [thread.id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    await base44.entities.Message.create({
      body: reply, message_type: "conversation", thread_id: thread.id,
      sender_role: "parent", sender_name: parentName, recipient_name: "Coach",
    });
    await base44.entities.Thread.update(thread.id, { last_message_body: reply, last_sender_role: "parent" });
    setReply("");
    setSending(false);
    loadMessages();
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 mb-4 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Back to Messages
      </button>
      <div className="bg-white rounded-xl border border-slate-100">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm shrink-0">
              {thread.subject[0].toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-slate-900">{thread.subject}</h2>
              <p className="text-sm text-slate-500">{thread.parent_name}</p>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="text-center text-sm text-slate-400 py-4">Loading messages...</div>
          ) : messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender_role === "parent" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.sender_role === "parent" ? "bg-red-800 text-white" : "bg-slate-100 text-slate-900"}`}>
                <p className="text-sm">{msg.body}</p>
                <p className={`text-xs mt-1 ${msg.sender_role === "parent" ? "text-red-200" : "text-slate-400"}`}>
                  {msg.sender_name} · {format(new Date(msg.created_date), "MMM d, h:mm a")}
                </p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2">
          <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply..."
            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20" />
          <button type="submit" disabled={sending || !reply.trim()} className="px-4 py-2 bg-red-800 text-white rounded-lg text-sm font-medium hover:bg-red-900 transition disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
