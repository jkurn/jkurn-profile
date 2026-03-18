'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import PixelAvatar from '@/components/PixelAvatar';
import RadarChart from '@/components/RadarChart';
import AccordionSection from '@/components/AccordionSection';

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
  bio: 'AI strategist and builder. Turns complex problems into systems, frameworks, and shipped products. Based in Sydney — has called six countries home.',
};

// ─── RADAR ATTRIBUTES (6-axis) ──────────────────────────────────
const ATTRIBUTES = [
  {
    label: 'AI Strategy',
    abbr: 'AI',
    value: 37,
    max: 40,
    color: '#22d3ee',
    description: 'Lives and breathes AI — from governance frameworks to hands-on prompt engineering. Builds with AI daily, advises others on how to do it responsibly.',
  },
  {
    label: 'Systems Thinking',
    abbr: 'SYS',
    value: 36,
    max: 40,
    color: '#8b5cf6',
    description: 'Connects dots across fields that have no business being connected. Give him a messy problem and he\'ll hand back a framework.',
  },
  {
    label: 'Communication',
    abbr: 'COM',
    value: 33,
    max: 40,
    color: '#ec4899',
    description: 'Lights up in conversations about ideas. Translates complex technical concepts into language that lands with any audience.',
  },
  {
    label: 'Execution',
    abbr: 'EXE',
    value: 30,
    max: 40,
    color: '#f59e0b',
    description: 'Ships real things — AI chatbots, knowledge pipelines, automation workflows. Gets from whiteboard to production.',
  },
  {
    label: 'Leadership',
    abbr: 'LDR',
    value: 31,
    max: 40,
    color: '#22c55e',
    description: 'Leads by making the complex simple. Mentors teams, aligns stakeholders, and knows when to make the call.',
  },
  {
    label: 'Adaptability',
    abbr: 'ADP',
    value: 34,
    max: 40,
    color: '#f97316',
    description: 'Six countries, multiple industries, three career pivots. Thrives in ambiguity and picks up new domains fast.',
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
      'Repetitive admin work with no thinking involved — I do my best work when there\'s a real problem to solve.',
      'Meetings that could\'ve been a doc. (You\'ve heard this one before, but I really mean it.)',
      'Executing without understanding why. I don\'t need to agree with everything, but I need to understand the reasoning.',
      'Low-autonomy environments — I thrive when trusted to figure out the "how" once I know the "what."',
    ],
  },
  {
    title: 'Working With Me',
    icon: '◆',
    content: [
      'I do my best work when I understand the bigger picture — the "why" behind what we\'re doing.',
      'I\'ll probably respond to your problem with a framework. Feel free to tell me to just answer the question.',
      'I genuinely want pushback on my ideas. I\'d rather be wrong early than wrong late.',
      'I\'ll bring energy, ideas, and structure to any project. Pair me with strong executors and we\'ll move fast.',
    ],
  },
];

// ─── ACTIVE CONDITIONS ──────────────────────────────────────────
interface Condition {
  name: string;
  icon: string;
  description: string;
  source: string;
}

const CONDITIONS: Condition[] = [
  { name: 'Dual Mind Stance', icon: '⚡', description: 'Can switch between big-picture brainstorming and heads-down building. Two modes, one brain.', source: 'Innate trait' },
  { name: 'Framework Arsenal', icon: '📚', description: 'Has a mental toolkit of 10+ frameworks ready for any situation. Possibly overkill for choosing lunch.', source: 'Years of collecting mental models' },
  { name: 'Metacognitive Shield', icon: '🛡', description: 'Unusually aware of his own thinking patterns and biases. Uses that awareness to course-correct fast.', source: 'Lots of self-reflection' },
  { name: 'Quantum Processing', icon: '🔮', description: 'Comfortable holding multiple conflicting ideas at once without needing to pick a winner right away.', source: 'Multicultural upbringing' },
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
    domain: 'Execution & Output',
    icon: '▶',
    color: '#f59e0b',
    capabilities: [
      { name: 'Vision Articulation', level: 'Expert', evidence: 'Can explain complex ideas in a way that actually lands' },
      { name: 'Project Initiation', level: 'Advanced', evidence: 'Strong starts, lots of momentum — the exciting part' },
      { name: 'Sustained Delivery', level: 'Advanced', evidence: 'Shipped multiple production systems end-to-end — each one gets smoother' },
    ],
  },
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
  { name: 'Code Apprentice', period: '2023 Q1-Q2', description: 'Discovered AI and immediately went all in. Built GPTs, prototyped executive-level AI tools. The spark.', traits: ['Builder', 'Explorer'], active: false, future: false },
  { name: 'System Builder', period: '2023 Q3 — 2024 Q2', description: 'Found a niche in AI governance and strategy. Started creating content, shipping frameworks, advising orgs.', traits: ['AI Governance', 'Content Creator', 'Framework Designer'], active: false, future: false },
  { name: 'The Shaper', period: '2024 Q3 — Present', description: 'Building at the intersection of AI strategy, product, and execution. Shipping real systems while advising others on how to do the same.', traits: ['Builder', 'Strategist', 'Advisor', 'Creator'], active: true, future: false },
  { name: 'Sovereign Synthesizer', period: 'Next', description: 'Leading AI transformation at scale — whether inside an organization or building one from scratch.', traits: ['AI Leadership', 'Product Vision', 'Team Builder'], active: false, future: true },
];

const EVOLUTION_REQUIREMENTS = [
  { text: 'Establish global AI leadership authority', done: false },
  { text: 'Ship 3 major products to production', done: true },
  { text: 'Build and publish an AI governance framework', done: true },
  { text: 'Publish consistently for 6 months', done: false },
  { text: 'Ship AI agents that generate revenue autonomously', done: false },
];

const PHILOSOPHICAL_LOADOUT = [
  { name: 'Lean / Agile', color: '#f59e0b' },
  { name: 'Systems Thinking', color: '#8b5cf6' },
  { name: 'Behavioral Economics', color: '#22d3ee' },
  { name: 'Design Thinking', color: '#22c55e' },
  { name: 'PARA / PKM', color: '#ec4899' },
  { name: 'Positive Psychology', color: '#3b82f6' },
];

// ─── ACHIEVEMENT LOG ──────────────────────────────────────────────
interface AchievementCategory {
  category: string;
  icon: string;
  color: string;
  items: string[];
}

const ACHIEVEMENTS: AchievementCategory[] = [
  {
    category: 'AI Strategy & Governance',
    icon: '⚡',
    color: '#22d3ee',
    items: [
      'Designed AI governance frameworks adopted by enterprise clients for responsible AI deployment',
      'Built and deployed AI chatbot (Nielsen Bot) — reduced manual research time by 60%',
      'Created 30+ custom AI automation skills and agent workflows for business operations',
      'Advised organizations across APAC on AI adoption strategy and risk management',
    ],
  },
  {
    category: 'Building & Shipping',
    icon: '▶',
    color: '#8b5cf6',
    items: [
      'Shipped production AI systems: chatbots, knowledge pipelines, automation agents',
      'Built AI bookmark-to-knowledge pipeline — Python, AWS Lambda, automated ingestion',
      'Architected a 2,450+ note personal knowledge system (Obsidian, PARA framework)',
      'Built this site from scratch — Next.js, GSAP animations, deployed on GitHub Pages',
    ],
  },
  {
    category: 'Thought Leadership & Advisory',
    icon: '◆',
    color: '#f59e0b',
    items: [
      'Published AI strategy content on Medium and Substack reaching thousands of readers',
      'Active consulting engagements with enterprise clients on AI implementation',
      'Developed repeatable frameworks for AI readiness assessment and governance setup',
    ],
  },
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
      className="text-[11px] px-2 py-0.5 uppercase tracking-wider shrink-0"
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
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(['achievements', 'attributes']));
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const statBarsRef = useRef<HTMLDivElement>(null);
  const xpBarRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const heroBioRef = useRef<HTMLParagraphElement>(null);
  const heroCardRef = useRef<HTMLElement>(null);

  const toggleSection = useCallback((id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Boot sequence — GSAP timeline
  // If document is hidden (e.g. iframe/preview tool), skip animation immediately
  useGSAP(() => {
    if (!bootRef.current) return;

    const complete = () => {
      setBooted(true);
      setTimeout(() => setStatsAnimated(true), 200);
    };

    // Skip animation when tab/iframe is hidden or user prefers reduced motion
    if (document.hidden || prefersReducedMotion) {
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
    if (!booted || !mainRef.current || document.hidden || prefersReducedMotion) return;

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


  // ─── Step 1: ScrambleText hero name decode ───
  useGSAP(() => {
    if (!booted || !heroNameRef.current || document.hidden || prefersReducedMotion) return;
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
    if (!booted || !heroBioRef.current || document.hidden || prefersReducedMotion) return;
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
    if (!booted || !heroCardRef.current || document.hidden || prefersReducedMotion) return;
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
    if (!booted || document.hidden || prefersReducedMotion) return;
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
    if (!booted || document.hidden || prefersReducedMotion) return;
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
  }, [booted]);

  // ─── Hover scramble on stat counters ───
  useEffect(() => {
    if (!booted || !statBarsRef.current || document.hidden || prefersReducedMotion) return;

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


  // Boot screen
  if (!booted) {
    return (
      <div ref={bootRef} className="boot-screen">
        <div className="max-w-md w-full px-6">
          <div className="space-y-1">
            {BOOT_LINES.map((line, i) => (
              <div
                key={i}
                className="boot-line text-[#22d3ee] text-xs sm:text-sm leading-6"
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
                  className="text-sm sm:text-lg tracking-widest"
                  style={{ fontFamily: 'var(--font-press-start)', color: 'var(--text-gold)' }}
                >
                  {CHARACTER.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[#8b5cf6] text-[13px] px-2 py-0.5 border border-[#8b5cf6]/30 bg-[#8b5cf6]/10">
                    {CHARACTER.title}
                  </span>
                  <span className="text-[#22d3ee] text-[13px] px-2 py-0.5 border border-[#22d3ee]/30 bg-[#22d3ee]/10">
                    {CHARACTER.subclass}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-3">
                <span
                  className="text-xs shrink-0"
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
                  <span className="text-xs text-[#8892a8] shrink-0 tabular-nums">
                    {(CHARACTER.xp.current / 1000000).toFixed(1)}M/{(CHARACTER.xp.next / 1000000).toFixed(0)}M XP
                  </span>
                </div>
              </div>

              <p ref={heroBioRef} className="text-sm text-[#8892a8] leading-relaxed max-w-md">
                {CHARACTER.bio}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                {[
                  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jonathan-kurniawan/', color: '#3b82f6' },
                  { label: 'YouTube', href: 'https://www.youtube.com/@Jkurn', color: '#ef4444' },
                  { label: 'X', href: 'https://x.com/jonakurn', color: '#8892a8' },
                  { label: 'Substack', href: 'https://freerangefriaiday.substack.com/', color: '#f59e0b' },
                  { label: 'Medium', href: 'https://medium.com/@jkurn', color: '#22c55e' },
                  { label: 'Insta', href: 'https://www.instagram.com/jonathan.l.kurniawan/', color: '#ec4899' },
                  { label: 'GitHub', href: 'https://github.com/jkurn', color: '#8b5cf6' },
                  { label: 'Twitch', href: 'https://www.twitch.tv/jkurniawan', color: '#9146ff' },
                ].map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] px-2 py-1 border transition-colors"
                    style={{
                      fontFamily: 'var(--font-press-start)',
                      color: link.color,
                      borderColor: `${link.color}4d`,
                      backgroundColor: `${link.color}1a`,
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLElement).style.backgroundColor = `${link.color}33`;
                      (e.target as HTMLElement).style.borderColor = `${link.color}80`;
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLElement).style.backgroundColor = `${link.color}1a`;
                      (e.target as HTMLElement).style.borderColor = `${link.color}4d`;
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ═══ ACCORDION SECTIONS ═══ */}
        <div className="space-y-4">

          {/* ── ACHIEVEMENT LOG ── */}
          <AccordionSection id="achievements" title="★ Achievement Log" isOpen={openSections.has('achievements')} onToggle={toggleSection} defaultOpen>
            <div className="space-y-4">
              {ACHIEVEMENTS.map(cat => (
                <div key={cat.category}>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ color: cat.color }}>{cat.icon}</span>
                    <span className="text-sm font-bold" style={{ color: cat.color }}>
                      {cat.category}
                    </span>
                  </div>
                  <div className="space-y-1.5 ml-5">
                    {cat.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-[#5a6478] shrink-0 mt-0.5">›</span>
                        <span className="text-sm text-[#e8dcc8]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionSection>

          {/* ── CORE ATTRIBUTES ── */}
          <AccordionSection id="attributes" title="◆ Core Attributes" isOpen={openSections.has('attributes')} onToggle={toggleSection} defaultOpen>
            {/* Radar Chart */}
            <div className="rpg-panel p-4 mb-4 flex justify-center">
              <RadarChart attributes={ATTRIBUTES} animate={statsAnimated} />
            </div>

            {/* Stat Bars */}
            <div ref={statBarsRef}>
              <div className="space-y-3">
                {ATTRIBUTES.map(attr => (
                  <div key={attr.abbr} className="stat-row flex items-start gap-3">
                    <span
                      className="w-12 text-xs font-bold shrink-0 pt-0.5"
                      style={{ color: attr.color, fontFamily: 'var(--font-press-start)' }}
                    >
                      {attr.abbr}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-[#e8dcc8] font-bold">{attr.label}</span>
                        <span className="text-[13px] text-[#8892a8] tabular-nums">
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
                      <p className="text-[13px] text-[#8892a8] leading-relaxed">{attr.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[13px] text-[#8892a8] flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-[#8b5cf6] opacity-50" />
                Scale: 0-40 | Self-assessed from 3,954 AI conversations and psychometric frameworks.
              </div>
            </div>
          </AccordionSection>

          {/* ── CAPABILITY MAP ── */}
          <AccordionSection id="capabilities" title="◇ Capability Map" isOpen={openSections.has('capabilities')} onToggle={toggleSection}>
            <div className="space-y-5">
              {CAPABILITIES.map(domain => (
                <div key={domain.domain}>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ color: domain.color }}>{domain.icon}</span>
                    <span className="text-sm font-bold" style={{ color: domain.color }}>
                      {domain.domain}
                    </span>
                  </div>
                  <div className="space-y-2 ml-5">
                    {domain.capabilities.map(cap => (
                      <div key={cap.name} className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-[#e8dcc8]">{cap.name}</span>
                            <ProficiencyBadge level={cap.level} />
                          </div>
                          <p className="text-[13px] text-[#8892a8] mt-0.5">{cap.evidence}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionSection>

          {/* ── HOW I WORK ── */}
          <AccordionSection id="manual" title="◇ How I Work" isOpen={openSections.has('manual')} onToggle={toggleSection}>
            <div className="mb-3 text-[13px] text-[#22d3ee] border border-[#22d3ee]/20 bg-[#22d3ee]/5 p-2">
              A quick guide for collaborators, teammates, and anyone thinking about working together.
            </div>
            <div className="space-y-4">
              {MANUAL_SECTIONS.map(section => (
                <div key={section.title} className="rpg-panel p-3">
                  <h3
                    className="text-xs tracking-wider uppercase mb-2 flex items-center gap-2"
                    style={{ fontFamily: 'var(--font-press-start)', color: '#dcc06e' }}
                  >
                    <span className="text-[#8b5cf6]">{section.icon}</span>
                    {section.title}
                  </h3>
                  <ul className="space-y-1.5">
                    {section.content.map((line, i) => (
                      <li key={i} className="text-sm text-[#e8dcc8] leading-relaxed flex items-start gap-2">
                        <span className="text-[#5a6478] shrink-0 mt-0.5">›</span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </AccordionSection>

          {/* ── STRENGTHS ── */}
          <AccordionSection id="conditions" title="⚡ Strengths" isOpen={openSections.has('conditions')} onToggle={toggleSection}>
            <div className="grid grid-cols-1 gap-2">
              {CONDITIONS.map(cond => (
                <div key={cond.name} className="status-card rpg-panel p-3 flex items-start gap-3 border-l-2 border-l-[#22c55e]">
                  <span className="text-lg shrink-0">{cond.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-[#22c55e]">{cond.name}</span>
                    <p className="text-[13px] text-[#e8dcc8] mt-0.5">{cond.description}</p>
                    <p className="text-xs text-[#8892a8] mt-1 italic">{cond.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionSection>


          {/* ── GROWTH PATH ── */}
          <AccordionSection id="growth" title="◈ Where I'm Headed" isOpen={openSections.has('growth')} onToggle={toggleSection}>
            <h3
              className="text-xs text-[#dcc06e] tracking-widest uppercase mb-3"
              style={{ fontFamily: 'var(--font-press-start)' }}
            >
              Class Evolution
            </h3>
            <div className="space-y-0 mb-6">
              {EVOLUTION.map((stage) => (
                <div key={stage.name} className={`evolution-node ${stage.active ? 'active' : ''} pb-4`}>
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 shrink-0 flex items-center justify-center border-2 text-[11px] ${
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
                        <span className={`text-sm font-bold ${stage.active ? 'text-[#8b5cf6]' : stage.future ? 'text-[#8892a8]' : 'text-[#22c55e]'}`}>
                          {stage.name}
                        </span>
                        <span className="text-xs text-[#8892a8]">{stage.period}</span>
                        {stage.active && (
                          <span className="text-[11px] px-1.5 py-0.5 bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#8892a8] mt-1">{stage.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {stage.traits.map((trait, ti) => (
                          <span
                            key={ti}
                            className={`text-[11px] px-1.5 py-0.5 border ${
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
              className="text-xs text-[#dcc06e] tracking-widest uppercase mb-3"
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
                  <span className="text-[13px] font-bold block" style={{ color: item.color }}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Evolution Requirements */}
            <h3
              className="text-xs text-[#dcc06e] tracking-widest uppercase mb-3"
              style={{ fontFamily: 'var(--font-press-start)' }}
            >
              Evolution Requirements
            </h3>
            <div className="space-y-2">
              {EVOLUTION_REQUIREMENTS.map((req, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={`w-5 h-5 shrink-0 flex items-center justify-center border text-[11px] ${
                    req.done ? 'border-[#22c55e] bg-[#22c55e]/20 text-[#22c55e]' : 'border-[#2a3050] text-[#8892a8]'
                  }`}>
                    {req.done ? '✓' : '○'}
                  </span>
                  <span className={`text-sm ${req.done ? 'text-[#22c55e] line-through' : 'text-[#e8dcc8]'}`}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-[13px] text-[#8892a8] border-t border-[#2a3050] pt-3">
              <span className="text-[#22c55e]">▶</span> Progress: 2/5 requirements met. Next evolution loading...
            </div>
          </AccordionSection>

        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="rpg-panel p-4 text-center space-y-1 gsap-panel">
          <p className="text-[13px] text-[#8892a8]">
            Profile powered by AI-assisted self-analysis across thousands of conversations and psychometric frameworks.
          </p>
        </div>

        <div className="text-center py-4">
          <p
            className="text-[11px] text-[#8892a8] tracking-widest"
            style={{ fontFamily: 'var(--font-press-start)' }}
          >
            JKURN v0.9 — CHARACTER PROFILE SYSTEM
          </p>
        </div>
      </div>
    </main>
  );
}
