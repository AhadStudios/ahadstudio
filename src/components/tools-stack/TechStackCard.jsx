import { logoLayoutPresets } from "@/data/stackCategories";
import LogoTile from "@/components/tools-stack/LogoTile";

export default function TechStackCard({ category }) {
  return (
    <article className="tools-stack-card">
      <div className="tools-stack-card-copy">
        <span className="tools-stack-card-number">{category.number}</span>
        <h3 className="tools-stack-card-title">{category.title}</h3>
        <p className="tools-stack-card-description">{category.description}</p>
        <ul className="tools-stack-card-list">
          {category.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="tools-stack-card-visual">
        <div className="tools-stack-card-grid" aria-hidden="true" />
        <div className="tools-stack-card-logos">
          {category.logos.map((logo, index) => (
            <LogoTile
              key={logo.name}
              logo={logo}
              layout={logoLayoutPresets[index % logoLayoutPresets.length]}
              index={index}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
