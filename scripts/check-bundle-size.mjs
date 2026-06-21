import { readFileSync, readdirSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const DIST_DIR = "dist";
const MAX_INITIAL_GZIP_KB = 250;

function getGzipSizeKb(filePath) {
  const content = readFileSync(filePath);
  return gzipSync(content).length / 1024;
}

function findEntryChunk() {
  const html = readFileSync(join(DIST_DIR, "index.html"), "utf8");
  const match = html.match(/src="\/assets\/(index-[^"]+\.js)"/);
  if (!match?.[1]) {
    throw new Error("Could not find entry chunk in dist/index.html");
  }
  return match[1];
}

function formatKb(value) {
  return value.toFixed(2);
}

const entryFile = findEntryChunk();
const entryPath = join(DIST_DIR, "assets", entryFile);
const gzipKb = getGzipSizeKb(entryPath);

const assetsDir = join(DIST_DIR, "assets");
const chunks = readdirSync(assetsDir)
  .filter((file) => file.endsWith(".js"))
  .map((file) => ({
    file,
    gzipKb: getGzipSizeKb(join(assetsDir, file)),
  }))
  .sort((a, b) => b.gzipKb - a.gzipKb);

console.log(`Entry chunk: ${entryFile}`);
console.log(
  `Initial JS (gzip): ${formatKb(
    gzipKb
  )} KB (budget: ${MAX_INITIAL_GZIP_KB} KB)`
);
console.log("\nTop chunks:");
for (const chunk of chunks.slice(0, 5)) {
  console.log(`  ${chunk.file}: ${formatKb(chunk.gzipKb)} KB`);
}

if (gzipKb > MAX_INITIAL_GZIP_KB) {
  console.error(
    `\nBundle budget exceeded by ${formatKb(gzipKb - MAX_INITIAL_GZIP_KB)} KB.`
  );
  process.exit(1);
}

console.log("\nBundle budget check passed.");
