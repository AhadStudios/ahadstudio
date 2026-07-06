import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "brand-logos");
const baseUrl = "https://ahadstudios.com/images/brands";

const brandAssets = [
  { name: "Wander", slug: "wander", file: "wander.svg" },
  { name: "AM MD", slug: "am-md", file: "ammd.svg" },
  { name: "Grow Pronto", slug: "grow-pronto", file: "grow_pronto.webp" },
  { name: "HIDE", slug: "hide", file: "hide.svg" },
  { name: "Nailboo", slug: "nailboo", file: "nailboo.svg" },
  { name: "TATBROW", slug: "tatbrow", file: "tatbrow.webp" },
  { name: "Best of the Bone", slug: "best-of-the-bone", file: "best_of_the_bone2.svg" },
  { name: "Animal House", slug: "animal-house", file: "animal_house.webp" },
  { name: "Ecomlanders", slug: "ecomlanders", file: "ecom_landers.webp" },
  { name: "Nomad Lane", slug: "nomad-lane", file: "nomad_lane.svg" },
  { name: "Voltech", slug: "voltech", file: "volted.webp" },
  { name: "DadFuel", slug: "dadfuel", file: "dadfuel.svg" },
  { name: "Kosso Nutrition", slug: "kosso-nutrition", file: "kosso_nutrition.svg" },
  { name: "Melrose", slug: "melrose", file: "melrose.webp" },
  { name: "Fit Preps", slug: "fit-preps", file: "fit_preps.svg" },
  { name: "Lukamachain", slug: "lukamachain", file: "lukamachain.webp" },
  { name: "Monday", slug: "monday", file: "monday.webp" },
  { name: "Prime IV", slug: "prime-iv", file: "prime_hydration_and_wellness.svg" },
  { name: "The Man Shake", slug: "the-man-shake", file: "the_man_shake.webp" },
  { name: "SCG Agency", slug: "scg-agency", file: "scg_agency.webp" },
  { name: "Repriced", slug: "repriced", file: "repriced.svg" },
  { name: "Growth Minds", slug: "growth-minds", file: "growth_minds.webp" },
  { name: "Boost Berry", slug: "boost-berry", file: "boost_berry1.webp" },
  { name: "Craze", slug: "craze", file: "craze.svg" },
  { name: "Optimum7", slug: "optimum7", file: "optimum_7.svg" },
  { name: "Dorii Eyewear", slug: "dorii-eyewear", file: "dori_eyewear.webp" },
  { name: "The Esports Club", slug: "the-esports-club", file: "the_esports_club.webp" },
  { name: "Twistly", slug: "twistly", file: "twisty.webp" },
  { name: "Wipemate", slug: "wipemate", file: "wipemate.svg" },
  { name: "Famous Nutrition", slug: "famous-nutrition", file: "famous_nutrition.webp" },
  { name: "Mailbucks", slug: "mailbucks", file: "mailbucks.webp" },
  { name: "Eightfold", slug: "eightfold", file: "eightfold.webp" },
  { name: "Kobalt Club", slug: "kobalt-club", file: "kobalt_club.webp" },
  { name: "Gel Blaster", slug: "gel-blaster", file: "gel_blaster.webp" },
  { name: "Eve and Co", slug: "eve-and-co", file: "eve_and_co.svg" },
  { name: "WLD", slug: "wld", file: "wldd.svg" },
];

async function downloadBrand(asset) {
  const url = `${baseUrl}/${asset.file}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(outDir, asset.file), buffer);
  return asset.file;
}

fs.mkdirSync(outDir, { recursive: true });

for (const file of fs.readdirSync(outDir)) {
  fs.unlinkSync(path.join(outDir, file));
}

const manifest = {};

for (const asset of brandAssets) {
  process.stdout.write(`Downloading ${asset.name}... `);
  try {
    await downloadBrand(asset);
    manifest[asset.slug] = asset.file;
    console.log(asset.file);
  } catch (err) {
    console.log(`FAILED (${err.message})`);
  }
}

fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2),
  "utf8",
);

console.log(`Downloaded ${Object.keys(manifest).length} logos.`);
