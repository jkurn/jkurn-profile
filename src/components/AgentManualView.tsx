'use client';

// Renders the external agent manual as a single CLAUDE.md-style document —
// one continuous section with markdown formatting and a preamble.

export default function AgentManualView() {
  return (
    <div className="space-y-4">
      {/* Preamble */}
      <div className="rpg-panel p-4 sm:p-5 border-l-2 border-l-[#22d3ee]">
        <h1
          className="text-[0.5rem] sm:text-xs tracking-widest uppercase mb-2"
          style={{ fontFamily: 'var(--font-press-start)', color: '#22d3ee' }}
        >
          jonathan-agent-manual.md
        </h1>
        <p className="text-xs text-[#8892a8] italic mt-2">
          <span className="text-[#5a6478]">#</span> Context file for AI agents and tools working with Jonathan Kurniawan.
        </p>
        <p className="text-xs text-[#8892a8] italic">
          <span className="text-[#5a6478]">#</span> Place this in your CLAUDE.md, system prompt, or agent config.
        </p>
        <p className="text-xs text-[#8892a8] italic">
          <span className="text-[#5a6478]">#</span> A separate comprehensive manual exists for personal agents.
        </p>
      </div>

      {/* Single unified CLAUDE.md content */}
      <div className="rpg-panel p-4 sm:p-6">
        <pre
          className="text-sm text-[#e8dcc8] leading-relaxed whitespace-pre-wrap font-[family-name:var(--font-geist-mono)]"
          style={{ overflowWrap: 'break-word', wordBreak: 'normal' }}
        >
{`# Jonathan Kurniawan — External Agent Manual

> This document provides context for AI agents and tools working with Jonathan.
> It contains professional and preference information to enable better assistance.

---

## Identity

name: Jonathan Kurniawan
role: CEO & Head of AI Platform Engineering, Bridge AI Knowledge
location: Sydney, Australia (works across Sydney, Jakarta, Dubai, Canada)
expertise: Enterprise AI platforms, agentic systems, AI governance, ML observability, RAG systems
stage: Executive — targeting AI leadership roles
type: ENTP — pattern-recognizer, systems thinker, novelty-driven
education: Computer Science + MBA (4.0 GPA)

---

## Career

# Listed chronologically. Use as evidence of capability.

- **Dolby Labs** — Software Engineer
  Audio codec optimization. Systems thinking and shipping discipline at global scale.

- **Cambrian Group** — Research Analyst
  12 research reports published, 40+ founder interviews. Pattern recognition and founder psychology.

- **Bukalapak** — Sr. Head of Data Science
  70M users, $5B valuation. Scaled team 12 → 60. Beat Google and Algolia in search A/B test.

- **Prodago** — Chief Product Officer
  Gartner Cool Vendor in AI Governance. 15 enterprise customers. ISO 42001, EU AI Act depth.

- **Bridge AI Knowledge** — CEO
  $2M+ ARR. Enterprise RAG and agent systems. Production AI agents across Canada, MENA, Indonesia.

\`Differentiators: Gartner Cool Vendor | $5B Scale | Global (6 countries) | CS + MBA 4.0 | Build Club (2,000+ members)\`

---

## Communication

# Follow these rules strictly.

### Do
+ Be direct and intellectually honest — no corporate speak
+ Warm but substantive — depth over breadth
+ Concrete examples before abstractions
+ Challenge assumptions when appropriate
+ Use frameworks and structured thinking
+ Concise when possible, medium-length for complex topics

### Don't
- Sycophantic language ("Great question!", "Absolutely!")
- Over-hedging or unnecessary qualifiers
- Filler phrases ("Here's the thing...", "Let me explain why...")
- Academic hedging stacks ("It's possible, though there are certainly...")

---

## Working Style

personality: ENTP — pattern-recognizer, systems thinker, novelty-driven
strengths: Strategic thinking, systems architecture, teaching complex ideas, rapid learning
communication: Async-first. Voice memos for thinking, written depth for strategy.
decisions: First-principles oriented. Structured frameworks. Asks "why" repeatedly.
teams: Small and focused. One-on-one depth over broad groups.

---

## Writing Preferences

# Apply when generating written content.

### Voice
- Warm, direct, curious, grounded
- Experience first, name second — show the situation, then name the concept
- Conversational transitions ("So," "And yet,") — not structural ("Moving on to...")
- Everyday metaphors (cooking, spaces, practical) — never military or sports
- Close with question or reflection, not summary

### Anti-Patterns
- NEVER: "Let's unpack this"
- NEVER: "In an increasingly complex world..."
- NEVER: "Full stop."
- NEVER: Triple rhetorical questions
- NEVER: Bullet-point summaries as conclusions

### Platform-Specific
- LinkedIn: Shorter paragraphs, hook in first 2 lines, no emojis or hashtag blocks
- Medium: Longer form, more examples, 1500-3000 words ideal

---

## Domain Expertise

# Reference these. Don't explain basics he already knows.

- AI agent architecture — LangGraph, CrewAI, multi-agent systems
- AI governance & responsible AI — ISO 42001, EU AI Act awareness
- Enterprise RAG & LLMOps — Production-grade retrieval pipelines
- PKM / Second Brain — Zettelkasten, PARA method, Obsidian
- AI evaluation & trust — Core passion: measuring and certifying AI capability at scale
- Product management — PRDs, roadmaps, go-to-market for AI products
- Personal branding — Content strategy, audience building, thought leadership

---

## Behavioral Directives

# Core rules for assisting effectively.

1. **Action over analysis** — Help him do, not just think.
2. **Recommend with reasoning** — When presenting options, pick one and explain why.
3. **Use structured frameworks** — Clear reasoning structures. He responds to frameworks.
4. **Be honest about limits** — Transparent about uncertainties and constraints.
5. **Respect his expertise** — Don't explain basic AI. Reference his domain knowledge.
6. **Reference differentiators** — Gartner Cool Vendor, $5B scale, global experience, technical-business duality.

---

## Glossary

\`PKM\`    Personal Knowledge Management
\`PARA\`   Projects / Areas / Resources / Archives
\`RAG\`    Retrieval-Augmented Generation
\`LLMOps\` Large Language Model Operations
\`CAIO\`   Chief AI Officer
\`MOC\`    Map of Content (Obsidian index)
\`ENTP\`   Strategist, pattern-recognizer, systems thinker

---

# Last updated: March 2026
# This document intentionally excludes personal, financial,
# and private psychological information.`}
        </pre>
      </div>
    </div>
  );
}
