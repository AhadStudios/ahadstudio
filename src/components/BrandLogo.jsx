export default function BrandLogo({ name, file }) {
  return (
    <article className="brand-logo">
      <img
        src={`/brand-logos/${file}`}
        alt={`${name} logo`}
        loading="lazy"
        draggable="false"
      />
    </article>
  );
}
