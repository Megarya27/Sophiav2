// ──────────────────────────────────────────────────────────
// Edge Handle — thin grab strip at the edge
// ──────────────────────────────────────────────────────────
function EdgeHandle({ side = "left", label, onClick, open }) {
  return (
    <button
      onClick={onClick}
      className={`edge-handle hidden sm:block group absolute top-0 bottom-0 ${side === "left" ? "left-0" : "right-0"}
        w-[28px] hover:w-[36px] bg-transparent hover:bg-white/[0.025] z-20 transition-all`}
      aria-label={label}
    >
      <div className="h-full flex flex-col items-center justify-center gap-3">
        {/* grip dots */}
        <div className="flex flex-col gap-[3px] opacity-50 group-hover:opacity-100 transition">
          {[0,1,2,3,4,5].map(i =>
            <span key={i} className="w-[3px] h-[3px] rounded-full bg-sage-300"/>)}
        </div>
        {/* vertical label */}
        <div className={`edge-grip opacity-70 group-hover:opacity-100 transition
          text-[9px] tracking-[0.32em] text-ink-500 group-hover:text-sage-300`}
          style={{ writingMode: "vertical-rl", transform: side === "left" ? "rotate(180deg)" : "none"}}>
          {label}
        </div>
        <div className="flex flex-col gap-[3px] opacity-50 group-hover:opacity-100 transition">
          {[0,1,2,3,4,5].map(i =>
            <span key={i} className="w-[3px] h-[3px] rounded-full bg-sage-300"/>)}
        </div>
      </div>
    </button>
  );
}

// ──────────────────────────────────────────────────────────
// Left Drawer — Conversation History
// ──────────────────────────────────────────────────────────
function HistoryDrawer({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.aside
            initial={{ x: -360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="history-drawer absolute top-14 bottom-0 left-0 w-full sm:w-[340px] z-50 bg-ink-900/90 backdrop-blur-xl border-r border-white/[0.06] nice-scroll overflow-y-auto"
          >
            <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconHistory size={14} className="text-sage-300"/>
                <span className="text-[10px] tracking-[0.22em] text-ink-300">CONVERSATION HISTORY</span>
              </div>
            </div>

            <button className="mt-4 w-full flex items-center gap-2 px-3 py-2.5 rounded-md bg-sage-500/25 hover:bg-sage-500/35 border border-sage-500/30 text-ink-50 font-semibold text-[12.5px] transition begin-conv-btn">
              <IconPlus size={13}/>
              <span>Begin a new conversation</span>
            </button>

            <div className="mt-5 relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-ink-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <input
                  placeholder="Search transcripts, decisions, people…"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-md pl-10 pr-3 py-2 text-[12.5px] text-ink-50 placeholder:text-ink-500 outline-none focus:border-sage-500/50 transition"
                />
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {SEED_HISTORY.map(group => (
                <div key={group.group}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-[9px] tracking-[0.24em] text-ink-500 font-mono">{group.group}</span>
                    <div className="flex-1 h-px bg-white/[0.05]"/>
                  </div>
                  <ul className="space-y-0.5">
                    {group.items.map(item => (
                      <li key={item.id}>
                        <button className={`w-full text-left px-3 py-2 rounded-md transition flex items-start gap-2.5
                          ${item.active
                            ? "bg-sage-500/15 border border-sage-500/30"
                            : "hover:bg-white/[0.03] border border-transparent"}`}>
                          <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${item.active ? "bg-sage-300" : "bg-ink-500/60"}`}/>
                          <div className="flex-1 min-w-0">
                            <div className={`text-[12.5px] truncate ${item.active ? "text-ink-50" : "text-ink-300"}`}>
                              {item.title}
                            </div>
                            <div className="text-[10px] text-ink-500 font-mono mt-0.5">{item.when}</div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* footer */}
            <div className="mt-8 pt-5 border-t border-white/[0.05] text-[10px] text-ink-500 leading-relaxed font-mono">
              Sophia keeps every conversation private. Transcripts are encrypted and never used for model training.
            </div>
          </div>
          </motion.aside>

          <motion.button
            initial={{ x: -8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -8, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-label="Collapse conversation history"
            className="collapse-toggle collapse-toggle-left absolute left-[334px] top-1/2 -translate-y-1/2 z-40 w-7 h-14 rounded-r-lg border border-white/[0.14] border-l-0 bg-ink-900/80 backdrop-blur-md shadow-[0_10px_26px_-18px_rgba(0,0,0,0.8)] hover:bg-sage-500/25 hover:text-sage-100 text-ink-300 transition-all duration-200 hover:w-8 flex items-center justify-center"
          >
            <IconChevronLeft size={14}/>
          </motion.button>
        </>
      )}
    </AnimatePresence>
  );
}

// ──────────────────────────────────────────────────────────
// Right Drawer — Intelligence Panel
// ──────────────────────────────────────────────────────────
function IntelligencePanel({ open, onClose, decisions, onAddDecision, commitments, setCommitments }) {
  const [tab, setTab] = React.useState("pulse");
  const tabs = [
    { id: "pulse", label: "Pulse", icon: IconPulse },
    { id: "decisions", label: "Decision", icon: IconFlag },
    { id: "commits", label: "Commits", icon: IconCheck },
    { id: "practice", label: "Practice", icon: IconSparkle },
    { id: "growth", label: "Growth", icon: IconBrain },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.aside
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="intelligence-drawer absolute top-14 bottom-0 right-0 w-full sm:w-[400px] z-50 bg-ink-900/90 backdrop-blur-xl border-l border-white/[0.06] nice-scroll overflow-y-auto"
          >
            <div className="p-5 pb-16">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconBrain size={14} className="text-sage-300"/>
                <span className="text-[10px] tracking-[0.22em] text-ink-300">INTELLIGENCE PANEL</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-4 grid grid-cols-5 gap-1 p-1 bg-white/[0.03] rounded-md border border-white/[0.05]">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`relative min-w-0 overflow-hidden flex flex-col items-center gap-1 py-2 rounded text-[8.5px] tracking-[0.08em] leading-none transition
                    ${tab === t.id ? "bg-sage-500/20 text-sage-200" : "text-ink-500 hover:text-ink-300"}`}>
                  <t.icon size={13}/>
                  <span className="block w-full truncate text-center">{t.label.toUpperCase()}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="mt-5">
              {tab === "pulse" && <PulsePanel/>}
              {tab === "decisions" && <DecisionsPanel decisions={decisions} onAdd={onAddDecision}/>}
              {tab === "commits" && <CommitmentsPanel commitments={commitments} setCommitments={setCommitments}/>}
              {tab === "practice" && <PracticesPanel/>}
              {tab === "growth" && <GrowthPanel/>}
            </div>
          </div>
          </motion.aside>

          <motion.button
            initial={{ x: 8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 8, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-label="Collapse intelligence panel"
            className="collapse-toggle collapse-toggle-right absolute right-[394px] top-1/2 -translate-y-1/2 z-40 w-7 h-14 rounded-l-lg border border-white/[0.14] border-r-0 bg-ink-900/80 backdrop-blur-md shadow-[0_10px_26px_-18px_rgba(0,0,0,0.8)] hover:bg-sage-500/25 hover:text-sage-100 text-ink-300 transition-all duration-200 hover:w-8 flex items-center justify-center"
          >
            <IconChevronRight size={14}/>
          </motion.button>
        </>
      )}
    </AnimatePresence>
  );
}

// Team Pulse
function PulsePanel() {
  const p = SEED_PULSE_SIGNAL;
  return (
    <div>
      <div className="rounded-lg p-4 bg-gradient-to-br from-sage-500/15 to-sage-500/[0.02] border border-sage-500/30">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[10px] tracking-[0.22em] text-sage-300">TEAM PULSE</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif italic text-[24px] text-ink-50">{p.mood}</span>
              <span className="font-mono text-[11px] text-ink-300">· {p.alignment}% alignment</span>
            </div>
          </div>
          <div className="w-14 h-14 relative">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/>
              <circle cx="28" cy="28" r="22" fill="none" stroke="#7FA687" strokeWidth="3"
                strokeDasharray={`${(p.alignment/100)*138} 138`} strokeLinecap="round"
                transform="rotate(-90 28 28)"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-mono text-sage-200">{p.alignment}</div>
          </div>
        </div>
        {/* Sparkline */}
        <svg width="100%" height="40" viewBox="0 0 300 40" className="mt-3">
          <path d="M0 28 L 25 24 L 50 30 L 75 20 L 100 22 L 125 16 L 150 14 L 175 18 L 200 12 L 225 16 L 250 10 L 275 14 L 300 8"
            fill="none" stroke="#7FA687" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M0 28 L 25 24 L 50 30 L 75 20 L 100 22 L 125 16 L 150 14 L 175 18 L 200 12 L 225 16 L 250 10 L 275 14 L 300 8 L 300 40 L 0 40 Z"
            fill="url(#spark)" opacity=".4"/>
          <defs>
            <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7FA687" stopOpacity=".5"/>
              <stop offset="100%" stopColor="#7FA687" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="mt-4">
        <div className="text-[10px] tracking-[0.22em] text-ink-500 mb-2">BY PERSON</div>
        <ul className="space-y-1.5">
          {p.participants.map(pt => (
            <li key={pt.id} className="flex items-center gap-3 p-2.5 rounded-md hover:bg-white/[0.03] transition">
              <Speaker id={pt.id} size={28}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] text-ink-50">{pt.name}</span>
                  <span className="font-mono text-[10px] text-ink-500">{pt.score}</span>
                </div>
                <div className="h-1 bg-white/[0.05] rounded-full mt-1 overflow-hidden">
                  <div className="h-full rounded-full"
                    style={{width: `${pt.score}%`,
                            background: pt.trend === "down" ? "#D6A24A" : "#7FA687"}}/>
                </div>
              </div>
              <span className={`text-[10px] font-mono tracking-wider ${
                pt.trend === "up" ? "text-sage-300" :
                pt.trend === "down" ? "text-amber-400" : "text-ink-500"
              }`}>
                {pt.trend === "up" ? "↗" : pt.trend === "down" ? "↘" : "→"} {pt.trend}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Decisions Log
function DecisionsPanel({ decisions, onAdd }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] tracking-[0.22em] text-ink-500">DECISION LOG · {decisions.length}</div>
        <button className="text-[10px] tracking-[0.18em] text-sage-300 hover:text-sage-200 flex items-center gap-1">
          <IconPlus size={10}/> CAPTURE
        </button>
      </div>
      <ul className="space-y-2">
        {decisions.map(d => (
          <motion.li key={d.id} layout
            initial={{opacity:0, x: 10}} animate={{opacity:1, x:0}}
            className="relative p-3 rounded-md bg-white/[0.02] border border-white/[0.06] hover:border-sage-500/30 transition">
            <div className="flex items-start gap-2.5">
              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${d.status === "committed" ? "bg-sage-400" : "bg-amber-400"}`}/>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-ink-50 leading-snug">{d.title}</div>
                <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-ink-500">
                  <span>{d.who}</span>
                  <span>·</span>
                  <span>{d.when}</span>
                  <span>·</span>
                  <span className={d.status === "committed" ? "text-sage-300" : "text-amber-400"}>
                    {d.status}
                  </span>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

// Commitment River
function CommitmentsPanel({ commitments, setCommitments }) {
  const [dragId, setDragId] = React.useState(null);

  const toggle = (id) => setCommitments(cs => cs.map(c => c.id === id ? {...c, done: !c.done} : c));

  const onDragStart = (id) => setDragId(id);
  const onDragOver = (e, overId) => {
    e.preventDefault();
    if (!dragId || dragId === overId) return;
    setCommitments(cs => {
      const fromIdx = cs.findIndex(c => c.id === dragId);
      const toIdx = cs.findIndex(c => c.id === overId);
      const copy = cs.slice();
      const [m] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, m);
      return copy;
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] tracking-[0.22em] text-ink-500">COMMITMENT RIVER</div>
        <div className="font-mono text-[10px] text-ink-500">{commitments.filter(c=>!c.done).length} open</div>
      </div>
      {/* The "river" — a soft vertical gradient line */}
      <div className="relative">
        <div className="absolute left-[12px] top-2 bottom-2 w-px bg-gradient-to-b from-sage-500/60 via-sage-500/30 to-sage-500/0"/>
        <ul className="space-y-1.5">
          {commitments.map((c, i) => (
            <motion.li key={c.id} layout
              draggable
              onDragStart={() => onDragStart(c.id)}
              onDragOver={(e) => onDragOver(e, c.id)}
              onDragEnd={() => setDragId(null)}
              className={`relative group pl-7 pr-2 py-2.5 rounded-md hover:bg-white/[0.03] transition cursor-grab active:cursor-grabbing
                ${dragId === c.id ? "opacity-50" : ""}`}>
              {/* node on the river */}
              <button onClick={() => toggle(c.id)}
                className={`absolute left-[7px] top-[13px] w-[11px] h-[11px] rounded-full border-2 transition
                  ${c.done
                    ? "bg-sage-400 border-sage-400"
                    : "bg-ink-900 border-sage-500 hover:bg-sage-500/30"}`}>
                {c.done && <IconCheck size={7} className="text-ink-900" strokeWidth={3}/>}
              </button>
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] leading-snug transition ${
                    c.done ? "text-ink-500 line-through decoration-sage-400/80 decoration-[1.5px]" : "text-ink-50"
                  }`}>
                    {c.text}
                  </p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  <Speaker id={c.owner} size={18}/>
                  <div className="text-ink-500">
                    <IconGrip size={12}/>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
      <button className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-md border border-dashed border-white/10 hover:border-sage-500/40 text-ink-500 hover:text-sage-300 text-[11px] tracking-[0.16em] transition">
        <IconPlus size={11}/> ADD COMMITMENT
      </button>
    </div>
  );
}

// Active Practices
function PracticesPanel() {
  return (
    <div>
      <div className="text-[10px] tracking-[0.22em] text-ink-500 mb-3">ACTIVE PRACTICES · WORKING ON</div>
      <ul className="space-y-2.5">
        {SEED_PRACTICES.map((a, i) => (
          <li key={a.id} className="p-3.5 rounded-md bg-white/[0.02] border border-white/[0.06] hover:border-sage-500/30 transition lift">
            <div className="flex items-start gap-3">
              <div className="font-mono text-[12px] text-sage-300 tabular-nums w-5 shrink-0">0{i+1}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h5 className="text-[13.5px] text-ink-50 font-medium tracking-tight">{a.title}</h5>
                  <span className="font-mono text-[11px] text-sage-300 tabular-nums">{a.pct}%</span>
                </div>
                <p className="mt-1 text-[11.5px] leading-relaxed text-ink-300 font-serif italic">{a.blurb}</p>
                <div className="mt-2.5 h-[3px] bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${a.pct}%` }}
                    transition={{ duration: 1.1, ease: [0.2,0.8,0.2,1], delay: i*0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-sage-500 to-sage-300"/>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Growth constellation
function GrowthPanel() {
  return (
    <div>
      <div className="text-[10px] tracking-[0.22em] text-ink-500 mb-1">GROWTH PROFILE</div>
      <p className="text-[11px] text-ink-500 font-serif italic max-w-[32ch] leading-snug">
        Where your leadership presence is concentrating this quarter.
      </p>
      <div className="mt-3 flex items-center justify-center">
        <GrowthConstellation data={SEED_GROWTH}/>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {SEED_GROWTH.map(g => {
          const max = Math.max(...SEED_GROWTH.map(d=>d.value));
          return (
            <div key={g.id} className={`flex items-center justify-between px-2.5 py-1.5 rounded text-[11.5px] border ${
              g.value === max ? "border-sage-500/40 bg-sage-500/10" : "border-white/[0.05] bg-white/[0.02]"
            }`}>
              <span className={g.value === max ? "text-sage-200" : "text-ink-300"}>{g.label}</span>
              <span className={`font-mono ${g.value === max ? "text-sage-300" : "text-ink-500"}`}>{g.value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { EdgeHandle, HistoryDrawer, IntelligencePanel });
