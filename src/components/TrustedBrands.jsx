import { brands } from "@/data/brands";
import BrandLogo from "@/components/BrandLogo";

export default function TrustedBrands() {
  return (
    <section className="section-wrapper trusted-brands" aria-labelledby="trusted-brands-heading">
      <div className="trusted-brands-inner">
        <p id="trusted-brands-heading" className="trusted-brands-label">
          Trusted by world&apos;s most
          <br />
          exciting brands
        </p>

        <div className="trusted-brands-grid">
          {brands.map((brand) => (
            <BrandLogo key={brand.slug} name={brand.name} file={brand.file} />
          ))}
        </div>
      </div>
    </section>
  );
}
