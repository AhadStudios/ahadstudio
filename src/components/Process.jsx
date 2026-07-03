"use client";

import useScrollReveal from "@/hooks/useScrollReveal";
import BookACall from "@/components/BookACall";

export default function Process() {
  const sectionRef = useScrollReveal();

  return (
    <section className="section-wrapper process" ref={sectionRef}>
      <div className="process-inner">
        <span className="process-bg-number" aria-hidden="true">
          (02)
        </span>

        <div className="process-copy">
          <div className="section-heading" data-scroll-reveal>
            <span className="title-script-decor title-script-decor--lg" aria-hidden="true">
              The
            </span>
            <h2 className="process-title">
              The process that is unbreakable &amp;
              <br />
              delivers every time without uncertainty
            </h2>
          </div>
          <p className="process-text" data-scroll-reveal>
            Three steps. Notion for tasks, Slack for comms, Figma for delivery.
            No long email chains, no Zoom marathons, no guessing where things
            stand. You&apos;ll always know what&apos;s in progress, what&apos;s
            next, and when it&apos;s landing.
          </p>
        </div>

        <div className="process-cta" data-scroll-reveal>
          <BookACall wide />
        </div>
      </div>
    </section>
  );
}
