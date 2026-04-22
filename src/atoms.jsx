// motion + AnimatePresence are exposed as window.motion / window.AnimatePresence
// via the bootstrap script in the main HTML. JSX uses them lowercase as tags.

// ──────────────────────────────────────────────────────────
// Sophia Circle — colorful brand orb + wordmark
// ──────────────────────────────────────────────────────────
function SophiaCircle({ size = 128, style = "aurora", theme = "dark" }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size + 74, height: size + 74 }}>
      {/* soft outer bloom */}
      <div
        className="absolute rounded-full breathe pointer-events-none"
        style={{
          width: size + 36, height: size + 36,
          background: "radial-gradient(circle, rgba(230,236,232,0.64), rgba(230,236,232,0) 72%)",
          filter: "blur(12px)"
        }}
      />

      {/* ring */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size + 12, height: size + 12,
          border: "1px solid rgba(255,255,255,0.30)",
        }}
      />

      {/* colorful core */}
      <div
        className="relative rounded-full breathe-inner overflow-hidden"
        style={{
          width: size, height: size,
          background: "radial-gradient(circle at 29% 38%, #c6e3df 0%, #add5d0 27%, transparent 62%), radial-gradient(circle at 79% 33%, #f3bdd7 0%, #e6a9c8 25%, transparent 58%), radial-gradient(circle at 67% 79%, #d7efb8 0%, #c6e89d 22%, transparent 50%), radial-gradient(circle at 47% 20%, #f2dcab 0%, #ead09d 22%, transparent 50%), linear-gradient(145deg, #dbe8e4 0%, #edf2ee 100%)",
          boxShadow: "inset 0 0 30px rgba(255,255,255,0.5), 0 16px 34px rgba(0,0,0,0.2)"
        }}
      >
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at 36% 28%, rgba(255,255,255,0.40), transparent 42%)"
        }}/>
        <div
          className="absolute inset-0 flex items-center justify-center font-sans font-extrabold tracking-tight"
            style={{
              color: theme === "light" ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.98)",
              fontSize: Math.max(18, size * 0.24),
              letterSpacing: "-0.045em",
              textShadow: "0 1px 1px rgba(35,42,37,0.20)"
            }}
        >
          <span className="relative inline-block">
            sophia
            <span
              aria-hidden="true"
              className="absolute"
              style={{
                right: size * 0.016,
                top: size * -0.06,
                width: size * 0.076,
                height: size * 0.028,
                background: theme === "light" ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.98)",
                transform: "rotate(-30deg)",
                borderRadius: 999,
                clipPath: "polygon(0 50%, 100% 0, 82% 100%)"
              }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Goal Card — editable, persists to localStorage
// ──────────────────────────────────────────────────────────
function GoalCard({ goal, setGoal, quote }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(goal);
  const commit = () => { setGoal(draft.trim() || goal); setEditing(false); };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-2.5">
        <span className="text-[10px] tracking-[0.22em] text-sage-300 font-semibold">NORTH STAR</span>
        <span className="w-1 h-1 rounded-full bg-ink-500/60"/>
        <span className="text-[10px] text-ink-500 font-mono tabular-nums">COMMITTED 9D AGO</span>
        <span className="w-1 h-1 rounded-full bg-ink-500/60"/>
        <span className="text-[10px] text-ink-500 font-mono tabular-nums">Q2 FOCUS</span>
        <button onClick={() => setEditing(e => !e)}
          className="ml-auto text-[10px] tracking-[0.18em] text-ink-500 hover:text-sage-300 transition font-medium">
          {editing ? "SAVE" : "EDIT"}
        </button>
      </div>
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => e.key === "Enter" && commit()}
          className="w-full bg-transparent text-[30px] leading-tight tracking-tight text-ink-50 outline-none border-b border-sage-500/50 pb-1 font-medium"
        />
      ) : (
        <h1 className="text-[30px] leading-[1.1] tracking-tight text-ink-50 font-medium" style={{textWrap:"balance"}}>
          {goal}
        </h1>
      )}
      <p className="mt-3 text-[13px] leading-[1.6] text-ink-300 max-w-[62ch] font-serif">
        {quote}
      </p>
      <div className="mt-4 flex items-center gap-4">
        <button className="text-[10.5px] tracking-[0.18em] text-sage-300 hover:text-sage-200 transition font-medium flex items-center gap-1.5">
          <span className="inline-block w-1 h-1 rounded-full bg-sage-400"/> REFRAME GOAL
        </button>
        <button className="text-[10.5px] tracking-[0.18em] text-ink-500 hover:text-ink-300 transition font-medium">
          SEE LINEAGE
        </button>
        <button className="text-[10.5px] tracking-[0.18em] text-ink-500 hover:text-ink-300 transition font-medium">
          SHARE WITH TEAM
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Active Blocker Card — amber left border
// ──────────────────────────────────────────────────────────
function BlockerCard() {
  return (
    <div
      className="whisper-enter relative grid grid-cols-[auto_1fr_auto] gap-4 p-4 pr-5 rounded-md bg-gradient-to-r from-amber-400/[0.07] via-amber-400/[0.02] to-transparent border border-amber-400/25 border-l-[3px] border-l-amber-400"
    >
      <div className="pt-0.5">
        <div className="w-9 h-9 rounded-md bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-amber-400">
          <IconBolt size={14}/>
        </div>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-[0.22em] text-amber-400 font-semibold">ACTIVE BLOCKER</span>
          <span className="w-1 h-1 rounded-full bg-ink-500/60"/>
          <span className="text-[10px] text-ink-500 font-mono tabular-nums">DETECTED 14M AGO</span>
          <span className="w-1 h-1 rounded-full bg-ink-500/60"/>
          <span className="text-[10px] text-ink-500 font-mono tabular-nums">CONFIDENCE 0.91</span>
        </div>
        <p className="mt-1.5 text-[14.5px] leading-snug text-ink-50">
          <span className="font-semibold">Technical hurdle #12</span> unresolved — Mikey awaiting Speaker 2 for 3 days.
        </p>
        <div className="mt-2 text-[12px] text-ink-300 leading-snug">
          <span className="text-[10px] tracking-[0.18em] text-sage-300 font-semibold mr-2">NEXT STEP</span>
          15-min sync with Mikey & Speaker 2 today · est. unblocks 2 downstream tasks
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-500 text-ink-900 text-[11.5px] font-medium tracking-wide transition">
            Schedule sync
          </button>
          <button className="px-3 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-ink-300 text-[11.5px] tracking-wide transition">
            Assign
          </button>
          <button className="px-3 py-1.5 rounded-md bg-transparent hover:bg-white/[0.04] border border-white/10 text-ink-500 text-[11.5px] tracking-wide transition">
            Snooze 1h
          </button>
          <button className="px-3 py-1.5 rounded-md bg-transparent hover:bg-white/[0.04] border border-white/10 text-ink-500 text-[11.5px] tracking-wide transition">
            Dismiss
          </button>
        </div>
      </div>
      <div className="text-right self-start">
        <div className="text-[9px] tracking-[0.22em] text-ink-500 font-mono">IMPACT</div>
        <div className="mt-1 text-[18px] text-amber-400 font-mono tabular-nums font-medium">−4.2d</div>
        <div className="text-[9px] text-ink-500 font-mono">to milestone</div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Input pill with focus gradient
// ──────────────────────────────────────────────────────────
function InputBar({ value, onChange, onSubmit, placeholder = "What's on your mind?" }) {
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef();
  return (
    <div className={`input-shell ${focused ? "focused" : ""} px-5 py-3 flex items-center gap-3`} style={{minHeight: 56}}>
      <IconSparkle size={16} className="text-sage-300 shrink-0"/>
      <input
        ref={ref}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onSubmit()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-[16px] text-ink-50 placeholder:text-ink-500/80"
      />
      <button className="p-2 rounded-full hover:bg-white/[0.06] text-ink-300 transition">
        <IconMic size={16}/>
      </button>
      <button
        onClick={onSubmit}
        disabled={!value.trim()}
        className="w-9 h-9 rounded-full bg-sage-500 hover:bg-sage-400 disabled:bg-white/[0.06] disabled:text-ink-500 text-ink-50 flex items-center justify-center transition">
        <IconSend size={14}/>
      </button>
    </div>
  );
}

// Chip suggestions — populate, do not auto-send
function Chip({ label, icon, onClick }) {
  const IconEl = { pulse: IconPulse, sparkle: IconSparkle, leaf: IconLeaf,
                   brain: IconBrain, wave: IconWave, calendar: IconCalendar }[icon] || IconDot;
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/[0.07] hover:border-sage-500/50 bg-white/[0.015] hover:bg-sage-500/[0.08] text-ink-300 hover:text-ink-50 text-[12.5px] transition lift">
      <IconEl size={13} className="text-sage-300 group-hover:text-sage-200"/>
      <span>{label}</span>
    </button>
  );
}

// ──────────────────────────────────────────────────────────
// Growth Constellation — radial dots, connected, highest glows
// ──────────────────────────────────────────────────────────
function GrowthConstellation({ data }) {
  const size = 220;
  const cx = size/2, cy = size/2;
  const max = Math.max(...data.map(d=>d.value));
  const rInner = 22;
  const rOuter = 86;
  const points = data.map((d, i) => {
    const angle = (i / data.length) * Math.PI * 2 - Math.PI/2;
    const r = rInner + (d.value / 50) * (rOuter - rInner);
    return { ...d, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, angle };
  });
  return (
    <div className="relative" style={{width: size, height: size}}>
      <svg width={size} height={size} overflow="visible" style={{overflow: 'visible'}}>
        {/* rings */}
        {[0.33, 0.66, 1].map((t, i) => (
          <circle key={i} cx={cx} cy={cy} r={rInner + (rOuter-rInner)*t}
            fill="none" stroke="rgba(127,166,135,0.08)" strokeDasharray="2 4"/>
        ))}
        {/* spokes */}
        {points.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
            stroke="rgba(127,166,135,0.12)" strokeWidth="1"/>
        ))}
        {/* polygon connecting */}
        <polygon
          points={points.map(p => `${p.x},${p.y}`).join(" ")}
          fill="rgba(74,124,89,0.12)" stroke="rgba(127,166,135,0.35)" strokeWidth="1"/>
        {/* center dot */}
        <circle cx={cx} cy={cy} r={2.5} fill="#7FA687"/>
        {/* dimension dots */}
        {points.map((p, i) => {
          const isMax = p.value === max;
          return (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r={isMax ? 6 : 4}
                fill={isMax ? "#7FA687" : "#4A7C59"}
                className={isMax ? "dot-glow" : ""}/>
              {isMax && <circle cx={p.x} cy={p.y} r={10} fill="none" stroke="#7FA687" strokeOpacity=".4"/>}
            </g>
          );
        })}
        {/* labels */}
        {points.map((p, i) => {
          const lx = cx + Math.cos(p.angle) * (rOuter + 18);
          const ly = cy + Math.sin(p.angle) * (rOuter + 18);
          const anchor = Math.cos(p.angle) > 0.3 ? "start" : Math.cos(p.angle) < -0.3 ? "end" : "middle";
          return (
            <g key={"l"+p.id}>
              <text x={lx} y={ly-4} textAnchor={anchor}
                fill={p.value === max ? "#D7E3D9" : "#7A7A6F"}
                fontSize="10" fontFamily="Inter" letterSpacing="0.12em">
                {p.label.toUpperCase()}
              </text>
              <text x={lx} y={ly+8} textAnchor={anchor}
                fill={p.value === max ? "#7FA687" : "#C8C8BC"}
                fontSize="11" fontFamily="JetBrains Mono" fontWeight="500">
                {p.value}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Speaker avatar circle
function Speaker({ id, size = 24 }) {
  const colors = {
    O: "bg-sage-500 text-ink-50",
    M: "bg-amber-400 text-ink-900",
    U: "bg-sage-300 text-ink-900",
    K: "bg-ink-300 text-ink-900",
  };
  return (
    <div className={`rounded-full flex items-center justify-center font-medium ${colors[id] || "bg-ink-500 text-ink-50"}`}
      style={{width: size, height: size, fontSize: size*0.42}}>
      {id}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// KPI strip — compact metrics cluster, vertical or horizontal
// ──────────────────────────────────────────────────────────
function KpiStrip({ horizontal = false }) {
  const kpis = [
    { label: "ON TRACK",     value: "7/9",  sub: "projects",   tone: "sage"  },
    { label: "TEAM ALIGN",   value: "82%",  sub: "↑ 4 this wk", tone: "sage"  },
    { label: "OPEN BLOCKERS",value: "3",    sub: "1 critical",  tone: "amber" },
    { label: "COMMITS DUE",  value: "12",   sub: "by Friday",   tone: "neutral" },
  ];
  const wrapCls = horizontal
    ? "grid grid-cols-4 gap-2"
    : "flex flex-col gap-2 w-[176px]";

  return (
    <div className={wrapCls}>
      {kpis.map(k => (
        <div key={k.label}
          className={`px-3 py-2.5 rounded-md border ${
            k.tone === "amber" ? "border-amber-400/30 bg-amber-400/[0.04]"
            : k.tone === "sage" ? "border-sage-500/25 bg-sage-500/[0.04]"
            : "border-white/[0.07] bg-white/[0.02]"}`}>
          <div className="text-[9px] tracking-[0.22em] text-ink-500 font-medium">{k.label}</div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className={`text-[22px] tabular-nums font-mono font-medium leading-none ${
              k.tone === "amber" ? "text-amber-400"
              : k.tone === "sage" ? "text-sage-200"
              : "text-ink-50"}`}>{k.value}</span>
          </div>
          <div className="mt-1 text-[10px] text-ink-500 font-mono">{k.sub}</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  SophiaCircle, GoalCard, BlockerCard, InputBar, Chip, GrowthConstellation, Speaker, KpiStrip
});
