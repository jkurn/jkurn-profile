'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin);

interface AccordionSectionProps {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function AccordionSection({
  id,
  title,
  isOpen,
  onToggle,
  children,
  defaultOpen = false,
}: AccordionSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const headerTextRef = useRef<HTMLSpanElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!contentRef.current) return;

    // On first render, set initial state without animation
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (isOpen) {
        contentRef.current.style.height = 'auto';
        contentRef.current.style.overflow = 'visible';
      } else {
        contentRef.current.style.height = '0px';
        contentRef.current.style.overflow = 'hidden';
      }
      return;
    }

    // Skip animation if document is hidden
    if (document.hidden) {
      if (isOpen) {
        contentRef.current.style.height = 'auto';
        contentRef.current.style.overflow = 'visible';
      } else {
        contentRef.current.style.height = '0px';
        contentRef.current.style.overflow = 'hidden';
      }
      return;
    }

    if (isOpen) {
      // Opening: animate height to auto
      gsap.killTweensOf(contentRef.current);
      contentRef.current.style.overflow = 'hidden';
      gsap.to(contentRef.current, {
        height: 'auto',
        duration: 0.5,
        ease: 'cyberSnap',
        onComplete: () => {
          if (contentRef.current) {
            contentRef.current.style.overflow = 'visible';
          }
        },
      });

      // ScrambleText on header when opening
      if (headerTextRef.current) {
        gsap.to(headerTextRef.current, {
          duration: 0.8,
          scrambleText: {
            text: title,
            chars: '!@#$%^&*01XMWK',
            revealDelay: 0.1,
            speed: 0.5,
          },
        });
      }
    } else {
      // Closing: animate height to 0
      gsap.killTweensOf(contentRef.current);
      contentRef.current.style.overflow = 'hidden';
      gsap.to(contentRef.current, {
        height: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      });
    }
  }, [isOpen, title]);

  return (
    <div className="rpg-panel gsap-panel">
      <button
        className="accordion-header section-header"
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
        aria-controls={`accordion-${id}`}
      >
        <span ref={headerTextRef}>{title}</span>
        <span className={`accordion-chevron ${isOpen ? 'open' : ''}`}>▸</span>
      </button>
      <div
        ref={contentRef}
        id={`accordion-${id}`}
        className="accordion-content"
      >
        <div ref={innerRef} className="p-4 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
