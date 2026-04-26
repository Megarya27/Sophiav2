// ──────────────────────────────────────────────────────────
// Sophia Command Center — main app
// ──────────────────────────────────────────────────────────
// Polished Team Trend dashboard with period controls, aggregated data, animated line and tooltips
function TeamTrendDashboard({ base = [22,36,51,78], theme = 'dark' }) {
  const [period, setPeriod] = React.useState('Weekly'); // Weekly, Monthly, Quarterly
  const [hover, setHover] = React.useState(null);
  const w = 640, h = 180, pad = 28;

  // generate datasets for each period
  const generateData = (period) => {
    if (period === 'Weekly') {
      // 4 weekly points
      return { labels: ['Wk 1','Wk 2','Wk 3','Wk 4'], values: base };
    }
    if (period === 'Monthly') {
      // aggregate into 3 monthly points (sample)
      const vals = [Math.round((base[0]+base[1])/2), Math.round((base[1]+base[2])/2), Math.round((base[2]+base[3])/2)];
      return { labels: ['M1','M2','M3'], values: vals };
    }
    // Quarterly -> 4 quarters
    const q1 = Math.round((base[0]+base[1])/2);
    const q2 = Math.round((base[1]+base[2])/2);
    const q3 = Math.round((base[2]+base[3])/2);
    const q4 = Math.round((base[3] + base[3]) / 2);
    return { labels: ['Q1','Q2','Q3','Q4'], values: [q1,q2,q3,q4] };
  };

  const { labels, values } = generateData(period);
  const min = Math.min(...values), max = Math.max(...values);
  const range = Math.max(1, max - min);
  const points = values.map((v, i) => {
    const x = pad + (i / Math.max(1, values.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return { x, y, v, i };
  });
  const d = points.map((p, i) => `${i===0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
  const fillD = d + ` L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`;

  const wrapperClass = theme === 'dark'
    ? 'rounded-md p-4 pt-10 bg-white/[0.02] border border-white/[0.04] shadow-sm relative'
    : 'rounded-md p-4 pt-10 bg-white border border-gray-200 shadow-sm relative';

  return (
    <div>
      <div className={wrapperClass}>
        {/* Latest metric positioned top-left */}
        <div className="absolute top-3 left-4 text-sm text-ink-500 font-medium">Latest: <span className="num">{values[values.length-1]}%</span></div>

        {/* Segmented control (top-right) */}
        <div className="absolute top-3 right-4">
            <div className={theme === 'dark' ? 'flex items-center gap-2 bg-white/[0.02] rounded-full p-1 px-2' : 'flex items-center gap-2 bg-gray-100 rounded-full p-1 px-2'}>
            {['Weekly','Monthly','Quarterly'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-full text-sm text-center transition ${period === p ? 'bg-white/[0.06] text-ink-50' : 'text-ink-500 hover:text-ink-300'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-2">
          <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="trendFill2" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#7FA687" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#7FA687" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="trendLine2" x1="0" x2="1">
                <stop offset="0%" stopColor="#7FA687" />
                <stop offset="100%" stopColor="#D6A24A" />
              </linearGradient>
            </defs>
            {/* subtle grid lines */}
            {[0,0.25,0.5,0.75,1].map((t,i) => (
              <line key={i} x1={pad} x2={w-pad} y1={pad + t*(h-pad*2)} y2={pad + t*(h-pad*2)} stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 6" />
            ))}

            {/* filled area */}
            <path d={fillD} fill="url(#trendFill2)" />

            {/* animated trend line */}
            <motion.path d={d} fill="none" stroke="url(#trendLine2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9 }} style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.25))' }} />

            {/* points */}
            {points.map(p => (
              <g key={p.i} transform={`translate(${p.x},${p.y})`}>
                <circle r={6} fill="#fff" stroke="#7FA687" strokeWidth={2} onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)} />
              </g>
            ))}

            {/* x labels aligned under ticks */}
            {points.map((p,i) => (
              <text key={i} x={p.x} y={h - 6} textAnchor="middle" fill="#C8C8BC" fontSize="11">{labels[i]}</text>
            ))}

            {/* svg-based tooltip (scales with the graph) */}
            {hover && (
              <g transform={`translate(${hover.x},${hover.y - 28})`} pointerEvents="none">
                <rect x={-40} y={-22} width={80} height={36} rx={6} fill="#0b0b0b" stroke="rgba(255,255,255,0.06)" />
                <text x={0} y={-4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600">{labels[hover.i]}</text>
                <text x={0} y={12} textAnchor="middle" fill="#c8c8bc" fontSize="11">{hover.v}%</text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}

// Hook: measure an element's content box using ResizeObserver
const useMeasure = (ref) => {
  const [rect, setRect] = React.useState({ width: 0, height: 0 });
  React.useEffect(() => {
    if (!ref || !ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const r = e.contentRect;
        setRect({ width: r.width, height: r.height });
      }
    });
    ro.observe(el);
    // set initial
    setRect({ width: el.clientWidth, height: el.clientHeight });
    return () => ro.disconnect();
  }, [ref]);
  return rect;
};

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

  // initialize selectedDate to today
  React.useEffect(() => {
    setSelectedDate(new Date());
  }, []);

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

  // Close record menu on outside click
  React.useEffect(() => {
    const onDocClick = (e) => {
      if (!openRecordFor) return;
      const menu = recordMenuRef.current;
      const target = e.target;
      if (menu && menu.contains(target)) return;
      const attr = target.closest && target.closest('[data-meeting-id]');
      if (attr && attr.getAttribute && attr.getAttribute('data-meeting-id') === openRecordFor) return;
      setOpenRecordFor(null);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openRecordFor]);

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
  const [page, setPage] = React.useState('Home');
  const [calendarView, setCalendarView] = React.useState('week'); // 'month' | 'week' | 'year'
  const [selectedMember, setSelectedMember] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [openRecordFor, setOpenRecordFor] = React.useState(null);
  const recordMenuRef = React.useRef(null);
  const [recordMenuPos, setRecordMenuPos] = React.useState(null);

  // Close the floating record menu when the user scrolls, resizes, or interacts to avoid stale positioning
  React.useEffect(() => {
    const handleCloseOnScroll = () => {
      if (openRecordFor !== null) {
        setOpenRecordFor(null);
        setRecordMenuPos(null);
      }
    };
    window.addEventListener('scroll', handleCloseOnScroll, { passive: true });
    window.addEventListener('wheel', handleCloseOnScroll, { passive: true });
    window.addEventListener('touchstart', handleCloseOnScroll, { passive: true });
    window.addEventListener('resize', handleCloseOnScroll);
    return () => {
      window.removeEventListener('scroll', handleCloseOnScroll);
      window.removeEventListener('wheel', handleCloseOnScroll);
      window.removeEventListener('touchstart', handleCloseOnScroll);
      window.removeEventListener('resize', handleCloseOnScroll);
    };
  }, [openRecordFor]);

  // Calendar navigation helpers
  const goToPrevMonth = () => setSelectedDate(d => {
    const dt = new Date(d || new Date());
    dt.setMonth(dt.getMonth() - 1);
    dt.setDate(1);
    return dt;
  });
  const goToNextMonth = () => setSelectedDate(d => {
    const dt = new Date(d || new Date());
    dt.setMonth(dt.getMonth() + 1);
    dt.setDate(1);
    return dt;
  });
  const goToPrevWeek = () => setSelectedDate(d => {
    const dt = new Date(d || new Date());
    dt.setDate(dt.getDate() - 7);
    return dt;
  });
  const goToNextWeek = () => setSelectedDate(d => {
    const dt = new Date(d || new Date());
    dt.setDate(dt.getDate() + 7);
    return dt;
  });
  const goToPrevYear = () => setSelectedDate(d => {
    const dt = new Date(d || new Date());
    dt.setFullYear(dt.getFullYear() - 1);
    dt.setMonth(0);
    dt.setDate(1);
    return dt;
  });
  const goToNextYear = () => setSelectedDate(d => {
    const dt = new Date(d || new Date());
    dt.setFullYear(dt.getFullYear() + 1);
    dt.setMonth(0);
    dt.setDate(1);
    return dt;
  });
  const goToThisWeek = () => { setSelectedDate(new Date()); setCalendarView('week'); };

  // generate pseudo growth dimensions for a member based on score
  const generateMemberGrowth = (member) => {
    const base = member && member.score ? member.score : 70;
    const labels = SEED_GROWTH.map(g => g.label);
    return labels.map((label, i) => {
      // spread values around base with a small variance
      const variance = (i * 3 + (member.score % 7)) % 10;
      const val = Math.max(18, Math.min(92, Math.round(base - 12 + (i * 4) + variance - 4)));
      return { id: label.toLowerCase().replace(/\s+/g, '-'), label, value: val };
    });
  };

  // no modal — we'll swap the main view inline using `selectedMember`

  // compute team-average across participants (returns array matching SEED_GROWTH)
  const computeTeamAverage = (participants) => {
    const all = participants.map(p => generateMemberGrowth(p).map(d => d.value));
    if (all.length === 0) return SEED_GROWTH.map(g => ({ label: g.label, value: 0 }));
    const sums = all[0].map((_, i) => all.reduce((s, arr) => s + (arr[i] || 0), 0));
    return sums.map((s, i) => ({ label: SEED_GROWTH[i].label, value: Math.round(s / all.length) }));
  };

  // Calendar helpers: normalize meeting time strings to weekday short names
  const weekLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const normalizeDayFromString = (t) => {
    if (!t) return null;
    const s = String(t).toLowerCase();
    if (s.includes('mon')) return 'Mon';
    if (s.includes('tue')) return 'Tue';
    if (s.includes('wed')) return 'Wed';
    if (s.includes('thu')) return 'Thu';
    if (s.includes('fri')) return 'Fri';
    if (s.includes('sat')) return 'Sat';
    if (s.includes('sun')) return 'Sun';
    if (s.includes('today')) {
      const d = new Date();
      const map = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      return map[d.getDay()];
    }
    if (s.includes('tomorrow')) {
      const d = new Date();
      const map = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      return map[(d.getDay() + 1) % 7];
    }
    return null;
  };

  const getWeekCounts = (meetings) => {
    const counts = { Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0, Sun:0 };
    (meetings || []).forEach(m => {
      const day = normalizeDayFromString(m.time);
      if (day && counts[day] !== undefined) counts[day] += 1;
    });
    return counts;
  };

  const getWeekDates = (refDate = new Date()) => {
    const res = [];
    // compute Monday for the current week
    const day = refDate.getDay(); // 0 (Sun) - 6 (Sat)
    const diffToMon = (day + 6) % 7; // days since Monday
    const mon = new Date(refDate);
    mon.setDate(refDate.getDate() - diffToMon);
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      res.push({ label: weekLabels[i], date: d, dayNum: d.getDate() });
    }
    return res;
  };

  const formatMonthYear = (d) => {
    const dt = new Date(d || new Date());
    return `${dt.toLocaleString(undefined, { month: 'long' })} ${dt.getFullYear()}`;
  };

  const formatWeekRange = (d) => {
    const dates = getWeekDates(d || new Date()).map(x => x.date);
    const start = dates[0];
    const end = dates[6];
    const startStr = start.toLocaleString(undefined, { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleString(undefined, { month: 'short', day: 'numeric' });
    const year = end.getFullYear();
    return `${startStr} — ${endStr}, ${year}`;
  };

  // Build a month grid (array of weeks, each week is 7 Date objects) starting on Monday
  const getMonthGrid = (refDate = new Date()) => {
    const year = refDate.getFullYear();
    const month = refDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    // find Monday on or before the first of month
    const day = firstOfMonth.getDay(); // 0 Sun - 6 Sat
    const diffToMon = (day + 6) % 7;
    const start = new Date(firstOfMonth);
    start.setDate(firstOfMonth.getDate() - diffToMon);
    const weeks = [];
    let cur = new Date(start);
    for (let w = 0; w < 6; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        week.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  };

  // Map meetings into all matching dates across a month grid (recurring by weekday), plus Today/Tomorrow one-off mappings
  const mapMeetingsToMonthDates = (meetings, monthGrid) => {
    const map = {};
    const flat = monthGrid.flat();
    const labels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const today = new Date();
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    (meetings || []).forEach(m => {
      const s = String(m.time || '').toLowerCase();
      if (s.includes('today')) {
        const key = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
        map[key] = map[key] || [];
        map[key].push(m);
        return;
      }
      if (s.includes('tomorrow')) {
        const key = `${tomorrow.getFullYear()}-${tomorrow.getMonth()+1}-${tomorrow.getDate()}`;
        map[key] = map[key] || [];
        map[key].push(m);
        return;
      }
      const wd = normalizeDayFromString(m.time);
      if (!wd) return;
      // include all dates in the month grid whose weekday matches wd
      flat.forEach(d => {
        const label = labels[d.getDay()];
        if (label === wd) {
          const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
          map[key] = map[key] || [];
          map[key].push(m);
        }
      });
    });
    return map;
  };

  // small hook to measure element width
  const useMeasure = (ref) => {
    const [rect, setRect] = React.useState({ width: 0, height: 0 });
    React.useEffect(() => {
      if (!ref.current) return;
      const ro = new ResizeObserver(entries => {
        for (const e of entries) {
          const cr = e.contentRect;
          setRect({ width: cr.width, height: cr.height });
        }
      });
      ro.observe(ref.current);
      return () => ro.disconnect();
    }, [ref]);
    return rect;
  };

  // generate an individual profile with requested labels
  const generateIndividualProfile = (member) => {
    const base = member && member.score ? member.score : 70;
    const labels = ['Achievement','Influence','Connection','Autonomy','Recognition','Purpose','Growth'];
    return labels.map((label, i) => {
      const variance = (i * 5 + (member.score % 11)) % 18;
      const val = Math.max(12, Math.min(98, Math.round(base - 14 + i * 3 + variance - 6)));
      return { label, value: val };
    });
  };

  // Simple radar chart component (SVG)
  const TeamRadarChart = ({ data = SEED_GROWTH.map(g => ({ label: g.label, value: g.value })), size = 360 }) => {
    // Mirror the individual's radar style for consistency
    const count = data.length;
    const cx = size / 2, cy = size / 2;
    const maxVal = 100;
    const radius = Math.min(cx, cy) - 36;

    const points = data.map((d, i) => {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const r = (d.value / maxVal) * radius;
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), v: d.value };
    });
    const poly = points.map(p => `${p.x},${p.y}`).join(' ');

    // highlight the max value
    const maxIdx = points.reduce((best, p, i) => p.v > points[best].v ? i : best, 0);

    // wrapper ref to measure available width and adjust font sizes/offsets
    const wrapperRef = React.useRef(null);
    const rect = useMeasure(wrapperRef);
    const containerWidth = rect.width || size + 32; // fallback
    const baseFont = 12;
    const fontSize = containerWidth < 380 ? Math.max(8, baseFont - 3) : baseFont;

    return (
      <div className="w-full flex justify-center" ref={wrapperRef} style={{ padding: 20, overflow: 'visible' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} overflow="visible" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="teamRadarFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7FA687" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#7FA687" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {[0.25,0.5,0.75,1].map((t, idx) => (
            <circle key={idx} cx={cx} cy={cy} r={radius * t} fill="none" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 6" />
          ))}

          {data.map((d, i) => {
            const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.04)" />;
          })}

          <polygon points={poly} fill="url(#teamRadarFill)" stroke="#7FA687" strokeWidth={2} strokeLinejoin="round" opacity={0.98} />

          <circle cx={cx} cy={cy} r={3} fill="#C8C8BC" />

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={5} fill="#fff" stroke="#7FA687" strokeWidth={2} />
              {i === maxIdx && (
                <circle cx={p.x} cy={p.y} r={10} fill="none" stroke="#7FA687" strokeWidth={2} opacity={0.16} />
              )}
            </g>
          ))}

          {/* numeric labels near each point (no percent sign) */}
          {points.map((p, i) => {
            const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
            const offset = 20; // increased padding so numbers don't overlap nodes
            const nx = p.x + Math.cos(angle) * offset;
            const ny = p.y + Math.sin(angle) * offset;
            return (
              <text key={`n-${i}`} x={nx} y={ny} fill="#E6F7EB" stroke="#0b0b0b" strokeWidth={2} paintOrder="stroke" fontSize={12} fontWeight={700} textAnchor="middle" style={{fontVariantNumeric: 'tabular-nums'}}>{p.v}</text>
            );
          })}

          {data.map((d, i) => {
            const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
            // adjust offsets; top/bottom vertices get extra offset to avoid collision
            const baseLabelOffset = 28;
            const basePctOffset = 56;
            const extraForVertical = Math.abs(Math.cos(angle)) < 0.12 ? 14 : 0; // top/bottom
            const labelOffset = baseLabelOffset + extraForVertical;
            const pctOffset = basePctOffset + extraForVertical;
            const baseLX = cx + (radius + labelOffset) * Math.cos(angle);
            const baseLY = cy + (radius + labelOffset) * Math.sin(angle);
            const pctX = cx + (radius + pctOffset) * Math.cos(angle);
            // nudge labels and percentages apart on near-vertical angles to avoid overlap
            const sinA = Math.sin(angle);
            let labelY = baseLY;
            let pctY = baseLY;
            if (Math.abs(sinA) > 0.6) {
              const shift = 10 * Math.sign(sinA); // positive => bottom, negative => top
              // place label slightly further away from center and pct on opposite side
              labelY = baseLY - shift;
              pctY = baseLY + shift;
            }
            const anchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : (Math.cos(angle) > 0 ? 'start' : 'end');
            const pctAnchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : (Math.cos(angle) > 0 ? 'start' : 'end');

            // If still very close to vertical, render two-line layout (label above, pct below)
            if (Math.abs(Math.cos(angle)) < 0.08) {
              return (
                <g key={i}>
                  <text x={baseLX} y={labelY - 6} fill="#C8C8BC" fontSize={fontSize} textAnchor="middle">{d.label}</text>
                </g>
              );
            }

            return (
              <g key={i}>
                <text x={baseLX} y={labelY} fill="#C8C8BC" fontSize={fontSize} textAnchor={anchor}>{d.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Individual radar chart that matches the attached reference style
  const IndividualRadarChart = ({ data = [], size = 360, accent = '#7FA687' }) => {
    const count = data.length;
    const cx = size / 2, cy = size / 2;
    const maxVal = 100;
    const radius = Math.min(cx, cy) - 36;

    const points = data.map((d, i) => {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const r = (d.value / maxVal) * radius;
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), v: d.value };
    });
    const poly = points.map(p => `${p.x},${p.y}`).join(' ');

    // find highest point to highlight
    const maxIdx = points.reduce((best, p, i) => p.v > points[best].v ? i : best, 0);

    // ensure labels that sit just outside the radar are visible (no clipping)
    const wrapperRefI = React.useRef(null);
    const rectI = useMeasure(wrapperRefI);
    return (
      <div className="w-full flex justify-center" ref={wrapperRefI} style={{ padding: 20, overflow: 'visible' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} overflow="visible" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="indRadarFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.16" />
              <stop offset="100%" stopColor={accent} stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* dotted rings */}
          {[0.25,0.5,0.75,1].map((t, idx) => (
            <circle key={idx} cx={cx} cy={cy} r={radius * t} fill="none" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 6" />
          ))}

          {/* axes lines */}
          {data.map((d, i) => {
            const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.04)" />;
          })}

          {/* filled polygon */}
          <polygon points={poly} fill="url(#indRadarFill)" stroke={accent} strokeWidth={2} strokeLinejoin="round" opacity={0.98} />

          {/* inner center marker */}
          <circle cx={cx} cy={cy} r={3} fill="#C8C8BC" />

          {/* data points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={5} fill="#fff" stroke={accent} strokeWidth={2} />
              {/* highlight largest */}
              {i === maxIdx && (
                <circle cx={p.x} cy={p.y} r={10} fill="none" stroke={`${accent}`} strokeWidth={2} opacity={0.16} />
              )}
            </g>
          ))}

          {/* numeric labels near each point (no percent sign) */}
          {points.map((p, i) => {
            const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
            const offset = 20;
            const nx = p.x + Math.cos(angle) * offset;
            const ny = p.y + Math.sin(angle) * offset;
            return (
              <text key={`in-${i}`} x={nx} y={ny} fill="#E6F7EB" stroke="#0b0b0b" strokeWidth={2} paintOrder="stroke" fontSize={12} fontWeight={700} textAnchor="middle" style={{fontVariantNumeric: 'tabular-nums'}}>{p.v}</text>
            );
          })}

          {/* labels with percentage near them */}
          {data.map((d, i) => {
            const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
            const labelOffset = 28;
            const pctOffset = 56;
            const baseLX = cx + (radius + labelOffset) * Math.cos(angle);
            const baseLY = cy + (radius + labelOffset) * Math.sin(angle);
            const pctX = cx + (radius + pctOffset) * Math.cos(angle);
            // separate label and percentage vertically on near-vertical axes
            const sinA = Math.sin(angle);
            let labelY = baseLY;
            let pctY = baseLY;
            if (Math.abs(sinA) > 0.6) {
              const shift = 10 * Math.sign(sinA);
              labelY = baseLY - shift;
              pctY = baseLY + shift;
            }
            const anchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : (Math.cos(angle) > 0 ? 'start' : 'end');
            const pctAnchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : (Math.cos(angle) > 0 ? 'start' : 'end');
            return (
              <g key={i}>
                <text x={baseLX} y={labelY} fill="#C8C8BC" fontSize="11" textAnchor={anchor}>{d.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Member detail list view (strict 3-column layout)
  const MemberDetailList = ({ data = [] }) => {
    return (
      <div className="w-full" style={{ padding: 16 }}>
        <div className="space-y-3">
          {data.map((d, i) => {
            const barPct = Math.round(d.value * 0.65); // bar length capped to 65% of middle column
            return (
              <div key={i} className="grid items-center" style={{ gridTemplateColumns: 'minmax(100px, 1fr) 1fr 48px', columnGap: '20px' }}>
                <div className="text-sm text-ink-300" title={d.label} style={{ minWidth: 120, whiteSpace: 'normal', wordBreak: 'break-word' }}>{d.label}</div>
                <div className="relative w-full">
                  <div className="w-full bg-white/[0.02] h-2 rounded-full overflow-hidden">
                    <div style={{ width: `${barPct}%` }} className="h-2 bg-sage-400 transition-all" />
                  </div>
                </div>
                <div className="text-sm font-medium text-ink-50" style={{ width: 48, textAlign: 'right' }}><span className="num">{d.value}%</span></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-screen w-screen overflow-visible">
      <TopBar theme={theme} onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} page={page} onNavigate={setPage} />

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
          {page === 'Home' ? (
            <div className={`max-w-[1140px] mx-auto py-8 px-8 ${densityClass} glass-panel`}>

              {/* CHECK LATEST INSIGHT Notification */}
              <section>
                <div className={`relative`} style={{borderRadius:14, padding:20, border: theme === 'dark' ? '1px solid rgba(22,101,52,0.18)' : '1px solid rgba(22,101,52,0.12)', background: theme === 'dark' ? 'linear-gradient(90deg, rgba(22,101,52,0.16), rgba(6,10,8,0.12))' : 'linear-gradient(90deg, rgba(209,250,229,0.7), rgba(255,255,255,0.9))', boxShadow: theme === 'dark' ? '0 18px 40px rgba(0,0,0,0.7), inset 0 -40px 60px rgba(22,101,52,0.06)' : '0 12px 30px rgba(0,0,0,0.06)'}}>
                  <div style={{position:'absolute', left:10, top:12, bottom:12, width:6, borderRadius:4, background: theme === 'dark' ? 'linear-gradient(180deg,#1f7a4a,#114e2d)' : 'linear-gradient(180deg,#166534,#0b5a33)'}}/>
                  <button aria-label="dismiss insight" onClick={() => setWhisper('')} className="absolute top-3 right-3 text-ink-300 hover:text-ink-50">✕</button>

                  <div className="flex items-start gap-4">
                    <div style={{minWidth:56}}>
                      <div style={{width:52,height:52,borderRadius:9999,display:'flex',alignItems:'center',justifyContent:'center',background: theme === 'dark' ? 'linear-gradient(180deg,#166534,#1f7a4a)' : '#166534', boxShadow: theme === 'dark' ? '0 6px 18px rgba(0,0,0,0.6)' : '0 4px 10px rgba(0,0,0,0.08)'}}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <path d="M15 17H9" stroke="#D1FAE5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 5v6" stroke="#D1FAE5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M20 12a8 8 0 1 0-16 0c0 2.5 1.2 4.7 3.1 6.1L9 21h6l1.9-2.9A7.9 7.9 0 0 0 20 12z" stroke="#D1FAE5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="section-title" style={{color: theme === 'dark' ? '#D1FAE5' : '#0b5a33', fontWeight:700, letterSpacing:'0.08em'}}>CHECK LATEST INSIGHT</div>
                      </div>
                      <p className="mt-4" style={{color: theme === 'dark' ? '#E8FFEF' : '#0f172a', fontSize:15, lineHeight:1.6, fontWeight:500}}>{whisper}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Growth Sessions (was Meeting Reflections) */}
              <section className="mt-6">
                <h2 className="text-[12px] tracking-[0.22em] text-ink-50 font-semibold mb-3">GROWTH SESSIONS</h2>
                <MeetingRow/>
              </section>

              {/* Calendar (full width) */}
              <section className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[12px] tracking-[0.22em] text-ink-50 font-semibold">CALENDAR</div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCalendarView('month')}
                      style={{padding:'6px 12px', borderRadius:999, background: calendarView === 'month' ? (theme === 'dark' ? '#166534' : '#D1FAE5') : 'transparent', color: calendarView === 'month' ? (theme === 'dark' ? '#fff' : '#166534') : undefined, border: calendarView === 'month' ? 'none' : '1px solid rgba(255,255,255,0.04)'}}
                      aria-pressed={calendarView === 'month'}>Month</button>
                    <button onClick={() => setCalendarView('week')}
                      style={{padding:'6px 12px', borderRadius:999, background: calendarView === 'week' ? (theme === 'dark' ? '#166534' : '#D1FAE5') : 'transparent', color: calendarView === 'week' ? (theme === 'dark' ? '#fff' : '#166534') : undefined, border: calendarView === 'week' ? 'none' : '1px solid rgba(255,255,255,0.04)'}}
                      aria-pressed={calendarView === 'week'}>Week</button>
                    <button onClick={() => setCalendarView('year')}
                      style={{padding:'6px 12px', borderRadius:999, background: calendarView === 'year' ? (theme === 'dark' ? '#166534' : '#D1FAE5') : 'transparent', color: calendarView === 'year' ? (theme === 'dark' ? '#fff' : '#166534') : undefined, border: calendarView === 'year' ? 'none' : '1px solid rgba(255,255,255,0.04)'}}
                      aria-pressed={calendarView === 'year'}>Year</button>
                  </div>
                </div>

                <div className={theme === 'dark' ? 'rounded-md p-4 bg-white/[0.02] border border-white/[0.04]' : 'rounded-md p-4 bg-white border border-gray-200'}>
                  {/* Week strip + daily detail (Granola-inspired) */}
                  {(() => {
                    const weekDates = getWeekDates(selectedDate || new Date());
                    const counts = getWeekCounts(SEED_MEETINGS);
                    // map meetings to weekday label
                    const meetingsByDay = weekDates.reduce((acc, wd) => ({ ...acc, [wd.label]: [] }), {});
                    (SEED_MEETINGS || []).forEach(m => {
                      const d = normalizeDayFromString(m.time);
                      if (d && meetingsByDay[d]) meetingsByDay[d].push(m);
                    });
                    const weekStrip = (
                      <div style={{paddingBottom:8}}>
                        <div style={{display:'flex',gap:12,overflowX:'auto',padding:'6px 2px'}}>
                          {weekDates.map(wd => {
                            const c = counts[wd.label] || 0;
                            const active = wd.date.getFullYear() === selectedDate.getFullYear() && wd.date.getMonth() === selectedDate.getMonth() && wd.date.getDate() === selectedDate.getDate();
                            return (
                              <div key={wd.label} onClick={() => { setSelectedDate(wd.date); setCalendarView('week'); }} role="button" tabIndex={0}
                                style={{minWidth:88,flex:'0 0 auto',cursor:'pointer',borderRadius:12,padding:10,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background: active ? (theme === 'dark' ? 'rgba(127,166,135,0.08)' : 'rgba(179,199,235,0.12)') : 'transparent', transition:'all 160ms ease'}}>
                                <div style={{fontSize:12,fontWeight:600,color: theme === 'dark' ? '#DCEFE0' : '#374151'}}>{wd.label}</div>
                                <div style={{fontSize:11,color: theme === 'dark' ? '#A7C9AD' : '#6B7280', marginTop:4}}>{wd.dayNum}</div>
                                <div style={{display:'flex',gap:6,marginTop:8,alignItems:'center'}}>
                                  {Array.from({length: Math.max(1, Math.min(4, c))}).map((_,i) => (
                                    <div key={i} style={{width:8,height:8,borderRadius:999,background: c>0 ? '#166534' : (theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)')}}/>
                                  ))}
                                  {c === 0 && <div style={{width:8,height:8,borderRadius:999,background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}}/>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );

                    const meetingsForDate = (date) => {
                      const labelMap = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                      const label = labelMap[date.getDay()];
                      const today = new Date();
                      const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
                      return (SEED_MEETINGS || []).filter(m => {
                        const s = String(m.time || '').toLowerCase();
                        if (s.includes('today')) {
                          return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
                        }
                        if (s.includes('tomorrow')) {
                          return date.getFullYear() === tomorrow.getFullYear() && date.getMonth() === tomorrow.getMonth() && date.getDate() === tomorrow.getDate();
                        }
                        const wd = normalizeDayFromString(m.time);
                        return wd === label;
                      });
                    };
                    const dayMeetings = meetingsForDate(selectedDate);

                    // month grid data (for month view), relative to selectedDate's month
                    const monthGrid = getMonthGrid(selectedDate || new Date());
                    const meetingsOnDate = mapMeetingsToMonthDates(SEED_MEETINGS, monthGrid);

                    // Header controls for calendar (month / week / year)
                    const calendarHeader = (() => {
                      const leftAction = calendarView === 'month' ? goToPrevMonth : (calendarView === 'week' ? goToPrevWeek : goToPrevYear);
                      const rightAction = calendarView === 'month' ? goToNextMonth : (calendarView === 'week' ? goToNextWeek : goToNextYear);
                      const heading = calendarView === 'month' ? formatMonthYear(selectedDate) : (calendarView === 'week' ? formatWeekRange(selectedDate) : (selectedDate ? selectedDate.getFullYear() : (new Date()).getFullYear()));
                      return (
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                          <div style={{display:'flex',gap:8,alignItems:'center'}}>
                            <button onClick={leftAction} aria-label="previous" style={{width:36,height:36,borderRadius:10,background:'transparent',border:'1px solid rgba(255,255,255,0.04)'}}>&lsaquo;</button>
                            <button onClick={() => { setSelectedDate(new Date()); setCalendarView('month'); }} aria-label="today" style={{padding:'6px 10px',borderRadius:8,background:'transparent',border:'1px solid rgba(255,255,255,0.02)'}}>Today</button>
                          </div>
                          <div style={{fontSize:15,fontWeight:700}}>{heading}</div>
                          <div style={{display:'flex',gap:8,alignItems:'center'}}>
                            {calendarView === 'week' && <button onClick={goToThisWeek} style={{padding:'6px 10px',borderRadius:8,background:'transparent',border:'1px solid rgba(255,255,255,0.02)'}}>This Week</button>}
                            <button onClick={rightAction} aria-label="next" style={{width:36,height:36,borderRadius:10,background:'transparent',border:'1px solid rgba(255,255,255,0.04)'}}>&rsaquo;</button>
                          </div>
                        </div>
                      );
                    })();

                    // Build month and year views
                    const monthsOfYear = (() => {
                      const base = selectedDate || new Date();
                      const y = base.getFullYear();
                      const arr = [];
                      for (let m = 0; m < 12; m++) {
                        arr.push({ year: y, month: m, name: new Date(y, m, 1).toLocaleString(undefined, { month: 'short' }) });
                      }
                      return arr;
                    })();

                    // meetings mapped for current month (we already have monthGrid & meetingsOnDate)
                    return (
                      <div>
                        {calendarHeader}
                        <motion.div key={calendarView} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                        {calendarView === 'week' && (
                          <div>
                            {weekStrip}
                            <motion.div key={selectedDate?.toDateString()} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                              <div style={{marginTop:6, display:'flex', flexDirection:'column', gap:10, maxHeight:260, overflowY:'auto', paddingRight:6}}>
                                {dayMeetings.length === 0 ? (
                                  <div style={{padding:18, borderRadius:12, background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(249,250,251,0.6)', border: '1px solid rgba(255,255,255,0.02)', textAlign:'center', color: theme === 'dark' ? '#9CAFB3' : '#6B7280'}}>
                                    No meetings · enjoy the focus time
                                  </div>
                                ) : (
                                  dayMeetings.map(m => (
                                    <div key={m.id} className="calendar-meeting" style={{display:'flex',gap:12,alignItems:'flex-start',padding:14,borderRadius:12,background: theme === 'dark' ? 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))' : '#ffffff', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(0,0,0,0.04)', boxShadow: theme === 'dark' ? '0 6px 18px rgba(0,0,0,0.6)' : '0 2px 12px rgba(0,0,0,0.04)', transition: 'transform 160ms ease, box-shadow 160ms ease'}}
                                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                      onClick={(e) => {
                                        const menuW = 200;
                                        const gap = 8;
                                        const clickX = e.clientX;
                                        const clickY = e.clientY;
                                        const left = clickX < window.innerWidth / 2
                                          ? Math.min(window.scrollX + clickX + gap, window.scrollX + window.innerWidth - menuW - 8)
                                          : Math.max(window.scrollX + clickX - menuW - gap, 8 + window.scrollX);
                                        const top = window.scrollY + clickY;
                                        setRecordMenuPos({ left, top });
                                        setOpenRecordFor(openRecordFor === m.id ? null : m.id);
                                      }}>
                                        <div style={{minWidth:96, textAlign:'left', display:'flex', alignItems:'center', gap:10}}>
                                          <div data-meeting-id={m.id} style={{position:'relative', display:'flex', alignItems:'center', gap:10}}>
                                            <img src="uploads/Innersystems_sohiamark_transparent.webp" alt="logo" data-meeting-id={m.id} onClick={(e) => {
                                              e.stopPropagation();
                                              const menuW = 200;
                                              const gap = 8;
                                              const clickX = e.clientX;
                                              const clickY = e.clientY;
                                              const left = clickX < window.innerWidth / 2
                                                ? Math.min(window.scrollX + clickX + gap, window.scrollX + window.innerWidth - menuW - 8)
                                                : Math.max(window.scrollX + clickX - menuW - gap, 8 + window.scrollX);
                                              const top = window.scrollY + clickY;
                                              setRecordMenuPos({ left, top });
                                              setOpenRecordFor(openRecordFor === m.id ? null : m.id);
                                            }} style={{width:36,height:36,borderRadius:999,objectFit:'cover',boxShadow: theme === 'dark' ? '0 6px 18px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.08)', cursor: 'pointer'}}/>
                                            {openRecordFor === m.id && recordMenuPos && ReactDOM.createPortal(
                                              <motion.div ref={recordMenuRef} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }} style={{position:'absolute', left: recordMenuPos.left, top: recordMenuPos.top, transform: 'translateY(-50%)', zIndex: 999999}}>
                                                <div style={{minWidth:200, borderRadius:12, padding:'8px 10px', boxShadow: theme === 'dark' ? '0 8px 28px rgba(0,0,0,0.6)' : '0 6px 20px rgba(0,0,0,0.08)', background: theme === 'dark' ? 'rgba(12,16,13,0.92)' : '#fff', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.02)' : '1px solid rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:10}}>
                                                  <button onClick={() => { setOpenRecordFor(null); setWhisper("Recording with Sophia..."); }} style={{display:'flex',alignItems:'center',gap:8,background:'transparent',border:'none',cursor:'pointer',padding:6}}>
                                                    <IconMic size={14} className="text-sage-300"/>
                                                    <span style={{fontSize:13,fontWeight:600,color: theme === 'dark' ? '#E6F7EB' : '#0b0b0b'}}>Record with Sophia</span>
                                                  </button>
                                                </div>
                                              </motion.div>, document.body)
                                            }
                                          </div>
                                          <div>
                                            <div style={{fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace', fontSize:12, color: theme === 'dark' ? '#A7C9AD' : '#6B7280'}}>{m.time}</div>
                                          </div>
                                        </div>
                                      <div style={{flex:1}}>
                                        <div style={{fontSize:15,fontWeight:600,color: theme === 'dark' ? '#E6F7EB' : '#111827'}}>{m.title}</div>
                                        <div style={{marginTop:6,display:'flex',alignItems:'center',gap:8,color: theme === 'dark' ? '#9CAFB3' : '#6B7280',fontSize:13,lineHeight:1.5}}>
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v2" stroke={theme === 'dark' ? '#9CAFB3' : '#6B7280'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 22v-2" stroke={theme === 'dark' ? '#9CAFB3' : '#6B7280'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 12h2" stroke={theme === 'dark' ? '#9CAFB3' : '#6B7280'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 12h2" stroke={theme === 'dark' ? '#9CAFB3' : '#6B7280'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                          <div>{m.tip}</div>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </motion.div>
                          </div>
                        )}

                        {calendarView === 'month' && (
                          <div style={{marginTop:8}}>
                            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:8}}>
                              {monthGrid.flat().map(d => {
                                const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
                                const isCurrentMonth = d.getMonth() === (selectedDate || new Date()).getMonth();
                                const dayMeet = meetingsOnDate[key] || [];
                                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                                const today = new Date();
                                const isToday = d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
                                const isSelected = selectedDate && d.getFullYear()===selectedDate.getFullYear() && d.getMonth()===selectedDate.getMonth() && d.getDate()===selectedDate.getDate();
                                return (
                                  <div key={key} onClick={() => { setSelectedDate(d); setCalendarView('week'); }} style={{minHeight:86,borderRadius:12,padding:10,cursor:'pointer',background: theme === 'dark' ? (isCurrentMonth ? 'rgba(255,255,255,0.01)' : 'transparent') : (isCurrentMonth ? 'rgba(249,250,251,0.6)' : 'transparent'), border: '1px solid rgba(255,255,255,0.02)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition:'transform 120ms ease', opacity: isCurrentMonth ? 1 : 0.5, color: isWeekend ? (theme === 'dark' ? '#9CAFB3' : '#9CA3AF') : undefined }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                      <div style={{fontSize:13,fontWeight:600, borderRadius:999, width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', background: isSelected ? (theme==='dark' ? '#166534' : '#D1FAE5') : 'transparent', color: isSelected ? (theme==='dark' ? '#fff' : '#166534') : (isToday ? (theme==='dark' ? '#fff' : '#166534') : undefined), border: isToday && !isSelected ? `2px solid #166534` : undefined }}>{d.getDate()}</div>
                                    </div>
                                    <div style={{marginTop:8,display:'flex',gap:6,flexWrap:'wrap'}}>
                                      {dayMeet.slice(0,4).map((m,i) => (
                                        <div key={i} style={{width:8,height:8,borderRadius:999,background: '#166534'}}/>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {calendarView === 'year' && (
                          <div style={{marginTop:8}}>
                            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
                              {monthsOfYear.map((mObj, idx) => {
                                const mg = getMonthGrid(new Date(mObj.year, mObj.month, 1));
                                const md = mapMeetingsToMonthDates(SEED_MEETINGS, mg);
                                const total = Object.values(md).reduce((s, arr) => s + (arr ? arr.length : 0), 0);
                                return (
                                  <div key={idx} onClick={() => { setSelectedDate(new Date(mObj.year, mObj.month, 1)); setCalendarView('month'); }} style={{padding:12,borderRadius:12,background: theme==='dark' ? 'rgba(255,255,255,0.01)' : '#fff', border:'1px solid rgba(255,255,255,0.02)', boxShadow:'0 2px 12px rgba(0,0,0,0.04)', cursor:'pointer'}}>
                                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                      <div style={{fontSize:13,fontWeight:700}}>{mObj.name}</div>
                                      <div style={{fontSize:12,color: theme==='dark' ? '#9CAFB3' : '#6B7280'}}>{total} {total===1 ? 'meeting' : 'meetings'}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </motion.div>
                      </div>
                    );
                  })()}
                </div>
              </section>

              {/* Team Trend (below calendar) */}
              <section className="mt-6">
                <div className="text-[12px] tracking-[0.22em] text-ink-50 font-semibold mb-3">TEAM TREND</div>
                <div className={theme === 'dark' ? 'rounded-md p-4 bg-white/[0.02] border border-white/[0.04]' : 'rounded-md p-4 bg-white border border-gray-200'}>
                  <TeamTrendDashboard base={[22,36,51,78]} theme={theme} />
                </div>
              </section>

              {/* Team Motivation — overall chart + member list */}
              <section className="mt-6">
                <div className="text-[12px] tracking-[0.22em] text-ink-50 font-semibold mb-3">TEAM MOTIVATION</div>

                {/* Helper: compute team-average across dimensions */}
                {/* Team layout: left = chart (2/3), right = members (1/3) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="lg:col-span-2">
                    <div className={theme === 'dark' ? 'rounded-md p-4 bg-white/[0.02] border border-white/[0.04] h-full min-h-[460px]' : 'rounded-md p-4 bg-white border border-gray-200 h-full min-h-[460px]'}>
                      <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
                        {/* TeamRadarChart component */}
                        {selectedMember ? (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-lg font-semibold text-ink-50">{selectedMember.name}'s Motivation</div>
                              <button onClick={() => setSelectedMember(null)} className="text-sm text-ink-300 hover:text-ink-50">Back to Overall</button>
                            </div>
                            <div className="flex justify-center">
                              <IndividualRadarChart data={generateIndividualProfile(selectedMember)} size={420} />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <TeamRadarChart data={computeTeamAverage(SEED_PULSE_SIGNAL.participants)} size={420} />
                            
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className={theme === 'dark' ? 'rounded-md p-4 bg-white/[0.02] border border-white/[0.04] h-full min-h-[460px] flex flex-col' : 'rounded-md p-4 bg-white border border-gray-200 h-full min-h-[460px] flex flex-col'}>
                        <div className="space-y-3 flex-1 overflow-auto">
                          {SEED_PULSE_SIGNAL.participants.map(p => (
                            <div key={p.id}
                              onClick={() => setSelectedMember(p)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setSelectedMember(p); } }}
                              className={`flex items-center justify-between p-3 rounded-md border ${selectedMember && selectedMember.id === p.id ? 'border-sage-400 bg-sage-500/[0.04]' : 'border-white/[0.03] bg-transparent'} hover:cursor-pointer hover:bg-white/[0.02]`}
                            >
                              <div>
                                <div className="font-medium text-ink-50">{p.name}</div>
                                <div className="text-[12px] text-ink-500"><span className="num">{p.score}</span> · <span className="capitalize">{p.trend}</span></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button aria-label={`View ${p.name} profile`} onClick={(e) => { e.stopPropagation(); setSelectedMember(p); }} className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center text-ink-300 hover:bg-white/[0.05]">
                                  <span className="sr-only">View</span>
                                  <span aria-hidden>›</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                  </div>
                </div>
              </section>

              {/* Sophia orb at bottom — navigates to Coach SOPHIA on click */}
              <div className="flex justify-center py-12">
                <SophiaCircle size={160} theme={theme} onClick={() => setPage('Coach SOPHIA')} />
              </div>
            </div>
          ) : page === 'Coach SOPHIA' ? (
            <div className="max-w-[1140px] mx-auto py-12 px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main column */}
                <div className="lg:col-span-2 flex flex-col items-center">
                  <div className="mt-6">
                    <SophiaCircle size={260} theme={theme} />
                  </div>
                  <div className="mt-6 text-center max-w-[780px]">
                    <h2 className="text-[20px] font-semibold text-ink-50">Let's get clarity on something.</h2>
                    <p className="mt-3 text-ink-300 max-w-[64ch] mx-auto">Tell Sophia what's on your mind and she'll help you reframe, prioritize, and prepare next steps. Use the quick prompts below to get started.</p>
                  </div>

                  <div className="w-full max-w-[860px] mt-8">
                    <div className={theme === 'dark' ? 'rounded-lg p-6 bg-white/[0.02] border border-white/[0.04]' : 'rounded-lg p-6 bg-white border border-gray-200'}>
                      <textarea
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        placeholder={"What's on your mind?"}
                        className="w-full min-h-[120px] resize-none bg-transparent outline-none text-[15px] text-ink-50 placeholder:text-ink-500/80 p-4 rounded-md"
                      />

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex gap-3 flex-wrap">
                          {SEED_CHIPS.map((c, i) => (
                            <Chip key={i} label={c.label} icon={c.icon} onClick={() => setDraft(prev => (prev ? prev + ' ' : '') + c.label)} />
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => { setDraft(''); setWhisper(''); }} className="px-3 py-2 rounded-md bg-transparent hover:bg-white/[0.02] border border-white/[0.04] text-ink-300">Clear</button>
                          <button onClick={() => { if (draft.trim()) submit(); }} className="px-4 py-2 rounded-md bg-[#166534] hover:bg-[#14502b] text-white">Ask Sophia</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right sidebar: Intentions */}
                <aside className="lg:col-span-1">
                  <div className={theme === 'dark' ? 'rounded-lg p-4 bg-white/[0.02] border border-white/[0.04] sticky top-20' : 'rounded-lg p-4 bg-white border border-gray-200 sticky top-20'}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[12px] tracking-[0.22em] text-ink-50 font-semibold">INTENTIONS</div>
                      <button className="text-sm text-ink-300 hover:text-ink-50">Change</button>
                    </div>
                    <div className="space-y-3">
                      {["Slow the proposal beat","Make recognition visible","Return to parked threads"].map((t, i) => (
                        <div key={i} className="p-3 rounded-md bg-white/[0.01] border border-white/[0.03]">
                          <div className="text-sm text-ink-50 font-medium">{t}</div>
                          <div className="text-[12px] text-ink-400 mt-1">{i===0? 'One more breath before suggesting a solution.' : i===1 ? 'Specific, named appreciation for Sara and Priya.' : 'Revisit before closing the meeting.'}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <button onClick={() => setPage('Home')} className="w-full px-3 py-2 rounded-md bg-transparent hover:bg-white/[0.02] border border-white/[0.04] text-ink-300">Back</button>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          ) : (
            <div className="max-w-[1140px] mx-auto py-16 px-8">
              <h1 className="text-3xl font-semibold text-ink-50 mb-4">Studio</h1>
              <p className="text-ink-300">Studio features and creative tools will live here. This placeholder keeps the app organized into separate pages.</p>
            </div>
          )}
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
