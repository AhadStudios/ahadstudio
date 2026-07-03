import CircularArrow from "@/components/our-work/CircularArrow";

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 16V12M10 16V9M14 16V11M18 16V7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 8.2V15.8L16 12L10 8.2Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AnimatedButton({
  href = "#",
  label,
  showArrow = true,
  variant = "text",
  icon = null,
  className = "",
  ariaLabel,
}) {
  if (variant === "circle") {
    return (
      <a
        href={href}
        className={`our-work-btn our-work-btn--circle ${className}`.trim()}
        aria-label={ariaLabel || label}
      >
        <CircularArrow />
      </a>
    );
  }

  if (variant === "play") {
    return (
      <a
        href={href}
        className={`our-work-btn our-work-btn--play ${className}`.trim()}
        aria-label={ariaLabel || "Play"}
      >
        <span className="our-work-btn-play-ring" aria-hidden="true" />
        <span className="our-work-btn-play-icon">
          <PlayIcon />
        </span>
      </a>
    );
  }

  const isInline = variant === "inline";

  return (
    <a
      href={href}
      className={`our-work-btn our-work-btn--${variant} ${className}`.trim()}
      aria-label={ariaLabel || label}
    >
      <span className="our-work-btn-inner">
        {label && <span className="our-work-btn-label">{label}</span>}
        {showArrow && !icon && <CircularArrow className="our-work-btn-arrow" />}
        {icon === "chart" && (
          <span className="our-work-btn-chart">
            <ChartIcon />
          </span>
        )}
      </span>
      {!isInline && <span className="our-work-btn-line" aria-hidden="true" />}
    </a>
  );
}
