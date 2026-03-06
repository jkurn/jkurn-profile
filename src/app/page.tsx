'use client';

import { useState, useEffect } from 'react';
import PixelAvatar from '@/components/PixelAvatar';
import RadarChart from '@/components/RadarChart';

// ─── CHARACTER DATA ──────────────────────────────────────────────
const CHARACTER = {
  name: 'JONATHAN KURNIAWAN',
  title: 'The Shaper',
  subclass: 'Manifesting Generator',
  level: 32,
  xp: { current: 9800000, next: 12000000 },
  bio: 'Curious about everything, builder of things, connector of dots. Probably has a framework for that. Definitely has a framework for the framework.',
};

// ─── RADAR ATTRIBUTES (6-axis) ──────────────────────────────────
const ATTRIBUTES = [
  {
    label: 'Intelligence',
    abbr: 'INT',
    value: 38,
    max: 40,
    color: '#8b5cf6',
    description: 'Curious about everything, connects dots across fields that have no business being connected. Will happily disappear into a rabbit hole for hours.',
  },
  {
    label: 'Wisdom',
    abbr: 'WIS',
    value: 30,
    max: 40,
    color: '#22d3ee',
    description: 'Genuinely self-aware — sometimes too much. Tends to analyze feelings rather than actually feel them. Knows this, working on it.',
  },
  {
    label: 'Charisma',
    abbr: 'CHA',
    value: 26,
    max: 40,
    color: '#ec4899',
    description: 'Lights up in conversations about ideas — surprisingly good at getting people excited. Still figuring out how to put himself out there publicly.',
  },
  {
    label: 'Constitution',
    abbr: 'CON',
    value: 24,
    max: 40,
    color: '#f59e0b',
    description: 'Can go deep on something for hours when it clicks. Sustained routine and discipline? That\'s a different conversation entirely.',
  },
  {
    label: 'Willpower',
    abbr: 'WILL',
    value: 18,
    max: 40,
    color: '#ef4444',
    description: 'Great at starting things. Has approximately 47 open browser tabs of half-finished projects to prove it. The spirit is willing.',
  },
  {
    label: 'Strength',
    abbr: 'STR',
    value: 14,
    max: 40,
    color: '#f97316',
    description: 'The gym membership is... aspirational. Honestly the stat that needs the most love. One day.',
  },
];

// ─── OPERATING MANUAL ───────────────────────────────────────────
interface ManualEntry {
  title: string;
  icon: string;
  content: string[];
}

const MANUAL_SECTIONS: ManualEntry[] = [
  {
    title: 'How I Think',
    icon: '◈',
    content: [
      'I\'m a pattern person. I naturally connect ideas across different fields — sometimes useful, sometimes I\'m three tangents deep before anyone notices.',
      'Most of my thinking happens by exploring: reading, asking questions, building mental models. I need to see the full picture before I can act on any part of it.',
      'Fair warning — if you give me a problem, I\'ll probably build a framework to understand it before actually solving it. It\'s just how my brain works.',
      'I think better in writing than speaking. Give me a doc to respond to and you\'ll get my best thinking.',
    ],
  },
  {
    title: 'How I Communicate',
    icon: '◇',
    content: [
      'I tend to be direct and concise — not because I don\'t care, but because I respect your time.',
      'I value honest feedback, and I try to keep mine constructive. If something isn\'t working, I\'d rather we talk about it early than let it fester.',
      'I usually start with the "why" behind something. If I\'m sharing context, it\'s because I think it\'ll help us both.',
      'I\'m better in writing than in spontaneous conversations. Async is where I do my clearest thinking.',
    ],
  },
  {
    title: 'What Drives Me',
    icon: '⚡',
    content: [
      'Seeing an idea become real. There\'s nothing quite like watching something you imagined actually work.',
      'Genuine mastery — I\'d rather be quietly good at something than loudly recognized for it.',
      'Helping people see patterns they couldn\'t see before. My favorite moments are when I can help someone else\'s work click.',
      'Building things that last beyond the moment — systems, tools, frameworks that keep being useful long after I\'ve moved on.',
    ],
  },
  {
    title: 'What Drains Me',
    icon: '▼',
    content: [
      'Repetitive admin work with no thinking involved — my energy drops fast.',
      'Having to push forward on something I\'ve mentally moved past. I know this about myself and I\'m working on it.',
      'Meetings that could\'ve been a doc. (You\'ve heard this one before, but I really mean it.)',
      'Executing without understanding why. I don\'t need to agree with everything, but I need to understand the reasoning.',
    ],
  },
  {
    title: 'The Five Faces',
    icon: '★',
    content: [
      'The Professor — Comes alive when teaching or mentoring someone who\'s genuinely curious. Could talk frameworks all day.',
      'The Catalyst — Shows up with ten new ideas before coffee. High energy, contagious enthusiasm, short bursts.',
      'The Commander — Emerges when things get serious and someone needs to make the call. Not my default mode, but it\'s there.',
      'The Alchemist — Mixes ideas from wildly different places into something new. Probably my signature thing.',
      'The Architect — Give me a whiteboard and stand back. Wants to build the system, the structure, the operating model.',
    ],
  },
  {
    title: 'Working With Me',
    icon: '◆',
    content: [
      'I do my best work when I understand the bigger picture — the "why" behind what we\'re doing.',
      'I\'ll probably respond to your problem with a framework. Feel free to tell me to just answer the question.',
      'I\'m a strong starter, less strong finisher. Pairing me with someone detail-oriented is a cheat code.',
      'I genuinely want pushback on my ideas. I\'d rather be wrong early than wrong late.',
      'I\'ll bring energy, ideas, and structure to any project. In return, I just ask for a bit of patience when I go down rabbit holes.',
    ],
  },
];

// ─── ACTIVE CONDITIONS ──────────────────────────────────────────
interface Condition {
  name: string;
  type: 'buff' | 'debuff';
  icon: string;
  description: string;
  source: string;
}

const CONDITIONS: Condition[] = [
  { name: 'Dual Mind Stance', type: 'buff', icon: '⚡', description: 'Can switch between big-picture brainstorming and heads-down building. Two modes, one brain.', source: 'Innate trait' },
  { name: 'Framework Arsenal', type: 'buff', icon: '📚', description: 'Has a mental toolkit of 10+ frameworks ready for any situation. Possibly overkill for choosing lunch.', source: 'Years of collecting mental models' },
  { name: 'Metacognitive Shield', type: 'buff', icon: '🛡', description: 'Unusually aware of his own thinking patterns and biases. Doesn\'t always act on that awareness, but it\'s there.', source: 'Lots of self-reflection' },
  { name: 'Quantum Processing', type: 'buff', icon: '🔮', description: 'Comfortable holding multiple conflicting ideas at once without needing to pick a winner right away.', source: 'Multicultural upbringing' },
  { name: 'Elevated Threshold', type: 'debuff', icon: '⏳', description: 'Tends to over-polish before shipping. The "just one more tweak" trap is very real.', source: 'The planning-to-doing ratio' },
  { name: 'Island Hopper', type: 'debuff', icon: '🏝', description: 'Gets excited about new things a bit too easily. Depth is the aspiration, breadth is the reality.', source: 'A restless spirit' },
  { name: 'System Builder\'s Compulsion', type: 'debuff', icon: '📊', description: 'Will occasionally build an entire tracking system to avoid having a feeling about something.', source: 'A very analytical brain' },
  { name: 'Accumulation Drive', type: 'debuff', icon: '🔄', description: 'Says "this is my simplification year" while signing up for three new tools. Every year.', source: 'Curiosity vs. minimalism' },
  { name: 'Vulnerability Gap', type: 'debuff', icon: '👁', description: 'More open and honest in writing than in person. Working on closing that gap.', source: 'A work in progress' },
];

// ─── CAPABILITY MAP ─────────────────────────────────────────────
type Proficiency = 'Expert' | 'Advanced' | 'Proficient' | 'Developing';

interface Capability {
  name: string;
  level: Proficiency;
  evidence: string;
}

interface CapabilityDomain {
  domain: string;
  icon: string;
  color: string;
  capabilities: Capability[];
}

const CAPABILITIES: CapabilityDomain[] = [
  {
    domain: 'AI & Technology',
    icon: '⚡',
    color: '#22d3ee',
    capabilities: [
      { name: 'Prompt Engineering', level: 'Expert', evidence: 'Builds with AI daily — prompts, agents, workflows, the whole stack' },
      { name: 'AI Governance', level: 'Expert', evidence: 'Knows where the guardrails should go and why they matter' },
      { name: 'Tool Synthesis', level: 'Expert', evidence: 'Picks the right AI tool for the job without overthinking it' },
      { name: 'Code & Infrastructure', level: 'Advanced', evidence: 'Builds real things when the vision is clear enough to start' },
    ],
  },
  {
    domain: 'Strategic Thinking',
    icon: '◆',
    color: '#00a0a0',
    capabilities: [
      { name: 'Framework Design', level: 'Expert', evidence: 'Life OS, Second Brain, personal operating systems — loves this stuff' },
      { name: 'Pattern Recognition', level: 'Expert', evidence: 'Spots connections across domains that others miss' },
      { name: 'Strategic Planning', level: 'Expert', evidence: 'Give him a goal and he\'ll map every path to get there' },
      { name: 'Blueprint Crafting', level: 'Advanced', evidence: 'PRDs, roadmaps, proposals — turns ideas into structured plans' },
    ],
  },
  {
    domain: 'Inner Work',
    icon: '☽',
    color: '#ec4899',
    capabilities: [
      { name: 'Jungian Analysis', level: 'Advanced', evidence: 'Archetypes, shadow work, individuation — genuinely fascinated' },
      { name: 'Self-Optimization', level: 'Advanced', evidence: 'Always looking for ways to grow and get better' },
      { name: 'Existential Navigation', level: 'Advanced', evidence: 'Thinks deeply about meaning, purpose, and what matters' },
      { name: 'Mindfulness', level: 'Proficient', evidence: 'Genuine interest, but the optimizer brain makes this tricky' },
    ],
  },
  {
    domain: 'Cultural Navigation',
    icon: '◈',
    color: '#22c55e',
    capabilities: [
      { name: 'Geographic Adaptability', level: 'Advanced', evidence: 'Has called six countries home — adapts quickly' },
      { name: 'Cross-Cultural Fluency', level: 'Proficient', evidence: 'Reads rooms across cultures, still learning every day' },
      { name: 'Identity Synthesis', level: 'Developing', evidence: 'Figuring out how all these different parts of himself fit together' },
    ],
  },
  {
    domain: 'Execution & Output',
    icon: '▶',
    color: '#f59e0b',
    capabilities: [
      { name: 'Vision Articulation', level: 'Expert', evidence: 'Can explain complex ideas in a way that actually lands' },
      { name: 'Project Initiation', level: 'Advanced', evidence: 'Strong starts, lots of momentum — the exciting part' },
      { name: 'Sustained Delivery', level: 'Developing', evidence: 'The follow-through muscle. Building it.' },
      { name: 'Physical Discipline', level: 'Developing', evidence: 'See: STR stat. Aspirational.' },
    ],
  },
];

// ─── CHARACTER DYNAMICS ─────────────────────────────────────────
interface Dynamic {
  name: string;
  sideA: string;
  sideB: string;
  position: number;
  conversationsA: number;
  conversationsB: number;
  description: string;
  severity: 'critical' | 'high' | 'moderate';
}

const DYNAMICS: Dynamic[] = [
  {
    name: 'The Core Paradox',
    sideA: 'Self-Acceptance',
    sideB: 'Self-Optimization',
    position: 48,
    conversationsA: 341,
    conversationsB: 375,
    description: 'Wants to fully accept himself AND become the best version of himself. These two things don\'t always agree.',
    severity: 'critical',
  },
  {
    name: 'The Execution Gap',
    sideA: 'Planning',
    sideB: 'Shipping',
    position: 63,
    conversationsA: 552,
    conversationsB: 318,
    description: 'Loves the planning phase a little too much. The ideas are always flowing — shipping them is the real boss fight.',
    severity: 'high',
  },
  {
    name: 'The Depth Dilemma',
    sideA: 'Breadth',
    sideB: 'Depth',
    position: 65,
    conversationsA: 339,
    conversationsB: 180,
    description: 'Wants to go deep on one thing but keeps discovering interesting new things. The classic generalist\'s dilemma.',
    severity: 'high',
  },
  {
    name: 'The Accumulation Paradox',
    sideA: 'Simplify',
    sideB: 'Accumulate',
    position: 34,
    conversationsA: 300,
    conversationsB: 155,
    description: 'Keeps saying "simplify" while the bookmarks folder and tool stack quietly grows. Self-aware about it, at least.',
    severity: 'high',
  },
  {
    name: 'The Path Split',
    sideA: 'Sovereign Builder',
    sideB: 'Institutional Path',
    position: 31,
    conversationsA: 163,
    conversationsB: 73,
    description: 'Heart says build something of his own. Head says the safety net is nice. Still figuring this one out.',
    severity: 'moderate',
  },
];

// ─── SABOTEUR CYCLE ─────────────────────────────────────────────
const SABOTEUR_CYCLE = [
  { name: 'Restless', score: 6.8, effect: 'Ooh, shiny new project! (halfway through the current one)' },
  { name: 'Hyper-Rational', score: 6.3, effect: 'Feelings? Let me build a spreadsheet about those.' },
  { name: 'Hyper-Achiever', score: 5.9, effect: 'Rest day? Sounds like a day to feel guilty about not working.' },
  { name: 'Controller', score: 5.3, effect: 'If the system isn\'t working, I\'ll just... build a new system.' },
];

// ─── GROWTH PATH ────────────────────────────────────────────────
interface EvolutionStage {
  name: string;
  period: string;
  description: string;
  traits: string[];
  active: boolean;
  future: boolean;
}

const EVOLUTION: EvolutionStage[] = [
  {
    name: 'Code Apprentice',
    period: '2023 Q1-Q2',
    description: 'Discovered AI and immediately went all in. Built GPTs, played virtual C-suite. The spark.',
    traits: ['Builder', 'Executive'],
    active: false,
    future: false,
  },
  {
    name: 'System Builder',
    period: '2023 Q3 — 2024 Q2',
    description: 'Found a niche in AI governance. Started creating content, building frameworks. Things got real.',
    traits: ['AI Governance', 'Content Creator', 'Framework Designer'],
    active: false,
    future: false,
  },
  {
    name: 'The Shaper',
    period: '2024 Q3 — Present',
    description: 'Doing a bit of everything — building, strategizing, creating, exploring. Hasn\'t picked just one thing yet (and kind of likes it that way).',
    traits: ['Builder', 'Founder', 'Strategist', 'Creator'],
    active: true,
    future: false,
  },
  {
    name: '??? Sovereign Synthesizer',
    period: 'Future',
    description: 'Picks one lane and goes all in. The scattered energy becomes focused force. Someday.',
    traits: ['???'],
    active: false,
    future: true,
  },
];

const EVOLUTION_REQUIREMENTS = [
  { text: 'Collapse the quantum identity — choose a primary', done: false },
  { text: 'Ship 3 major projects to production', done: false },
  { text: 'Publish consistently for 6 months', done: false },
  { text: 'Complete the Financial Truth Sheet', done: false },
  { text: 'Resolve the geographic equation', done: false },
];

const PHILOSOPHICAL_LOADOUT = [
  { name: 'Jungian Psychology', uses: 241, color: '#8b5cf6' },
  { name: 'Positive Psychology', uses: 220, color: '#22c55e' },
  { name: 'Existentialism', uses: 220, color: '#3b82f6' },
  { name: 'Lean / Agile', uses: 104, color: '#f59e0b' },
  { name: 'Human Design', uses: 70, color: '#ec4899' },
  { name: 'Behavioral Economics', uses: 59, color: '#22d3ee' },
];

// ─── HELPER COMPONENTS ────────────────────────────────────────────

function ProficiencyBadge({ level }: { level: Proficiency }) {
  const styles: Record<Proficiency, { bg: string; text: string; border: string }> = {
    Expert: { bg: 'rgba(0,160,160,0.12)', text: '#00a0a0', border: 'rgba(0,160,160,0.25)' },
    Advanced: { bg: 'rgba(34,211,238,0.12)', text: '#22d3ee', border: 'rgba(34,211,238,0.25)' },
    Proficient: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e', border: 'rgba(34,197,94,0.25)' },
    Developing: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
  };
  const s = styles[level];
  return (
    <span
      className="text-[10px] px-2.5 py-1 uppercase tracking-wider shrink-0 rounded-full font-medium"
      style={{
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
      }}
    >
      {level}
    </span>
  );
}

// ─── TAB TYPES ──────────────────────────────────────────────────
type TabKey = 'overview' | 'about' | 'skills' | 'growth';

const TAB_LABELS: Record<TabKey, string> = {
  overview: 'Overview',
  about: 'About Me',
  skills: 'Skills',
  growth: 'Inner Work',
};

// ─── MAIN PAGE ───────────────────────────────────────────────────

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [statsAnimated, setStatsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStatsAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-8">

        {/* ═══ HERO ═══ */}
        <header className="card p-6 sm:p-8 animate-fade-in-up">
          <div className="flex items-start gap-5 sm:gap-6">
            <div className="shrink-0 pt-1">
              <PixelAvatar pixelSize={4} />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <h1
                className="text-base sm:text-lg tracking-wide leading-tight"
                style={{ fontFamily: 'var(--font-press-start)', color: '#1a1a1a' }}
              >
                {CHARACTER.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm px-3 py-1 rounded-full border border-[rgba(0,128,128,0.3)] bg-[rgba(0,128,128,0.08)] text-[#00a0a0]">
                  {CHARACTER.title}
                </span>
                <span className="text-sm px-3 py-1 rounded-full border border-[rgba(0,128,128,0.2)] bg-[rgba(0,128,128,0.05)] text-[#52525b]">
                  {CHARACTER.subclass}
                </span>
              </div>

              <p className="text-[15px] text-[#52525b] leading-relaxed max-w-lg">
                {CHARACTER.bio}
              </p>

              <div className="flex items-center gap-3">
                <span
                  className="text-xs shrink-0 text-[#52525b]"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  Lv.{CHARACTER.level}
                </span>
                <div className="flex items-center gap-2 flex-1 max-w-[240px]">
                  <div className="stat-bar-track flex-1 h-2 rounded-full overflow-hidden border border-[rgba(0,0,0,0.06)]">
                    <div
                      className="stat-bar-fill rounded-full"
                      style={{
                        width: statsAnimated ? `${(CHARACTER.xp.current / CHARACTER.xp.next) * 100}%` : '0%',
                        background: 'linear-gradient(90deg, #006666, #00a0a0)',
                      }}
                    />
                  </div>
                  <span className="text-xs text-[#71717a] shrink-0 tabular-nums" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    {(CHARACTER.xp.current / 1000000).toFixed(1)}M/{(CHARACTER.xp.next / 1000000).toFixed(0)}M XP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ═══ TAB NAVIGATION ═══ */}
        <nav className="tab-nav sticky top-0 z-40 pt-2">
          {(Object.keys(TAB_LABELS) as TabKey[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </nav>

        {/* ═══ TAB CONTENT ═══ */}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="tab-content space-y-8">
            {/* Radar Chart */}
            <div className="card p-6 flex justify-center">
              <RadarChart attributes={ATTRIBUTES} animate={statsAnimated} />
            </div>

            {/* Core Attributes */}
            <div className="card p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-6 text-[#1a1a1a]">Core Attributes</h2>
              <div className="space-y-5">
                {ATTRIBUTES.map(attr => (
                  <div key={attr.abbr} className="flex items-start gap-4">
                    <span
                      className="w-14 text-xs font-bold shrink-0 pt-1 tracking-wide"
                      style={{ color: attr.color, fontFamily: 'var(--font-geist-mono)' }}
                    >
                      {attr.abbr}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[15px] font-medium text-[#1a1a1a]">{attr.label}</span>
                        <span className="text-sm text-[#71717a] tabular-nums" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                          {attr.value}/{attr.max}
                        </span>
                      </div>
                      <div className="stat-bar-track h-2 rounded-full overflow-hidden border border-[rgba(0,0,0,0.06)] mb-2">
                        <div
                          className="stat-bar-fill rounded-full"
                          style={{
                            width: statsAnimated ? `${(attr.value / attr.max) * 100}%` : '0%',
                            background: `linear-gradient(90deg, ${attr.color}cc, ${attr.color})`,
                          }}
                        />
                      </div>
                      <p className="text-[14px] text-[#52525b] leading-relaxed">{attr.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-[#71717a]">
                Scale: 0-40 | Thinks a lot, ships less. Aware of it. Working on it.
              </p>
            </div>
          </div>
        )}

        {/* ── ABOUT ME TAB ── */}
        {activeTab === 'about' && (
          <div className="tab-content space-y-8">
            {/* Operating Manual */}
            <div className="card p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-2 text-[#1a1a1a]">Operating Manual</h2>
              <p className="text-sm text-[#52525b] mb-6">
                A personal user manual for collaborators, teammates, and future self.
              </p>
              <div className="space-y-6">
                {MANUAL_SECTIONS.map(section => (
                  <div key={section.title} className="card-elevated p-5 sm:p-6">
                    <h3 className="text-[15px] font-semibold mb-3 flex items-center gap-2 text-[#1a1a1a]">
                      <span className="text-[#00a0a0]">{section.icon}</span>
                      {section.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {section.content.map((line, i) => (
                        <li key={i} className="text-[14px] text-[#52525b] leading-relaxed flex items-start gap-3">
                          <span className="text-[#71717a] shrink-0 mt-0.5">—</span>
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Conditions — NO hover states */}
            <div className="card p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-6 text-[#1a1a1a]">Active Conditions</h2>

              <h3 className="text-sm font-semibold text-[#22c55e] uppercase tracking-wider mb-3">Buffs</h3>
              <div className="space-y-3 mb-8">
                {CONDITIONS.filter(c => c.type === 'buff').map(cond => (
                  <div key={cond.name} className="card-elevated p-4 flex items-start gap-4 border-l-2 border-l-[#22c55e]">
                    <span className="text-xl shrink-0">{cond.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[15px] font-medium text-[#22c55e]">{cond.name}</span>
                      <p className="text-[14px] text-[#52525b] mt-1">{cond.description}</p>
                      <p className="text-[13px] text-[#71717a] mt-1.5 italic">Source: {cond.source}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-[#ef4444] uppercase tracking-wider mb-3">Debuffs</h3>
              <div className="space-y-3">
                {CONDITIONS.filter(c => c.type === 'debuff').map(cond => (
                  <div key={cond.name} className="card-elevated p-4 flex items-start gap-4 border-l-2 border-l-[#ef4444]">
                    <span className="text-xl shrink-0">{cond.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[15px] font-medium text-[#ef4444]">{cond.name}</span>
                      <p className="text-[14px] text-[#52525b] mt-1">{cond.description}</p>
                      <p className="text-[13px] text-[#71717a] mt-1.5 italic">Source: {cond.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SKILLS TAB ── */}
        {activeTab === 'skills' && (
          <div className="tab-content space-y-8">
            <div className="card p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-6 text-[#1a1a1a]">Capability Map</h2>
              <div className="space-y-8">
                {CAPABILITIES.map(domain => (
                  <div key={domain.domain}>
                    <div className="flex items-center gap-2.5 mb-4">
                      <span className="text-lg" style={{ color: domain.color }}>{domain.icon}</span>
                      <span className="text-[15px] font-semibold" style={{ color: domain.color }}>
                        {domain.domain}
                      </span>
                    </div>
                    <div className="space-y-3 ml-7">
                      {domain.capabilities.map(cap => (
                        <div key={cap.name} className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-[15px] text-[#1a1a1a]">{cap.name}</span>
                              <ProficiencyBadge level={cap.level} />
                            </div>
                            <p className="text-[14px] text-[#52525b] mt-1">{cap.evidence}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── INNER WORK TAB ── */}
        {activeTab === 'growth' && (
          <div className="tab-content space-y-8">
            {/* Character Dynamics */}
            <div className="card p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-2 text-[#1a1a1a]">Character Dynamics</h2>
              <p className="text-sm text-[#00a0a0] border border-[rgba(0,128,128,0.2)] bg-[rgba(0,128,128,0.05)] rounded-lg px-4 py-2.5 mb-6">
                The ongoing internal debates. Everyone has them — these are mine.
              </p>
              <div className="space-y-6">
                {DYNAMICS.map(d => (
                  <div key={d.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[15px] font-medium text-[#1a1a1a]">{d.name}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                        d.severity === 'critical'
                          ? 'bg-[rgba(239,68,68,0.12)] text-[#ef4444] border border-[rgba(239,68,68,0.25)]'
                          : d.severity === 'high'
                          ? 'bg-[rgba(245,158,11,0.12)] text-[#f59e0b] border border-[rgba(245,158,11,0.25)]'
                          : 'bg-[rgba(59,130,246,0.12)] text-[#3b82f6] border border-[rgba(59,130,246,0.25)]'
                      }`}>
                        {d.severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[13px] text-[#00a0a0] w-24 sm:w-28 text-right shrink-0">{d.sideA}</span>
                      <div className="flex-1 relative">
                        <div className="tension-bar" />
                        <div className="tension-marker" style={{ left: `${d.position}%` }} />
                      </div>
                      <span className="text-[13px] text-[#71717a] w-24 sm:w-28 shrink-0">{d.sideB}</span>
                    </div>

                    <div className="flex items-center justify-between text-[12px] text-[#71717a] mb-1">
                      <span>{d.conversationsA} convos</span>
                      <span>{d.conversationsB} convos</span>
                    </div>
                    <p className="text-[14px] text-[#52525b]">{d.description}</p>
                  </div>
                ))}
              </div>

              {/* Saboteur Cycle */}
              <div className="mt-8 pt-6 border-t border-[rgba(0,0,0,0.06)]">
                <h3 className="text-[15px] font-semibold text-[#ef4444] mb-4">⚠ Saboteur Cycle</h3>
                <div className="space-y-3">
                  {SABOTEUR_CYCLE.map(s => (
                    <div key={s.name} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 shrink-0 w-32">
                        <span className="text-[14px] text-[#1a1a1a] font-medium">{s.name}</span>
                        <span className="text-[13px] text-[#ef4444]" style={{ fontFamily: 'var(--font-geist-mono)' }}>{s.score}</span>
                      </div>
                      <div className="flex-1">
                        <div className="stat-bar-track h-2 rounded-full overflow-hidden border border-[rgba(0,0,0,0.06)]">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${(s.score / 10) * 100}%`,
                              background: 'linear-gradient(90deg, #ef4444cc, #ef4444)',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[14px] text-[#71717a] italic">
                  The loop: start something new → rationalize it → push too hard → rebuild the system → repeat
                </p>
              </div>
            </div>

            {/* Growth Path */}
            <div className="card p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-6 text-[#1a1a1a]">Growth Path</h2>

              {/* Evolution Timeline */}
              <h3 className="text-[14px] font-semibold text-[#00a0a0] uppercase tracking-wider mb-4">Class Evolution</h3>
              <div className="space-y-0 mb-8">
                {EVOLUTION.map((stage) => (
                  <div
                    key={stage.name}
                    className={`evolution-node ${stage.active ? 'active' : ''} pb-5`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-8 h-8 shrink-0 flex items-center justify-center border-2 rounded-lg text-[12px] ${
                          stage.active
                            ? 'border-[#00a0a0] bg-[rgba(0,160,160,0.15)] text-[#00a0a0]'
                            : stage.future
                            ? 'border-[rgba(0,0,0,0.1)] bg-transparent text-[#71717a] border-dashed'
                            : 'border-[#22c55e] bg-[rgba(34,197,94,0.1)] text-[#22c55e]'
                        }`}
                      >
                        {stage.future ? '?' : stage.active ? '◆' : '✓'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[15px] font-semibold ${
                              stage.active ? 'text-[#00a0a0]' : stage.future ? 'text-[#71717a]' : 'text-[#22c55e]'
                            }`}
                          >
                            {stage.name}
                          </span>
                          <span className="text-[13px] text-[#71717a]">{stage.period}</span>
                          {stage.active && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(0,160,160,0.12)] text-[#00a0a0] border border-[rgba(0,160,160,0.25)]">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <p className="text-[14px] text-[#52525b] mt-1">{stage.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {stage.traits.map((trait, ti) => (
                            <span
                              key={ti}
                              className={`text-[12px] px-2 py-0.5 rounded-full border ${
                                stage.future
                                  ? 'border-[rgba(0,0,0,0.06)] text-[#71717a] border-dashed'
                                  : 'border-[rgba(0,0,0,0.1)] text-[#52525b]'
                              }`}
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Philosophical Loadout */}
              <h3 className="text-[14px] font-semibold text-[#00a0a0] uppercase tracking-wider mb-4">Equipped Frameworks</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {PHILOSOPHICAL_LOADOUT.map(item => (
                  <div
                    key={item.name}
                    className="card-elevated p-3 text-center rounded-xl"
                    style={{ borderColor: `${item.color}20` }}
                  >
                    <span className="text-[14px] font-medium block" style={{ color: item.color }}>
                      {item.name}
                    </span>
                    <span className="text-[12px] text-[#71717a]" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                      {item.uses} convos
                    </span>
                  </div>
                ))}
              </div>

              {/* Evolution Requirements */}
              <h3 className="text-[14px] font-semibold text-[#00a0a0] uppercase tracking-wider mb-4">Evolution Requirements</h3>
              <div className="space-y-3">
                {EVOLUTION_REQUIREMENTS.map((req, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`w-6 h-6 shrink-0 flex items-center justify-center border rounded-md text-[12px] ${
                      req.done
                        ? 'border-[#22c55e] bg-[rgba(34,197,94,0.15)] text-[#22c55e]'
                        : 'border-[rgba(0,0,0,0.1)] text-[#71717a]'
                    }`}>
                      {req.done ? '✓' : '○'}
                    </span>
                    <span className={`text-[14px] ${req.done ? 'text-[#22c55e] line-through' : 'text-[#52525b]'}`}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 text-[14px] text-[#71717a] border-t border-[rgba(0,0,0,0.06)] pt-4">
                <span className="text-[#f59e0b]">⚠</span> Progress: 0/5 requirements met. The wave function remains uncollapsed.
              </div>
            </div>
          </div>
        )}

        {/* ═══ FOOTER ═══ */}
        <footer className="mt-12 space-y-4 text-center pb-8">
          <div className="card p-5">
            <p className="text-[13px] text-[#71717a]">
              Character data derived from 3,954 conversations | ~9.8M words | 1,076 days
            </p>
            <p className="text-[13px] text-[#71717a] mt-1">
              ChatGPT (1,856) + Claude (2,098) + Second Brain (35 files)
            </p>
            <p className="text-[12px] text-[#71717a] mt-3" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              Frameworks: LIWC · Big Five · McClelland · McAdams · PrinciplesYou · Saboteur Assessment
            </p>
          </div>
          <p className="text-[12px] text-[#71717a]" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            JKURN v0.3
          </p>
        </footer>
      </div>
    </main>
  );
}
