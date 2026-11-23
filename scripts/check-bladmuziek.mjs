/**
 * Verifies that every bladmuziek/audio file referenced in src/data/bladmuziek-*.json and stemmen.json
 * actually exists under public/bladmuziek/.
 *
 * Run: node scripts/check-bladmuziek.mjs
 * Exit 0 = all files present, exit 1 = one or more missing.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = (f) => JSON.parse(readFileSync(join(root, 'src/data', f), 'utf8'));

// Sheet music lists and per-voice recordings live in src/data/*.json (editable via Pages CMS)
const pdfs = ['algemeen', 'kerst', 'verbeelding', 'overig']
  .flatMap((k) => data(`bladmuziek-${k}.json`))
  .map((s) => s.pdf);
const audios = data('stemmen.json').flatMap((s) => s.opnames.map((o) => o.bestand));

const files = [...pdfs, ...audios];

if (files.length === 0) {
  console.error('ERROR: No files found — check src/data/*.json structure');
  process.exit(1);
}

let failed = 0;
for (const file of files) {
  const fullPath = join(root, 'public/bladmuziek', file);
  if (existsSync(fullPath)) {
    console.log(`  ok  public/bladmuziek/${file}`);
  } else {
    console.error(`MISSING  public/bladmuziek/${file}`);
    failed++;
  }
}

console.log('');
if (failed > 0) {
  console.error(`${failed}/${files.length} file(s) missing from public/bladmuziek/`);
  process.exit(1);
}
console.log(`All ${files.length} bladmuziek files present.`);
