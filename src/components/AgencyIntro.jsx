"use client";

import BookACall from "@/components/BookACall";

export default function AgencyIntro() {
  return (
    <section id="contact" className="section-wrapper agency-intro">
      <div className="agency-intro-inner">
        <div className="agency-intro-copy">
          <div className="section-heading">
            <h2 className="agency-intro-title">
              <span className="agency-intro-line">Not just another design team.</span>
              <br />
              <span className="agency-intro-line">The one you stop searching after.</span>
            </h2>
          </div>
          <p className="agency-intro-text">
            Over 12 years grinding alongside founders &amp; agencies with a chip
            on their shoulder and a story that needs telling. CREATIVECUE is the
            design partner teams turn to when speed &amp; quality matter most.
          </p>
        </div>

        <div className="agency-intro-cta">
          <BookACall wide />
        </div>
      </div>
    </section>
  );
}
