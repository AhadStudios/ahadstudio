import {
  HOME_HOVER_STEPS,
  STACK_HOVER_POSITIONS,
  STACK_HOVER_TECH,
  WORK_HOVER_PROJECTS,
} from "@/data/navHoverContent";

export default function NavPreview({ panelId }) {
  switch (panelId) {
    case "hero":
      return (
        <div className="nav-hover-panel nav-hover-panel--home">
          {HOME_HOVER_STEPS.map((lines, index) => (
            <div
              key={lines.join("-")}
              className="nav-hover-home-step"
              data-hover-step
              data-hover-index={index}
            >
              {lines.map((line) => (
                <span key={line} className="nav-hover-home-line">
                  {line}
                </span>
              ))}
            </div>
          ))}
        </div>
      );

    case "work":
      return (
        <div className="nav-hover-panel nav-hover-panel--work">
          <p className="nav-hover-work-eyebrow" data-hover-intro>
            WORK
          </p>
          <p className="nav-hover-work-count" data-hover-intro>
            20+ Projects
          </p>
          <div className="nav-hover-work-grid">
            {WORK_HOVER_PROJECTS.map((project, index) => (
              <article
                key={project.id}
                className="nav-hover-work-card"
                data-hover-card
                data-hover-index={index}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.image} alt="" loading="lazy" />
                <span className="nav-hover-work-card-title">{project.title}</span>
              </article>
            ))}
          </div>
        </div>
      );

    case "stack":
      return (
        <div className="nav-hover-panel nav-hover-panel--stack">
          <p className="nav-hover-stack-title" data-hover-intro>
            STACK
          </p>
          <div className="nav-hover-stack-stage">
            {STACK_HOVER_TECH.map((tech, index) => (
              <div
                key={tech.id}
                className="nav-hover-stack-icon"
                data-hover-icon
                data-hover-index={index}
                style={STACK_HOVER_POSITIONS[index]}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tech.src} alt="" loading="lazy" />
                <span>{tech.label}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "contact":
      return (
        <div className="nav-hover-panel nav-hover-panel--contact">
          <div className="nav-hover-contact-glow" data-hover-glow aria-hidden="true" />
          <div className="nav-hover-contact-copy">
            <p className="nav-hover-contact-title" data-hover-intro>
              <span>LET&apos;S BUILD</span>
              <span>SOMETHING GREAT</span>
            </p>
            <div className="nav-hover-contact-form" data-hover-form>
              <span className="nav-hover-contact-field" />
              <span className="nav-hover-contact-field" />
              <span className="nav-hover-contact-field nav-hover-contact-field--wide" />
              <span className="nav-hover-contact-submit">Send message</span>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
