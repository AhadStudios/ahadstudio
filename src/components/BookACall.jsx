import Link from "next/link";

export default function BookACall({ className = "", wide = false }) {
  const blockClass = [
    "cta-block",
    wide && "cta-block--wide",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={blockClass}>
      <div className="cta-row">
        <Link href="/contact" className="book-a-call">
          Book A Call
        </Link>
        <span className="spinner" aria-hidden="true">
          <span className="spinner-dot" />
          <span className="spinner-dot" />
          <span className="spinner-dot" />
          <span className="spinner-dot" />
          <span className="spinner-dot" />
          <span className="spinner-dot" />
          <span className="spinner-dot" />
          <span className="spinner-dot" />
        </span>
      </div>
      <span className="book-a-call-line" aria-hidden="true" />
    </div>
  );
}
