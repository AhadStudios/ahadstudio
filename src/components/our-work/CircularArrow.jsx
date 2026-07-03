export default function CircularArrow({ className = "" }) {
  return (
    <span className={`our-work-circle-arrow ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10.5" className="our-work-circle-arrow-ring" />
        <path
          d="M9.5 14.5L14.5 9.5M14.5 9.5H10M14.5 9.5V14"
          className="our-work-circle-arrow-icon"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
