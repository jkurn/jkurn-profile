'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import PixelAvatar from '@/components/PixelAvatar';
import RadarChart from '@/components/RadarChart';

gsap.registerPlugin(useGSAP, ScrambleTextPlugin, SplitText, CustomEase);

// Signature ease: fast burst → overshoot → snappy settle
if (typeof window !== 'undefined') {
  CustomEase.create('cyberSnap', 'M0,0 C0.14,0 0.24,0.8 0.34,1.06 0.43,1.12 0.56,0.98 0.66,1.0 0.76,1.01 0.88,1.0 1,1');
}

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
    color: '#8b5cf6',
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
  { name: 'Code Apprentice', period: '2023 Q1-Q2', description: 'Discovered AI and immediately went all in. Built GPTs, played virtual C-suite. The spark.', traits: ['Builder', 'Executive'], active: false, future: false },
  { name: 'System Builder', period: '2023 Q3 — 2024 Q2', description: 'Found a niche in AI governance. Started creating content, building frameworks. Things got real.', traits: ['AI Governance', 'Content Creator', 'Framework Designer'], active: false, future: false },
  { name: 'The Shaper', period: '2024 Q3 — Present', description: 'Doing a bit of everything — building, strategizing, creating, exploring. Hasn\'t picked just one thing yet (and kind of likes it that way).', traits: ['Builder', 'Founder', 'Strategist', 'Creator'], active: true, future: false },
  { name: '??? Sovereign Synthesizer', period: 'Future', description: 'Picks one lane and goes all in. The scattered energy becomes focused force. Someday.', traits: ['???'], active: false, future: true },
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
      className="text-[9px] px-2 py-0.5 uppercase tracking-wider shrink-0"
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

// ─── TAB TYPES ──────────────────────────────────────────────────
type TabKey = 'overview' | 'about' | 'skills' | 'growth';

const TAB_LABELS: Record<TabKey, string> = {
  overview: 'Overview',
  about: 'About Me',
  skills: 'Skills',
  growth: 'Inner Work',
};

// ─── BOOT SEQUENCE ──────────────────────────────────────────────

const BOOT_LINES = [
  'LOADING CHARACTER DATA...',
  'PARSING 3,954 CONVERSATIONS...',
  'ANALYZING 9.8M WORDS...',
  'MAPPING COGNITIVE PROFILE...',
  'CALIBRATING RADAR ARRAY...',
  'CHARACTER LOADED.',
];

// ─── MAIN PAGE ───────────────────────────────────────────────────

export default function ProfilePage() {
  const [booted, setBooted] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const activeTabRef = useRef<TabKey>('overview');
  const bootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const statBarsRef = useRef<HTMLDivElement>(null);
  const xpBarRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const heroBioRef = useRef<HTMLParagraphElement>(null);
  const heroCardRef = useRef<HTMLElement>(null);

  // Boot sequence — GSAP timeline
  // If document is hidden (e.g. iframe/preview tool), skip animation immediately
  useGSAP(() => {
    if (!bootRef.current) return;

    const complete = () => {
      setBooted(true);
      setTimeout(() => setStatsAnimated(true), 200);
    };

    // Skip animation when tab/iframe is hidden — GSAP ticker pauses in hidden docs
    if (document.hidden) {
      complete();
      return;
    }

    const lines = bootRef.current.querySelectorAll('.boot-line');
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(bootRef.current, {
          opacity: 0,
          duration: 0.4,
          onComplete: complete,
        });
      },
    });

    tl.from(lines, {
      opacity: 0,
      x: -10,
      duration: 0.15,
      stagger: 0.2,
      ease: 'power2.out',
    });
  }, { scope: bootRef });

  // Animate main content on boot complete — skip when GSAP ticker is sleeping (hidden iframe)
  useGSAP(() => {
    if (!booted || !mainRef.current || document.hidden) return;

    const panels = mainRef.current.querySelectorAll('.gsap-panel');
    gsap.from(panels, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: 'cyberSnap',
    });
  }, { dependencies: [booted], scope: mainRef });

  // Animate stat bars — CSS transition drives widths (works even when GSAP ticker sleeps),
  // GSAP adds counter number count-up as an enhancement
  useEffect(() => {
    if (!statsAnimated || !statBarsRef.current) return;

    // CSS transition: set width via style, transition handles the animation
    const bars = statBarsRef.current.querySelectorAll<HTMLElement>('.gsap-stat-fill');
    bars.forEach((bar, i) => {
      setTimeout(() => { bar.style.width = bar.dataset.width || '0%'; }, 60 + i * 60);
    });

    // GSAP counter count-up (enhancement — gracefully falls back to final value if ticker sleeping)
    const counters = statBarsRef.current.querySelectorAll<HTMLElement>('.gsap-counter');
    counters.forEach((el, i) => {
      const target = parseInt(el.dataset.target || '0', 10);
      const obj = { val: 0 };
      const tween = gsap.to(obj, {
        val: target,
        duration: 1.2,
        delay: 0.1 + i * 0.06,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.val).toString(); },
      });
      // If GSAP ticker is sleeping (hidden iframe), jump to final value after 300ms
      setTimeout(() => {
        if (el.textContent === '0') {
          tween.kill();
          el.textContent = target.toString();
        }
      }, 300 + i * 60);
    });
  }, [statsAnimated]);

  // Animate XP bar via CSS transition
  useEffect(() => {
    if (!statsAnimated || !xpBarRef.current) return;
    const target = `${(CHARACTER.xp.current / CHARACTER.xp.next) * 100}%`;
    setTimeout(() => { if (xpBarRef.current) xpBarRef.current.style.width = target; }, 80);
  }, [statsAnimated]);

  // Animate saboteur bars via CSS transition when Inner Work tab is active
  useEffect(() => {
    if (activeTab !== 'growth') return;
    const timer = setTimeout(() => {
      const bars = document.querySelectorAll<HTMLElement>('.gsap-saboteur-fill');
      bars.forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.dataset.width || '0%'; }, i * 80);
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // ─── Step 1: ScrambleText hero name decode ───
  useGSAP(() => {
    if (!booted || !heroNameRef.current || document.hidden) return;
    gsap.to(heroNameRef.current, {
      duration: 1.8,
      delay: 0.6,
      scrambleText: {
        text: CHARACTER.name,
        chars: '!@#$%^&*01XMWK',
        revealDelay: 0.2,
        speed: 0.4,
      },
    });
  }, { dependencies: [booted] });

  // ─── Step 2: SplitText bio character cascade ───
  useGSAP(() => {
    if (!booted || !heroBioRef.current || document.hidden) return;
    const split = new SplitText(heroBioRef.current, { type: 'chars' });
    gsap.from(split.chars, {
      opacity: 0,
      y: 12,
      rotationX: -40,
      duration: 0.6,
      delay: 2.2,
      stagger: 0.02,
      ease: 'back.out(1.7)',
      immediateRender: false,
    });
    return () => { split.revert(); };
  }, { dependencies: [booted] });

  // ─── Step 3: SVG glitch filter (intermittent) ───
  useGSAP(() => {
    if (!booted || !heroCardRef.current || document.hidden) return;
    const turbulence = document.querySelector('#glitch feTurbulence');
    const displacement = document.querySelector('#glitch feDisplacementMap');
    if (!turbulence || !displacement) return;

    const fireGlitch = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          const nextDelay = gsap.utils.random(4, 8);
          gsap.delayedCall(nextDelay, fireGlitch);
        },
      });
      tl.to(turbulence, { attr: { baseFrequency: '0.08' }, duration: 0.05 })
        .to(displacement, { attr: { scale: '15' }, duration: 0.05 }, '<')
        .to(heroNameRef.current, { textShadow: '2px 0 #ff0000, -2px 0 #00ff00', duration: 0.05 }, '<')
        .to({}, { duration: 0.1 })
        .to(turbulence, { attr: { baseFrequency: '0' }, duration: 0.05 })
        .to(displacement, { attr: { scale: '0' }, duration: 0.05 }, '<')
        .to(heroNameRef.current, { textShadow: 'none', duration: 0.05 }, '<');
    };

    gsap.delayedCall(3, fireGlitch);
  }, { dependencies: [booted] });

  // ─── Step 5: Neon glow pulse (ambient) ───
  useGSAP(() => {
    if (!booted || document.hidden) return;
    gsap.to('.rpg-panel-gold', {
      boxShadow: '0 0 12px rgba(200,168,78,0.3), inset 0 0 12px rgba(200,168,78,0.05)',
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    gsap.to('.section-header', {
      textShadow: '0 0 7px #dcc06e, 0 0 21px #c8a84e',
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }, { dependencies: [booted] });

  // ─── Step 6: Neon flicker on section headers (intermittent) ───
  useEffect(() => {
    if (!booted || document.hidden) return;
    const headers = document.querySelectorAll<HTMLElement>('.section-header');
    const tweens: gsap.core.Tween[] = [];

    headers.forEach((header) => {
      const flickerLoop = () => {
        const tl = gsap.timeline({
          onComplete: () => {
            const nextDelay = gsap.utils.random(4, 10);
            const dc = gsap.delayedCall(nextDelay, flickerLoop);
            tweens.push(dc as unknown as gsap.core.Tween);
          },
        });
        tl.to(header, { opacity: 0.7, duration: 0.03 })
          .to(header, { opacity: 1, duration: 0.03 })
          .to(header, { opacity: 0.8, duration: 0.04 })
          .to(header, { opacity: 1, duration: 0.03 });
        tweens.push(tl as unknown as gsap.core.Tween);
      };
      const initialDelay = gsap.utils.random(2, 6);
      const dc = gsap.delayedCall(initialDelay, flickerLoop);
      tweens.push(dc as unknown as gsap.core.Tween);
    });

    return () => { tweens.forEach(t => t.kill()); };
  }, [booted, activeTab]);

  // ─── Step 8: Magnetic tab buttons ───
  useEffect(() => {
    if (!booted || document.hidden) return;
    const buttons = document.querySelectorAll<HTMLElement>('.tab-button');
    const cleanups: (() => void)[] = [];

    buttons.forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power3' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power3' });

      const handleMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        xTo(relX * 0.3);
        yTo(relY * 0.3);
      };

      const handleLeave = () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      };

      btn.addEventListener('mousemove', handleMove);
      btn.addEventListener('mouseleave', handleLeave);
      cleanups.push(() => {
        btn.removeEventListener('mousemove', handleMove);
        btn.removeEventListener('mouseleave', handleLeave);
      });
    });

    return () => { cleanups.forEach(fn => fn()); };
  }, [booted]);

  // ─── Hover scramble on stat counters ───
  useEffect(() => {
    if (!booted || !statBarsRef.current || document.hidden) return;

    const rows = statBarsRef.current.querySelectorAll<HTMLElement>('.stat-row');
    const cleanups: (() => void)[] = [];

    rows.forEach((row) => {
      const counter = row.querySelector<HTMLElement>('.gsap-counter');
      if (!counter) return;

      const handleEnter = () => {
        const target = counter.dataset.target || '0';
        gsap.to(counter, {
          duration: 0.4,
          scrambleText: {
            text: target,
            chars: '0123456789',
            revealDelay: 0.1,
            speed: 0.8,
          },
        });
      };

      row.addEventListener('mouseenter', handleEnter);
      cleanups.push(() => row.removeEventListener('mouseenter', handleEnter));
    });

    return () => { cleanups.forEach(fn => fn()); };
  }, [booted, statsAnimated]);

  // Animate tab content — directional slide based on which tab we're moving to
  const TAB_ORDER: TabKey[] = ['overview', 'about', 'skills', 'growth'];

  const handleTabChange = useCallback((tab: TabKey) => {
    const prevIdx = TAB_ORDER.indexOf(activeTabRef.current);
    const nextIdx = TAB_ORDER.indexOf(tab);
    const direction = nextIdx >= prevIdx ? 1 : -1;
    activeTabRef.current = tab;
    setActiveTab(tab);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!tabContentRef.current) return;
        const children = tabContentRef.current.querySelectorAll('.gsap-tab-item');
        if (children.length === 0 || document.hidden) return;
        gsap.from(children, {
          opacity: 0,
          x: direction * 24,
          y: 8,
          duration: 0.35,
          stagger: 0.05,
          ease: 'cyberSnap',
        });

        // ScrambleText decode on section headers
        const headers = tabContentRef.current.querySelectorAll('.section-header');
        headers.forEach((header) => {
          const originalText = header.textContent || '';
          gsap.to(header, {
            duration: 0.8,
            scrambleText: {
              text: originalText,
              chars: '!@#$%^&*01XMWK',
              revealDelay: 0.1,
              speed: 0.5,
            },
          });
        });
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Boot screen
  if (!booted) {
    return (
      <div ref={bootRef} className="boot-screen">
        <div className="max-w-md w-full px-6">
          <div className="space-y-1">
            {BOOT_LINES.map((line, i) => (
              <div
                key={i}
                className="boot-line text-[#22d3ee] text-[11px] sm:text-xs leading-6"
                style={{ fontFamily: 'var(--font-press-start)' }}
              >
                {line}
              </div>
            ))}
          </div>
          <span
            className="inline-block w-2 h-3 bg-[#22d3ee] mt-2"
            style={{ animation: 'cursorBlink 1s step-end infinite' }}
          />
        </div>
      </div>
    );
  }

  return (
    <main ref={mainRef} className="min-h-screen pb-20">
      <div className="scanline-overlay" />

      {/* Hidden SVG filter for glitch effect */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="glitch">
          <feTurbulence type="fractalNoise" baseFrequency="0" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="max-w-3xl mx-auto px-4 pt-8 space-y-4">

        {/* ═══ HERO ═══ */}
        <header ref={heroCardRef} className="rpg-panel rpg-panel-gold p-6 gsap-panel glitch-target">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="shrink-0">
              <PixelAvatar />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <h1
                  ref={heroNameRef}
                  className="text-[13px] sm:text-base tracking-widest"
                  style={{ fontFamily: 'var(--font-press-start)', color: 'var(--text-gold)' }}
                >
                  {CHARACTER.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[#8b5cf6] text-[12px] px-2 py-0.5 border border-[#8b5cf6]/30 bg-[#8b5cf6]/10">
                    {CHARACTER.title}
                  </span>
                  <span className="text-[#22d3ee] text-[12px] px-2 py-0.5 border border-[#22d3ee]/30 bg-[#22d3ee]/10">
                    {CHARACTER.subclass}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-3">
                <span
                  className="text-[11px] shrink-0"
                  style={{ fontFamily: 'var(--font-press-start)', color: 'var(--text-gold)' }}
                >
                  Lv.{CHARACTER.level}
                </span>
                <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                  <div className="stat-bar-track flex-1 border border-[#2a3050] h-[10px]">
                    <div
                      ref={xpBarRef}
                      className="stat-bar-fill"
                      style={{ width: '0%', background: 'linear-gradient(90deg, #c8a84ecc, #c8a84e)', transition: 'width 1.5s ease-out' }}
                    />
                  </div>
                  <span className="text-[11px] text-[#8892a8] shrink-0 tabular-nums">
                    {(CHARACTER.xp.current / 1000000).toFixed(1)}M/{(CHARACTER.xp.next / 1000000).toFixed(0)}M XP
                  </span>
                </div>
              </div>

              <p ref={heroBioRef} className="text-[13px] text-[#8892a8] leading-relaxed max-w-md">
                {CHARACTER.bio}
              </p>
            </div>
          </div>
        </header>

        {/* ═══ TAB NAVIGATION ═══ */}
        <nav className="tab-nav sticky top-0 z-40 pt-1 gsap-panel">
          {(Object.keys(TAB_LABELS) as TabKey[]).map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </nav>

        {/* ═══ TAB CONTENT ═══ */}
        <div ref={tabContentRef}>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Radar Chart */}
              <div className="rpg-panel p-4 gsap-tab-item flex justify-center">
                <RadarChart attributes={ATTRIBUTES} animate={statsAnimated} />
              </div>

              {/* Core Attributes */}
              <div ref={statBarsRef} className="rpg-panel p-4 gsap-tab-item">
                <h2 className="section-header mb-4">◆ Core Attributes</h2>
                <div className="space-y-3">
                  {ATTRIBUTES.map(attr => (
                    <div key={attr.abbr} className="stat-row flex items-start gap-3">
                      <span
                        className="w-12 text-[11px] font-bold shrink-0 pt-0.5"
                        style={{ color: attr.color, fontFamily: 'var(--font-press-start)' }}
                      >
                        {attr.abbr}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[13px] text-[#e8dcc8] font-bold">{attr.label}</span>
                          <span className="text-[12px] text-[#8892a8] tabular-nums">
                            <span className="gsap-counter" data-target={attr.value}>0</span>/{attr.max}
                          </span>
                        </div>
                        <div className="stat-bar-track border border-[#2a3050] mb-1">
                          <div
                            className="gsap-stat-fill stat-bar-fill"
                            data-width={`${(attr.value / attr.max) * 100}%`}
                            style={{
                              width: '0%',
                              background: `linear-gradient(90deg, ${attr.color}cc, ${attr.color})`,
                            }}
                          />
                        </div>
                        <p className="text-[12px] text-[#8892a8] leading-relaxed">{attr.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-[12px] text-[#8892a8] flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-[#8b5cf6] opacity-50" />
                  Scale: 0-40 | Thinks a lot, ships less. Aware of it. Working on it.
                </div>
              </div>
            </div>
          )}

          {/* ── ABOUT ME TAB ── */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              {/* Operating Manual */}
              <div className="rpg-panel p-4 gsap-tab-item">
                <h2 className="section-header mb-3">◇ Operating Manual</h2>
                <div className="mb-3 text-[12px] text-[#22d3ee] border border-[#22d3ee]/20 bg-[#22d3ee]/5 p-2">
                  A personal user manual for collaborators, teammates, and future self.
                </div>
                <div className="space-y-4">
                  {MANUAL_SECTIONS.map(section => (
                    <div key={section.title} className="rpg-panel p-3 gsap-tab-item">
                      <h3
                        className="text-[11px] tracking-wider uppercase mb-2 flex items-center gap-2"
                        style={{ fontFamily: 'var(--font-press-start)', color: '#dcc06e' }}
                      >
                        <span className="text-[#8b5cf6]">{section.icon}</span>
                        {section.title}
                      </h3>
                      <ul className="space-y-1.5">
                        {section.content.map((line, i) => (
                          <li key={i} className="text-[13px] text-[#e8dcc8] leading-relaxed flex items-start gap-2">
                            <span className="text-[#2a3050] shrink-0 mt-0.5">›</span>
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Conditions */}
              <div className="rpg-panel p-4 gsap-tab-item">
                <h2 className="section-header mb-4">◇ Active Conditions</h2>

                <h3 className="text-[11px] text-[#22c55e] tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-press-start)' }}>
                  Buffs
                </h3>
                <div className="grid grid-cols-1 gap-2 mb-6">
                  {CONDITIONS.filter(c => c.type === 'buff').map(cond => (
                    <div key={cond.name} className="status-card rpg-panel p-3 flex items-start gap-3 border-l-2 border-l-[#22c55e] gsap-tab-item">
                      <span className="text-lg shrink-0">{cond.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] font-bold text-[#22c55e]">{cond.name}</span>
                        <p className="text-[12px] text-[#e8dcc8] mt-0.5">{cond.description}</p>
                        <p className="text-[11px] text-[#8892a8] mt-1 italic">Source: {cond.source}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-[11px] text-[#ef4444] tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-press-start)' }}>
                  Debuffs
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {CONDITIONS.filter(c => c.type === 'debuff').map(cond => (
                    <div key={cond.name} className="status-card rpg-panel p-3 flex items-start gap-3 border-l-2 border-l-[#ef4444] gsap-tab-item">
                      <span className="text-lg shrink-0">{cond.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] font-bold text-[#ef4444]">{cond.name}</span>
                        <p className="text-[12px] text-[#e8dcc8] mt-0.5">{cond.description}</p>
                        <p className="text-[11px] text-[#8892a8] mt-1 italic">Source: {cond.source}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SKILLS TAB ── */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="rpg-panel p-4 gsap-tab-item">
                <h2 className="section-header mb-4">◇ Capability Map</h2>
                <div className="space-y-5">
                  {CAPABILITIES.map(domain => (
                    <div key={domain.domain} className="gsap-tab-item">
                      <div className="flex items-center gap-2 mb-2">
                        <span style={{ color: domain.color }}>{domain.icon}</span>
                        <span className="text-[13px] font-bold" style={{ color: domain.color }}>
                          {domain.domain}
                        </span>
                      </div>
                      <div className="space-y-2 ml-5">
                        {domain.capabilities.map(cap => (
                          <div key={cap.name} className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[13px] text-[#e8dcc8]">{cap.name}</span>
                                <ProficiencyBadge level={cap.level} />
                              </div>
                              <p className="text-[12px] text-[#8892a8] mt-0.5">{cap.evidence}</p>
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
            <div className="space-y-4">
              {/* Character Dynamics */}
              <div className="rpg-panel p-4 gsap-tab-item">
                <h2 className="section-header mb-3">◈ Character Dynamics</h2>
                <div className="mb-3 text-[12px] text-[#8b5cf6] border border-[#8b5cf6]/20 bg-[#8b5cf6]/5 p-2">
                  The ongoing internal debates. Everyone has them — these are mine.
                </div>
                <div className="space-y-5">
                  {DYNAMICS.map(d => (
                    <div key={d.name} className="gsap-tab-item">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-bold text-[#e8dcc8]">{d.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 ${
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
                        <span className="text-[11px] text-[#22d3ee] w-20 sm:w-24 text-right shrink-0">{d.sideA}</span>
                        <div className="flex-1 relative">
                          <div className="tension-bar" />
                          <div className="tension-marker" style={{ left: `${d.position}%` }} />
                        </div>
                        <span className="text-[11px] text-[#8b5cf6] w-20 sm:w-24 shrink-0">{d.sideB}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#8892a8] mb-1">
                        <span>{d.conversationsA} convos</span>
                        <span>{d.conversationsB} convos</span>
                      </div>
                      <p className="text-[12px] text-[#8892a8]">{d.description}</p>
                    </div>
                  ))}
                </div>

                {/* Saboteur Cycle */}
                <div className="mt-6 pt-4 border-t border-[#2a3050]">
                  <h3
                    className="text-[11px] text-[#ef4444] tracking-widest uppercase mb-3"
                    style={{ fontFamily: 'var(--font-press-start)' }}
                  >
                    ⚠ Saboteur Cycle
                  </h3>
                  <div className="space-y-2">
                    {SABOTEUR_CYCLE.map(s => (
                      <div key={s.name} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 shrink-0 w-28">
                          <span className="text-[13px] text-[#e8dcc8] font-bold">{s.name}</span>
                          <span className="text-[11px] text-[#ef4444]">{s.score}</span>
                        </div>
                        <div className="flex-1">
                          <div className="stat-bar-track border border-[#2a3050] h-2">
                            <div
                              className="gsap-saboteur-fill h-full"
                              data-width={`${(s.score / 10) * 100}%`}
                              style={{ width: '0%', background: 'linear-gradient(90deg, #ef4444cc, #ef4444)', transition: 'width 1.0s ease-out' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-[12px] text-[#8892a8] italic">
                    The loop: start something new → rationalize it → push too hard → rebuild the system → repeat
                  </div>
                </div>
              </div>

              {/* Growth Path */}
              <div className="rpg-panel p-4 gsap-tab-item">
                <h2 className="section-header mb-4">◈ Growth Path</h2>

                <h3
                  className="text-[11px] text-[#dcc06e] tracking-widest uppercase mb-3"
                  style={{ fontFamily: 'var(--font-press-start)' }}
                >
                  Class Evolution
                </h3>
                <div className="space-y-0 mb-6">
                  {EVOLUTION.map((stage) => (
                    <div key={stage.name} className={`evolution-node ${stage.active ? 'active' : ''} pb-4 gsap-tab-item`}>
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
                            <span className={`text-[13px] font-bold ${stage.active ? 'text-[#8b5cf6]' : stage.future ? 'text-[#8892a8]' : 'text-[#22c55e]'}`}>
                              {stage.name}
                            </span>
                            <span className="text-[11px] text-[#8892a8]">{stage.period}</span>
                            {stage.active && (
                              <span className="text-[9px] px-1.5 py-0.5 bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-[#8892a8] mt-1">{stage.description}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {stage.traits.map((trait, ti) => (
                              <span
                                key={ti}
                                className={`text-[10px] px-1.5 py-0.5 border ${
                                  stage.future ? 'border-[#2a3050] text-[#8892a8] border-dashed' : 'border-[#2a3050] text-[#e8dcc8]'
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
                  className="text-[11px] text-[#dcc06e] tracking-widest uppercase mb-3"
                  style={{ fontFamily: 'var(--font-press-start)' }}
                >
                  Equipped Frameworks
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                  {PHILOSOPHICAL_LOADOUT.map(item => (
                    <div
                      key={item.name}
                      className="rpg-panel p-2 text-center gsap-tab-item"
                      style={{ borderColor: `${item.color}30` }}
                    >
                      <span className="text-[12px] font-bold block" style={{ color: item.color }}>
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#8892a8]">{item.uses} convos</span>
                    </div>
                  ))}
                </div>

                {/* Evolution Requirements */}
                <h3
                  className="text-[11px] text-[#dcc06e] tracking-widest uppercase mb-3"
                  style={{ fontFamily: 'var(--font-press-start)' }}
                >
                  Evolution Requirements
                </h3>
                <div className="space-y-2">
                  {EVOLUTION_REQUIREMENTS.map((req, i) => (
                    <div key={i} className="flex items-center gap-3 gsap-tab-item">
                      <span className={`w-5 h-5 shrink-0 flex items-center justify-center border text-[10px] ${
                        req.done ? 'border-[#22c55e] bg-[#22c55e]/20 text-[#22c55e]' : 'border-[#2a3050] text-[#8892a8]'
                      }`}>
                        {req.done ? '✓' : '○'}
                      </span>
                      <span className={`text-[13px] ${req.done ? 'text-[#22c55e] line-through' : 'text-[#e8dcc8]'}`}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[12px] text-[#8892a8] border-t border-[#2a3050] pt-3">
                  <span className="text-[#f59e0b]">⚠</span> Progress: 0/5 requirements met. The wave function remains uncollapsed.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="rpg-panel p-4 text-center space-y-1 gsap-panel">
          <p className="text-[12px] text-[#8892a8]">
            Character data derived from 3,954 conversations | ~9.8M words | 1,076 days
          </p>
          <p className="text-[11px] text-[#8892a8]">
            ChatGPT (1,856) + Claude (2,098) + Second Brain (35 files)
          </p>
          <p className="text-[11px] text-[#8892a8] mt-2">
            Frameworks: LIWC · Big Five · McClelland · McAdams · PrinciplesYou · Saboteur Assessment
          </p>
        </div>

        <div className="text-center py-4">
          <p
            className="text-[10px] text-[#8892a8] tracking-widest"
            style={{ fontFamily: 'var(--font-press-start)' }}
          >
            JKURN v0.5 — CHARACTER PROFILE SYSTEM
          </p>
        </div>
      </div>
    </main>
  );
}
