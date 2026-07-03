export default function SectionWrapper({ id, className = "", children }) {
  const composedClassName = className
    ? `section-wrapper ${className}`
    : "section-wrapper";

  return (
    <section id={id} className={composedClassName}>
      <div className="section-inner">{children}</div>
    </section>
  );
}
