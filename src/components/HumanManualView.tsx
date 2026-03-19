'use client';

import AccordionSection from '@/components/AccordionSection';
import { useState, useCallback } from 'react';

const MANUAL_INTRO = 'I\'m an ENTP AI strategist and builder — pattern-recognizer, framework-mixer, someone who thinks best out loud. I move between strategic thinking and hands-on building. What actually drives me isn\'t success for its own sake. It\'s significance with belonging: being deeply known by people who matter, for something real.';

const SECTIONS = [
  {
    id: 'hm-think',
    title: '◈ How I Think',
    content: [
      'ENTP in practice: I go with the flow, hunt for novelty, and hold multiple mental models simultaneously. I\'m not looking for THE answer — I\'m mapping the landscape of possible answers and seeing which fits.',
      'Deep analytical mode: I see patterns others miss because I\'m comfortable holding contradictions. I\'ll notice the thread connecting something you said last month to a completely different domain, and suddenly the connection makes the whole system clearer.',
      'Processing style is verbal/audio-first. My thinking tool is a voice memo on a walk. I need to hear myself say it out loud before I understand what I actually think. If I\'m quiet, I\'m usually either still processing, or deeply interested and listening.',
      'Mental model builder before action-taker. I build the architecture first, then execute. This is a strength (fewer mistakes, better foundations) and a shadow: sometimes the map becomes more satisfying than the territory.',
      'Comfortable with complexity. I don\'t need to simplify everything into binary choices. I can sit with contradictions — that\'s where the interesting thinking lives.',
    ],
  },
  {
    id: 'hm-work',
    title: '⚡ How I Work Best',
    intro: 'Peak state: Effortless, flowing intellectual conversation with someone who gets context without lengthy explanation. Someone who brings their own thinking, not just questions.',
    subsections: [
      {
        label: 'Energy Modes',
        items: [
          'DISCOVER (walking, voice memos, exploratory) — unstructured time to notice patterns, ask questions, make connections.',
          'CREATE (first 90 minutes of morning, deep output) — best thinking and writing. Unbroken time. No notifications.',
          'EXECUTE (mid-morning onward, defined tasks) — 45-90 minute focused sprints on concrete problems with clear success criteria.',
        ],
      },
      {
        label: 'I Excel At',
        items: [
          'Strategic thinking and systems architecture',
          'Pattern recognition across domains',
          'Teaching complex ideas clearly',
          'Holding multiple contexts and seeing connections others miss',
          'Rapid learning and building credibility in new domains',
        ],
      },
      {
        label: 'Team Structure',
        items: [
          'Small, focused teams beat large groups every time.',
          'One-on-one depth beats broad networking.',
          'I\'d rather have three people who get what I\'m building than thirty who are along for the ride.',
        ],
      },
    ],
  },
  {
    id: 'hm-communicate',
    title: '◇ How to Communicate With Me',
    content: [
      'Be direct and intellectually honest. No corporate speak. No "let\'s circle back" or "low-hanging fruit." Say what you mean.',
      'Bring your own thinking. I respond well to people who aren\'t just asking questions but genuinely thinking alongside me. Disagree with me — I want the friction of different perspectives.',
      'Trust that I track patterns. Don\'t over-explain context I already have. I usually know more about what you\'re working on than you think.',
      'Questions worth thinking through on a walk > demands for immediate answers. If you need a snap judgment, just say so and I\'ll give you one.',
      'I will ask "why" a lot. It\'s not a challenge or a sign I don\'t believe you. It\'s how I actually understand.',
    ],
  },
  {
    id: 'hm-values',
    title: '★ What I Value',
    content: [
      'Significance with belonging: Being deeply known by people who matter, for something real. Not shallow success or broad recognition.',
      'Integrity alignment: Actions matching stated values. If you say something matters and then don\'t act like it, that gap bothers me.',
      'Intellectual honesty over polished answers. "I don\'t know, but here\'s how I\'d think about it" beats "here\'s the expert answer" every time.',
      'High-quality relationships over broad networks. I\'d rather have five people who truly understand what I\'m building than five hundred LinkedIn connections.',
      'Self-mastery and clarity of reality. I want to actually understand how things work — not have a pretty story about them.',
    ],
  },
  {
    id: 'hm-drains',
    title: '▼ What Drains Me',
    content: [
      'Shallow small talk and forced networking',
      'Administrative work, budgeting, paperwork — these are energy vampires',
      'Being asked to perform expertise rather than share genuine curiosity',
      'Obligatory meetings without clear purpose',
      'Surface-level conversations when there\'s a deeper pattern to explore',
    ],
  },
  {
    id: 'hm-lead',
    title: '◆ How I Lead',
    content: [
      'I\'ve led teams up to 60 people (scaled engineering at Bukalapak from 12 to 60). Leadership style: build trust through fast, accurate thinking and direct communication.',
      'I lead by seeing what others miss — the pattern, the constraint, the real problem hiding beneath the stated problem — and translating that into actionable frameworks.',
      'Built and led Build Club Australia and Build Club Indonesia (1,000+ members each). I know how to create spaces where people actually think deeply together.',
    ],
  },
  {
    id: 'hm-strengths',
    title: '▶ My Strengths',
    content: [
      'Pattern recognition across domains — connecting dots others don\'t see',
      'Systems thinking and architectural design — seeing how pieces fit together',
      'Teaching complex ideas clearly — I can make difficult things understandable',
      'Technical credibility + business fluency — CS degree + MBA 4.0 GPA. I speak both languages.',
      'Rapid learning and multi-framework fluency — pick up new domains fast and see them from multiple angles',
      'Honest self-awareness — I\'ll tell you what I\'m bad at and why',
    ],
  },
  {
    id: 'hm-growth',
    title: '◈ My Growth Edges',
    content: [
      'Execution at the finish line: I can think circles around problems, but perfectionism activates right when I\'m about to ship. The last 10% takes as long as the first 90%.',
      'Staying committed to one path long enough for a verdict: I\'m an Island Hopper. I generate novelty, explore new frameworks, see adjacent possibilities. Working on trusting my own reasoning and following through.',
      'Admin discipline: I think in frameworks and patterns. Spreadsheets and financial truth sheets don\'t come naturally. But I\'m learning that precision here matters.',
      'Choosing depth over breadth when novelty calls: When something shiny appears, it\'s hard to stay focused. Working on recognizing when "that looks interesting" is wisdom vs. distraction.',
    ],
  },
  {
    id: 'hm-help',
    title: '⚡ How to Help Me',
    content: [
      'Hold me accountable to what I said I\'d do. I generate clarity, then sometimes re-analyze instead of acting. When I say "I\'m going to do X," and I start second-guessing, tell me to keep going.',
      'Call out when I\'m building a system as a substitute for doing the thing. "You\'ve mapped it, now execute it" is sometimes exactly what I need.',
      'Remind me that the last 10% is where the value lives. Done is better than perfect. Shipped beats polished.',
      'Give me a deadline with stakes. Deadlines unlock execution. "By Friday" is more useful than "when you get to it."',
      'Be the person who says "you already know what to do." Sometimes I just need permission to trust my own reasoning.',
    ],
  },
  {
    id: 'hm-context',
    title: '◇ Personal Context',
    subsections: [
      {
        label: 'Background',
        items: [
          'Age 32, based in Sydney. Moves between Jakarta, Dubai, and Sydney depending on the work.',
          'Languages: English (primary), Indonesian (cultural and business fluency).',
        ],
      },
      {
        label: 'Career Through-Line',
        items: [
          'Dolby Labs > Cambrian Group > Bukalapak (70M users, $5B valuation) > Prodago (Gartner Cool Vendor) > Bridge AI Knowledge (CEO)',
          'The thread: AI quality, evaluation, and trust. How do we measure and certify AI capability at scale?',
        ],
      },
      {
        label: 'Active Interests',
        items: [
          'AI agents and governance',
          'Personal knowledge management (PKM / Second Brain)',
          'SaaS product development',
          'Personal branding as a vehicle for thought leadership',
        ],
      },
    ],
  },
];

const CLOSING = 'I don\'t want shallow success. I want to be deeply known by people who matter, for something real. Everything traces back to this. That\'s why I\'m picky about who I work with. That\'s why I\'d rather have a conversation with one person who actually gets what I\'m building than present to a room who won\'t. If you\'re going to work with me, bring that same honesty. Tell me what you actually think. Let me know when I\'m off track. And know that when I ask "why" or push back or suggest a different approach, it\'s because I give enough of a shit about what we\'re building to think hard about it. That\'s the deal.';

export default function HumanManualView() {
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(['hm-think', 'hm-work']));

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
      <div className="rpg-panel p-4 border-l-2 border-l-[#8b5cf6]">
        <p className="text-sm text-[#e8dcc8] leading-relaxed">{MANUAL_INTRO}</p>
      </div>

      {SECTIONS.map(section => (
        <AccordionSection
          key={section.id}
          id={section.id}
          title={section.title}
          isOpen={openSections.has(section.id)}
          onToggle={toggleSection}
        >
          {section.intro && (
            <div className="mb-3 text-[13px] text-[#22d3ee] border border-[#22d3ee]/20 bg-[#22d3ee]/5 p-2">
              {section.intro}
            </div>
          )}

          {section.content && (
            <ul className="space-y-2">
              {section.content.map((line, i) => (
                <li key={i} className="text-sm text-[#e8dcc8] leading-relaxed flex items-start gap-2">
                  <span className="text-[#5a6478] shrink-0 mt-0.5">›</span>
                  {line}
                </li>
              ))}
            </ul>
          )}

          {section.subsections && (
            <div className="space-y-4">
              {section.subsections.map(sub => (
                <div key={sub.label} className="rpg-panel p-3">
                  <h3
                    className="text-xs tracking-wider uppercase mb-2"
                    style={{ fontFamily: 'var(--font-press-start)', color: '#dcc06e' }}
                  >
                    {sub.label}
                  </h3>
                  <ul className="space-y-1.5">
                    {sub.items.map((item, i) => (
                      <li key={i} className="text-sm text-[#e8dcc8] leading-relaxed flex items-start gap-2">
                        <span className="text-[#5a6478] shrink-0 mt-0.5">›</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </AccordionSection>
      ))}

      {/* Closing */}
      <div className="rpg-panel rpg-panel-gold p-4">
        <h3
          className="text-xs tracking-wider uppercase mb-3"
          style={{ fontFamily: 'var(--font-press-start)', color: '#dcc06e' }}
        >
          The Thing I Most Want You to Know
        </h3>
        <p className="text-sm text-[#e8dcc8] leading-relaxed">{CLOSING}</p>
      </div>
    </div>
  );
}
