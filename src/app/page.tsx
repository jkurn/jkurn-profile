'use client';

import { useState, useEffect, useCallback } from 'react';
import PixelAvatar from '@/components/PixelAvatar';
import RadarChart from '@/components/RadarChart';

// ─── CHARACTER DATA ──────────────────────────────────────────────
const CHARACTER = {
  name: 'JONATHAN KURNIAWAN',
  title: 'The Shaper',
  subclass: 'Manifesting Generator',
  level: 32,
  bio: 'Dual-mind operator — explores with divergent thought, executes with convergent precision. Builds frameworks across domains, then builds more frameworks about those frameworks.',
};

// ─── RADAR ATTRIBUTES (6-axis) ──────────────────────────────────
const ATTRIBUTES = [
  {
    label: 'Intelligence',
    abbr: 'INT',
    value: 38,
    max: 40,
    color: '#8b5cf6',
    description: 'Creative ideation, conceptual thinking, and framework mastery. 98th percentile creative, 93rd conceptual, 97th curiosity. 9.8M words of evidence.',
  },
  {
    label: 'Wisdom',
    abbr: 'WIS',
    value: 30,
    max: 40,
    color: '#22d3ee',
    description: 'Deep metacognition but undermined by Hyper-Rational saboteur (6.3). 11% empathetic — intellectualizes emotions instead of feeling them.',
  },
  {
    label: 'Charisma',
    abbr: 'CHA',
    value: 26,
    max: 40,
    color: '#ec4899',
    description: '92% extraversion capacity, 98th percentile for inspiring others. But zero published content and vulnerability outsourced to AI.',
  },
  {
    label: 'Constitution',
    abbr: 'CON',
    value: 24,
    max: 40,
    color: '#f59e0b',
    description: '3,954 conversations prove mental endurance. But only 35% composed — burst conscientiousness, not sustained discipline.',
  },
  {
    label: 'Willpower',
    abbr: 'WILL',
    value: 18,
    max: 40,
    color: '#ef4444',
    description: '13% persistent, 12% dependable. Plans 1.7x more than executes. Restless saboteur (6.8) undermines follow-through.',
  },
  {
    label: 'Strength',
    abbr: 'STR',
    value: 14,
    max: 40,
    color: '#f97316',
    description: '80 body-related conversations, zero resolved. Physical health is the acknowledged, perennial gap.',
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
      'Dual-mind operator — Exploration via ChatGPT (divergent), Execution via Claude (convergent).',
      '70% of cognitive energy goes to exploration, 15% to implementation, 15% to reflection.',
      'I think in frameworks. If a problem exists, I will build a system to understand it before solving it.',
      'Pattern-first processor — I see connections across domains before I see individual details.',
    ],
  },
  {
    title: 'How I Communicate',
    icon: '◇',
    content: [
      'Concise and directive. 66% of my messages are under 50 words.',
      '96th percentile critical thinking, 80th percentile directness. I don\'t soften feedback.',
      'I lead with "why" and expect others to fill in "how." If I\'m giving you the how, you\'re new.',
      'Written > verbal. I process better asynchronously.',
    ],
  },
  {
    title: 'What Drives Me',
    icon: '⚡',
    content: [
      'Achievement motivation (41.8%) dominates — "I need to achieve to be worthy."',
      'Mastery over performance. I care about being genuinely good, not looking good.',
      'Building systems that outlast the moment. Legacy through structure.',
      'The intersection of AI governance × personal development × entrepreneurship.',
    ],
  },
  {
    title: 'What Drains Me',
    icon: '▼',
    content: [
      'Routine logistics and administrative overhead without intellectual content.',
      'Forced persistence on tasks I\'ve mentally completed.',
      'Emotional labor without an analytical framework to process through.',
      'Being asked to execute someone else\'s vision without understanding the architecture.',
    ],
  },
  {
    title: 'The Five Faces',
    icon: '★',
    content: [
      'The Professor — Teaching, mentoring, framework delivery. Activated by genuine curiosity in others.',
      'The Catalyst — Igniting ideas and momentum. Short bursts of intense creative energy.',
      'The Commander — Directive leadership when stakes are high. 96% critical, 80% direct.',
      'The Alchemist — Synthesizing disparate ideas into novel frameworks. The signature move.',
      'The Architect — Building systems, structures, operating models. Where planning lives.',
    ],
  },
  {
    title: 'Working With Me',
    icon: '◆',
    content: [
      'Give me the "why" first. I\'ll reject tasks I don\'t understand the purpose of.',
      'Expect frameworks in response to problems — that\'s how I process.',
      'Pair me with finishers. I generate 1.7x more plans than I execute.',
      'Don\'t ask me to slow down for comfort — ask me to slow down for quality.',
      'Challenge my ideas directly. I respect intellectual rigor over diplomatic consensus.',
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
  { name: 'Dual Mind Stance', type: 'buff', icon: '⚡', description: 'Switch between Exploration Mode (divergent) and Execution Mode (convergent) at will.', source: 'Innate — Manifesting Generator' },
  { name: 'Framework Arsenal', type: 'buff', icon: '📚', description: '10+ philosophical and analytical frameworks loaded simultaneously.', source: '241 Jungian + 220 Existential + 104 Lean convos' },
  { name: 'Metacognitive Shield', type: 'buff', icon: '🛡', description: 'High self-awareness provides partial immunity to blind spots — when used.', source: 'PrinciplesYou: 97% Self-Questioning' },
  { name: 'Quantum Processing', type: 'buff', icon: '🔮', description: 'Holds multiple identity states in superposition without premature collapse.', source: 'Cross-platform identity analysis' },
  { name: 'Elevated Threshold', type: 'debuff', icon: '⏳', description: 'Requires near-perfection before shipping. Plans 1.7x more than executes.', source: 'Planning (552) vs Execution (318) convos' },
  { name: 'Island Hopper', type: 'debuff', icon: '🏝', description: 'Commitment horizon in months, not years. Breadth always wins over depth.', source: 'Restless saboteur: 6.8/10' },
  { name: 'System Builder\'s Compulsion', type: 'debuff', icon: '📊', description: '30% chance to convert emotional problems into structural problems.', source: 'Hyper-Rational saboteur: 6.3/10' },
  { name: 'Accumulation Drive', type: 'debuff', icon: '🔄', description: 'Declared simplification year, but behavior is relentless expansion.', source: 'Simplify (300) vs Accumulate (155) convos' },
  { name: 'Validation Asymmetry', type: 'debuff', icon: '👁', description: 'Vulnerability outsourced to AI. Competent facade maintained with humans.', source: '92% vulnerability with AI, ~8% with humans' },
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
      { name: 'Prompt Engineering', level: 'Expert', evidence: '3,954 convos, 9.8M words — 0.3% AI-echo rate' },
      { name: 'AI Governance', level: 'Expert', evidence: 'Primary professional differentiator' },
      { name: 'Tool Synthesis', level: 'Expert', evidence: 'Naturally differentiated platforms by cognitive mode' },
      { name: 'Code & Infrastructure', level: 'Advanced', evidence: '489 code convos — builds when vision crystallizes' },
    ],
  },
  {
    domain: 'Strategic Thinking',
    icon: '◆',
    color: '#8b5cf6',
    capabilities: [
      { name: 'Framework Design', level: 'Expert', evidence: 'Virtual C-suites, Life OS, PARA, Second Brain' },
      { name: 'Pattern Recognition', level: 'Expert', evidence: 'Cross-domain synthesis, behavioral analysis' },
      { name: 'Strategic Planning', level: 'Expert', evidence: '552 planning conversations — dominant mode' },
      { name: 'Blueprint Crafting', level: 'Advanced', evidence: 'PRDs, proposals, roadmaps, operating models' },
    ],
  },
  {
    domain: 'Inner Work',
    icon: '☽',
    color: '#ec4899',
    capabilities: [
      { name: 'Jungian Analysis', level: 'Advanced', evidence: '241 convos — archetypes, shadow, individuation' },
      { name: 'Self-Optimization', level: 'Advanced', evidence: '375 convos — relentless drive to level up' },
      { name: 'Existential Navigation', level: 'Advanced', evidence: '220 convos — meaning, purpose, authenticity' },
      { name: 'Mindfulness', level: 'Proficient', evidence: 'Genuine but in tension with optimization drive' },
    ],
  },
  {
    domain: 'Cultural Navigation',
    icon: '◈',
    color: '#22c55e',
    capabilities: [
      { name: 'Geographic Adaptability', level: 'Advanced', evidence: 'Dubai, Singapore, Indonesia, Canada, Australia, SV' },
      { name: 'Cross-Cultural Fluency', level: 'Proficient', evidence: 'Each location is an identity proposition' },
      { name: 'Identity Synthesis', level: 'Developing', evidence: 'Multiple identities in superposition — unresolved' },
    ],
  },
  {
    domain: 'Execution & Output',
    icon: '▶',
    color: '#f59e0b',
    capabilities: [
      { name: 'Vision Articulation', level: 'Expert', evidence: 'Can communicate complex ideas with precision' },
      { name: 'Project Initiation', level: 'Advanced', evidence: 'Strong starts, multiple simultaneous projects' },
      { name: 'Sustained Delivery', level: 'Developing', evidence: '13% persistent — the acknowledged gap' },
      { name: 'Physical Discipline', level: 'Developing', evidence: '80 body convos, zero resolution' },
    ],
  },
];

// ─── CHARACTER DYNAMICS ─────────────────────────────────────────
interface Dynamic {
  name: string;
  sideA: string;
  sideB: string;
  position: number; // 0-100, where 50 = balanced
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
    description: 'Almost perfectly balanced = maximum tension. Simultaneously pursuing radical acceptance and radical optimization.',
    severity: 'critical',
  },
  {
    name: 'The Execution Gap',
    sideA: 'Planning',
    sideB: 'Shipping',
    position: 63,
    conversationsA: 552,
    conversationsB: 318,
    description: 'Plans 1.7x more than ships. System-building as a sophisticated form of productive procrastination.',
    severity: 'high',
  },
  {
    name: 'The Depth Dilemma',
    sideA: 'Breadth',
    sideB: 'Depth',
    position: 65,
    conversationsA: 339,
    conversationsB: 180,
    description: 'Aspires to depth but practices breadth. The island-hopping pattern.',
    severity: 'high',
  },
  {
    name: 'The Accumulation Paradox',
    sideA: 'Simplify',
    sideB: 'Accumulate',
    position: 34,
    conversationsA: 300,
    conversationsB: 155,
    description: 'Talks about simplifying 2x more, but behavior is expansion. Textbook cognitive dissonance.',
    severity: 'high',
  },
  {
    name: 'The Path Split',
    sideA: 'Sovereign Builder',
    sideB: 'Institutional Path',
    position: 31,
    conversationsA: 163,
    conversationsB: 73,
    description: 'Builder leads 2:1, but institutional path persists as financial insurance.',
    severity: 'moderate',
  },
];

// ─── SABOTEUR CYCLE ─────────────────────────────────────────────
const SABOTEUR_CYCLE = [
  { name: 'Restless', score: 6.8, effect: 'Initiates new project before finishing current one' },
  { name: 'Hyper-Rational', score: 6.3, effect: 'Converts feelings into frameworks' },
  { name: 'Hyper-Achiever', score: 5.9, effect: 'Worth = output. Rest feels like regression.' },
  { name: 'Controller', score: 5.3, effect: 'If I can\'t control the system, I\'ll build a new one' },
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
    description: 'Early AI adoption. Building GPTs, playing virtual C-suite. The spark ignites.',
    traits: ['Builder', 'Executive'],
    active: false,
    future: false,
  },
  {
    name: 'System Builder',
    period: '2023 Q3 — 2024 Q2',
    description: 'Governance becomes the differentiator. Content creation emerges. Frameworks multiply.',
    traits: ['AI Governance', 'Content Creator', 'Framework Designer'],
    active: false,
    future: false,
  },
  {
    name: 'The Shaper',
    period: '2024 Q3 — Present',
    description: 'Multi-identity synthesis. All modes running simultaneously. The wave function has not yet collapsed.',
    traits: ['Builder', 'Founder', 'Strategist', 'Creator'],
    active: true,
    future: false,
  },
  {
    name: '??? Sovereign Synthesizer',
    period: 'Future',
    description: 'Identity collapsed. One thing, done with full force. The quantum state resolves.',
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
    Expert: { bg: 'rgba(139,92,246,0.15)', text: '#8b5cf6', border: 'rgba(139,92,246,0.3)' },
    Advanced: { bg: 'rgba(34,211,238,0.15)', text: '#22d3ee', border: 'rgba(34,211,238,0.3)' },
    Proficient: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', border: 'rgba(34,197,94,0.3)' },
    Developing: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  };
  const s = styles[level];
  return (
    <span
      className="text-[7px] px-1.5 py-0.5 uppercase tracking-wider shrink-0"
      style={{
        fontFamily: 'var(--font-press-start)',
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
      }}
    >
      {level}
    </span>
  );
}

function Section({
  title,
  sectionKey,
  openSections,
  toggle,
  sealed,
  children,
}: {
  title: string;
  sectionKey: string;
  openSections: Record<string, boolean>;
  toggle: (key: string) => void;
  sealed?: boolean;
  children: React.ReactNode;
}) {
  const isOpen = openSections[sectionKey] || false;

  return (
    <div className={`rpg-panel ${sealed ? 'sealed-section' : ''}`}>
      <button
        onClick={() => toggle(sectionKey)}
        className="section-toggle w-full flex items-center justify-between p-4"
      >
        <span className="section-header flex items-center gap-2">
          {title}
        </span>
        <span
          className="toggle-indicator text-[#8892a8] text-xs transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▶
        </span>
      </button>
      <div className={`section-content ${isOpen ? 'open' : ''}`}>
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────

export default function ProfilePage() {
  const [booted, setBooted] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [bootText, setBootText] = useState('');

  const bootLines = [
    'LOADING CHARACTER DATA...',
    'PARSING 3,954 CONVERSATIONS...',
    'ANALYZING 9.8M WORDS...',
    'MAPPING COGNITIVE PROFILE...',
    'CALIBRATING RADAR ARRAY...',
    'CHARACTER LOADED.',
  ];

  useEffect(() => {
    let lineIndex = 0;
    let currentText = '';

    const interval = setInterval(() => {
      if (lineIndex < bootLines.length) {
        currentText += (lineIndex > 0 ? '\n' : '') + bootLines[lineIndex];
        setBootText(currentText);
        lineIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setBooted(true);
          setTimeout(() => setStatsAnimated(true), 300);
        }, 400);
      }
    }, 250);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = useCallback((key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  if (!booted) {
    return (
      <div className="boot-screen">
        <div className="max-w-md w-full px-6">
          <pre
            className="text-[#22d3ee] text-[9px] sm:text-xs leading-6 whitespace-pre-wrap"
            style={{ fontFamily: 'var(--font-press-start)' }}
          >
            {bootText}
            <span className="inline-block w-2 h-3 bg-[#22d3ee] ml-1" style={{ animation: 'cursorBlink 1s step-end infinite' }} />
          </pre>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      <div className="max-w-2xl mx-auto px-4 pt-8 space-y-4">

        {/* ═══ 1. HERO: CHARACTER CARD + RADAR ═══ */}
        <div className="rpg-panel rpg-panel-gold p-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="shrink-0">
              <PixelAvatar />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <h1
                  className="text-[10px] sm:text-sm tracking-widest"
                  style={{ fontFamily: 'var(--font-press-start)', color: 'var(--text-gold)' }}
                >
                  {CHARACTER.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[#8b5cf6] text-[10px] px-2 py-0.5 border border-[#8b5cf6]/30 bg-[#8b5cf6]/10">
                    {CHARACTER.title}
                  </span>
                  <span className="text-[#22d3ee] text-[10px] px-2 py-0.5 border border-[#22d3ee]/30 bg-[#22d3ee]/10">
                    {CHARACTER.subclass}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span
                  className="text-[9px]"
                  style={{ fontFamily: 'var(--font-press-start)', color: 'var(--text-gold)' }}
                >
                  Lv.{CHARACTER.level}
                </span>
              </div>

              <p className="text-[10px] text-[#8892a8] leading-relaxed max-w-md">
                {CHARACTER.bio}
              </p>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="mt-6 flex justify-center">
            <RadarChart attributes={ATTRIBUTES} animate={statsAnimated} />
          </div>
        </div>

        {/* ═══ 2. CORE ATTRIBUTES DETAIL ═══ */}
        <div className="rpg-panel p-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="section-header mb-4">◆ Core Attributes</h2>
          <div className="space-y-3">
            {ATTRIBUTES.map(attr => (
              <div key={attr.abbr} className="flex items-start gap-3">
                <span
                  className="w-12 text-[9px] font-bold shrink-0 pt-0.5"
                  style={{ color: attr.color, fontFamily: 'var(--font-press-start)' }}
                >
                  {attr.abbr}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-[#e8dcc8] font-bold">{attr.label}</span>
                    <span className="text-[10px] text-[#8892a8] tabular-nums">{attr.value}/{attr.max}</span>
                  </div>
                  <div className="stat-bar-track border border-[#2a3050] mb-1">
                    <div
                      className="stat-bar-fill"
                      style={{
                        width: statsAnimated ? `${(attr.value / attr.max) * 100}%` : '0%',
                        background: `linear-gradient(90deg, ${attr.color}cc, ${attr.color})`,
                      }}
                    />
                  </div>
                  <p className="text-[9px] text-[#8892a8] leading-relaxed">{attr.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] text-[#8892a8] flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-[#8b5cf6] opacity-50" />
            Scale: 0-40 | Top-heavy profile — cognitive strengths, execution gaps
          </div>
        </div>

        {/* ═══ 3. OPERATING MANUAL ═══ */}
        <Section title="◇ Operating Manual" sectionKey="manual" openSections={openSections} toggle={toggle}>
          <div className="mb-3 text-[10px] text-[#22d3ee] border border-[#22d3ee]/20 bg-[#22d3ee]/5 p-2">
            A personal user manual for collaborators, teammates, and future self.
          </div>
          <div className="space-y-4">
            {MANUAL_SECTIONS.map(section => (
              <div key={section.title} className="rpg-panel p-3">
                <h3
                  className="text-[9px] tracking-wider uppercase mb-2 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-press-start)', color: '#dcc06e' }}
                >
                  <span className="text-[#8b5cf6]">{section.icon}</span>
                  {section.title}
                </h3>
                <ul className="space-y-1.5">
                  {section.content.map((line, i) => (
                    <li key={i} className="text-[10px] text-[#e8dcc8] leading-relaxed flex items-start gap-2">
                      <span className="text-[#2a3050] shrink-0 mt-0.5">›</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══ 4. ACTIVE CONDITIONS ═══ */}
        <Section title="◇ Active Conditions" sectionKey="conditions" openSections={openSections} toggle={toggle}>
          <div className="space-y-3">
            <h3 className="text-[9px] text-[#22c55e] tracking-widest uppercase" style={{ fontFamily: 'var(--font-press-start)' }}>
              Buffs
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {CONDITIONS.filter(c => c.type === 'buff').map(cond => (
                <div key={cond.name} className="status-card rpg-panel p-3 flex items-start gap-3 border-l-2 border-l-[#22c55e]">
                  <span className="text-lg shrink-0">{cond.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-[#22c55e]">{cond.name}</span>
                    </div>
                    <p className="text-[9px] text-[#e8dcc8] mt-0.5">{cond.description}</p>
                    <p className="text-[8px] text-[#8892a8] mt-1 italic">Source: {cond.source}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-[9px] text-[#ef4444] tracking-widest uppercase mt-4" style={{ fontFamily: 'var(--font-press-start)' }}>
              Debuffs
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {CONDITIONS.filter(c => c.type === 'debuff').map(cond => (
                <div key={cond.name} className="status-card rpg-panel p-3 flex items-start gap-3 border-l-2 border-l-[#ef4444]">
                  <span className="text-lg shrink-0">{cond.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-[#ef4444]">{cond.name}</span>
                    </div>
                    <p className="text-[9px] text-[#e8dcc8] mt-0.5">{cond.description}</p>
                    <p className="text-[8px] text-[#8892a8] mt-1 italic">Source: {cond.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══ 5. CAPABILITY MAP ═══ */}
        <Section title="◇ Capability Map" sectionKey="capabilities" openSections={openSections} toggle={toggle}>
          <div className="space-y-5">
            {CAPABILITIES.map(domain => (
              <div key={domain.domain}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: domain.color }}>{domain.icon}</span>
                  <span className="text-[10px] font-bold" style={{ color: domain.color }}>
                    {domain.domain}
                  </span>
                </div>
                <div className="space-y-2 ml-5">
                  {domain.capabilities.map(cap => (
                    <div key={cap.name} className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] text-[#e8dcc8]">{cap.name}</span>
                          <ProficiencyBadge level={cap.level} />
                        </div>
                        <p className="text-[9px] text-[#8892a8] mt-0.5">{cap.evidence}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══ 6. CHARACTER DYNAMICS (Sealed) ═══ */}
        <Section title="◈ Character Dynamics" sectionKey="dynamics" openSections={openSections} toggle={toggle} sealed>
          <div className="mb-3 text-[10px] text-[#8b5cf6] border border-[#8b5cf6]/20 bg-[#8b5cf6]/5 p-2">
            ◈ SEALED — The five internal tensions that define this character&apos;s inner architecture.
          </div>
          <div className="space-y-5">
            {DYNAMICS.map(d => (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#e8dcc8]">{d.name}</span>
                  <span className={`text-[8px] px-1.5 py-0.5 ${
                    d.severity === 'critical'
                      ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30'
                      : d.severity === 'high'
                      ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
                      : 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30'
                  }`}>
                    {d.severity.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] text-[#22d3ee] w-20 sm:w-24 text-right shrink-0">{d.sideA}</span>
                  <div className="flex-1 relative">
                    <div className="tension-bar" />
                    <div className="tension-marker" style={{ left: `${d.position}%` }} />
                  </div>
                  <span className="text-[8px] text-[#8b5cf6] w-20 sm:w-24 shrink-0">{d.sideB}</span>
                </div>

                <div className="flex items-center justify-between text-[8px] text-[#8892a8] mb-1">
                  <span>{d.conversationsA} convos</span>
                  <span>{d.conversationsB} convos</span>
                </div>
                <p className="text-[9px] text-[#8892a8]">{d.description}</p>
              </div>
            ))}
          </div>

          {/* Saboteur Cycle */}
          <div className="mt-6 pt-4 border-t border-[#2a3050]">
            <h3
              className="text-[9px] text-[#ef4444] tracking-widest uppercase mb-3"
              style={{ fontFamily: 'var(--font-press-start)' }}
            >
              ⚠ Saboteur Cycle
            </h3>
            <div className="space-y-2">
              {SABOTEUR_CYCLE.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 shrink-0 w-28">
                    <span className="text-[10px] text-[#e8dcc8] font-bold">{s.name}</span>
                    <span className="text-[9px] text-[#ef4444]">{s.score}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="stat-bar-track flex-1 border border-[#2a3050] h-2">
                      <div
                        className="h-full transition-all duration-1000"
                        style={{
                          width: `${(s.score / 10) * 100}%`,
                          background: `linear-gradient(90deg, #ef4444cc, #ef4444)`,
                        }}
                      />
                    </div>
                  </div>
                  {i < SABOTEUR_CYCLE.length - 1 && (
                    <span className="text-[8px] text-[#8892a8]">→</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 text-[9px] text-[#8892a8] italic">
              Cycle: Restless starts → Hyper-Rational justifies → Hyper-Achiever pushes → Controller rebuilds → repeat
            </div>
          </div>
        </Section>

        {/* ═══ 7. GROWTH PATH (Sealed) ═══ */}
        <Section title="◈ Growth Path" sectionKey="growth" openSections={openSections} toggle={toggle} sealed>
          <div className="mb-3 text-[10px] text-[#8b5cf6] border border-[#8b5cf6]/20 bg-[#8b5cf6]/5 p-2">
            ◈ SEALED — Evolution timeline, philosophical loadout, and requirements to advance.
          </div>

          {/* Evolution Timeline */}
          <h3
            className="text-[9px] text-[#dcc06e] tracking-widest uppercase mb-3"
            style={{ fontFamily: 'var(--font-press-start)' }}
          >
            Class Evolution
          </h3>
          <div className="space-y-0 mb-6">
            {EVOLUTION.map((stage) => (
              <div
                key={stage.name}
                className={`evolution-node ${stage.active ? 'active' : ''} pb-4`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 shrink-0 flex items-center justify-center border-2 text-[10px] ${
                      stage.active
                        ? 'border-[#8b5cf6] bg-[#8b5cf6]/20 text-[#8b5cf6]'
                        : stage.future
                        ? 'border-[#2a3050] bg-transparent text-[#8892a8] border-dashed'
                        : 'border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]'
                    }`}
                    style={{ fontFamily: 'var(--font-press-start)' }}
                  >
                    {stage.future ? '?' : stage.active ? '◆' : '✓'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold ${
                          stage.active ? 'text-[#8b5cf6]' : stage.future ? 'text-[#8892a8]' : 'text-[#22c55e]'
                        }`}
                      >
                        {stage.name}
                      </span>
                      <span className="text-[9px] text-[#8892a8]">{stage.period}</span>
                      {stage.active && (
                        <span className="text-[8px] px-1.5 py-0.5 bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] text-[#8892a8] mt-1">{stage.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {stage.traits.map((trait, ti) => (
                        <span
                          key={ti}
                          className={`text-[8px] px-1.5 py-0.5 border ${
                            stage.future
                              ? 'border-[#2a3050] text-[#8892a8] border-dashed'
                              : 'border-[#2a3050] text-[#e8dcc8]'
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
          <h3
            className="text-[9px] text-[#dcc06e] tracking-widest uppercase mb-3"
            style={{ fontFamily: 'var(--font-press-start)' }}
          >
            Equipped Frameworks
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            {PHILOSOPHICAL_LOADOUT.map(item => (
              <div
                key={item.name}
                className="rpg-panel p-2 text-center"
                style={{ borderColor: `${item.color}30` }}
              >
                <span className="text-[10px] font-bold block" style={{ color: item.color }}>
                  {item.name}
                </span>
                <span className="text-[8px] text-[#8892a8]">{item.uses} convos</span>
              </div>
            ))}
          </div>

          {/* Evolution Requirements */}
          <h3
            className="text-[9px] text-[#dcc06e] tracking-widest uppercase mb-3"
            style={{ fontFamily: 'var(--font-press-start)' }}
          >
            Evolution Requirements
          </h3>
          <div className="space-y-2">
            {EVOLUTION_REQUIREMENTS.map((req, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`w-5 h-5 shrink-0 flex items-center justify-center border text-[8px] ${
                  req.done
                    ? 'border-[#22c55e] bg-[#22c55e]/20 text-[#22c55e]'
                    : 'border-[#2a3050] text-[#8892a8]'
                }`}>
                  {req.done ? '✓' : '○'}
                </span>
                <span className={`text-[10px] ${req.done ? 'text-[#22c55e] line-through' : 'text-[#e8dcc8]'}`}>
                  {req.text}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-[10px] text-[#8892a8] border-t border-[#2a3050] pt-3">
            <span className="text-[#f59e0b]">⚠</span> Progress: 0/5 requirements met. The wave function remains uncollapsed.
          </div>
        </Section>

        {/* ═══ DATA FINGERPRINT ═══ */}
        <div className="rpg-panel p-4 text-center space-y-1">
          <p className="text-[9px] text-[#8892a8]">
            Character data derived from 3,954 conversations | ~9.8M words | 1,076 days
          </p>
          <p className="text-[8px] text-[#8892a8]">
            ChatGPT (1,856) + Claude (2,098) + Second Brain (35 files)
          </p>
          <p className="text-[8px] text-[#8892a8] mt-2">
            Frameworks: LIWC · Big Five · McClelland · McAdams · PrinciplesYou · Saboteur Assessment
          </p>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p
            className="text-[8px] text-[#8892a8] tracking-widest"
            style={{ fontFamily: 'var(--font-press-start)' }}
          >
            JKURN v0.2 — CHARACTER PROFILE SYSTEM
          </p>
        </div>
      </div>
    </main>
  );
}
