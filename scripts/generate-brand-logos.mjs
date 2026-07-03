import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "brand-logos");

const brands = [
  { slug: "wander", label: "Wander", style: { fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 500, letterSpacing: "0.02em", textTransform: "none" } },
  { slug: "am-md", label: "AM MD", style: { fontSize: 13, fontWeight: 700, letterSpacing: "0.22em" } },
  { slug: "grow-pronto", label: "GROW PRONTO", style: { fontSize: 10, fontWeight: 700, letterSpacing: "0.28em" } },
  { slug: "hide", label: "HIDE", style: { fontSize: 24, fontWeight: 900, letterSpacing: "0.06em" } },
  { slug: "nailboo", label: "Nailboo", style: { fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 400, fontStyle: "italic", textTransform: "none" } },
  { slug: "tatbrow", label: "TATBROW", style: { fontSize: 11, fontWeight: 300, letterSpacing: "0.34em" } },
  { slug: "best-of-the-bone", label: "BEST OF THE BONE", style: { fontSize: 9, fontWeight: 700, letterSpacing: "0.12em" } },
  { slug: "animal-house", label: "ANIMAL HOUSE", style: { fontSize: 9, fontWeight: 700, letterSpacing: "0.1em" } },
  { slug: "ecomlanders", label: "ecomlanders", style: { fontSize: 16, fontWeight: 500, letterSpacing: "0.01em", textTransform: "none" } },
  { slug: "nomad-lane", label: "NOMAD LANE", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.26em" } },
  { slug: "voltech", label: "VOLTED", style: { fontSize: 18, fontWeight: 700, fontStyle: "italic", letterSpacing: "0.04em" } },
  { slug: "dadfuel", label: "DADFUEL", style: { fontSize: 18, fontWeight: 900, letterSpacing: "0.03em" } },
  { slug: "kosso-nutrition", label: "KOSSO NUTRITION", style: { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" } },
  { slug: "melrose", label: "melróse", style: { fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 400, textTransform: "none" } },
  { slug: "fit-preps", label: "FIT PREPS", style: { fontSize: 14, fontWeight: 600, fontStyle: "italic", letterSpacing: "0.05em" } },
  { slug: "lukamachain", label: "lukamachain", style: { fontFamily: "Times New Roman, serif", fontSize: 15, fontWeight: 700, textTransform: "none" } },
  { slug: "monday", label: "monday", style: { fontSize: 20, fontWeight: 500, letterSpacing: "0.01em", textTransform: "none" } },
  { slug: "prime-iv", label: "PRIME IV", style: { fontSize: 13, fontWeight: 700, letterSpacing: "0.14em" } },
  { slug: "the-man-shake", label: "THE MAN SHAKE", style: { fontSize: 10, fontWeight: 900, letterSpacing: "0.08em" } },
  { slug: "scg-agency", label: "SCG AGENCY", style: { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" } },
  { slug: "repriced", label: "REPRICED", style: { fontSize: 14, fontWeight: 700, letterSpacing: "0.05em" } },
  { slug: "growth-minds", label: "Growth Minds.", style: { fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 500, fontStyle: "italic", textTransform: "none" } },
  { slug: "boost-berry", label: "boost berry", style: { fontSize: 16, fontWeight: 500, letterSpacing: "0.01em", textTransform: "none" } },
  { slug: "craze", label: "CRAZE", style: { fontSize: 20, fontWeight: 900, letterSpacing: "0.18em" } },
  { slug: "optimum7", label: "Optimum 7", style: { fontSize: 16, fontWeight: 600, textTransform: "none" } },
  { slug: "dorii-eyewear", label: "DORII EYEWEAR", style: { fontSize: 9, fontWeight: 600, letterSpacing: "0.12em" } },
  { slug: "the-esports-club", label: "THE ESPORTS CLUB", style: { fontSize: 8, fontWeight: 700, letterSpacing: "0.08em" } },
  { slug: "twistly", label: "TWISTY", style: { fontSize: 17, fontWeight: 700, letterSpacing: "0.1em" } },
  { slug: "wipemate", label: "wipemate", style: { fontSize: 16, fontWeight: 500, textTransform: "none" } },
  { slug: "famous-nutrition", label: "FAMOUS NUTRITION", style: { fontSize: 11, fontWeight: 800, letterSpacing: "0.06em" } },
  { slug: "mailbucks", label: "mailbucks", style: { fontSize: 16, fontWeight: 500, textTransform: "none" } },
  { slug: "eightfold", label: "eightfold", style: { fontSize: 16, fontWeight: 500, textTransform: "none" } },
  { slug: "kobalt-club", label: "KOBALT CLUB", style: { fontSize: 10, fontWeight: 700, letterSpacing: "0.12em" } },
  { slug: "gel-blaster", label: "GEL BLASTER", style: { fontSize: 12, fontWeight: 800, letterSpacing: "0.08em" } },
  { slug: "eve-and-co", label: "EVE AND CO", style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.16em" } },
  { slug: "wld", label: "WLDD", style: { fontSize: 22, fontWeight: 900, letterSpacing: "0.12em" } },
];

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildWordmark({ label, style }) {
  const {
    fontFamily = "Arial, Helvetica, sans-serif",
    fontSize = 14,
    fontWeight = 600,
    fontStyle = "normal",
    letterSpacing = "0.06em",
    textTransform = "uppercase",
  } = style;

  const display = textTransform === "none" ? label : label.toUpperCase();
  const safe = escapeXml(display);
  const charWidth = fontSize * (letterSpacing ? 0.58 : 0.52);
  const width = Math.ceil(display.length * charWidth + fontSize * 0.6);
  const height = Math.ceil(fontSize * 1.8);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(label)}">
  <text x="0" y="${Math.round(fontSize * 1.15)}" fill="#ffffff" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${fontWeight}" font-style="${fontStyle}" letter-spacing="${letterSpacing}">${safe}</text>
</svg>`;
}

fs.mkdirSync(outDir, { recursive: true });

const manifest = {};

for (const brand of brands) {
  const filename = `${brand.slug}.svg`;
  fs.writeFileSync(path.join(outDir, filename), buildWordmark(brand), "utf8");
  manifest[brand.slug] = filename;
}

for (const file of fs.readdirSync(outDir)) {
  if (/\.(png|jpg|jpeg|webp)$/i.test(file)) {
    fs.unlinkSync(path.join(outDir, file));
  }
}

fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2),
  "utf8",
);

console.log(`Generated ${brands.length} wordmark SVG logos.`);
