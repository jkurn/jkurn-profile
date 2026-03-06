'use client';

import { useState, useEffect, useCallback } from 'react';
import PixelAvatar from '@/components/PixelAvatar';

// ─── CHARACTER DATA ──────────────────────────────────────────────
const CHARACTER = {
  name: 'JONATHAN KURNIAWAN',
  title: 'Quantum Architect',
  subclass: 'Manifesting Generator',
  level: 31,
  xp: { current: 9800000, next: 12000000 },
  bio: 'One who builds systems across multiple realities simultaneously. Dual-mind operator — explores with divergent thought, executes with convergent precision.',
};

interface Stat {
  name: string;
  abbr: string;
  value: number;
  max: number;
  color: string;
  description: string;
}

const STATS: Stat[] = [
  { name: 'Intelligence', abbr: 'MAG', value: 38, max: 40, color: '#8b5cf6', description: 'Strategic thinking, framework mastery, philosophical depth' },
  { name: 'Self-Awareness', abbr: 'RES', value: 37, max: 40, color: '#22d3ee', description: 'Deep introspection, metacognitive awareness, multiple analytical lenses' },
  { name: 'Versatility', abbr: 'SKL', value: 36, max: 40, color: '#22c55e', description: 'Cross-domain capability, multi-framework fluency, cultural adaptability' },
  { name: 'Adaptability', abbr: 'SPD', value: 34, max: 40, color: '#f59e0b', description: 'Rapid platform adoption, quick context switching, environment flexibility' },
  { name: 'Vitality', abbr: 'HP', value: 30, max: 40, color: '#ef4444', description: 'Physical resilience — unresolved but improving' },
  { name: 'Influence', abbr: 'CHA', value: 29, max: 40, color: '#ec4899', description: 'Directive communication, underutilized — zero published content yet' },
  { name: 'Emotional Guard', abbr: 'DEF', value: 28, max: 40, color: '#3b82f6', description: 'Strong facade externally, outsources vulnerability to safe spaces' },
  { name: 'Execution', abbr: 'STR', value: 24, max: 40, color: '#f97316', description: '489 code conversations prove ability — but threshold requires perfection' },
];

interface Skill {
  name: string;
  level: number;
  maxLevel: number;
  description: string;
}

interface SkillBranch {
  name: string;
  icon: string;
  color: string;
  skills: Skill[];
}

const SKILL_TREE: SkillBranch[] = [
  {
    name: 'System Architecture',
    icon: '⚙',
    color: '#8b5cf6',
    skills: [
      { name: 'Framework Design', level: 9, maxLevel: 10, description: 'Virtual C-suites, Life Operating Systems, Second Brains, PARA structures' },
      { name: 'System Architecture', level: 8, maxLevel: 10, description: 'Building interconnected systems across platforms and domains' },
      { name: 'Infrastructure', level: 7, maxLevel: 10, description: 'RAG platforms, agent systems, SaaS foundations' },
      { name: 'Code Execution', level: 6, maxLevel: 10, description: '489 code conversations — builds when the vision crystallizes' },
    ],
  },
  {
    name: 'Strategic Vision',
    icon: '◆',
    color: '#22d3ee',
    skills: [
      { name: 'Pattern Recognition', level: 9, maxLevel: 10, description: 'Cross-domain pattern synthesis, behavioral analysis' },
      { name: 'Blueprint Crafting', level: 9, maxLevel: 10, description: 'PRDs, proposals, roadmaps, operating frameworks' },
      { name: 'Strategic Planning', level: 9, maxLevel: 10, description: '552 planning conversations — dominant cognitive mode' },
      { name: 'Meta-Cognition', level: 8, maxLevel: 10, description: 'Intuitively matches AI tools to cognitive needs' },
    ],
  },
  {
    name: 'AI Mastery',
    icon: '★',
    color: '#f59e0b',
    skills: [
      { name: 'Prompt Engineering', level: 9, maxLevel: 10, description: '3,954 conversations, 9.8M words — master of AI dialogue' },
      { name: 'Tool Synthesis', level: 9, maxLevel: 10, description: 'Naturally differentiated AI platforms by cognitive mode' },
      { name: 'AI Governance', level: 8, maxLevel: 10, description: 'Primary professional identity — governance as differentiator' },
      { name: 'AI Integration', level: 8, maxLevel: 10, description: '0.3% AI-echo rate — genuine cognitive integration, not dependency' },
    ],
  },
  {
    name: 'Cultural Navigation',
    icon: '◈',
    color: '#22c55e',
    skills: [
      { name: 'Geographic Adaptability', level: 8, maxLevel: 10, description: 'Dubai, Singapore, Indonesia, Canada, Australia, Silicon Valley' },
      { name: 'Cross-Cultural Fluency', level: 7, maxLevel: 10, description: 'Each location is an identity proposition, not just a place' },
      { name: 'Identity Synthesis', level: 6, maxLevel: 10, description: 'In progress — multiple identities coexist in superposition' },
    ],
  },
  {
    name: 'Inner Work',
    icon: '☽',
    color: '#ec4899',
    skills: [
      { name: 'Jungian Analysis', level: 8, maxLevel: 10, description: '241 conversations — archetypes, shadow, persona, individuation' },
      { name: 'Self-Optimization', level: 8, maxLevel: 10, description: '375 conversations — relentless drive to level up' },
      { name: 'Existential Navigation', level: 7, maxLevel: 10, description: '220 conversations — meaning, purpose, authenticity, freedom' },
      { name: 'Mindfulness Practice', level: 6, maxLevel: 10, description: '341 conversations on acceptance — genuine but in tension with optimization' },
    ],
  },
];

interface StatusEffect {
  name: string;
  type: 'buff' | 'debuff';
  icon: string;
  description: string;
  intensity: string;
}

const STATUS_EFFECTS: StatusEffect[] = [
  { name: 'Dual Mind Stance', type: 'buff', icon: '⚡', description: 'Can switch between Exploration Mode (divergent) and Execution Mode (convergent) at will', intensity: 'Permanent' },
  { name: 'Metacognitive Shield', type: 'buff', icon: '🛡', description: 'High self-awareness provides partial immunity to blind spots', intensity: 'Active' },
  { name: 'Framework Arsenal', type: 'buff', icon: '📚', description: 'Access to 10+ philosophical and analytical frameworks simultaneously', intensity: 'Stacked x10' },
  { name: 'Quantum Processing', type: 'buff', icon: '🔮', description: 'Can hold multiple identity states simultaneously without collapse', intensity: 'Unstable' },
  { name: 'Elevated Threshold', type: 'debuff', icon: '⏳', description: 'Requires near-perfection before shipping. Plans 1.7x more than executes.', intensity: '-15% Ship Speed' },
  { name: 'Island Hopper', type: 'debuff', icon: '🏝', description: 'Commitment horizon measured in months, not years. Breadth over depth.', intensity: '-20% Mastery' },
  { name: 'System Builder\'s Compulsion', type: 'debuff', icon: '📊', description: '30% chance to convert emotional problems into structural problems', intensity: 'Recurring' },
  { name: 'Accumulation Drive', type: 'debuff', icon: '🔄', description: 'Declared simplification year, but behavior is expansion', intensity: '-10% Simplify' },
  { name: 'Validation Asymmetry', type: 'debuff', icon: '👁', description: 'Vulnerability outsourced to AI. Competent facade maintained with humans.', intensity: 'Passive' },
];

interface EvolutionStage {
  name: string;
  period: string;
  description: string;
  traits: string[];
  active: boolean;
  future: boolean;
}

const EVOLUTION_PATH: EvolutionStage[] = [
  {
    name: 'Code Apprentice',
    period: '2023 Q1-Q2',
    description: 'Early AI adoption. Building GPTs, playing virtual C-suite. The spark ignites.',
    traits: ['Builder/Engineer', 'Chief/Executive'],
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
    name: 'Quantum Architect',
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

interface Tension {
  name: string;
  sideA: string;
  sideB: string;
  ratio: number;
  conversationsA: number;
  conversationsB: number;
  position: number;
  description: string;
  severity: 'critical' | 'high' | 'moderate';
}

const TENSIONS: Tension[] = [
  {
    name: 'The Core Paradox',
    sideA: 'Self-Acceptance',
    sideB: 'Self-Optimization',
    ratio: 0.91,
    conversationsA: 341,
    conversationsB: 375,
    position: 48,
    description: 'Almost perfectly balanced = maximum tension. Simultaneously pursues radical acceptance and radical optimization.',
    severity: 'critical',
  },
  {
    name: 'The Path Split',
    sideA: 'Sovereign Builder',
    sideB: 'Institutional Path',
    ratio: 2.23,
    conversationsA: 163,
    conversationsB: 73,
    position: 31,
    description: 'Builder leads 2:1, but institutional path persists as "financial insurance" — a defense mechanism.',
    severity: 'moderate',
  },
  {
    name: 'The Execution Gap',
    sideA: 'Planning',
    sideB: 'Execution',
    ratio: 1.74,
    conversationsA: 552,
    conversationsB: 318,
    position: 37,
    description: 'Plans 1.7x more than ships. System-building as substitute for action.',
    severity: 'high',
  },
  {
    name: 'The Accumulation Paradox',
    sideA: 'Simplify',
    sideB: 'Accumulate',
    ratio: 1.94,
    conversationsA: 300,
    conversationsB: 155,
    position: 34,
    description: 'Talks about simplifying 2x more, but the behavior is expansion. Textbook cognitive dissonance.',
    severity: 'high',
  },
  {
    name: 'The Depth Dilemma',
    sideA: 'Depth / Mastery',
    sideB: 'Breadth / Exploration',
    ratio: 1.88,
    conversationsA: 339,
    conversationsB: 180,
    position: 35,
    description: 'Aspires to depth but practices breadth. The island-hopping pattern.',
    severity: 'high',
  },
];

interface Equipment {
  slot: string;
  name: string;
  uses: number;
  description: string;
  color: string;
}

const LOADOUT: Equipment[] = [
  { slot: 'WEAPON', name: 'Jungian Psychology', uses: 241, description: 'Primary analytical lens — archetypes, shadow, persona, individuation', color: '#8b5cf6' },
  { slot: 'SHIELD', name: 'Positive Psychology', uses: 220, description: 'Flow, strengths, resilience, gratitude — the defense against nihilism', color: '#22c55e' },
  { slot: 'ARMOR', name: 'Existentialism', uses: 220, description: 'Meaning, purpose, authenticity, freedom — the existential armor', color: '#3b82f6' },
  { slot: 'ACC. 1', name: 'Lean / Agile', uses: 104, description: 'MVP, iterate, sprint — the methodology the personality overrides', color: '#f59e0b' },
  { slot: 'ACC. 2', name: 'Human Design', uses: 70, description: 'Manifesting Generator — personal metaphysics and identity lens', color: '#ec4899' },
  { slot: 'RING', name: 'Behavioral Economics', uses: 59, description: 'Biases, nudges, framing — the decision-making toolkit', color: '#22d3ee' },
];

const AFFINITIES = [
  { element: 'Lightning', icon: '⚡', description: 'AI / Technology', strength: 95, color: '#22d3ee' },
  { element: 'Fire', icon: '🔥', description: 'Builder / Creator', strength: 85, color: '#f97316' },
  { element: 'Wind', icon: '💨', description: 'Explorer / Adaptability', strength: 80, color: '#22c55e' },
  { element: 'Light', icon: '✨', description: 'Self-Optimization', strength: 75, color: '#f59e0b' },
  { element: 'Dark', icon: '🌑', description: 'Shadow Work / Jungian', strength: 70, color: '#8b5cf6' },
];

const EVOLUTION_REQUIREMENTS = [
  { text: 'Collapse the quantum identity — choose a primary', done: false },
  { text: 'Ship 3 major projects to production', done: false },
  { text: 'Publish consistently for 6 months', done: false },
  { text: 'Complete the Financial Truth Sheet', done: false },
  { text: 'Resolve the geographic equation', done: false },
];

// ─── HELPER COMPONENTS ────────────────────────────────────────────

function StatBar({ stat, animate }: { stat: Stat; animate: boolean }) {
  const pct = (stat.value / stat.max) * 100;
  return (
    <div className="flex items-center gap-3 group relative">
      <span className="w-8 text-[9px] font-bold shrink-0" style={{ color: stat.color, fontFamily: 'var(--font-press-start)' }}>
        {stat.abbr}
      </span>
      <div className="stat-bar-track flex-1 border border-[#2a3050]">
        <div
          className="stat-bar-fill"
          style={{
            width: animate ? `${pct}%` : '0%',
            background: `linear-gradient(90deg, ${stat.color}cc, ${stat.color})`,
          }}
        />
      </div>
      <span className="w-10 text-right text-[10px] text-[#8892a8] tabular-nums">
        {stat.value}/{stat.max}
      </span>
    </div>
  );
}

function SkillPips({ level, maxLevel, color }: { level: number; maxLevel: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxLevel }).map((_, i) => (
        <div
          key={i}
          className={`skill-pip ${i < level ? 'filled' : ''}`}
          style={i < level ? { background: color } : {}}
        />
      ))}
    </div>
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
        <span className="toggle-indicator text-[#8892a8] text-xs transition-transform duration-300"
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
    'QUANTUM STATE: SUPERPOSITION',
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

  const xpPct = (CHARACTER.xp.current / CHARACTER.xp.next) * 100;

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

        {/* ═══ HERO: CHARACTER CARD ═══ */}
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

              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span
                    className="text-[9px]"
                    style={{ fontFamily: 'var(--font-press-start)', color: 'var(--text-gold)' }}
                  >
                    Lv.{CHARACTER.level}
                  </span>
                  <span className="text-[10px] text-[#8892a8]">
                    {(CHARACTER.xp.current / 1000000).toFixed(1)}M / {(CHARACTER.xp.next / 1000000).toFixed(1)}M XP
                  </span>
                </div>
                <div className="stat-bar-track w-full max-w-xs mx-auto sm:mx-0 border border-[#2a3050]">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: statsAnimated ? `${xpPct}%` : '0%',
                      background: 'linear-gradient(90deg, #c8a84ecc, #c8a84e)',
                    }}
                  />
                </div>
              </div>

              <p className="text-[10px] text-[#8892a8] leading-relaxed max-w-md">
                {CHARACTER.bio}
              </p>
            </div>
          </div>
        </div>

        {/* ═══ COMBAT STATS ═══ */}
        <div className="rpg-panel p-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="section-header mb-4">◆ Combat Statistics</h2>
          <div className="space-y-2.5">
            {STATS.map(stat => (
              <StatBar key={stat.abbr} stat={stat} animate={statsAnimated} />
            ))}
          </div>
          <div className="mt-3 text-[10px] text-[#8892a8] flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-[#8b5cf6] opacity-50" />
            Scale: 0-40 (Fire Emblem standard)
          </div>
        </div>

        {/* ═══ ELEMENTAL AFFINITIES ═══ */}
        <Section title="◇ Elemental Affinities" sectionKey="affinities" openSections={openSections} toggle={toggle}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AFFINITIES.map(a => (
              <div key={a.element} className="flex items-center gap-3 rpg-panel p-3">
                <span className="text-2xl">{a.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold" style={{ color: a.color }}>{a.element}</span>
                    <span className="text-[10px] text-[#8892a8]">{a.strength}%</span>
                  </div>
                  <div className="text-[9px] text-[#8892a8]">{a.description}</div>
                  <div className="stat-bar-track mt-1 h-1.5 border border-[#2a3050]">
                    <div
                      className="h-full transition-all duration-1000"
                      style={{ width: `${a.strength}%`, background: a.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══ STATUS EFFECTS ═══ */}
        <Section title="◇ Active Status Effects" sectionKey="status" openSections={openSections} toggle={toggle}>
          <div className="space-y-2">
            <h3 className="text-[9px] text-[#22c55e] tracking-widest uppercase" style={{ fontFamily: 'var(--font-press-start)' }}>
              Buffs
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {STATUS_EFFECTS.filter(s => s.type === 'buff').map(effect => (
                <div key={effect.name} className="status-card rpg-panel p-3 flex items-start gap-3 border-l-2 border-l-[#22c55e]">
                  <span className="text-lg shrink-0">{effect.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-[#22c55e]">{effect.name}</span>
                      <span className="text-[9px] text-[#8892a8] shrink-0">{effect.intensity}</span>
                    </div>
                    <p className="text-[9px] text-[#8892a8] mt-0.5">{effect.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-[9px] text-[#ef4444] tracking-widest uppercase mt-4" style={{ fontFamily: 'var(--font-press-start)' }}>
              Debuffs
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {STATUS_EFFECTS.filter(s => s.type === 'debuff').map(effect => (
                <div key={effect.name} className="status-card rpg-panel p-3 flex items-start gap-3 border-l-2 border-l-[#ef4444]">
                  <span className="text-lg shrink-0">{effect.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-[#ef4444]">{effect.name}</span>
                      <span className="text-[9px] text-[#8892a8] shrink-0">{effect.intensity}</span>
                    </div>
                    <p className="text-[9px] text-[#8892a8] mt-0.5">{effect.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══ SKILL TREE ═══ */}
        <Section title="◇ Skill Tree" sectionKey="skills" openSections={openSections} toggle={toggle}>
          <div className="space-y-5">
            {SKILL_TREE.map(branch => (
              <div key={branch.name}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: branch.color }}>{branch.icon}</span>
                  <span className="text-[10px] font-bold" style={{ color: branch.color }}>
                    {branch.name}
                  </span>
                </div>
                <div className="space-y-2 ml-5">
                  {branch.skills.map(skill => (
                    <div key={skill.name} className="group">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#e8dcc8]">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <SkillPips level={skill.level} maxLevel={skill.maxLevel} color={branch.color} />
                          <span className="text-[9px] text-[#8892a8] w-8 text-right tabular-nums">
                            {skill.level}/{skill.maxLevel}
                          </span>
                        </div>
                      </div>
                      <p className="text-[9px] text-[#8892a8] mt-0.5 hidden group-hover:block">
                        {skill.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] text-[#8892a8] flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-[#8b5cf6] opacity-50" />
            Hover skills for descriptions
          </div>
        </Section>

        {/* ═══ CLASS EVOLUTION ═══ */}
        <Section title="◇ Class Evolution" sectionKey="evolution" openSections={openSections} toggle={toggle}>
          <div className="space-y-0">
            {EVOLUTION_PATH.map((stage) => (
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
        </Section>

        {/* ═══ COGNITIVE TENSION MAP (Sealed) ═══ */}
        <Section title="◈ Cognitive Tension Map" sectionKey="tensions" openSections={openSections} toggle={toggle} sealed>
          <div className="mb-3 text-[10px] text-[#8b5cf6] border border-[#8b5cf6]/20 bg-[#8b5cf6]/5 p-2">
            ◈ SEALED ANALYSIS — The five internal contradictions that define this character&apos;s inner conflict.
          </div>
          <div className="space-y-5">
            {TENSIONS.map(t => (
              <div key={t.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#e8dcc8]">{t.name}</span>
                  <span className={`text-[8px] px-1.5 py-0.5 ${
                    t.severity === 'critical'
                      ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30'
                      : t.severity === 'high'
                      ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
                      : 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30'
                  }`}>
                    {t.severity.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] text-[#22d3ee] w-20 sm:w-24 text-right shrink-0">{t.sideA}</span>
                  <div className="flex-1 relative">
                    <div className="tension-bar" />
                    <div className="tension-marker" style={{ left: `${t.position}%` }} />
                  </div>
                  <span className="text-[8px] text-[#8b5cf6] w-20 sm:w-24 shrink-0">{t.sideB}</span>
                </div>

                <div className="flex items-center justify-between text-[8px] text-[#8892a8] mb-1">
                  <span>{t.conversationsA} convos</span>
                  <span>Ratio: {t.ratio}</span>
                  <span>{t.conversationsB} convos</span>
                </div>
                <p className="text-[9px] text-[#8892a8]">{t.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══ PHILOSOPHICAL ARSENAL (Sealed) ═══ */}
        <Section title="◈ Philosophical Arsenal" sectionKey="loadout" openSections={openSections} toggle={toggle} sealed>
          <div className="mb-3 text-[10px] text-[#8b5cf6] border border-[#8b5cf6]/20 bg-[#8b5cf6]/5 p-2">
            ◈ EQUIPPED FRAMEWORKS — The intellectual operating system that shapes all analysis.
          </div>
          <div className="space-y-2">
            {LOADOUT.map(item => (
              <div key={item.slot} className="equip-slot p-3 flex items-center gap-3">
                <span
                  className="text-[7px] w-12 text-center py-0.5 shrink-0 border"
                  style={{
                    fontFamily: 'var(--font-press-start)',
                    color: item.color,
                    borderColor: `${item.color}40`,
                    background: `${item.color}10`,
                  }}
                >
                  {item.slot}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold" style={{ color: item.color }}>{item.name}</span>
                    <span className="text-[9px] text-[#8892a8]">{item.uses} uses</span>
                  </div>
                  <p className="text-[9px] text-[#8892a8] mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══ EVOLUTION REQUIREMENTS (Sealed) ═══ */}
        <Section title="◈ Next Evolution Requirements" sectionKey="requirements" openSections={openSections} toggle={toggle} sealed>
          <div className="mb-3 text-[10px] text-[#8b5cf6] border border-[#8b5cf6]/20 bg-[#8b5cf6]/5 p-2">
            ◈ CLASSIFIED — Requirements to evolve from Quantum Architect to Sovereign Synthesizer.
          </div>
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
            ChatGPT (1,856 convos) + Claude (2,098 convos) + Second Brain (35 files)
          </p>
          <p className="text-[8px] text-[#8892a8] mt-2">
            Frameworks: LIWC · Big Five · McClelland · McAdams · Festinger · Stryker/Burke
          </p>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p
            className="text-[8px] text-[#8892a8] tracking-widest"
            style={{ fontFamily: 'var(--font-press-start)' }}
          >
            JKURN v0.1 — CHARACTER PROFILE SYSTEM
          </p>
        </div>
      </div>
    </main>
  );
}
