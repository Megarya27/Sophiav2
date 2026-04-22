// Tweaks panel — toggles on/off via parent toolbar
function TweaksPanel({ tweaks, setTweaks, onClose }) {
  const update = (k, v) => setTweaks(t => ({ ...t, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
      className="fixed bottom-5 right-5 z-50 w-[280px] rounded-xl bg-ink-900/95 backdrop-blur-xl border border-sage-500/30 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)]">
      <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconSparkle size={12} className="text-sage-300"/>
          <span className="text-[10px] tracking-[0.24em] text-ink-50">TWEAKS</span>
        </div>
        <button onClick={onClose} className="text-ink-500 hover:text-ink-300 p-1"><IconX size={12}/></button>
      </div>
      <div className="p-3 space-y-4">
        <TweakRow label="Theme">
          {["dark","light"].map(v => (
            <Pill key={v} active={tweaks.theme === v} onClick={() => update("theme", v)}>{v}</Pill>
          ))}
        </TweakRow>
        <TweakRow label="Accent">
          {["sage","forest","amber"].map(v => (
            <Pill key={v} active={tweaks.accent === v} onClick={() => update("accent", v)}>{v}</Pill>
          ))}
        </TweakRow>
        <TweakRow label="Sophia orb">
          {["aurora","solid"].map(v => (
            <Pill key={v} active={tweaks.circleStyle === v} onClick={() => update("circleStyle", v)}>{v}</Pill>
          ))}
        </TweakRow>
        <TweakRow label="Density">
          {["comfy","compact"].map(v => (
            <Pill key={v} active={tweaks.density === v} onClick={() => update("density", v)}>{v}</Pill>
          ))}
        </TweakRow>
        <TweakRow label="Grain">
          <Pill active={tweaks.showGrain} onClick={() => update("showGrain", !tweaks.showGrain)}>
            {tweaks.showGrain ? "on" : "off"}
          </Pill>
        </TweakRow>
      </div>
    </motion.div>
  );
}

function TweakRow({ label, children }) {
  return (
    <div>
      <div className="text-[9.5px] tracking-[0.2em] text-ink-500 mb-1.5">{label.toUpperCase()}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-[11px] border transition
        ${active
          ? "bg-sage-500/25 border-sage-500/60 text-sage-200"
          : "bg-white/[0.02] border-white/[0.08] text-ink-300 hover:text-ink-50"}`}>
      {children}
    </button>
  );
}

Object.assign(window, { TweaksPanel });
