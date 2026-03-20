'use client';

import AccordionSection from '@/components/AccordionSection';
import { useState, useCallback } from 'react';

const SECTIONS = [
  {
    id: 'hm-think',
    title: '🧠 How I Think & Work',
    content: [
      'ENTP pattern-recognizer. I hold multiple mental models simultaneously and map the landscape of possible answers rather than hunting for THE answer.',
      'Processing style is verbal/audio-first — voice memos on walks. I build the architecture first, then execute. Give me a doc to respond to and you\'ll get my best thinking.',
      'Peak state: first 90 minutes of morning for deep output, then 45-90 min focused sprints. Small teams beat large groups. One-on-one depth beats broad networking.',
      'I naturally connect ideas across domains — sometimes useful, sometimes three tangents deep. I\'ll probably build a framework to understand a problem before solving it.',
    ],
  },
  {
    id: 'hm-communicate',
    title: '💬 How to Communicate With Me',
    content: [
      'Be direct and intellectually honest. No corporate speak. Say what you mean.',
      'Bring your own thinking — disagree with me. I want the friction of different perspectives.',
      'I will ask "why" a lot. It\'s not a challenge — it\'s how I actually understand.',
      'I\'m better in writing than spontaneous conversation. Async is where I do my clearest thinking.',
      'Questions worth thinking through on a walk > demands for immediate answers.',
    ],
  },
  {
    id: 'hm-values',
    title: '💎 What I Value',
    content: [
      'Significance with belonging — being deeply known by people who matter, for something real.',
      'Integrity alignment — actions matching stated values. That gap bothers me.',
      'Intellectual honesty over polished answers. "I don\'t know, but here\'s how I\'d think about it" beats expertise theater.',
      'Self-mastery and clarity of reality over comfortable stories.',
    ],
  },
  {
    id: 'hm-drains',
    title: '🔋 What Drains Me',
    content: [
      'Shallow small talk and forced networking',
      'Admin work, budgeting, paperwork — energy vampires',
      'Obligatory meetings without clear purpose',
      'Executing without understanding why',
      'Low-autonomy environments — I thrive when trusted to figure out the "how"',
    ],
  },
  {
    id: 'hm-lead',
    title: '👑 How I Lead & My Strengths',
    content: [
      'Scaled engineering from 12 → 60 at Bukalapak. Built Build Club communities (1,000+ members each in AU & ID).',
      'I lead by seeing what others miss — the constraint, the real problem beneath the stated problem — and translating that into actionable frameworks.',
      'Pattern recognition across domains, systems architecture, teaching complex ideas clearly.',
      'Technical credibility + business fluency: CS degree + MBA 4.0 GPA. I speak both languages.',
    ],
  },
  {
    id: 'hm-growth',
    title: '🌱 Growth Edges & How to Help Me',
    content: [
      'Perfectionism activates at the finish line — the last 10% takes as long as the first 90%. Hold me to "done beats perfect."',
      'Island Hopper tendency: I generate novelty and see adjacent possibilities. When I start second-guessing, tell me to keep going.',
      'I sometimes build systems as a substitute for doing the thing. "You\'ve mapped it, now execute it" is exactly what I need.',
      'Give me a deadline with stakes. "By Friday" is more useful than "when you get to it."',
    ],
  },
  {
    id: 'hm-context',
    title: '🌏 Personal Context',
    content: [
      'Age 32, based in Sydney. Has lived and worked across Jakarta, Dubai, Canada, and Singapore.',
      'Career thread: Dolby Labs → Cambrian Group → Bukalapak (70M users, $5B) → Prodago (Gartner Cool Vendor) → Bridge AI Knowledge (CEO). The through-line: AI quality, evaluation, and trust.',
      'Active interests: AI agents & governance, PKM / Second Brain systems, SaaS product development, personal branding.',
      'Languages: English (primary), Indonesian (cultural and business fluency).',
    ],
  },
];

const CLOSING = 'I don\'t want shallow success. I want to be deeply known by people who matter, for something real. If you\'re going to work with me, bring honesty. Tell me what you actually think. Know that when I push back or suggest a different approach, it\'s because I care enough about what we\'re building to think hard about it. That\'s the deal.';

export default function HumanManualView() {
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(['hm-think']));

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
      {/* What is a Personal User Manual */}
      <div className="rpg-panel p-5">
        <h2
          className="text-[0.55rem] sm:text-xs tracking-widest uppercase mb-3"
          style={{ fontFamily: 'var(--font-press-start)', color: '#dcc06e' }}
        >
          Why a Personal User Manual?
        </h2>
        <p className="text-sm text-[#e8dcc8] leading-relaxed mb-3">
          Dynamic products have manuals so people can get the most out of them. Humans are far more dynamic than any product — and yet we rarely come with instructions.
        </p>
        <p className="text-sm text-[#e8dcc8] leading-relaxed">
          A personal user manual is a way to be proactive about letting others know how you work best. It helps collaborators, teammates, and new connections skip the guesswork. Think of it as a shortcut to understanding — not a limitation, but an invitation.
        </p>
      </div>

      {/* About Me */}
      <div className="rpg-panel p-4 border-l-2 border-l-[#8b5cf6]">
        <p className="text-sm text-[#e8dcc8] leading-relaxed">
          I&apos;m an ENTP AI strategist and builder — pattern-recognizer, framework-mixer, someone who thinks best out loud. I move between strategic thinking and hands-on building. What drives me isn&apos;t success for its own sake. It&apos;s significance with belonging: being deeply known by people who matter, for something real.
        </p>
      </div>

      {SECTIONS.map(section => (
        <AccordionSection
          key={section.id}
          id={section.id}
          title={section.title}
          isOpen={openSections.has(section.id)}
          onToggle={toggleSection}
        >
          <ul className="space-y-2">
            {section.content.map((line, i) => (
              <li key={i} className="text-sm text-[#e8dcc8] leading-relaxed flex items-start gap-2">
                <span className="text-[#5a6478] shrink-0 mt-0.5">›</span>
                <span style={{ overflowWrap: 'break-word', wordBreak: 'normal' }}>{line}</span>
              </li>
            ))}
          </ul>
        </AccordionSection>
      ))}

      {/* Closing */}
      <div className="rpg-panel rpg-panel-gold p-4">
        <h3
          className="text-[0.55rem] sm:text-xs tracking-wider uppercase mb-3"
          style={{ fontFamily: 'var(--font-press-start)', color: '#dcc06e' }}
        >
          The Thing I Most Want You to Know
        </h3>
        <p className="text-sm text-[#e8dcc8] leading-relaxed">{CLOSING}</p>
      </div>
    </div>
  );
}
