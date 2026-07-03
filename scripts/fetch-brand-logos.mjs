import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { brands } from "../src/data/brands.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "brand-logos");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,*/*" },
    redirect: "follow",
  });
  if (!res.ok) return null;
  return res.text();
}

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) return null;
  const type = res.headers.get("content-type") || "";
  if (!type.includes("image") && !url.endsWith(".svg")) return null;
  return { buffer: Buffer.from(await res.arrayBuffer()), type };
}

function extractLogoUrls(html, baseUrl) {
  const urls = new Set();
  const patterns = [
    /property=["']og:image["']\s+content=["']([^"']+)["']/gi,
    /content=["']([^"']+)["']\s+property=["']og:image["']/gi,
    /<img[^>]+class=["'][^"']*logo[^"']*["'][^>]+src=["']([^"']+)["']/gi,
    /<img[^>]+src=["']([^"']+)["'][^>]+class=["'][^"']*logo[^"']*["']/gi,
    /src=["']([^"']*(?:logo|brand)[^"']*\.(?:png|svg|webp|jpg))["']/gi,
    /url\(["']?([^"')]+(?:logo|brand)[^"')]+\.(?:png|svg|webp))["']?\)/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      urls.add(match[1]);
    }
  }

  return [...urls].map((u) => {
    try {
      return new URL(u, baseUrl).href;
    } catch {
      return null;
    }
  }).filter(Boolean);
}

function wordmarkSvg(name, style = {}) {
  const {
    fontSize = 14,
    fontWeight = 600,
    letterSpacing = "0.06em",
    fontStyle = "normal",
    fontFamily = "Arial, Helvetica, sans-serif",
    textTransform = "uppercase",
  } = style;
  const label = name
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const display = textTransform === "uppercase" ? label.toUpperCase() : label;
  const width = Math.max(120, display.length * (fontSize * 0.62));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 40" role="img" aria-label="${label}">
  <text x="0" y="26" fill="#ffffff" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${fontWeight}" font-style="${fontStyle}" letter-spacing="${letterSpacing}">${display}</text>
</svg>`;
}

const wordmarkStyles = {
  wander: { fontSize: 16, fontWeight: 700, letterSpacing: "0.14em" },
  "am-md": { fontSize: 13, fontWeight: 700, letterSpacing: "0.18em" },
  "grow-pronto": { fontSize: 11, fontWeight: 700, letterSpacing: "0.22em" },
  hide: { fontSize: 22, fontWeight: 900, letterSpacing: "0.04em" },
  nailboo: { fontSize: 20, fontWeight: 500, fontStyle: "italic", fontFamily: "Georgia, serif", textTransform: "none" },
  tatbrow: { fontSize: 12, fontWeight: 300, letterSpacing: "0.32em" },
  "best-of-the-bone": { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" },
  "animal-house": { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" },
  ecomlanders: { fontSize: 15, fontWeight: 500, letterSpacing: "0.02em", textTransform: "none" },
  "nomad-lane": { fontSize: 11, fontWeight: 600, letterSpacing: "0.24em" },
  voltech: { fontSize: 17, fontWeight: 700, fontStyle: "italic", letterSpacing: "0.04em" },
  dadfuel: { fontSize: 18, fontWeight: 900, letterSpacing: "0.02em" },
  "kosso-nutrition": { fontSize: 12, fontWeight: 700, letterSpacing: "0.08em" },
  melrose: { fontSize: 20, fontWeight: 400, fontFamily: "Georgia, serif", textTransform: "none" },
  "fit-preps": { fontSize: 14, fontWeight: 600, fontStyle: "italic", letterSpacing: "0.06em" },
  lukamachain: { fontSize: 14, fontWeight: 700, fontFamily: "Times New Roman, serif", textTransform: "none" },
  monday: { fontSize: 18, fontWeight: 500, letterSpacing: "0.02em", textTransform: "none" },
  "prime-iv": { fontSize: 13, fontWeight: 700, letterSpacing: "0.12em" },
  "the-man-shake": { fontSize: 11, fontWeight: 900, letterSpacing: "0.06em" },
  "scg-agency": { fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" },
  repriced: { fontSize: 14, fontWeight: 700, letterSpacing: "0.04em" },
  "growth-minds": { fontSize: 16, fontWeight: 500, fontFamily: "Georgia, serif", fontStyle: "italic", textTransform: "none" },
  "boost-berry": { fontSize: 15, fontWeight: 500, letterSpacing: "0.02em", textTransform: "none" },
  craze: { fontSize: 18, fontWeight: 900, letterSpacing: "0.16em" },
  optimum7: { fontSize: 16, fontWeight: 600, textTransform: "none" },
  "dorii-eyewear": { fontSize: 10, fontWeight: 600, letterSpacing: "0.1em" },
  "the-esports-club": { fontSize: 9, fontWeight: 700, letterSpacing: "0.06em" },
  twistly: { fontSize: 16, fontWeight: 700, letterSpacing: "0.08em" },
  wipemate: { fontSize: 15, fontWeight: 500, textTransform: "none" },
  "famous-nutrition": { fontSize: 13, fontWeight: 800, letterSpacing: "0.04em" },
  mailbucks: { fontSize: 15, fontWeight: 500, textTransform: "none" },
  eightfold: { fontSize: 15, fontWeight: 500, textTransform: "none" },
  "kobalt-club": { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" },
  "gel-blaster": { fontSize: 12, fontWeight: 800, letterSpacing: "0.08em" },
  "eve-and-co": { fontSize: 11, fontWeight: 700, letterSpacing: "0.14em" },
  wld: { fontSize: 20, fontWeight: 900, letterSpacing: "0.1em" },
};

function extFromType(type, url) {
  if (type.includes("svg")) return "svg";
  if (type.includes("webp")) return "webp";
  if (type.includes("png")) return "png";
  if (type.includes("jpeg") || type.includes("jpg")) return "jpg";
  if (url.endsWith(".svg")) return "svg";
  if (url.endsWith(".webp")) return "webp";
  if (url.endsWith(".png")) return "png";
  return "png";
}

async function tryDownloadLogo(url) {
  try {
    const result = await fetchBuffer(url);
    if (!result || result.buffer.length < 200) return null;
    return { ...result, ext: extFromType(result.type, url) };
  } catch {
    return null;
  }
}

async function fetchBrandLogo(brand) {
  const base = `https://${brand.domain}`;
  const candidates = [];

  if (brand.domain) {
    const html = await fetchText(base);
    if (html) candidates.push(...extractLogoUrls(html, base));

    candidates.push(
      `${base}/cdn/shop/files/logo.png`,
      `${base}/cdn/shop/files/logo.svg`,
      `https://logo.clearbit.com/${brand.domain}?size=320`,
    );
  }

  for (const url of [...new Set(candidates)]) {
    const downloaded = await tryDownloadLogo(url);
    if (downloaded) {
      const filename = `${brand.slug}.${downloaded.ext}`;
      fs.writeFileSync(path.join(outDir, filename), downloaded.buffer);
      return filename;
    }
  }

  const svg = wordmarkSvg(brand.name, wordmarkStyles[brand.slug] || {});
  const filename = `${brand.slug}.svg`;
  fs.writeFileSync(path.join(outDir, filename), svg, "utf8");
  return filename;
}

fs.mkdirSync(outDir, { recursive: true });

const manifest = {};
for (const brand of brands) {
  process.stdout.write(`Fetching ${brand.name}... `);
  try {
    manifest[brand.slug] = await fetchBrandLogo(brand);
    console.log(manifest[brand.slug]);
  } catch (err) {
    const svg = wordmarkSvg(brand.name, wordmarkStyles[brand.slug] || {});
    const filename = `${brand.slug}.svg`;
    fs.writeFileSync(path.join(outDir, filename), svg, "utf8");
    manifest[brand.slug] = filename;
    console.log(`${filename} (fallback)`);
  }
}

fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2),
  "utf8",
);

console.log(`Done. ${Object.keys(manifest).length} logos.`);
