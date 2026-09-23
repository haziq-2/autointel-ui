#!/usr/bin/env node
/**
 * Convert root listings.csv → src/lib/mock-data/listings.json
 *
 * Usage: node scripts/ingest-listings.mjs [path/to/listings.csv]
 */
import { createReadStream } from "node:fs";
import { writeFile, stat } from "node:fs/promises";
import { createInterface } from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const inputPath = path.resolve(root, process.argv[2] ?? "listings.csv");
const outputPath = path.resolve(root, "src/lib/mock-data/listings.json");

const SOURCE_LABEL = {
  craigslist: "Craigslist",
  facebook: "Facebook Marketplace",
  "facebook marketplace": "Facebook Marketplace",
  cargurus: "CarGurus",
  autotrader: "CarGurus",
};

/** Minimal CSV line parser that respects quoted fields. */
function parseCsvLine(line) {
  const cols = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      cols.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  cols.push(cur.replace(/\r$/, ""));
  return cols;
}

function toNumber(value) {
  const v = (value ?? "").trim();
  if (!v) return 0;
  const n = Number(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function normalizeSource(raw) {
  const key = (raw ?? "").trim().toLowerCase();
  if (!key) return "Unknown";
  return SOURCE_LABEL[key] ?? raw.trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

const rows = [];
const seen = new Set();
const sources = Object.create(null);
let skipped = 0;
let dupes = 0;

const rl = createInterface({
  input: createReadStream(inputPath, { encoding: "utf8" }),
  crlfDelay: Infinity,
});

for await (const line of rl) {
  if (!line.trim()) continue;
  const cols = parseCsvLine(line);
  if (cols.length < 20) {
    skipped++;
    continue;
  }

  const listingId = (cols[2] ?? "").trim();
  const title = (cols[3] ?? "").trim();
  if (!listingId || !title) {
    skipped++;
    continue;
  }
  if (seen.has(listingId)) {
    dupes++;
    continue;
  }
  seen.add(listingId);

  const source = normalizeSource(cols[1]);
  sources[source] = (sources[source] ?? 0) + 1;

  rows.push({
    listingId,
    title,
    price: toNumber(cols[4]),
    year: Math.trunc(toNumber(cols[5])) || 0,
    make: (cols[6] ?? "").trim(),
    model: (cols[7] ?? "").trim(),
    mileage: Math.trunc(toNumber(cols[8])) || 0,
    location: (cols[9] ?? "").trim(),
    seller: (cols[10] ?? "").trim(),
    url: (cols[11] ?? "").trim(),
    image: (cols[12] ?? "").trim(),
    postedTime: (cols[13] ?? "").trim(),
    vin: (cols[14] ?? "").trim(),
    condition: (cols[15] ?? "").trim(),
    fuel: (cols[16] ?? "").trim(),
    transmission: (cols[17] ?? "").trim(),
    firstSeen: (cols[18] ?? "").trim(),
    lastSeen: (cols[19] ?? "").trim(),
    source,
  });
}

await writeFile(outputPath, JSON.stringify(rows), "utf8");
const sizeMb = ((await stat(outputPath)).size / 1e6).toFixed(2);

console.log(`Ingested ${rows.length.toLocaleString()} listings → ${path.relative(root, outputPath)}`);
console.log(`Skipped ${skipped}, duplicates ${dupes}, size ${sizeMb} MB`);
console.log("Sources:", sources);
