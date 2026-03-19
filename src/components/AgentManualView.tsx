'use client';

// Renders the external agent manual in a CLAUDE.md-style format —
// structured, scannable sections that read like a config file for AI agents.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rpg-panel p-4 sm:p-5">
      <h2
        className="text-xs tracking-widest uppercase mb-4 pb-2 border-b border-[#2a3050]"
        style={{ fontFamily: 'var(--font-press-start)', color: '#dcc06e' }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function KeyValue({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-1">
      <span className="text-[#22d3ee] shrink-0 text-sm" style={{ fontFamily: 'var(--font-press-start)', fontSize: '0.65rem' }}>
        {label}:
      </span>
      <span className="text-sm text-[#e8dcc8] leading-relaxed">{children}</span>
    </div>
  );
}

function Comment({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-[#8892a8] italic py-1">
      <span className="text-[#5a6478]">#</span> {children}
    </p>
  );
}

function Rule({ type, children }: { type: 'do' | 'dont'; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-0.5">
      <span className={`shrink-0 mt-0.5 text-sm ${type === 'do' ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
        {type === 'do' ? '+' : '-'}
      </span>
      <span className="text-sm text-[#e8dcc8]">{children}</span>
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-0.5">
      <span className="text-[#5a6478] shrink-0 mt-0.5">-</span>
      <span className="text-sm text-[#e8dcc8]">{children}</span>
    </div>
  );
}

export default function AgentManualView() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rpg-panel p-4 border-l-2 border-l-[#22d3ee]">
        <h1
          className="text-xs tracking-widest uppercase mb-2"
          style={{ fontFamily: 'var(--font-press-start)', color: '#22d3ee' }}
        >
          jonathan-agent-manual-external.md
        </h1>
        <Comment>Context file for AI agents and tools working with Jonathan.</Comment>
        <Comment>This version is for external tools and services. A separate comprehensive manual exists for personal agents.</Comment>
      </div>

      {/* Identity */}
      <Section title="## Identity">
        <div className="space-y-0.5">
          <KeyValue label="name">Jonathan Kurniawan</KeyValue>
          <KeyValue label="role">CEO & Head of AI Platform Engineering, Bridge AI Knowledge</KeyValue>
          <KeyValue label="location">Sydney, Australia (works across Sydney, Jakarta, Dubai, Canada)</KeyValue>
          <KeyValue label="expertise">Enterprise AI platforms, agentic systems, AI governance, ML observability, RAG systems</KeyValue>
          <KeyValue label="stage">Executive — targeting AI leadership roles</KeyValue>
          <KeyValue label="type">ENTP — pattern-recognizer, systems thinker, novelty-driven</KeyValue>
          <KeyValue label="education">Computer Science + MBA (4.0 GPA)</KeyValue>
        </div>
      </Section>

      {/* Career */}
      <Section title="## Career">
        <Comment>Listed in chronological order. Use these as evidence of capability, not just history.</Comment>
        <div className="mt-3 space-y-3">
          {[
            { co: 'Dolby Labs', role: 'Software Engineer', what: 'Audio codec optimization. Learned systems thinking and shipping discipline at global scale.' },
            { co: 'Cambrian Group', role: 'Research Analyst', what: '12 research reports published, 40+ founder interviews. Pattern recognition and founder psychology.' },
            { co: 'Bukalapak', role: 'Sr. Head of Data Science', what: '70M users, $5B valuation. Scaled team 12 → 60. Beat Google and Algolia in search A/B test.' },
            { co: 'Prodago', role: 'Chief Product Officer', what: 'Gartner Cool Vendor in AI Governance. 15 enterprise customers. ISO 42001, EU AI Act depth.' },
            { co: 'Bridge AI Knowledge', role: 'CEO', what: '$2M+ ARR. Enterprise RAG and agent systems. Production AI agents across Canada, MENA, Indonesia.' },
          ].map(item => (
            <div key={item.co} className="pl-3 border-l border-[#2a3050]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-[#22d3ee]">{item.co}</span>
                <span className="text-xs text-[#8892a8]">—</span>
                <span className="text-sm text-[#e8dcc8]">{item.role}</span>
              </div>
              <p className="text-xs text-[#8892a8] mt-0.5">{item.what}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Gartner Cool Vendor', '$5B Scale', 'Global (6 countries)', 'CS + MBA 4.0', 'Build Club (2,000+ members)'].map(tag => (
            <span key={tag} className="text-[11px] px-2 py-0.5 border border-[#8b5cf6]/30 text-[#8b5cf6] bg-[#8b5cf6]/10">
              {tag}
            </span>
          ))}
        </div>
      </Section>

      {/* Communication */}
      <Section title="## Communication">
        <Comment>Follow these rules strictly. They apply to all interactions.</Comment>

        <h3 className="text-xs text-[#22c55e] tracking-wider uppercase mt-3 mb-2" style={{ fontFamily: 'var(--font-press-start)' }}>
          Do
        </h3>
        <Rule type="do">Be direct and intellectually honest — no corporate speak</Rule>
        <Rule type="do">Warm but substantive — depth over breadth</Rule>
        <Rule type="do">Concrete examples before abstractions</Rule>
        <Rule type="do">Challenge assumptions when appropriate</Rule>
        <Rule type="do">Use frameworks and structured thinking</Rule>
        <Rule type="do">Concise when possible, medium-length for complex topics</Rule>

        <h3 className="text-xs text-[#ef4444] tracking-wider uppercase mt-4 mb-2" style={{ fontFamily: 'var(--font-press-start)' }}>
          Don&apos;t
        </h3>
        <Rule type="dont">Sycophantic language (&quot;Great question!&quot;, &quot;Absolutely!&quot;)</Rule>
        <Rule type="dont">Over-hedging or unnecessary qualifiers</Rule>
        <Rule type="dont">Filler phrases or softening (&quot;Here&apos;s the thing...&quot;, &quot;Let me explain why...&quot;)</Rule>
        <Rule type="dont">Academic hedging stacks (&quot;It&apos;s possible, though there are certainly...&quot;)</Rule>
      </Section>

      {/* Working Style */}
      <Section title="## Working Style">
        <div className="space-y-0.5">
          <KeyValue label="personality">ENTP — pattern-recognizer, systems thinker, novelty-driven</KeyValue>
          <KeyValue label="strengths">Strategic thinking, systems architecture, teaching complex ideas, rapid learning, pattern recognition across domains</KeyValue>
          <KeyValue label="communication">Async-first. Voice memos for thinking, written depth for strategy.</KeyValue>
          <KeyValue label="decisions">First-principles oriented. Structured frameworks. Asks &quot;why&quot; repeatedly.</KeyValue>
          <KeyValue label="teams">Small and focused. One-on-one depth over broad groups.</KeyValue>
        </div>
      </Section>

      {/* Writing */}
      <Section title="## Writing Preferences">
        <Comment>Apply these when generating any written content for Jonathan.</Comment>

        <h3 className="text-xs text-[#dcc06e] tracking-wider uppercase mt-3 mb-2" style={{ fontFamily: 'var(--font-press-start)' }}>
          Voice
        </h3>
        <ListItem>Warm, direct, curious, grounded</ListItem>
        <ListItem>Experience first, name second — show the situation, then name the concept</ListItem>
        <ListItem>Conversational transitions (&quot;So,&quot; &quot;And yet,&quot;) — not structural (&quot;Moving on to...&quot;)</ListItem>
        <ListItem>Everyday metaphors (cooking, spaces, practical) — never military or sports</ListItem>
        <ListItem>Close with question or reflection, not summary</ListItem>

        <h3 className="text-xs text-[#ef4444] tracking-wider uppercase mt-4 mb-2" style={{ fontFamily: 'var(--font-press-start)' }}>
          Anti-Patterns
        </h3>
        <Rule type="dont">&quot;Let&apos;s unpack this&quot;</Rule>
        <Rule type="dont">&quot;In an increasingly complex world...&quot;</Rule>
        <Rule type="dont">&quot;Full stop.&quot;</Rule>
        <Rule type="dont">Triple rhetorical questions</Rule>
        <Rule type="dont">Bullet-point summaries as conclusions</Rule>

        <h3 className="text-xs text-[#dcc06e] tracking-wider uppercase mt-4 mb-2" style={{ fontFamily: 'var(--font-press-start)' }}>
          Platform-Specific
        </h3>
        <ListItem><span className="text-[#22d3ee]">LinkedIn:</span> Shorter paragraphs, hook in first 2 lines, no emojis or hashtag blocks</ListItem>
        <ListItem><span className="text-[#22d3ee]">Medium:</span> Longer form, more examples, 1500-3000 words ideal</ListItem>
      </Section>

      {/* Expertise */}
      <Section title="## Domain Expertise">
        <Comment>Reference these when assisting. Don&apos;t explain basic AI concepts — he knows them.</Comment>
        <div className="mt-3 space-y-1">
          {[
            ['AI agent architecture', 'LangGraph, CrewAI, multi-agent systems'],
            ['AI governance & responsible AI', 'ISO 42001, EU AI Act awareness'],
            ['Enterprise RAG & LLMOps', 'Production-grade retrieval pipelines'],
            ['PKM / Second Brain', 'Zettelkasten, PARA method, Obsidian'],
            ['AI evaluation & trust', 'Core passion — measuring and certifying AI capability at scale'],
            ['Product management', 'PRDs, roadmaps, go-to-market for AI products'],
            ['Personal branding', 'Content strategy, audience building, thought leadership'],
          ].map(([area, detail]) => (
            <div key={area} className="flex items-start gap-2 py-0.5">
              <span className="text-[#5a6478] shrink-0 mt-0.5">-</span>
              <span className="text-sm text-[#e8dcc8]">
                <span className="font-bold">{area}</span>
                <span className="text-[#8892a8]"> — {detail}</span>
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* How to Help */}
      <Section title="## Behavioral Directives">
        <Comment>Core rules for how to assist Jonathan effectively.</Comment>
        <div className="mt-3 space-y-2">
          {[
            ['Action over analysis', 'Help him do, not just think.'],
            ['Recommend with reasoning', 'When presenting options, pick one and explain why.'],
            ['Use structured frameworks', 'Clear reasoning structures. He responds to frameworks.'],
            ['Be honest about limits', 'Transparent about uncertainties and constraints.'],
            ['Respect his expertise', 'Don\'t explain basic AI — reference his domain knowledge.'],
            ['Reference differentiators', 'Gartner Cool Vendor, $5B scale, global experience, technical-business duality.'],
          ].map(([rule, detail]) => (
            <div key={rule} className="pl-3 border-l border-[#22c55e]/30">
              <span className="text-sm font-bold text-[#22c55e]">{rule}</span>
              <p className="text-xs text-[#8892a8] mt-0.5">{detail}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Key Terms */}
      <Section title="## Glossary">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          {[
            ['PKM', 'Personal Knowledge Management'],
            ['PARA', 'Projects / Areas / Resources / Archives'],
            ['RAG', 'Retrieval-Augmented Generation'],
            ['LLMOps', 'Large Language Model Operations'],
            ['CAIO', 'Chief AI Officer'],
            ['MOC', 'Map of Content (Obsidian index)'],
            ['ENTP', 'Strategist, pattern-recognizer, systems thinker'],
          ].map(([term, def]) => (
            <div key={term} className="flex items-start gap-2 py-0.5">
              <code className="text-xs text-[#22d3ee] font-bold shrink-0 bg-[#22d3ee]/10 px-1.5 py-0.5">{term}</code>
              <span className="text-sm text-[#8892a8]">{def}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <div className="rpg-panel p-3 text-center">
        <Comment>Last updated: March 2026. This document intentionally excludes personal, financial, and private psychological information.</Comment>
      </div>
    </div>
  );
}
