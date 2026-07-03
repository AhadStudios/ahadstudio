export default function Hamburger({ className = "", ...props }) {
  return (
    <button
      type="button"
      className={className ? `hamburger ${className}` : "hamburger"}
      aria-label="Open menu"
      {...props}
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </button>
  );
}
