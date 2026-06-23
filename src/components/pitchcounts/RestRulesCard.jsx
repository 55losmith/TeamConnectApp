import React, { useState } from "react";
import { ChevronDown, Info } from "lucide-react";

const restTiers = [
  { range: "1–20", days: 0 },
  { range: "21–35", days: 1 },
  { range: "36–50", days: 2 },
  { range: "51–65", days: 3 },
  { range: "66+", days: 4 },
];

export default function RestRulesCard({ pitchLimit }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-100 mb-6 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 p-3 hover:bg-slate-50 transition"
      >
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="text-xs font-semibold text-slate-600 flex-1 text-left">
          How rest days are calculated
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-3 pb-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            {restTiers.map((tier) => (
              <span key={tier.range}>
                <span className="font-semibold text-slate-700">{tier.range} pitches</span> → {tier.days} day{tier.days !== 1 ? "s" : ""} rest
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Eligible the day after rest ends. Daily limit: {pitchLimit} pitches.
          </p>
        </div>
      )}
    </div>
  );
}
