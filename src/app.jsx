// ──────────────────────────────────────────────────────────
// Sophia Command Center — main app
// ──────────────────────────────────────────────────────────
function App() {
  const [theme, setTheme] = React.useState(() => localStorage.getItem("sophia.theme") || "dark");
  const [leftOpen, setLeftOpen] = React.useState(false);
  const [rightOpen, setRightOpen] = React.useState(false);

  const [goal, setGoal] = React.useState(() => localStorage.getItem("sophia.goal") || "become a better leader");
  const [draft, setDraft] = React.useState("");
  const [pulse, setPulse] = React.useState(SEED_PULSE);
  const [decisions, setDecisions] = React.useState(SEED_DECISIONS);
  const [commitments, setCommitments] = React.useState(SEED_COMMITMENTS);
  const [whisper, setWhisper] = React.useState(
    "You're already creating conditions where people feel safe to contribute. Now deepen that — show how comfortable you are sitting with ambiguity alongside your team. That's the hallmark of leaders people truly follow."
  );
  const [userTurns, setUserTurns] = React.useState([]);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);
  const [tweaks, setTweaks] = React.useState(window.SOPHIA_TWEAKS);
  const [generating, setGenerating] = React.useState(false);

  // Persist goal & theme
  React.useEffect(() => { localStorage.setItem("sophia.goal", goal); }, [goal]);
  React.useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("sophia.theme", theme);
  }, [theme]);

  // Sync tweaks → state
  React.useEffect(() => { setTheme(tweaks.theme); }, [tweaks.theme]);
  React.useEffect(() => {
    document.body.classList.toggle("grain", !!tweaks.showGrain);
  }, [tweaks.showGrain]);

  // Edit-mode protocol
  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data?.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  // Persist tweaks upstream
  const persistTweaks = (updater) => {
    setTweaks(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: next }, "*");
      return next;
    });
  };

  const submit = () => {
    if (!draft.trim()) return;
    setUserTurns(u => [...u, { id: "u"+Date.now(), text: draft.trim() }]);
    setGenerating(true);
    const reply = SOPHIA_REPLIES[Math.floor(Math.random() * SOPHIA_REPLIES.length)];
    setTimeout(() => {
      // Add new insight card into the pulse canvas
      const newCard = {
        id: "p"+Date.now(),
        kind: Math.random() > 0.5 ? "note" : "card",
        tilt: ["rot-l","rot-r","rot-ll","rot-rr"][Math.floor(Math.random()*4)],
        speaker: "O",
        tone: "calm",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: "Live · just now",
        transcript: "“" + draft.trim() + "”",
        insight: reply,
      };
      setPulse(p => [newCard, ...p]);
      setWhisper(reply);
      setGenerating(false);
    }, 500);
    setDraft("");
  };

  const captureDecision = (item) => {
    const d = {
      id: "d"+Date.now(),
      title: "Captured: " + item.transcript.replace(/[“”]/g, "").slice(0, 60) + (item.transcript.length > 60 ? "…" : ""),
      who: "Oliver",
      when: "just now",
      status: "committed"
    };
    setDecisions(ds => [d, ...ds]);
    setRightOpen(true);
  };

  const densityClass = tweaks.density === "compact" ? "space-y-6" : "space-y-10";

  return (
    <div className="relative h-screen w-screen overflow-visible">
      <TopBar theme={theme} onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")}/>

      {/* Main stage */}
      <div className="relative h-[calc(100vh-56px)]">
        {/* Left edge */}
        <EdgeHandle side="left" label="HISTORY"
          onClick={() => setLeftOpen(o => !o)} open={leftOpen}/>
        {/* Right edge */}
        <EdgeHandle side="right" label="INTELLIGENCE"
          onClick={() => setRightOpen(o => !o)} open={rightOpen}/>

        {/* Drawers */}
        <HistoryDrawer open={leftOpen} onClose={() => setLeftOpen(false)}/>
        <IntelligencePanel
          open={rightOpen}
          onClose={() => setRightOpen(false)}
          decisions={decisions}
          onAddDecision={(d) => setDecisions(ds => [d, ...ds])}
          commitments={commitments}
          setCommitments={setCommitments}
        />

        {/* Center canvas */}
        <main className={`h-full overflow-y-auto nice-scroll transition-all`}
          style={{
            paddingLeft: leftOpen ? 360 : 36,
            paddingRight: rightOpen ? 420 : 36,
          }}>
          <div className={`max-w-[960px] mx-auto py-8 px-8 ${densityClass} glass-panel`}>

            {/* Input + chips */}
            <section>
              <InputBar
                value={draft}
                onChange={setDraft}
                onSubmit={submit}
                generating={generating}
                placeholder="Ask Sophia, or describe what you're navigating…"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {SEED_CHIPS.map(c => (
                  <Chip key={c.label} label={c.label} icon={c.icon}
                    onClick={() => setDraft(c.label)}/>
                ))}
              </div>
            </section>

            {/* EXECUTIVE HEADER — orb + goal + at-a-glance KPIs */}
            <section className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-8 items-start pb-1">
              <div className="pt-1">
                <SophiaCircle
                  size={104}
                  style={tweaks.circleStyle}
                  theme={theme}
                  onClick={() => { setLeftOpen(true); setRightOpen(true); }}
                />
              </div>
              <div className="pt-2 min-w-0">
                <GoalCard
                  goal={goal}
                  setGoal={setGoal}
                  quote="Balancing ownership and listening to build a team that trusts your direction. Focus this quarter: naming decisions clearly, making space for dissent, and unblocking faster."
                />
              </div>
              <div className="pt-1 hidden xl:block">
                <KpiStrip/>
              </div>
            </section>

            {/* Metrics strip (mobile / narrow) */}
            <section className="xl:hidden">
              <KpiStrip horizontal/>
            </section>

            {/* Today's read */}
            <section>
              <SophiaWhisper text={whisper}/>
            </section>

            {/* Blocker */}
            <section>
              <BlockerCard/>
            </section>

            {/* Meeting prep row */}
            <section>
              <MeetingRow/>
            </section>

            {/* Pulse Canvas */}
            <section>
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-[11px] tracking-[0.22em] text-ink-50 font-semibold">PULSE CANVAS</span>
                  <span className="font-mono text-[10px] text-ink-500 tabular-nums">{pulse.length} signals · last 4h</span>
                </div>
                <div className="flex items-center gap-1 p-0.5 rounded-md bg-white/[0.03] border border-white/[0.05]">
                  {["ALL", "TENSE", "CURIOUS", "DECISIVE"].map((f, i) => (
                    <button key={f} className={`px-2 py-1 text-[10px] tracking-[0.14em] rounded transition ${
                      i === 0 ? "bg-white/[0.06] text-ink-50" : "text-ink-500 hover:text-ink-300"
                    }`}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="relative pl-0 md:pl-14">
                {/* timeline spine */}
                <div className="hidden md:block absolute left-[30px] top-2 bottom-2 w-px bg-gradient-to-b from-sage-500/30 via-sage-500/10 to-transparent"/>
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {userTurns.slice().reverse().map(u => (
                      <UserTurn key={u.id} text={u.text}/>
                    ))}
                    {pulse.map((item) => (
                      <PulseCard
                        key={item.id}
                        item={item}
                        onCapture={captureDecision}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* Footer note */}
            <section className="pt-4 pb-10">
              <div className="flex items-center justify-between text-[10px] tracking-[0.22em] text-ink-500 font-mono border-t border-white/[0.05] pt-4">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-sage-400"/>
                  ENCRYPTED · PRIVATE BY DEFAULT · NOT USED FOR TRAINING
                </div>
                <div className="tabular-nums">
                  v 2.4.1 · SYNCED 11:47
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {tweaksOpen && <TweaksPanel tweaks={tweaks} setTweaks={persistTweaks} onClose={() => setTweaksOpen(false)}/>}
      </AnimatePresence>
    </div>
  );
}

// Destructure framer-motion — already exposed on window via bootstrap, but
// keep a belt-and-suspenders assignment.
if (window.Motion) {
  window.motion = window.Motion.motion;
  window.AnimatePresence = window.Motion.AnimatePresence;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
