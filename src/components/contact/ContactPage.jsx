"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/helpers";
import { prefersReducedMotion } from "@/animations/panelScroll";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M8 3V7M16 3V7M4 10H20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CollaborationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16.5" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M4.5 18.5C5.6 15.8 7.9 14.2 10.5 14.2C12.4 14.2 14.1 15.1 15.2 16.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M14.8 16.8C15.6 15.7 16.9 15 18.4 15C20.4 15 22 16.2 22.5 18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InsightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 3L5 14H11L10 21L19 10H13L13 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const FEATURES = [
  {
    icon: CalendarIcon,
    title: "30–45 Minute Call",
    text: "A focused conversation about your project and goals.",
  },
  {
    icon: CollaborationIcon,
    title: "Direct Collaboration",
    text: "Speak directly with me, not a sales team.",
  },
  {
    icon: InsightIcon,
    title: "Actionable Insights",
    text: "Walk away with clarity and next steps.",
  },
];

export default function ContactPage() {
  const rootRef = useRef(null);
  const formCardRef = useRef(null);
  const submitRef = useRef(null);
  const magnetRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const formCard = formCardRef.current;
    if (!root || prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const titleLines = root.querySelectorAll("[data-contact-line]");
      const reveals = root.querySelectorAll("[data-contact-reveal]");
      const fields = root.querySelectorAll(".contact-page-input, .contact-page-select, .contact-page-textarea");

      gsap.set(titleLines, { yPercent: 110, autoAlpha: 0 });
      gsap.set(reveals, { y: 28, autoAlpha: 0 });
      gsap.set(fields, { y: 18, autoAlpha: 0 });

      const timeline = gsap.timeline({ delay: 0.2, defaults: { ease: "power3.out" } });

      timeline
        .to(titleLines, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.95,
          stagger: 0.14,
          ease: "power4.out",
        })
        .to(reveals, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1 }, "-=0.35")
        .to(fields, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.07 }, "-=0.2");

      if (formCard) {
        gsap.to(formCard, {
          y: -8,
          duration: 3.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }, root);

    const fields = root.querySelectorAll(".contact-page-input, .contact-page-select, .contact-page-textarea");
    const focusHandlers = [];

    fields.forEach((field) => {
      const onFocus = () => field.classList.add("is-focused");
      const onBlur = () => field.classList.remove("is-focused");
      field.addEventListener("focus", onFocus);
      field.addEventListener("blur", onBlur);
      focusHandlers.push(() => {
        field.removeEventListener("focus", onFocus);
        field.removeEventListener("blur", onBlur);
      });
    });

    const submit = submitRef.current;
    const onMove = (event) => {
      if (!submit || !window.matchMedia("(pointer: fine)").matches) return;
      const rect = submit.getBoundingClientRect();
      const nx = (event.clientX - (rect.left + rect.width / 2)) * 0.18;
      const ny = (event.clientY - (rect.top + rect.height / 2)) * 0.18;

      if (!magnetRef.current) {
        magnetRef.current = {
          xTo: gsap.quickTo(submit, "x", { duration: 0.4, ease: "power3.out" }),
          yTo: gsap.quickTo(submit, "y", { duration: 0.4, ease: "power3.out" }),
        };
      }

      magnetRef.current.xTo(nx);
      magnetRef.current.yTo(ny);
    };

    const onLeave = () => {
      if (!magnetRef.current) return;
      magnetRef.current.xTo(0);
      magnetRef.current.yTo(0);
    };

    submit?.addEventListener("mousemove", onMove);
    submit?.addEventListener("mouseleave", onLeave);

    const arrow = submit?.querySelector(".contact-page-submit-arrow");
    const onEnter = () => {
      if (arrow) gsap.to(arrow, { x: 8, duration: 0.4, ease: "power3.out" });
    };
    const onSubmitLeave = () => {
      if (arrow) gsap.to(arrow, { x: 0, duration: 0.35, ease: "power3.out" });
    };
    submit?.addEventListener("mouseenter", onEnter);
    submit?.addEventListener("mouseleave", onSubmitLeave);

    return () => {
      ctx.revert();
      focusHandlers.forEach((cleanup) => cleanup());
      submit?.removeEventListener("mousemove", onMove);
      submit?.removeEventListener("mouseleave", onLeave);
      submit?.removeEventListener("mouseenter", onEnter);
      submit?.removeEventListener("mouseleave", onSubmitLeave);
    };
  }, []);

  return (
    <section
      id="contact"
      className="section-wrapper contact-page"
      aria-labelledby="contact-heading"
      ref={rootRef}
    >
      <div className="contact-page-inner">
        <div className="contact-page-content">
          <h1 id="contact-heading" className="contact-page-title">
            <span className="contact-page-title-line" data-contact-line>
              Book a Call.
            </span>
            <span className="contact-page-title-line" data-contact-line>
              Let&apos;s build something
            </span>
            <span className="contact-page-title-line" data-contact-line>
              great together.
            </span>
          </h1>

          <p className="contact-page-lead" data-contact-reveal>
            Have a project in mind or want to explore ideas?
            <br />
            Schedule a call and let&apos;s discuss how we can
            <br />
            bring your vision to life.
          </p>

          <ul className="contact-page-features">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.title} className="contact-page-feature" data-contact-reveal>
                  <span className="contact-page-feature-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <div className="contact-page-feature-copy">
                    <h2 className="contact-page-feature-title">{feature.title}</h2>
                    <p className="contact-page-feature-text">{feature.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="contact-page-footnote" data-contact-reveal>
            We respect your time. No spam, ever.
          </p>
        </div>

        <div className="contact-page-form-card" ref={formCardRef}>
          <div className="contact-page-form-head" data-contact-reveal>
            <h2 className="contact-page-form-title">Schedule Your Call</h2>
            <p className="contact-page-form-subtitle">
              Fill out the form and I&apos;ll get back to you within 24 hours.
            </p>
          </div>

          <form className="contact-page-form" action="#" method="post">
            <div className="contact-page-form-row">
              <label className="contact-page-field">
                <span className="contact-page-label">First Name</span>
                <input
                  type="text"
                  name="firstName"
                  className="contact-page-input"
                  autoComplete="given-name"
                  required
                />
              </label>
              <label className="contact-page-field">
                <span className="contact-page-label">Last Name</span>
                <input
                  type="text"
                  name="lastName"
                  className="contact-page-input"
                  autoComplete="family-name"
                  required
                />
              </label>
            </div>

            <label className="contact-page-field">
              <span className="contact-page-label">Work Email</span>
              <input
                type="email"
                name="email"
                className="contact-page-input"
                autoComplete="email"
                required
              />
            </label>

            <label className="contact-page-field">
              <span className="contact-page-label">Company (Optional)</span>
              <input
                type="text"
                name="company"
                className="contact-page-input"
                autoComplete="organization"
              />
            </label>

            <label className="contact-page-field">
              <span className="contact-page-label">What best describes you?</span>
              <span className="contact-page-select-wrap">
                <select name="role" className="contact-page-select" defaultValue="" required>
                  <option value="" disabled>
                    Select one
                  </option>
                  <option value="founder">Founder / Startup</option>
                  <option value="agency">Agency</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="other">Other</option>
                </select>
              </span>
            </label>

            <label className="contact-page-field">
              <span className="contact-page-label">Tell us about your project</span>
              <textarea
                name="message"
                className="contact-page-textarea"
                rows={5}
                required
              />
            </label>

            <button type="submit" className="contact-page-submit" ref={submitRef}>
              <span>Schedule Call</span>
              <span className="contact-page-submit-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </form>

          <p className="contact-page-email-fallback" data-contact-reveal>
            Prefer email?{" "}
            <a href="mailto:hello@creativecue.com" className="contact-page-email-link">
              hello@creativecue.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
