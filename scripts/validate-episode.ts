import { readFileSync } from "node:fs";
import { episodeSchema, validateEpisodeQuality } from "../src/schemas/episode.js";

const inputFile = process.argv[2];
if (!inputFile) {
  console.error("Usage: npm run validate:episode -- <path-to-episode.json>");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(inputFile, "utf8"));
const parsed = episodeSchema.safeParse(raw);

if (!parsed.success) {
  console.error("Schema validation failed");
  console.error(JSON.stringify(parsed.error.flatten(), null, 2));
  process.exit(1);
}

const quality = validateEpisodeQuality(parsed.data);
if (!quality.ok) {
  console.error("Data quality checks failed");
  console.error(JSON.stringify(quality.errors, null, 2));
  process.exit(1);
}

console.log("Episode validation passed");
