"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useNavMenu } from "@/components/NavMenuProvider";

const NAV_LINKS = [
  { label: "Projects", target: "#work" },
  { label: "Services", target: ".services-showcase" },
  { label: "About", target: ".contact-page" },
  { label: "Process", target: ".prism-section" },
  { label: "Contact", target: ".contact-page" },
];

const STACK_LINKS = [
  "Next.js",
  "React",
  "TypeScript",
  "Three.js",
  "GSAP",
  "UI/UX Design",
  "Brand Identity",
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Email", href: "mailto:hello@creativecue.com" },
];

function scrollToTarget(target) {
  const element = document.querySelector(target);
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function NavOverlay() {
  const { isOpen, close } = useNavMenu();

  const handleNavClick = (target) => (event) => {
    event.preventDefault();
    close();
    window.requestAnimationFrame(() => scrollToTarget(target));
  };

  const handleSocialClick = () => {
    close();
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="nav-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="nav-overlay-panel"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              className="nav-overlay-close close-btn"
              aria-label="Close menu"
              onClick={close}
            >
              <span className="close-btn-x" aria-hidden="true" />
            </button>

            <div className="nav-overlay-grid">
              <div className="nav-overlay-column">
                <p className="nav-overlay-label">Explore</p>
                <ul className="nav-overlay-list">
                  {NAV_LINKS.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.target}
                        className="nav-overlay-link"
                        onClick={handleNavClick(item.target)}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="nav-overlay-column">
                <p className="nav-overlay-label">Stack</p>
                <ul className="nav-overlay-list nav-overlay-list--muted">
                  {STACK_LINKS.map((item) => (
                    <li key={item}>
                      <span className="nav-overlay-tag">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="nav-overlay-column">
                <p className="nav-overlay-label">Connect</p>
                <ul className="nav-overlay-list">
                  {SOCIAL_LINKS.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="nav-overlay-link"
                        target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={
                          item.href.startsWith("mailto:")
                            ? undefined
                            : "noopener noreferrer"
                        }
                        onClick={handleSocialClick}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="nav-overlay-sticker" aria-hidden="true">
              <svg viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect
                  x="28"
                  y="58"
                  width="96"
                  height="64"
                  rx="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M40 118h72M52 70h48M52 82h36"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="132" cy="88" r="18" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M126 88c4-8 16-8 20 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="132" cy="84" r="2" fill="currentColor" />
                <path
                  d="M60 170c12-18 36-18 48 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M44 170h92"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <text
                  x="90"
                  y="44"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  {"</>"}
                </text>
              </svg>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
