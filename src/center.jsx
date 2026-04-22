// ──────────────────────────────────────────────────────────
// Pulse Card — structured insight row (PM mode)
// ──────────────────────────────────────────────────────────
function PulseCard({ item, onCapture }) {
  const toneColor = item.tone === "tense" ? "#D6A24A"
                  : item.tone === "curious" ? "#A8C3AD" : "#7FA687";
  const toneBorder = item.tone === "tense" ? "border-l-amber-400/70"
                   : item.tone === "curious" ? "border-l-sage-300/70" : "border-l-sage-500/70";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      className="group relative"
    >
      <div>
      {/* Timestamp gutter */}
      <div className="absolute -left-14 top-4 text-[10px] text-ink-500 font-mono hidden md:block tabular-nums">
        {item.time}
      </div>

      <div className={`relative pl-4 pr-4 py-4 rounded-r-md border-l-2 ${toneBorder} bg-white/[0.02] hover:bg-white/[0.035] border-y border-r border-white/[0.05] hover:border-white/[0.1] transition`}>
        {/* Header row */}
        <div className="flex items-center gap-2 text-[10.5px] text-ink-500">
          <Speaker id={item.speaker} size={18}/>
          <span className="font-medium text-ink-300">{
            { O: "Oliver", M: "Mikey", U: "Una", K: "Kei" }[item.speaker] || item.speaker
          }</span>
          <span className="w-1 h-1 rounded-full bg-ink-500/50"/>
          <span className="font-mono">{item.source}</span>
          <span className="ml-auto uppercase tracking-[0.18em] text-[9px] font-medium" style={{ color: toneColor }}>
            {item.tone}
          </span>
          <button className="opacity-0 group-hover:opacity-100 transition text-sage-300 hover:text-sage-200 p-1 rounded hover:bg-white/[0.04]" title="Play 10s snippet">
            <IconPlay size={9}/>
          </button>
        </div>

        {/* Transcript */}
        <p className="mt-2 text-[14px] leading-snug text-ink-50">
          {item.transcript}
        </p>

        {/* Sophia insight */}
        <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-start gap-2.5">
          <div className="mt-0.5 flex items-center gap-1.5 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-sage-400"/>
            <span className="text-[9px] tracking-[0.24em] text-sage-300 font-medium">SOPHIA</span>
          </div>
          <p className="text-[12.5px] leading-[1.55] text-ink-300">
            {item.insight}
          </p>
        </div>

        {/* Footer actions */}
        <div className="mt-3 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition">
          <button onClick={() => onCapture && onCapture(item)}
            className="text-[10px] tracking-[0.18em] text-sage-300 hover:text-sage-200 flex items-center gap-1 font-medium">
            <IconPlus size={10}/> CAPTURE DECISION
          </button>
          <button className="text-[10px] tracking-[0.18em] text-ink-500 hover:text-ink-300 font-medium">PIN</button>
          <button className="text-[10px] tracking-[0.18em] text-ink-500 hover:text-ink-300 font-medium">ASSIGN</button>
          <button className="text-[10px] tracking-[0.18em] text-ink-500 hover:text-ink-300 font-medium">SHARE</button>
        </div>
      </div>
      </div>
    </motion.article>
  );
}

// ──────────────────────────────────────────────────────────
// Sophia response bubble (non-chat style — a whispered aside)
// ──────────────────────────────────────────────────────────
function SophiaWhisper({ text }) {
  return (
    <div
      className="whisper-enter relative p-4 pl-5 rounded-md bg-gradient-to-r from-sage-500/[0.08] via-sage-500/[0.03] to-transparent border border-sage-500/20 border-l-[3px] border-l-sage-400"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-sage-300 via-sage-500 to-sage-700 relative overflow-hidden shrink-0">
          <div className="absolute inset-0" style={{background:"conic-gradient(from 120deg, rgba(255,255,255,0.3), transparent 40%, rgba(214,162,74,0.3) 60%, transparent)"}}/>
        </div>
        <span className="text-[10px] tracking-[0.24em] text-sage-300 font-semibold">SOPHIA · TODAY'S READ</span>
        <span className="w-1 h-1 rounded-full bg-ink-500/60"/>
        <span className="text-[10px] text-ink-500 font-mono tabular-nums">UPDATED 11:47</span>
      </div>
      <p className="text-[14px] leading-[1.55] text-ink-50 max-w-[68ch]" style={{textWrap:"pretty"}}>
        {text}
      </p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// User turn (the user speaking to Sophia) — offset & subtle
// ──────────────────────────────────────────────────────────
function UserTurn({ text }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="relative pl-14"
    >
      <div className="absolute left-0 top-1">
        <Speaker id="O" size={32}/>
      </div>
      <div className="text-[10px] tracking-[0.22em] text-ink-500 mb-1">YOU · just now</div>
      <p className="text-[15px] leading-[1.5] text-ink-300">{text}</p>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────
// Meeting Prep Cards — horizontal scroll row
// ──────────────────────────────────────────────────────────
function MeetingRow() {
  return (
    <div className="relative">
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-3">
          <span className="text-[10px] tracking-[0.22em] text-ink-500">UPCOMING · ON THE HORIZON</span>
          <span className="font-mono text-[10px] text-ink-500">{SEED_MEETINGS.length} meetings queued</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-ink-500">
          <IconChevronLeft size={14}/> <IconChevronRight size={14}/>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto nice-scroll pb-2 -mx-2 px-2">
        {SEED_MEETINGS.map(m => (
          <div key={m.id}
            className="shrink-0 w-[280px] rounded-lg p-4 bg-white/[0.025] hover:bg-white/[0.045] border border-white/[0.07] hover:border-sage-500/40 lift">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-sage-300">{m.time}</span>
              <span className="font-mono text-[10px] text-ink-500">{m.duration}</span>
            </div>
            <h4 className="mt-1.5 text-[15px] text-ink-50 font-medium tracking-tight">{m.title}</h4>
            <div className="mt-2.5 flex items-center gap-1">
              {m.attendees.map((a, i) =>
                a.startsWith("+")
                  ? <div key={i} className="w-5 h-5 rounded-full bg-white/[0.05] text-ink-500 text-[9px] font-mono flex items-center justify-center">{a}</div>
                  : <Speaker key={i} id={a} size={20}/>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.05]">
              <div className="text-[9px] tracking-[0.22em] text-sage-300 font-semibold mb-1">SOPHIA TIP</div>
              <div className="flex items-start gap-1.5">
                <p className="text-[12px] leading-snug text-ink-300">{m.tip}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Top bar — floating nav
// ──────────────────────────────────────────────────────────
function TopBar({ onToggleTheme, theme }) {
  const nav = ["SOPHIA", "CULTURE HEALTH", "CALENDAR", "STUDIO"];
  const [active, setActive] = React.useState("SOPHIA");
  return (
    <div className="relative h-14 px-6 flex items-center gap-6 border-b border-white/[0.04]">
      {/* Wordmark */}
      <div className="flex items-center gap-2 shrink-0 min-w-0">
        <div className="relative h-8 w-[88px] shrink-0">
          <div className="absolute inset-0 rounded-full border border-white/32 shadow-[0_8px_20px_-14px_rgba(0,0,0,0.7)]" style={{
            background: "radial-gradient(circle at 29% 38%, #c6e3df 0%, #add5d0 27%, transparent 62%), radial-gradient(circle at 79% 33%, #f3bdd7 0%, #e6a9c8 25%, transparent 58%), radial-gradient(circle at 67% 79%, #d7efb8 0%, #c6e89d 22%, transparent 50%), radial-gradient(circle at 47% 20%, #f2dcab 0%, #ead09d 22%, transparent 50%), linear-gradient(145deg, #dbe8e4 0%, #edf2ee 100%)"
          }} />
          <span className={`absolute inset-0 flex items-center justify-center font-sans font-extrabold text-[13px] leading-none tracking-[-0.045em] ${theme === "light" ? "text-black" : "text-white"} drop-shadow-[0_1px_1px_rgba(35,42,37,0.2)]`}>
            <span className="relative inline-block">
              sophia
              <span
                aria-hidden="true"
                className="absolute"
                style={{
                  right: 2.2,
                  top: -3,
                  width: 7,
                  height: 2.2,
                  background: theme === "light" ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.98)",
                  transform: "rotate(-30deg)",
                  borderRadius: 999,
                  clipPath: "polygon(0 50%, 100% 0, 82% 100%)"
                }}
              />
            </span>
          </span>
        </div>
        <span className="hidden lg:inline text-[9px] tracking-[0.22em] text-ink-500 font-mono ml-1 mt-0.5">COMMAND CENTER</span>
      </div>

      {/* Nav — center, flex-grows to share space */}
      <nav className="flex-1 flex items-center justify-center gap-5 xl:gap-7 min-w-0 overflow-hidden">
        {nav.map(n => (
          <button key={n}
            onClick={() => setActive(n)}
            className={`relative text-[11px] tracking-[0.22em] whitespace-nowrap transition
              ${active === n ? "text-ink-50" : "text-ink-500 hover:text-ink-300"}`}>
            {n}
            <span
              aria-hidden="true"
              className={`absolute -bottom-[18px] left-0 right-0 h-px bg-sage-400 transition-opacity ${active === n ? "opacity-100" : "opacity-0"}`}
            />
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4 shrink-0">
        {/* Listening indicator — collapses to just the dot on narrower widths */}
        <div className="flex items-center gap-1.5 text-[11px] text-ink-500 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-sage-400 animate-pulse"/>
          <span className="hidden xl:inline whitespace-nowrap">listening · 2 active streams</span>
          <span className="hidden md:inline xl:hidden whitespace-nowrap">listening</span>
        </div>
        <button onClick={onToggleTheme}
          className="w-8 h-8 rounded-full hover:bg-white/[0.05] flex items-center justify-center text-ink-300 transition shrink-0">
          {theme === "dark" ? <IconSun size={14}/> : <IconMoon size={14}/>}
        </button>
        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/[0.05]">
          <Speaker id="O" size={26}/>
          <span className="text-[12px] text-ink-300">Oliver</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PulseCard, SophiaWhisper, UserTurn, MeetingRow, TopBar });
