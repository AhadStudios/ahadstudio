import AnimatedButton from "@/components/our-work/AnimatedButton";

export default function ProjectImageCard({ project }) {
  const headlineClass = [
    "our-work-image-card-headline",
    project.cardTitleSpaced && "our-work-image-card-headline--spaced",
    project.id === "04" && "our-work-image-card-headline--serif",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a href={project.href} className="our-work-image-card">
      <div className="our-work-image-card-media">
        <img
          src={project.image}
          alt={project.imageAlt}
          className="our-work-image-card-img"
          loading="lazy"
          draggable={false}
        />
        <div className="our-work-image-card-scrim" aria-hidden="true" />

        <div className="our-work-image-card-ui">
          <div className="our-work-image-card-top">
            <span className="our-work-image-card-brand">{project.title}</span>
            <span className="our-work-image-card-menu">
              MENU
              <span className="our-work-image-card-dot" aria-hidden="true" />
            </span>
          </div>

          <h3 className={headlineClass}>{project.cardTitle}</h3>

          {project.cardSubtitle ? (
            <p className="our-work-image-card-subtitle">{project.cardSubtitle}</p>
          ) : null}

          <div className="our-work-image-card-action">
            {project.cardAction === "play" ? (
              <AnimatedButton href={project.href} variant="play" />
            ) : (
              <AnimatedButton
                href={project.href}
                variant="inline"
                label={project.cardActionLabel}
                showArrow={!project.cardActionIcon}
                icon={project.cardActionIcon}
              />
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
