'use client';

import AccordionSection from '@/components/AccordionSection';
import { useState, useCallback } from 'react';

const AGENT_INTRO = 'This document provides context for AI agents and tools working with Jonathan. It contains professional and preference information to enable better assistance.';

const PROFESSIONAL_IDENTITY = {
  name: 'Jonathan Kurniawan',
  role: 'CEO & Head of AI Platform Engineering, Bridge AI Knowledge',
  location: 'Sydney, Australia (works across Sydney, Jakarta, Dubai)',
  expertise: 'Enterprise AI platforms, agentic systems, AI governance, ML observability, RAG systems',
  stage: 'Executive (targeting AI leadership roles)',
};

const CAREER_HIGHLIGHTS = [
  { company: 'Dolby Labs', role: 'Software Engineer', detail: 'Audio codec optimization, systems thinking at global scale' },
  { company: 'Cambrian Group', role: 'Research Analyst', detail: '12 research reports, 40+ founder interviews' },
  { company: 'Bukalapak', role: 'Senior Head of Data Science', detail: '70M users, $5B valuation, scaled team 12 to 60' },
  { company: 'Prodago', role: 'Chief Product Officer', detail: 'Gartner Cool Vendor in AI Governance, 15 enterprise clients' },
  { company: 'Bridge AI Knowledge', role: 'CEO', detail: '$2M+ ARR, enterprise RAG and agent systems' },
];

const COMM_PREFS = {
  do: [
    'Direct, intellectually honest, no corporate speak',
    'Warm but substantive — depth over breadth',
    'Concrete examples before abstractions',
    'Concise when possible, medium-length for complex topics',
    'Challenge assumptions when appropriate',
    'Frameworks and structured thinking',
  ],
  dont: [
    'Sycophantic language ("Great question!", "Absolutely!")',
    'Over-hedging or unnecessary qualifiers',
    'Filler phrases or unnecessary softening',
    'Throat-clearing ("Here\'s the thing...", "Let me explain why...")',
  ],
};

const WORKING_STYLE = [
  { label: 'Personality', value: 'ENTP — pattern-recognizer, systems thinker, novelty-driven' },
  { label: 'Strengths', value: 'Strategic thinking, systems architecture, teaching complex ideas, rapid learning, pattern recognition' },
  { label: 'Communication', value: 'Async-first, voice memos for thinking, written depth for strategy' },
  { label: 'Decision-Making', value: 'First-principles oriented. Uses structured frameworks. Asks "why" repeatedly.' },
  { label: 'Team Preference', value: 'Small, focused teams. One-on-one depth conversations.' },
];

const WRITING_PREFS = {
  voice: [
    'Warm, direct, curious, grounded',
    'Experience first, name second — show the situation, then name the concept',
    'Conversational transitions ("So," "And yet,") — not structural ("Moving on to...")',
    'Everyday metaphors (cooking, spaces, practical) — never military or sports',
    'Closes with question or reflection, not summary',
  ],
  antiPatterns: [
    '"Let\'s unpack this"',
    '"In an increasingly complex world..."',
    '"Full stop."',
    'Triple rhetorical questions',
    'Bullet-point summaries as conclusions',
    'Academic hedging stacks',
  ],
  platforms: [
    'LinkedIn: Shorter paragraphs, hook in first 2 lines, no emojis or hashtag blocks',
    'Medium: Longer form, more examples, 1500-3000 words ideal',
  ],
};

const EXPERTISE_AREAS = [
  { area: 'AI agent architecture and orchestration', detail: 'LangGraph, CrewAI, multi-agent systems' },
  { area: 'AI governance and responsible AI', detail: 'ISO 42001, EU AI Act awareness' },
  { area: 'Enterprise RAG systems and LLMOps', detail: 'Production-grade retrieval pipelines' },
  { area: 'Personal knowledge management', detail: 'PKM, Zettelkasten, PARA method, Obsidian' },
  { area: 'AI evaluation and trust infrastructure', detail: 'Core passion — "The One Piece"' },
  { area: 'Product management for AI products', detail: 'PRDs, roadmaps, go-to-market' },
  { area: 'Personal branding and thought leadership', detail: 'Content strategy, audience building' },
];

const HOW_TO_HELP = [
  { rule: 'Action over analysis', detail: 'Help him do, not just think.' },
  { rule: 'Recommendations with reasoning', detail: 'When presenting options, recommend one and explain why.' },
  { rule: 'Structured frameworks', detail: 'Use clear frameworks and reasoning structures.' },
  { rule: 'Honesty about limits', detail: 'Be transparent about uncertainties and constraints.' },
  { rule: 'Respect expertise', detail: 'Reference his domain knowledge — don\'t explain basic AI concepts.' },
  { rule: 'Career focus', detail: 'Emphasize AI leadership roles and unique differentiators (Gartner, scale, global experience).' },
];

const KEY_TERMS = [
  { term: 'PKM', def: 'Personal Knowledge Management' },
  { term: 'PARA', def: 'Projects / Areas / Resources / Archives (note organization)' },
  { term: 'RAG', def: 'Retrieval-Augmented Generation' },
  { term: 'LLMOps', def: 'Large Language Model Operations' },
  { term: 'CAIO', def: 'Chief AI Officer' },
  { term: 'MOC', def: 'Map of Content (Obsidian index notes)' },
  { term: 'ENTP', def: 'Myers-Briggs: Strategist, pattern-recognizer, systems thinker' },
];

export default function AgentManualView() {
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(['am-identity', 'am-comm']));

  const toggleSection = useCallback((id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="space-y-4">
      {/* Intro */}
      <div className="rpg-panel p-4 border-l-2 border-l-[#22d3ee]">
        <p className="text-sm text-[#e8dcc8] leading-relaxed">{AGENT_INTRO}</p>
        <p className="text-xs text-[#8892a8] mt-2 italic">
          This version is designed for external tools, services, and AI assistants. A separate comprehensive manual exists for personal agents only.
        </p>
      </div>

      {/* Professional Identity */}
      <AccordionSection id="am-identity" title="⚡ Professional Identity" isOpen={openSections.has('am-identity')} onToggle={toggleSection}>
        <div className="space-y-2">
          {Object.entries(PROFESSIONAL_IDENTITY).map(([key, value]) => (
            <div key={key} className="flex items-start gap-3">
              <span className="text-xs text-[#8b5cf6] uppercase tracking-wider w-20 shrink-0 pt-0.5" style={{ fontFamily: 'var(--font-press-start)' }}>
                {key === 'stage' ? 'Stage' : key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              <span className="text-sm text-[#e8dcc8]">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-[#2a3050]">
          <h3 className="text-xs tracking-wider uppercase mb-3" style={{ fontFamily: 'var(--font-press-start)', color: '#dcc06e' }}>
            Career Timeline
          </h3>
          <div className="space-y-2">
            {CAREER_HIGHLIGHTS.map(item => (
              <div key={item.company} className="rpg-panel p-2 flex items-start gap-3">
                <span className="text-sm font-bold text-[#22d3ee] shrink-0 w-28">{item.company}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-[#e8dcc8]">{item.role}</span>
                  <p className="text-xs text-[#8892a8] mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Gartner Cool Vendor', '$5B Scale', 'Global (6 countries)', 'CS + MBA 4.0', 'Build Club (2,000+ members)'].map(tag => (
              <span key={tag} className="text-[11px] px-2 py-0.5 border border-[#8b5cf6]/30 text-[#8b5cf6] bg-[#8b5cf6]/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </AccordionSection>

      {/* Communication Preferences */}
      <AccordionSection id="am-comm" title="◇ Communication Preferences" isOpen={openSections.has('am-comm')} onToggle={toggleSection}>
        <div className="space-y-4">
          <div className="rpg-panel p-3 border-l-2 border-l-[#22c55e]">
            <h3 className="text-xs tracking-wider uppercase mb-2" style={{ fontFamily: 'var(--font-press-start)', color: '#22c55e' }}>
              Do
            </h3>
            <ul className="space-y-1.5">
              {COMM_PREFS.do.map((item, i) => (
                <li key={i} className="text-sm text-[#e8dcc8] leading-relaxed flex items-start gap-2">
                  <span className="text-[#22c55e] shrink-0 mt-0.5">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rpg-panel p-3 border-l-2 border-l-[#ef4444]">
            <h3 className="text-xs tracking-wider uppercase mb-2" style={{ fontFamily: 'var(--font-press-start)', color: '#ef4444' }}>
              Don&apos;t
            </h3>
            <ul className="space-y-1.5">
              {COMM_PREFS.dont.map((item, i) => (
                <li key={i} className="text-sm text-[#e8dcc8] leading-relaxed flex items-start gap-2">
                  <span className="text-[#ef4444] shrink-0 mt-0.5">-</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AccordionSection>

      {/* Working Style */}
      <AccordionSection id="am-style" title="◆ Working Style" isOpen={openSections.has('am-style')} onToggle={toggleSection}>
        <div className="space-y-2">
          {WORKING_STYLE.map(item => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="text-xs text-[#f59e0b] uppercase tracking-wider w-28 shrink-0 pt-0.5" style={{ fontFamily: 'var(--font-press-start)' }}>
                {item.label}
              </span>
              <span className="text-sm text-[#e8dcc8]">{item.value}</span>
            </div>
          ))}
        </div>
      </AccordionSection>

      {/* Content & Writing Preferences */}
      <AccordionSection id="am-writing" title="◇ Content & Writing Preferences" isOpen={openSections.has('am-writing')} onToggle={toggleSection}>
        <div className="space-y-4">
          <div className="rpg-panel p-3">
            <h3 className="text-xs tracking-wider uppercase mb-2" style={{ fontFamily: 'var(--font-press-start)', color: '#dcc06e' }}>
              Voice & Structure
            </h3>
            <ul className="space-y-1.5">
              {WRITING_PREFS.voice.map((item, i) => (
                <li key={i} className="text-sm text-[#e8dcc8] leading-relaxed flex items-start gap-2">
                  <span className="text-[#5a6478] shrink-0 mt-0.5">›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rpg-panel p-3 border-l-2 border-l-[#ef4444]">
            <h3 className="text-xs tracking-wider uppercase mb-2" style={{ fontFamily: 'var(--font-press-start)', color: '#ef4444' }}>
              Anti-Patterns to Avoid
            </h3>
            <ul className="space-y-1.5">
              {WRITING_PREFS.antiPatterns.map((item, i) => (
                <li key={i} className="text-sm text-[#e8dcc8] leading-relaxed flex items-start gap-2">
                  <span className="text-[#ef4444] shrink-0 mt-0.5">-</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rpg-panel p-3">
            <h3 className="text-xs tracking-wider uppercase mb-2" style={{ fontFamily: 'var(--font-press-start)', color: '#dcc06e' }}>
              Platform-Specific
            </h3>
            <ul className="space-y-1.5">
              {WRITING_PREFS.platforms.map((item, i) => (
                <li key={i} className="text-sm text-[#e8dcc8] leading-relaxed flex items-start gap-2">
                  <span className="text-[#5a6478] shrink-0 mt-0.5">›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AccordionSection>

      {/* Areas of Expertise */}
      <AccordionSection id="am-expertise" title="★ Areas of Expertise" isOpen={openSections.has('am-expertise')} onToggle={toggleSection}>
        <div className="space-y-2">
          {EXPERTISE_AREAS.map(item => (
            <div key={item.area} className="rpg-panel p-2 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-sm text-[#e8dcc8] font-bold">{item.area}</span>
                <p className="text-xs text-[#8892a8] mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </AccordionSection>

      {/* How to Be Most Helpful */}
      <AccordionSection id="am-help" title="▶ How to Be Most Helpful" isOpen={openSections.has('am-help')} onToggle={toggleSection}>
        <div className="space-y-2">
          {HOW_TO_HELP.map(item => (
            <div key={item.rule} className="flex items-start gap-3">
              <span className="text-sm font-bold text-[#22c55e] shrink-0 w-40">{item.rule}</span>
              <span className="text-sm text-[#e8dcc8]">{item.detail}</span>
            </div>
          ))}
        </div>
      </AccordionSection>

      {/* Key Terms */}
      <AccordionSection id="am-terms" title="◇ Key Terms" isOpen={openSections.has('am-terms')} onToggle={toggleSection}>
        <div className="space-y-1">
          {KEY_TERMS.map(item => (
            <div key={item.term} className="flex items-start gap-3 py-1">
              <span className="text-xs text-[#22d3ee] font-bold w-16 shrink-0" style={{ fontFamily: 'var(--font-press-start)' }}>
                {item.term}
              </span>
              <span className="text-sm text-[#e8dcc8]">{item.def}</span>
            </div>
          ))}
        </div>
      </AccordionSection>
    </div>
  );
}
