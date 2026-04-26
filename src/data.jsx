// Seed data
const SEED_HISTORY = [
  { group: "TODAY", items: [
    { id: "h1", title: "Meeting debrief — ownership and...", when: "2h ago", active: true },
    { id: "h2", title: "Morning reset — setting intention", when: "9:04" },
  ]},
  { group: "THIS WEEK", items: [
    { id: "h3", title: "Meeting priorities shift — leadershi...", when: "Tue" },
    { id: "h4", title: "Goal realignment and priority shift", when: "Tue" },
    { id: "h5", title: "Meeting debrief — technical owner...", when: "Mon" },
  ]},
  { group: "EARLIER", items: [
    { id: "h6", title: "New conversation", when: "Apr 12" },
    { id: "h7", title: "Team dynamics — trust signal review", when: "Apr 09" },
  ]},
];

const SEED_CHIPS = [
  { label: "Debrief my last meeting", icon: "pulse" },
  { label: "What should I focus on?", icon: "sparkle" },
  { label: "Work on my growth edge", icon: "leaf" },
  { label: "Team dynamics overview", icon: "brain" },
  { label: "How am I progressing?", icon: "wave" },
  { label: "Prepare for next meeting", icon: "calendar" },
];

const SEED_PULSE = [
  {
    id: "p1", kind: "note", tilt: "rot-l",
    speaker: "O", tone: "calm",
    time: "11:42", source: "Roadmap sync · 00:14:22",
    transcript: "“If we commit now, we lose optionality on Q3 hiring.”",
    insight: "Oliver is balancing speed with flexibility. Notice the hesitation tells — that's where the real decision lives.",
  },
  {
    id: "p2", kind: "card", tilt: "rot-rr",
    speaker: "M", tone: "tense",
    time: "11:38", source: "Roadmap sync · 00:11:07",
    transcript: "“I'm still waiting on specs from Speaker 2 — hurdle #12.”",
    insight: "Mikey is blocked. Consider a 15-minute sync to unlock momentum before the sprint closes.",
  },
  {
    id: "p3", kind: "note", tilt: "rot-r",
    speaker: "U", tone: "curious",
    time: "11:31", source: "Roadmap sync · 00:04:49",
    transcript: "“What would it look like if we slowed this down by one week?”",
    insight: "Una asked a genuinely curious question. This is the texture of safety — protect it.",
  },
  {
    id: "p4", kind: "card", tilt: "rot-ll",
    speaker: "O", tone: "decisive",
    time: "11:24", source: "Roadmap sync · 00:01:12",
    transcript: "“Let's finalize the roadmap today and revisit budget next Tuesday.”",
    insight: "Clear decision captured. Good leadership presence — the room relaxed noticeably after.",
  },
];

const SEED_MEETINGS = [
  {
    id: "m1", title: "1:1 with Mikey", time: "Tomorrow · 10:00",
    attendees: ["M", "O"], duration: "30m",
    tip: "He's been blocked for 3 days. Lead with curiosity, not a checklist.",
  },
  {
    id: "m2", title: "Q3 Roadmap Review", time: "Thu · 14:00",
    attendees: ["O", "U", "M", "+3"], duration: "60m",
    tip: "Name the decision upfront. You tend to converge late.",
  },
  {
    id: "m3", title: "Design critique", time: "Fri · 11:00",
    attendees: ["U", "O", "+2"], duration: "45m",
    tip: "Hold space for silence. Una's best ideas surface after pauses.",
  },
  {
    id: "m4", title: "Board prep", time: "Mon · 09:00",
    attendees: ["O", "+1"], duration: "90m",
    tip: "Lead with the blocker narrative. Board reads confidence in candor.",
  },
];

const SEED_DECISIONS = [
  { id: "d1", title: "Roadmap finalized", who: "Oliver", when: "Yesterday", status: "committed" },
  { id: "d2", title: "Budget review deferred", who: "Pending Speaker 2", when: "Today", status: "pending" },
  { id: "d3", title: "Technical hurdle #12 assigned to Mikey", who: "Oliver → Mikey", when: "2h ago", status: "committed" },
  { id: "d4", title: "Hiring freeze lifted for Platform", who: "Exec team", when: "Mon", status: "committed" },
];

const SEED_COMMITMENTS = [
  { id: "c1", text: "Unblock Mikey — schedule 15m sync today", owner: "O", done: false },
  { id: "c2", text: "Share the decision narrative with the team by EOD", owner: "O", done: false },
  { id: "c3", text: "Review Una's proposal before Thursday", owner: "O", done: false },
  { id: "c4", text: "Name the trade-off in the Q3 kickoff doc", owner: "O", done: true },
  { id: "c5", text: "Close the loop with Speaker 2 on budget", owner: "O", done: false },
];

const SEED_PRACTICES = [
  { id: "a1", title: "Curious Questions Before Deciding", pct: 65,
    blurb: "Pause to ask clarifying questions before stating your position. Create space for team input." },
  { id: "a2", title: "Name the Decision Explicitly", pct: 40,
    blurb: "End meetings by stating the decision clearly and who owns next steps. Eliminate ambiguity." },
  { id: "a3", title: "Paint the Bigger Picture", pct: 25,
    blurb: "Connect decisions to future outcomes and team growth. Help people understand the why." },
];

// Growth dimensions — radial cluster (ordered for Motivation graphs)
const SEED_GROWTH = [
  { id: "g1", label: "Achievement", value: 27 },
  { id: "g2", label: "Influence",   value: 22 },
  { id: "g3", label: "Connection",  value: 18 },
  { id: "g4", label: "Autonomy",    value: 36 },
  { id: "g5", label: "Recognition", value: 29 },
  { id: "g6", label: "Purpose",     value: 31 },
  { id: "g7", label: "Growth",      value: 27 },
];

const SEED_PULSE_SIGNAL = {
  mood: "Positive",
  alignment: 82,
  participants: [
    { id: "O", name: "Oliver",  trend: "steady",  score: 84 },
    { id: "M", name: "Mikey",   trend: "down",    score: 61 },
    { id: "U", name: "Una",     trend: "up",      score: 88 },
    { id: "K", name: "Kei",     trend: "steady",  score: 77 },
  ]
};

const SOPHIA_REPLIES = [
  "I'm listening. Tell me where you want to land, and I'll help you find the path.",
  "Notice the shape of that thought. What's underneath it?",
  "Let's slow down here — what would it cost you to be wrong?",
  "I'll sit with that for a moment. Meanwhile, here's what I'm hearing.",
  "That's a real question. Worth protecting the space to answer it properly.",
];

Object.assign(window, {
  SEED_HISTORY, SEED_CHIPS, SEED_PULSE, SEED_MEETINGS, SEED_DECISIONS,
  SEED_COMMITMENTS, SEED_PRACTICES, SEED_GROWTH, SEED_PULSE_SIGNAL, SOPHIA_REPLIES
});
