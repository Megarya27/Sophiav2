// Tiny inline icon set — simple strokes only
const Icon = ({ d, size = 16, className = "", stroke = "currentColor", fill = "none", strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {d}
  </svg>
);

const IconLeaf = (p) => <Icon {...p} d={<>
  <path d="M5 19c7 1 14-4 14-13 0 0-8-1-12 3S5 19 5 19z"/>
  <path d="M5 19c3-5 6-8 10-10"/>
</>}/>;

const IconChevronLeft = (p) => <Icon {...p} d={<polyline points="15 6 9 12 15 18"/>}/>;
const IconChevronRight = (p) => <Icon {...p} d={<polyline points="9 6 15 12 9 18"/>}/>;
const IconPlus = (p) => <Icon {...p} d={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}/>;
const IconMic = (p) => <Icon {...p} d={<>
  <rect x="9" y="3" width="6" height="11" rx="3"/>
  <path d="M5 11a7 7 0 0 0 14 0"/>
  <line x1="12" y1="18" x2="12" y2="21"/>
</>}/>;
const IconSend = (p) => <Icon {...p} d={<>
  <path d="M4 12l16-8-6 16-2-7-8-1z"/>
</>}/>;
const IconPlay = (p) => <Icon {...p} d={<polygon points="6 4 20 12 6 20" fill="currentColor" stroke="none"/>}/>;
const IconSun = (p) => <Icon {...p} d={<>
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
</>}/>;
const IconMoon = (p) => <Icon {...p} d={<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>}/>;
const IconSparkle = (p) => <Icon {...p} d={<>
  <path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>
  <path d="M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/>
</>}/>;
const IconCalendar = (p) => <Icon {...p} d={<>
  <rect x="3" y="5" width="18" height="16" rx="2"/>
  <line x1="3" y1="10" x2="21" y2="10"/>
  <line x1="8" y1="3" x2="8" y2="7"/>
  <line x1="16" y1="3" x2="16" y2="7"/>
</>}/>;
const IconPulse = (p) => <Icon {...p} d={<polyline points="3 12 7 12 9 6 13 18 15 12 21 12"/>}/>;
const IconFlag = (p) => <Icon {...p} d={<>
  <path d="M4 21V4"/>
  <path d="M4 4h11l-2 4 2 4H4"/>
</>}/>;
const IconCheck = (p) => <Icon {...p} d={<polyline points="4 12 10 18 20 6"/>}/>;
const IconGrip = (p) => <Icon {...p} d={<>
  <circle cx="9" cy="6" r="1" fill="currentColor"/>
  <circle cx="9" cy="12" r="1" fill="currentColor"/>
  <circle cx="9" cy="18" r="1" fill="currentColor"/>
  <circle cx="15" cy="6" r="1" fill="currentColor"/>
  <circle cx="15" cy="12" r="1" fill="currentColor"/>
  <circle cx="15" cy="18" r="1" fill="currentColor"/>
</>}/>;
const IconHistory = (p) => <Icon {...p} d={<>
  <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/>
  <polyline points="3 3 3 8 8 8"/>
  <path d="M12 7v5l3 2"/>
</>}/>;
const IconBrain = (p) => <Icon {...p} d={<>
  <path d="M9 4a3 3 0 0 0-3 3v0a2 2 0 0 0-2 2v1a2 2 0 0 0 1 1.7A2 2 0 0 0 4 13v1a2 2 0 0 0 2 2 3 3 0 0 0 3 3h1V4H9z"/>
  <path d="M15 4a3 3 0 0 1 3 3v0a2 2 0 0 1 2 2v1a2 2 0 0 1-1 1.7A2 2 0 0 1 20 13v1a2 2 0 0 1-2 2 3 3 0 0 1-3 3h-1V4h1z"/>
</>}/>;
const IconBolt = (p) => <Icon {...p} d={<polygon points="13 2 4 14 11 14 11 22 20 10 13 10 13 2" fill="currentColor" stroke="none"/>}/>;
const IconDot = (p) => <Icon {...p} d={<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>}/>;
const IconWave = (p) => <Icon {...p} d={<path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/>}/>;
const IconX = (p) => <Icon {...p} d={<><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></>}/>;

Object.assign(window, {
  Icon, IconLeaf, IconChevronLeft, IconChevronRight, IconPlus, IconMic, IconSend,
  IconPlay, IconSun, IconMoon, IconSparkle, IconCalendar, IconPulse, IconFlag,
  IconCheck, IconGrip, IconHistory, IconBrain, IconBolt, IconDot, IconWave, IconX
});
